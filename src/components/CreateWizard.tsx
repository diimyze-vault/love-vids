import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";
import { cn } from "../lib/utils";
import { api } from "../lib/api";
import { Star, Zap, Film, Sparkles, Upload } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}
export function CreateWizard({
  onClose,
  isLoggedIn,
  onLogin,
  isAuthLoading,
  profile,
  resetMode,
  onPasswordUpdated,
  referralCode,
  onReferralChange,
  initialSignUp = false,
}: {
  onClose: () => void;
  isLoggedIn?: boolean;
  onLogin?: () => void;
  isAuthLoading?: boolean;
  profile: any;
  resetMode?: boolean;
  onPasswordUpdated?: () => void;
  referralCode?: string;
  onReferralChange?: (code: string) => void;
  initialSignUp?: boolean;
}) {
  const [step, setStep] = useState(resetMode ? 99 : isLoggedIn ? 2 : 1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedVibe, setSelectedVibe] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const pollRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  useEffect(() => {
    if (resetMode) {
      setStep(99);
    }
  }, [resetMode]);

  // Auth State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(initialSignUp);
  const [authMessage, setAuthMessage] = useState<{
    type: "error" | "success";
    content: React.ReactNode;
  } | null>(null);

  const handleResetPassword = async () => {
    if (!email) {
      setAuthMessage({
        type: "error",
        content: "Please enter your email address first.",
      });
      return;
    }
    localStorage.setItem("is_resetting_password", "true");
    const redirectUrl = window.location.origin + "?reset_flow=true";
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    setIsLoggingIn(false);
    if (error) {
      setAuthMessage({ type: "error", content: error.message });
    } else {
      setAuthMessage({
        type: "success",
        content: "Reset link sent! Check your email.",
      });
    }
  };

  const handleUpdatePassword = async () => {
    setIsLoggingIn(true);
    const { error } = await supabase.auth.updateUser({ password: password });
    setIsLoggingIn(false);

    if (error) {
      setAuthMessage({ type: "error", content: error.message });
    } else {
      setAuthMessage({
        type: "success",
        content: "Password updated! Logging you in...",
      });
      if (onPasswordUpdated) onPasswordUpdated();
      setTimeout(() => setStep(2), 1500);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) return;
    setIsLoggingIn(true);
    setAuthMessage(null);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      setIsLoggingIn(false);
      if (error) {
        if (error.message.includes("already registered")) {
          setAuthMessage({
            type: "error",
            content: "Email already registered. Please login.",
          });
          setIsSignUp(false);
        } else {
          setAuthMessage({ type: "error", content: error.message });
        }
      } else {
        setAuthMessage({
          type: "success",
          content: "Account created! Confirm via email.",
        });
        setIsSignUp(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setIsLoggingIn(false);
      if (error) {
        setAuthMessage({ type: "error", content: "Invalid credentials." });
      } else {
        setStep(2);
      }
    }
  };

  // Payment State
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success"
  >("idle");

  // Razorpay Script Loading
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async (planId: string) => {
    setPaymentStatus("processing");
    try {
      const orderRes = await api.createOrder(planId);
      if (orderRes.status === "error") throw new Error(orderRes.message);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: "VibeVids.ai",
        description: `Pass: ${planId.toUpperCase()}`,
        order_id: orderRes.data.order_id,
        handler: async (response: any) => {
          try {
            const verifyRes = await api.verifyPayment(
              orderRes.data.order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            if (verifyRes.status === "success" && selectedPlan) {
              setPaymentStatus("success");
              setStep(6);
              await handleGenerate(selectedPlan);
            } else {
              setAuthMessage({
                type: "error",
                content: "Payment verification failed.",
              });
              setPaymentStatus("idle");
            }
          } catch (err: any) {
            console.error("Verification error:", err);
            setAuthMessage({
              type: "error",
              content: "Internal verification error.",
            });
            setPaymentStatus("idle");
          }
        },
        modal: {
          ondismiss: function () {
            setPaymentStatus("idle");
          },
        },
        prefill: {
          email: email || profile?.email,
        },
        theme: {
          color: "#ec4899",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response: any) {
        alert("Payment Failed: " + response.error.description);
        setPaymentStatus("idle");
      });
      rzp1.open();
    } catch (err: any) {
      console.error(err);
      setAuthMessage({
        type: "error",
        content: err.message || "Payment initialization failed.",
      });
      setPaymentStatus("idle");
    }
  };

  const [generationStatus, setGenerationStatus] = useState<string>("idle");
  const [generatedVideo, setGeneratedVideo] = useState<any>(null);

  const handleGenerate = async (planId: string = "pro") => {
    setIsProcessing(true);
    setStep(6);
    setGenerationStatus("uploading");

    try {
      if (!file) return;

      const qualityMap: Record<string, "sd" | "hq"> = {
        quick: "sd",
        pro: "hq",
        magic: "sd",
        epic: "hq",
      };

      const quality = qualityMap[planId] || "hq";

      // 1. Upload to B2 (via backend proxy to avoid CORS)
      await api.uploadFile(file);

      // 3. Trigger generation
      const genRes = await api.generateVideo(
        `${selectedVibe}: ${text}`,
        quality
      );
      if (genRes.status === "error") throw new Error(genRes.message);

      const videoId = genRes.data.id;
      setGenerationStatus("processing");

      // 4. Poll for status
      pollRef.current = setInterval(async () => {
        const statusRes = await api.getVideoStatus(videoId);
        if (statusRes.data?.status === "ready") {
          clearInterval(pollRef.current);
          pollRef.current = null;
          setGeneratedVideo(statusRes.data);
          setIsProcessing(false);
          setGenerationStatus("completed");
        } else if (statusRes.data?.status === "failed") {
          clearInterval(pollRef.current);
          pollRef.current = null;
          throw new Error("Generation failed on server.");
        }
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setAuthMessage({ type: "error", content: err.message });
      setIsProcessing(false);
      setGenerationStatus("failed");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 cursor-pointer"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-lg relative cursor-default max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Boutique Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20 blur-2xl rounded-2xl opacity-100" />

        <div className="relative bg-background border border-border rounded-2xl flex flex-col shadow-2xl overflow-hidden h-full">
          <button
            className="focus:outline-none absolute right-4 top-4 w-8 h-8 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all z-50 cursor-pointer border border-border"
            onClick={onClose}
          >
            <span className="text-lg leading-none">×</span>
          </button>

          <div className="relative flex-1 overflow-y-auto custom-scrollbar flex flex-col">
            {/* STEP 1: AUTHENTICATION */}
            {step === 1 && (
              <div className="animate-in fade-in duration-700 p-7 lg:p-10">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-foreground tracking-tight mb-2">
                    {isSignUp ? "Create account" : "Welcome back"}
                  </h2>
                  <p className="text-muted-foreground text-sm font-medium">
                    {isSignUp
                      ? "Join us to create your first magic moment."
                      : "Enter your details to create more magic."}
                  </p>
                </div>

                <div className="space-y-6">
                  <Button
                    variant="outline"
                    className="w-full h-14 flex gap-4 text-[11px] font-semibold uppercase tracking-[0.1em] rounded-full border-border bg-muted/5 hover:bg-muted/10 hover:text-foreground transition-all text-foreground"
                    disabled={isAuthLoading}
                    onClick={() => (onLogin ? onLogin() : setStep(2))}
                  >
                    {isAuthLoading ? (
                      <Spinner />
                    ) : (
                      <img
                        src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
                        alt="G"
                        className="w-5 h-5"
                      />
                    )}
                    CONTINUE WITH GOOGLE
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border"></span>
                    </div>
                    <div className="relative flex justify-center text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                      <span className="bg-background px-6">Or use email</span>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="label-caps text-muted-foreground/60 ml-7">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="rounded-full bg-muted/20 border-border/40 h-14 px-8 text-sm focus:ring-1 focus:ring-primary/40 transition-all text-foreground font-medium tracking-tight placeholder:text-black/60"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center px-7">
                        <label className="label-caps text-muted-foreground/60">
                          Password
                        </label>
                        {!isSignUp && (
                          <span
                            onClick={handleResetPassword}
                            className="label-caps text-primary hover:text-primary/80 transition-colors cursor-pointer tracking-[0.1em]"
                          >
                            Forgot?
                          </span>
                        )}
                      </div>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="rounded-full bg-muted/20 border-border/40 h-14 px-8 text-sm focus:ring-1 focus:ring-primary/40 transition-all text-foreground font-medium tracking-tight placeholder:text-black/60"
                      />
                    </div>

                    {isSignUp && (
                      <div className="space-y-2">
                        <label className="label-caps text-muted-foreground/60 ml-7">
                          Invite Code (Optional)
                        </label>
                        <Input
                          type="text"
                          placeholder="EX: VIBE777"
                          value={referralCode || ""}
                          onChange={(e) =>
                            onReferralChange &&
                            onReferralChange(e.target.value.toUpperCase())
                          }
                          className="rounded-full bg-muted/20 border-border/40 h-14 px-8 text-sm focus:ring-1 focus:ring-primary/40 transition-all text-foreground font-medium tracking-widest placeholder:text-black/40"
                        />
                      </div>
                    )}

                    {authMessage && (
                      <div
                        className={cn(
                          "text-xs p-3 rounded-xl text-center font-medium tracking-tight border",
                          authMessage.type === "error"
                            ? "bg-red-500/5 text-red-400 border-red-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        )}
                      >
                        {authMessage.content}
                      </div>
                    )}

                    <Button
                      variant="premium"
                      className="w-full h-14 rounded-full font-semibold uppercase tracking-[0.1em] text-[11px] hover:scale-[1.02] transition-all active:scale-[0.98] mt-2 border-0 shadow-lg shadow-primary/20"
                      disabled={!email || !password || isLoggingIn}
                      onClick={handleEmailAuth}
                    >
                      <span className="relative z-10">
                        {isLoggingIn ? (
                          <Spinner className="text-white" />
                        ) : isSignUp ? (
                          "CREATE ACCOUNT"
                        ) : (
                          "LOGIN"
                        )}
                      </span>
                    </Button>

                    <p
                      className="text-center label-caps text-muted-foreground/60 cursor-pointer hover:text-foreground transition-colors pt-6 tracking-[0.1em]"
                      onClick={() => setIsSignUp(!isSignUp)}
                    >
                      {isSignUp
                        ? "Already have an account? Log In"
                        : "Need an account? Sign Up"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 99: RESET PASSWORD */}
            {step === 99 && (
              <div className="animate-in slide-in-from-bottom-6 duration-700 p-8 text-center">
                <div className="mb-10 text-center">
                  <h2 className="text-3xl font-bold text-foreground tracking-tight mb-2">
                    Reset password
                  </h2>
                  <p className="text-muted-foreground text-sm font-medium">
                    Enter a new secure password for your account.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2 text-left">
                    <label className="label-caps text-muted-foreground ml-1">
                      New Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-xl bg-muted/10 border-input h-12 px-4 text-sm focus:ring-1 focus:ring-primary/50 transition-all text-foreground font-medium"
                    />
                  </div>
                  {authMessage && (
                    <div
                      className={cn(
                        "text-xs p-3 rounded-xl text-center font-medium border",
                        authMessage.type === "error"
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      )}
                    >
                      {authMessage.content}
                    </div>
                  )}
                  <Button
                    variant="premium"
                    className="w-full h-12 rounded-xl font-bold text-sm transition-all active:scale-[0.98] mt-2 shadow-lg shadow-primary/20"
                    onClick={handleUpdatePassword}
                    disabled={!password || isLoggingIn}
                  >
                    {isLoggingIn ? (
                      <Spinner className="mr-2" />
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-muted-foreground text-xs font-medium hover:text-foreground transition-colors py-2"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: BASICS */}
            {step === 2 && (
              <div className="animate-in fade-in duration-500 p-7 lg:p-10">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground tracking-tight mb-1">
                    Create Video
                  </h2>
                  <p className="text-muted-foreground text-sm font-medium">
                    Upload a photo and add your message.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                      Photo Reference
                    </label>
                    <div
                      className={cn(
                        "border border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden relative",
                        file
                          ? "border-primary/50 bg-primary/5" // Active/Filled State
                          : "border-border bg-muted/5 hover:bg-muted/10 hover:border-primary/30" // Empty State
                      )}
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                    >
                      {file ? (
                        <div className="relative w-full flex flex-col items-center animate-in zoom-in-95 duration-300">
                          <div className="relative w-32 aspect-[9/16] rounded-lg overflow-hidden shadow-lg border border-white/10 mb-3 group-hover:scale-105 transition-transform duration-500">
                            <img
                              src={URL.createObjectURL(file)}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-background/50 border border-border backdrop-blur-md">
                            <span className="text-[10px] font-bold text-foreground truncate max-w-[150px]">
                              {file.name}
                            </span>
                            <span className="text-[9px] text-muted-foreground uppercase">
                              Change
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center space-y-3 relative z-10">
                          <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center mx-auto text-muted-foreground group-hover:scale-110 group-hover:text-primary transition-all duration-300">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-foreground block">
                              Click to Upload
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                              JPG, PNG (Max 5MB)
                            </span>
                          </div>
                        </div>
                      )}
                      {/* Background Glow for Hover */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                      <input
                        id="file-upload"
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                        className="focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                      Your Message
                    </label>
                    <textarea
                      className="flex min-h-[100px] w-full rounded-2xl border border-input bg-muted/5 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-foreground font-medium resize-none placeholder:text-muted-foreground/50"
                      placeholder="Write something sweet (or spicy)..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center mt-8 pt-4 border-t border-border">
                  {!isLoggedIn ? (
                    <Button
                      variant="ghost"
                      className="text-muted-foreground hover:text-foreground text-xs font-bold uppercase tracking-wider"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                  ) : (
                    <div />
                  )}
                  <Button
                    variant="premium"
                    className="h-12 px-8 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-primary/20"
                    disabled={!file || !text}
                    onClick={() => setStep(3)}
                  >
                    Next Step
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: VIBE */}
            {step === 3 && (
              <div className="animate-in fade-in duration-500 p-7 lg:p-10 flex flex-col h-full">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold text-foreground tracking-tight mb-2">
                    Choose the Vibe ✨
                  </h2>
                  <p className="text-muted-foreground text-sm font-medium">
                    Set the mood for your masterpiece.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto p-1">
                  {[
                    { id: "Romantic 🌹", label: "Romantic", icon: "🌹" },
                    { id: "Roast 🔥", label: "Roast", icon: "🔥" },
                    { id: "Cinematic 🎬", label: "Cinematic", icon: "🎬" },
                    { id: "Meme 🤪", label: "Meme", icon: "🤪" },
                    { id: "Retro 🕹️", label: "Retro", icon: "🕹️" },
                    { id: "Minimal 🌫️", label: "Minimal", icon: "🌫️" },
                  ].map((vibe) => (
                    <motion.div
                      key={vibe.id}
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "relative p-4 rounded-xl border transition-all cursor-pointer group flex flex-col items-center gap-2 overflow-hidden",
                        selectedVibe === vibe.id
                          ? "border-primary bg-primary/10 text-primary" // Selected
                          : "bg-muted/5 border-border text-muted-foreground hover:border-primary/30 hover:bg-muted/10 hover:text-foreground" // Default
                      )}
                      onClick={() => setSelectedVibe(vibe.id)}
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform duration-300 filter grayscale group-hover:grayscale-0">
                        {vibe.icon}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        {vibe.label}
                      </span>

                      {selectedVibe === vibe.id && (
                        <div className="absolute inset-0 bg-primary/5 pointer-events-none animate-pulse" />
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-8 pt-4 border-t border-border">
                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground text-xs font-bold uppercase tracking-wider"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </Button>
                  <Button
                    variant="premium"
                    className="h-12 px-8 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-primary/20"
                    disabled={!selectedVibe}
                    onClick={() => setStep(4)}
                  >
                    Review
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW */}
            {/* STEP 4: REVIEW */}
            {step === 4 && (
              <div className="animate-in fade-in duration-500 p-7 lg:p-10 flex flex-col h-full">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground tracking-tight mb-1">
                    Review
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Verify your details before generating.
                  </p>
                </div>

                <div className="bg-muted/10 border border-border p-6 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <span className="text-xs font-semibold text-muted-foreground/60">
                      Image
                    </span>
                    <span className="text-xs font-bold text-foreground truncate max-w-[150px]">
                      {file?.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <span className="text-xs font-semibold text-muted-foreground/60">
                      Vibe
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      {selectedVibe}
                    </span>
                  </div>
                  <div className="space-y-1 py-1">
                    <span className="text-xs font-semibold text-muted-foreground/60 block">
                      Message
                    </span>
                    <p className="font-medium italic text-sm text-foreground/80 leading-relaxed">
                      "{text}"
                    </p>
                  </div>
                  <div className="pt-4 flex justify-between items-center border-t border-border mt-2">
                    <span className="text-sm font-bold text-foreground uppercase tracking-widest">
                      Checkout
                    </span>
                    <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                      Next Step
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-10 pt-4 border-t border-border">
                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground text-xs font-bold"
                    onClick={() => setStep(3)}
                  >
                    BACK
                  </Button>
                  <Button
                    variant="premium"
                    className="h-12 px-10 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/20"
                    onClick={() => setStep(5)}
                  >
                    CHECKOUT →
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 5: PLAN SELECTION & PAYMENT */}
            {step === 5 && (
              <div className="animate-in fade-in duration-500 p-6 lg:p-8 flex flex-col h-full">
                <div className="mb-6 text-center shrink-0">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground tracking-tight mb-2">
                    Select Your Pass 🎟️
                  </h2>
                  <p className="text-muted-foreground text-sm font-medium">
                    Choose a quality & duration for your video.
                  </p>
                </div>

                <div className="space-y-2 flex-1 p-1 mb-4 overflow-y-auto custom-scrollbar">
                  {[
                    {
                      id: "quick",
                      name: "Quick Surprise",
                      desc: "720p HD • 5s",
                      price: 35,
                      icon: Zap,
                      color: "text-blue-400",
                      bg: "bg-blue-400/10",
                      border: "border-blue-400/20",
                    },
                    {
                      id: "pro",
                      name: "Pro Surprise",
                      desc: "1080p FHD • 5s",
                      price: 49,
                      popular: true,
                      icon: Star,
                      color: "text-amber-400",
                      bg: "bg-amber-400/10",
                      border: "border-amber-400/20",
                    },
                    {
                      id: "magic",
                      name: "Magic Gift",
                      desc: "720p HD • 10s",
                      price: 55,
                      icon: Sparkles,
                      color: "text-purple-400",
                      bg: "bg-purple-400/10",
                      border: "border-purple-400/20",
                    },
                    {
                      id: "epic",
                      name: "Epic Cinematic",
                      desc: "1080p FHD • 10s",
                      price: 79,
                      icon: Film,
                      color: "text-emerald-400",
                      bg: "bg-emerald-400/10",
                      border: "border-emerald-400/20",
                    },
                  ].map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={cn(
                        "relative flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group overflow-hidden",
                        selectedPlan === plan.id
                          ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
                          : "border-border bg-muted/5 hover:border-primary/30 hover:bg-muted/10"
                      )}
                    >
                      {plan.popular && (
                        <div className="absolute top-0 right-0 px-2 py-0.5 bg-primary text-[9px] font-bold text-white rounded-bl-lg uppercase tracking-wider">
                          Best Value
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center border",
                            plan.bg,
                            plan.border
                          )}
                        >
                          <plan.icon className={cn("w-5 h-5", plan.color)} />
                        </div>
                        <div>
                          <h4
                            className={cn(
                              "font-bold text-sm uppercase tracking-wider",
                              plan.popular || selectedPlan === plan.id
                                ? "text-primary"
                                : "text-foreground"
                            )}
                          >
                            {plan.name}
                          </h4>
                          <span className="text-xs font-semibold text-muted-foreground block mt-0.5">
                            {plan.desc}
                          </span>
                        </div>
                      </div>

                      <div className="text-right pr-2">
                        <div className="text-lg font-black text-foreground">
                          ₹{plan.price}
                        </div>
                        {selectedPlan === plan.id && (
                          <div className="text-[9px] font-bold text-primary uppercase tracking-wider mt-1 animate-in zoom-in">
                            Selected
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {paymentStatus === "processing" && (
                  <div className="text-center py-4 bg-background/80 backdrop-blur-sm absolute inset-0 z-50 flex flex-col items-center justify-center rounded-2xl">
                    <Spinner className="w-8 h-8 mb-3" />
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Initializing Razorpay...
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-border mt-auto h-auto shrink-0">
                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground text-[11px] font-bold uppercase tracking-wider"
                    onClick={() => setStep(4)}
                    disabled={paymentStatus === "processing"}
                  >
                    Back
                  </Button>

                  <Button
                    variant="premium"
                    className="h-12 px-8 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-primary/20"
                    disabled={!selectedPlan || paymentStatus === "processing"}
                    onClick={() => selectedPlan && handlePayment(selectedPlan)}
                  >
                    Proceed to Payment
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 6: SUCCESS / PROGRESS */}
            {step === 6 && (
              <div className="animate-in fade-in duration-700 text-center p-10 h-full flex flex-col justify-center">
                {isProcessing ? (
                  <div className="space-y-8 py-10 relative">
                    <div className="relative w-28 h-28 mx-auto">
                      {/* Outer Rings */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute inset-0 border-[3px] border-primary/20 rounded-full border-dashed"
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute inset-2 border-[3px] border-purple-500/20 rounded-full border-dotted"
                      />

                      {/* Center Pulse */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-full animate-pulse flex items-center justify-center backdrop-blur-sm">
                          <span className="text-xs font-black text-primary animate-pulse">
                            {generationStatus === "uploading" ? "CLOUD" : "AI"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 z-10 relative">
                      <h3 className="text-2xl font-black tracking-tighter text-foreground uppercase">
                        {generationStatus === "uploading"
                          ? "Uploading Assets"
                          : "Dreaming Vibe"}
                      </h3>
                      <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest max-w-[200px] mx-auto">
                        {generationStatus === "uploading"
                          ? "Sending to secure storage..."
                          : "Neural engine active..."}
                      </p>
                    </div>
                  </div>
                ) : generationStatus === "failed" ? (
                  <div className="space-y-6 py-10 animate-in zoom-in-95">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                      <span className="text-4xl">💔</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        Magic Stalled
                      </h2>
                      <p className="text-muted-foreground text-sm max-w-[250px] mx-auto">
                        {authMessage?.content ||
                          "Something went wrong while crafting your video."}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setStep(4)}
                      className="rounded-full px-8 border-border hover:bg-muted"
                    >
                      TRY AGAIN
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
                    <div className="text-center space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                          Ready to Watch
                        </span>
                      </div>
                      <h2 className="text-3xl font-black text-foreground tracking-tighter">
                        IT'S A{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                          VIBE
                        </span>
                      </h2>
                    </div>

                    <div className="aspect-[9/16] w-[200px] bg-black/5 rounded-2xl mx-auto relative group cursor-pointer overflow-hidden border-4 border-white/5 shadow-2xl hover:scale-[1.02] transition-all duration-500">
                      <img
                        src={
                          generatedVideo?.thumbnail_url ||
                          "https://picsum.photos/seed/vibe/300/533"
                        }
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-all">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                          <Film className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>

                      {/* Video Reflection Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-white/10 opacity-60 pointer-events-none" />
                    </div>

                    <div className="space-y-3 pt-2">
                      <Button
                        variant="premium"
                        className="w-full h-14 rounded-xl text-white font-bold text-sm tracking-wide uppercase transition-all hover:scale-[1.02] active:scale-[0.98] border-0 shadow-lg shadow-primary/20"
                        onClick={() => {
                          window.open(generatedVideo?.video_url, "_blank");
                        }}
                      >
                        Download Masterpiece
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full text-xs font-semibold text-muted-foreground uppercase tracking-widest hover:text-foreground hover:bg-transparent"
                        onClick={onClose}
                      >
                        Close & View in Gallery
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

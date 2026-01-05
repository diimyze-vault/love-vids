import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";
import { cn } from "../lib/utils";

export function CreateWizard({
  onClose,
  isLoggedIn,
  onLogin,
  isAuthLoading,
  resetMode,
  onPasswordUpdated,
}: {
  onClose: () => void;
  isLoggedIn?: boolean;
  onLogin?: () => void;
  isAuthLoading?: boolean;
  resetMode?: boolean;
  onPasswordUpdated?: () => void;
}) {
  const [step, setStep] = useState(resetMode ? 99 : isLoggedIn ? 2 : 1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedVibe, setSelectedVibe] = useState("");

  useEffect(() => {
    if (resetMode) {
      setStep(99);
    }
  }, [resetMode]);

  // Auth State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
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

  const handlePayment = () => {
    setPaymentStatus("processing");
    setTimeout(() => {
      setPaymentStatus("success");
      handleGenerate();
    }, 2000);
  };

  const handleGenerate = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(6);
    }, 3000);
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
        className="w-full max-w-lg relative cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Boutique Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20 blur-2xl rounded-[40px] opacity-100" />

        <div className="relative bg-background border border-border dark: rounded-[32px] overflow-hidden flex flex-col">
          <button
            className="focus:outline-none absolute right-6 top-6 w-10 h-10 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all z-50 cursor-pointer border border-border"
            onClick={onClose}
          >
            <span className="text-xl leading-none">×</span>
          </button>

          <div className="p-10 lg:p-12">
            {/* STEP 1: AUTHENTICATION */}
            {step === 1 && (
              <div className="animate-in fade-in duration-700">
                <div className="text-center mb-10">
                  <div className="label-caps px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5 inline-flex">
                    secure access
                  </div>
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
                      className="w-full h-14 rounded-full font-semibold uppercase tracking-[0.1em] text-[11px] hover: transition-all active:scale-[0.98] mt-2 border-0"
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
                    className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-foreground font-bold text-sm transition-all active:scale-[0.98] mt-2"
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
              <div className="animate-in fade-in duration-500">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground tracking-tight mb-1">
                    Create Video
                  </h2>
                  <p className="text-muted-foreground text-sm font-medium">
                    Upload a photo and add your message.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground/60 ml-1">
                      Photo Reference
                    </label>
                    <div
                      className="border-2 border-dashed border-border rounded-2xl bg-muted/10 p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30 hover:border-primary/20 transition-all group"
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                    >
                      {file ? (
                        <div className="relative text-center animate-in zoom-in-95">
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Preview"
                            className="h-24 object-cover rounded-xl mx-auto mb-2 border border-border"
                          />
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                            {file.name}
                          </span>
                        </div>
                      ) : (
                        <div className="text-center space-y-2">
                          <div className="w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center mx-auto text-xl">
                            📸
                          </div>
                          <span className="label-caps text-muted-foreground/60">
                            Upload Photo
                          </span>
                        </div>
                      )}
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
                    <label className="label-caps text-muted-foreground ml-1">
                      Message
                    </label>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-xl border border-input bg-muted/10 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-foreground font-medium"
                      placeholder="Ex: Happy Birthday to the queen!"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-border">
                  {!isLoggedIn ? (
                    <Button
                      variant="ghost"
                      className="text-muted-foreground hover:text-foreground text-xs font-bold"
                      onClick={() => setStep(1)}
                    >
                      BACK
                    </Button>
                  ) : (
                    <div />
                  )}
                  <Button
                    className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-foreground font-bold text-sm transition-all"
                    disabled={!file || !text}
                    onClick={() => setStep(3)}
                  >
                    PROCEED →
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: VIBE */}
            {step === 3 && (
              <div className="animate-in fade-in duration-500 p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground tracking-tight mb-1">
                    Pick Vibe
                  </h2>
                  <p className="text-muted-foreground text-sm font-medium">
                    Select the visual tone of your gift.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Romantic 🌹",
                    "Roast 🔥",
                    "Cinematic 🎬",
                    "Meme 🤪",
                    "Retro 🕹️",
                    "Minimal 🌫️",
                  ].map((vibe) => (
                    <motion.div
                      key={vibe}
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "p-4 rounded-xl border transition-all text-center cursor-pointer label-caps group",
                        selectedVibe === vibe
                          ? "border-primary bg-primary text-foreground"
                          : "bg-muted/10 border-border text-muted-foreground hover:border-primary/20 hover:text-foreground"
                      )}
                      onClick={() => setSelectedVibe(vibe)}
                    >
                      {vibe}
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-10 pt-4 border-t border-border">
                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground text-xs font-bold"
                    onClick={() => setStep(2)}
                  >
                    BACK
                  </Button>
                  <Button
                    className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-foreground font-bold text-sm transition-all"
                    disabled={!selectedVibe}
                    onClick={() => setStep(4)}
                  >
                    REVIEW →
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW */}
            {step === 4 && (
              <div className="animate-in fade-in duration-500 p-8">
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
                      TOTAL
                    </span>
                    <span className="text-2xl font-bold tracking-tight text-primary">
                      $4.99
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
                    className="h-12 px-10 rounded-xl bg-primary hover:bg-primary/90 text-foreground font-bold text-sm transition-all"
                    onClick={() => setStep(5)}
                  >
                    CHECKOUT →
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 5: PAYMENT */}
            {step === 5 && (
              <div className="animate-in fade-in duration-500 p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground tracking-tight mb-1">
                    Payment
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Unlock your high-definition gift.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/20 text-emerald-400 overflow-hidden relative">
                    <span className="font-semibold uppercase tracking-wider text-[10px]">
                      Price
                    </span>
                    <span className="font-bold text-2xl">$4.99</span>
                  </div>

                  {paymentStatus === "idle" && (
                    <div className="flex flex-col gap-3">
                      <Button
                        variant="outline"
                        className="h-14 rounded-xl border-border bg-muted/10 hover:bg-muted/20 hover:text-foreground transition-all text-sm font-semibold flex justify-between px-6"
                      >
                        <span>Credit Card</span>
                        <span className="text-xl">💳</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-14 rounded-xl border-border bg-muted/10 hover:bg-muted/20 hover:text-foreground transition-all text-sm font-semibold flex justify-between px-6"
                      >
                        <span>PayPal</span>
                        <span className="text-xl">🅿️</span>
                      </Button>
                    </div>
                  )}

                  {paymentStatus === "processing" && (
                    <div className="text-center py-8 space-y-4">
                      <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto opacity-50"></div>
                      <p className="text-muted-foreground font-semibold uppercase tracking-[0.1em] text-[10px]">
                        Authenticating Payment...
                      </p>
                    </div>
                  )}
                </div>

                {paymentStatus === "idle" && (
                  <div className="flex justify-between items-center mt-10 pt-4 border-t border-border">
                    <Button
                      variant="ghost"
                      className="text-muted-foreground hover:text-foreground text-xs font-bold"
                      onClick={() => setStep(4)}
                    >
                      BACK
                    </Button>
                    <Button
                      className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-foreground font-bold text-sm transition-all"
                      onClick={handlePayment}
                    >
                      PAY & GENERATE
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 6: SUCCESS */}
            {step === 6 && (
              <div className="animate-in fade-in duration-700 text-center p-10">
                {isProcessing ? (
                  <div className="space-y-8 py-10">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold tracking-tight text-foreground tracking-tight">
                        Crafting Gift...
                      </h3>
                      <p className="text-muted-foreground text-sm max-w-[200px] mx-auto font-medium">
                        Please wait while we synthesize your masterpiece.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in zoom-in-95 duration-1000">
                    <div className="space-y-2">
                      <div className="text-5xl mb-4">🎉</div>
                      <h2 className="text-3xl font-bold text-foreground tracking-tight leading-tight">
                        Your Gift is <br />
                        <span className="text-gradient">Ready!</span>
                      </h2>
                      <p className="text-muted-foreground text-sm font-medium">
                        Your vertical video is processed and ready.
                      </p>
                    </div>

                    <div className="aspect-[9/16] bg-muted/10 rounded-xl mx-auto max-w-[200px] relative group cursor-pointer overflow-hidden border border-border transition-transform">
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10">
                          <span className="ml-1 text-foreground text-xl">
                            ▶
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="premium"
                      className="w-full h-14 rounded-xl text-foreground font-bold text-sm transition-all mt-4"
                      onClick={onClose}
                    >
                      DOWNLOAD MAGIC
                    </Button>
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

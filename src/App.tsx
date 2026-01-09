import { useState, useEffect, lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { Navbar, Footer } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { HowItWorks, DemoVideos } from "./components/Sections";
import { Testimonials, Pricing } from "./components/SocialAndPricing";

const CreateWizard = lazy(() =>
  import("./components/CreateWizard").then((m) => ({ default: m.CreateWizard }))
);
const Dashboard = lazy(() =>
  import("./components/Dashboard").then((m) => ({ default: m.Dashboard }))
);
import { supabase } from "./lib/supabase";
import type { User } from "@supabase/supabase-js";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Button } from "./components/ui/button";
import { FullPageSpinner } from "./components/ui/spinner";
import { api } from "./lib/api";

function App() {
  const [showWizard, setShowWizard] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [referralCode, setReferralCode] = useState<string | undefined>(
    undefined
  );
  const [startWithSignUp, setStartWithSignUp] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    console.log("[App] Mount. URL:", window.location.href);
    console.log("[App] Search Params:", window.location.search);

    // Check for custom reset flow param (URL)
    const params = new URLSearchParams(window.location.search);
    if (params.get("reset_flow") === "true") {
      console.log("[App] Found reset_flow=true!");
      setIsPasswordReset(true);
      setShowWizard(true);
      // Clean URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("reset_flow");
      window.history.replaceState({}, "", newUrl.toString());
    } else {
      // Fallback: Check LocalStorage (for same-device resets)
      if (localStorage.getItem("is_resetting_password") === "true") {
        // Only activate if we also see a 'code' param (implying a flow happened)
        // OR if we are just checking blindly on mount?
        // Better to wait for session?
        // Actually, if they click the link, they land with ?code=...
        if (params.has("code")) {
          console.log("[App] Detected reset intent from LocalStorage + Code!");
          setIsPasswordReset(true);
          setShowWizard(true);
          // Do not remove item yet! Persist until success or logout.
        }
      }
    }

    // Check URL for recovery mode manually (Legacy Hash Check)
    const hash = window.location.hash;
    if (hash && hash.includes("type=recovery")) {
      setIsPasswordReset(true);
      setShowWizard(true);
    }

    const ref = params.get("ref");
    if (ref) {
      console.log("[App] Found referral code:", ref);
      setReferralCode(ref);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // CLEAR LOADING IMMEDIATELY
      setLoading(false);

      if (session) {
        setUser(session.user);

        // Sync with backend on sign in
        if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
          api
            .syncProfile(referralCode)
            .then((res) => {
              if (res.data) setProfile(res.data);
            })
            .catch((err) => {
              console.error("[App] Sync Error:", err);
            });
        } else if (!profile) {
          // Fetch profile if we just refreshed and have a session but no profile yet
          api
            .getProfile()
            .then((res) => {
              if (res.data) setProfile(res.data);
            })
            .catch((err) => console.error("[App] Profile fetch error:", err));
        }
      } else {
        setUser(null);
        setProfile(null);
      }

      if (event === "PASSWORD_RECOVERY") {
        setIsPasswordReset(true);
        setShowWizard(true);
      }

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setIsAuthLoading(false);
        const url = new URL(window.location.href);
        if (url.searchParams.has("code")) {
          url.searchParams.delete("code");
          url.searchParams.delete("reset_flow");
          window.history.replaceState({}, "", url.toString());
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user && referralCode) {
      console.log("[App] Syncing referral code:", referralCode);
      api
        .syncProfile(referralCode)
        .then((res) => {
          if (res.data) setProfile(res.data);
        })
        .catch((err) => {
          console.error("[App] Referral Sync Error:", err);
        });
    }
  }, [user, referralCode]);

  useEffect(() => {
    // Auto-open wizard for referral links if not logged in
    if (!loading && !user && referralCode) {
      console.log("[App] Honoring referral link, opening wizard...");
      setStartWithSignUp(true);
      setShowWizard(true);
    }
  }, [loading, user, referralCode]);

  const handleGoogleLogin = async () => {
    setIsAuthLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      console.error("Error logging in:", error.message);
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.warn(
        "Logout error (clearing local session anyway):",
        error.message
      );
    }

    // START MANUAL CLEANUP
    // Supabase might not clear localStorage if it thinks the session is already invalid on server.
    // We manually clear any keys that look like Supabase tokens.
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("sb-")) {
        localStorage.removeItem(key);
      }
    });
    // END MANUAL CLEANUP

    // Always clear local user state
    setUser(null);
    setIsLoggingOut(false);
  };

  if (loading) {
    return <FullPageSpinner />;
  }

  return (
    <Suspense fallback={<FullPageSpinner />}>
      {user && !isPasswordReset ? (
        // CHECK FOR SOFT DELETED STATUS
        user.user_metadata?.status === "deleted" ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-card glass border border-white/10 p-8 rounded-2xl max-w-md w-full text-center animate-in zoom-in-95 duration-300">
              <span className="text-4xl mb-4 block">⚠️</span>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#be123c] mb-2">
                Account Deactivated
              </h2>
              <p className="text-muted-foreground mb-6">
                This account was scheduled for deletion on{" "}
                <span className="font-mono text-foreground font-medium">
                  {new Date(
                    user.user_metadata.deletion_scheduled_at
                  ).toLocaleDateString()}
                </span>
                .<br />
                You have 30 days to restore it before permanent data loss.
              </p>

              <div className="flex gap-3 justify-center">
                <Button
                  variant="default"
                  className="w-full bg-primary hover:bg-primary/90 text-white border-0"
                  onClick={async () => {
                    // Restore Logic
                    await supabase.auth.updateUser({
                      data: { status: null, deletion_scheduled_at: null },
                    });
                    window.location.reload();
                  }}
                >
                  Restore Account
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-white/10 hover:bg-white/5"
                  onClick={() => supabase.auth.signOut()}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Dashboard
            onCreateClick={() => setShowWizard(true)}
            onLogout={handleLogout}
            user={user}
            profile={profile}
            setProfile={setProfile}
            isLoggingOut={isLoggingOut}
            isDark={isDark}
            toggleTheme={() => setIsDark(!isDark)}
          />
        )
      ) : (
        <>
          <div className="app-container bg-background text-foreground transition-colors duration-300 min-h-screen">
            <Navbar
              onCreateClick={() => setShowWizard(true)}
              onLogin={() => setShowWizard(true)}
              isDark={isDark}
              toggleTheme={() => setIsDark(!isDark)}
            />

            <main>
              <Hero onCreateClick={() => setShowWizard(true)} />
              <HowItWorks />
              <DemoVideos />
              <Testimonials />
              <Pricing onCreateClick={() => setShowWizard(true)} />
            </main>
          </div>
          <Footer />
        </>
      )}

      <AnimatePresence mode="wait">
        {showWizard && (
          <CreateWizard
            onClose={() => {
              setShowWizard(false);
              setStartWithSignUp(false); // Reset signup intent on close
              // If cancelling a password reset, just close the wizard.
              // The user is already logged in (via link), so they will see the Dashboard.
              if (isPasswordReset) {
                setIsPasswordReset(false);
                localStorage.removeItem("is_resetting_password"); // Clean up flag
              }
            }}
            isLoggedIn={!!user}
            profile={profile}
            onLogin={handleGoogleLogin}
            isAuthLoading={isAuthLoading}
            resetMode={isPasswordReset}
            onPasswordUpdated={() => {
              setIsPasswordReset(false);
              localStorage.removeItem("is_resetting_password"); // Consume flag on success
            }}
            referralCode={referralCode}
            onReferralChange={(code: string) => setReferralCode(code)}
            initialSignUp={startWithSignUp}
          />
        )}
      </AnimatePresence>
      <Analytics />
      <SpeedInsights />
    </Suspense>
  );
}

export default App;

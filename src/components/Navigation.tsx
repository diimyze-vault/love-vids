import { Button } from "./ui/button";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export function Navbar({
  onCreateClick,
  onLogin,
  isDark,
  toggleTheme,
}: {
  onCreateClick: () => void;
  onLogin: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}) {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="nav-sticky"
    >
      <div className="flex items-center justify-between px-4 md:px-6 py-4 max-w-7xl mx-auto w-full gap-2">
        <div
          className="text-xl font-bold text-gradient cursor-pointer hover:scale-[1.01] transition-transform active:scale-95 tracking-tight"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          VibeVids.ai
        </div>
        <div className="hidden lg:flex items-center gap-14 font-semibold text-[12px] uppercase tracking-[0.15em] text-foreground/70">
          <a
            href="#how-it-works"
            className="focus:outline-none hover:text-primary transition-all cursor-pointer"
          >
            How it works
          </a>
          <a
            href="#demos"
            className="focus:outline-none hover:text-primary transition-all cursor-pointer"
          >
            Gallery
          </a>
          <a
            href="#social"
            className="focus:outline-none hover:text-primary transition-all cursor-pointer"
          >
            Wall of Love
          </a>
          <a
            href="#pricing"
            className="focus:outline-none hover:text-primary transition-all cursor-pointer"
          >
            Pricing
          </a>
        </div>
        <div className="flex items-center gap-2 md:gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full w-9 h-9 md:w-10 md:h-10 border border-border cursor-pointer hover:bg-muted transition-colors"
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="secondary"
            className="text-[10px] md:text-[12px] font-bold h-9 md:h-10 px-4 md:px-6 rounded-full"
            onClick={onLogin}
          >
            Login
          </Button>
          <Button
            variant="premium"
            className="text-[10px] md:text-[12px] font-bold uppercase tracking-wider px-3 md:px-8 h-9 md:h-10 rounded-full shrink-0 cursor-pointer transition-all active:scale-95 relative group overflow-hidden"
            onClick={onCreateClick}
          >
            <span className="relative z-10 hidden md:inline">Create Vibe</span>
            <span className="relative z-10 md:hidden">Create</span>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t mt-24 py-16">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-12">
        <div className="space-y-6">
          <h3 className="text-3xl font-bold text-gradient tracking-tight">
            VibeVids.ai
          </h3>
          <p className="text-muted-foreground max-w-xs leading-relaxed font-medium">
            Personalized AI video gifts. Surprise them with magic.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-12 md:gap-24">
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold tracking-tight text-foreground">
              Legal
            </h4>
            <a
              href="#"
              className="focus:outline-none text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="focus:outline-none text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              Terms of Service
            </a>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold tracking-tight text-foreground">
              Social
            </h4>
            <a
              href="#"
              className="focus:outline-none text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              Twitter
            </a>
            <a
              href="#"
              className="focus:outline-none text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              TikTok
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 border-t mt-16 pt-8 text-center text-sm text-muted-foreground font-medium">
        <p>&copy; {new Date().getFullYear()} VibeVids AI. All rights served.</p>
      </div>
    </footer>
  );
}

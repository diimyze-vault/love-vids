import { Button } from "./ui/button";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export function Navbar({ 
  onCreateClick, 
  onLogin, 
  isDark, 
  toggleTheme 
}: { 
  onCreateClick: () => void, 
  onLogin: () => void,
  isDark: boolean,
  toggleTheme: () => void
}) {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="nav-sticky"
    >
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
        <div className="text-xl font-bold text-gradient cursor-pointer hover:scale-[1.01] transition-transform active:scale-95 tracking-tight" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          VibeVids
        </div>
        <div className="hidden lg:flex items-center gap-10 font-bold text-[12px] uppercase tracking-[0.1em] text-foreground/70">
          <a href="#demos" className="hover:text-primary transition-all cursor-pointer">Demos</a>
          <a href="#how-it-works" className="hover:text-primary transition-all cursor-pointer">How it works</a>
          <a href="#pricing" className="hover:text-primary transition-all cursor-pointer">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="rounded-full w-9 h-9 border border-black/5 dark:border-white/5 cursor-pointer hover:bg-muted/50 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button variant="secondary" className="text-[12px] font-bold uppercase tracking-[0.1em] cursor-pointer px-6 h-9 transition-all active:scale-95 rounded-full" onClick={onLogin}>
            Login
          </Button>
          <Button 
            variant="premium" 
            className="text-[12px] font-bold uppercase tracking-[0.1em] px-7 h-9 rounded-full shadow-lg shrink-0 cursor-pointer transition-all active:scale-95 relative group overflow-hidden" 
            onClick={onCreateClick}
          >
            <span className="relative z-10">Create Now</span>
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
          <h3 className="text-3xl font-black text-gradient tracking-tighter">
            VibeVids.ai
          </h3>
          <p className="text-muted-foreground max-w-xs leading-relaxed font-medium">
            Personalized AI video gifts for the people you love. Surprise them with magic.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-12 md:gap-24">
          <div className="flex flex-col gap-4">
             <h4 className="font-black tracking-tighter text-foreground">Legal</h4>
             <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">Privacy Policy</a>
             <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">Terms of Service</a>
          </div>
          <div className="flex flex-col gap-4">
             <h4 className="font-black tracking-tighter text-foreground">Social</h4>
             <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">Twitter</a>
             <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">TikTok</a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 border-t mt-16 pt-8 text-center text-sm text-muted-foreground font-medium">
        <p>&copy; {new Date().getFullYear()} VibeVids AI. All rights served.</p>
      </div>
    </footer>
  );
}

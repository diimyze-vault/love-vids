import { useState } from "react";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Spinner } from "./ui/spinner";
import { Skeleton } from "./ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import {
  Sun,
  Moon,
  LayoutDashboard,
  Video,
  Trophy,
  Settings,
  LogOut,
  Plus,
  ExternalLink,
  Search,
  Copy,
  Shield,
  Sparkles,
  LayoutGrid,
} from "lucide-react";

type Tab = "overview" | "gallery" | "rewards" | "settings";

export function Dashboard({
  onCreateClick,
  onLogout,
  user,
  isLoggingOut,
  isDark,
  toggleTheme,
}: {
  onCreateClick: () => void;
  onLogout: () => void;
  user: User;
  isLoggingOut?: boolean;
  isDark?: boolean;
  toggleTheme?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const [videos] = useState([
    {
      id: 1,
      title: "Birthday Roast for Mike",
      date: "2 mins ago",
      status: "Processing",
      thumbnail: "",
    },
    {
      id: 2,
      title: "Anniversary Surprise",
      date: "2 days ago",
      status: "Ready",
      thumbnail: "https://picsum.photos/seed/dash1/300/169",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    },
  ]);

  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [showReferral, setShowReferral] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChangePassword = async () => {
    if (!newPassword) return;
    setIsChangingPassword(true);
    setPasswordMessage(null);

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsChangingPassword(false);

    if (error) {
      setPasswordMessage({ type: "error", text: error.message });
    } else {
      setPasswordMessage({
        type: "success",
        text: "Password updated successfully!",
      });
      setNewPassword("");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      confirm(
        "Are you sure? Your account will be deactivated immediately and permanently deleted in 30 days."
      )
    ) {
      const deletionDate = new Date();
      deletionDate.setDate(deletionDate.getDate() + 30);

      const { error } = await supabase.auth.updateUser({
        data: {
          status: "deleted",
          deletion_scheduled_at: deletionDate.toISOString(),
        },
      });

      if (error) {
        alert("Error scheduling deletion:" + error.message);
      } else {
        await supabase.auth.signOut();
        alert(
          "Your account has been deactivated. It will be permanently removed in 30 days."
        );
        window.location.reload();
      }
    }
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "gallery", label: "My Videos", icon: Video },
    { id: "rewards", label: "Rewards", icon: Trophy },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  return (
    <div className="flex min-h-screen bg-[#fafafa] dark:bg-[#050505] text-foreground selection:bg-primary/20 font-sans overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-[280px] bg-background border-r border-border/50 flex flex-col h-screen shrink-0 z-50">
        <div className="h-24 flex items-center px-8 shrink-0 border-b border-border/50">
          <div className="text-xl font-bold text-gradient tracking-tight">
            VibeVids.ai
          </div>
        </div>

        <div className="flex-1 py-8 px-4 space-y-10 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            <p className="px-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/40">
              Navigation
            </p>
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as Tab)}
                    className={cn(
                      "group focus:outline-none w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-all duration-200 relative overflow-hidden",
                      active
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/10 border border-transparent"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-[18px] h-[18px] shrink-0 transition-transform duration-300",
                        active ? "scale-110" : "group-hover:scale-110"
                      )}
                    />
                    <span className="relative z-10">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border/50 space-y-3 shrink-0 bg-muted/5">
          <div className="p-4 rounded-xl bg-card border border-border/50 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-base font-bold border border-primary/20 shrink-0">
              {user.email?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold truncate text-foreground uppercase tracking-wider leading-none">
                {user.email?.split("@")[0]}
              </p>
              <p className="text-[9px] font-bold text-primary uppercase tracking-wider mt-1.5 opacity-60">
                Creator Account
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={onLogout}
            className="w-full h-11 rounded-full border-border/50 text-muted-foreground hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-all font-semibold text-[11px] uppercase tracking-wider"
          >
            {isLoggingOut ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <LogOut className="w-4 h-4 mr-2" />
            )}
            Sign Out
          </Button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-muted/[0.02]">
        {/* HEADER BAR */}
        <header className="h-20 border-b border-border/50 bg-background/50 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-40">
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
              <h2 className="text-[11px] font-bold tracking-tight uppercase text-primary">
                {activeTab}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
              <input
                type="search"
                name="dashboard-search-v2"
                autoComplete="off"
                placeholder="Search videos..."
                className="focus:outline-none h-10 pl-10 pr-4 rounded-full bg-muted/20 border border-border/50 text-sm font-medium focus:ring-2 focus:ring-primary/10 transition-all w-64 placeholder:text-muted-foreground/30"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleTheme?.()}
              className="w-10 h-10 rounded-full border border-border/50 hover:bg-muted/40 transition-all text-muted-foreground hover:text-foreground bg-card"
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            <Button
              onClick={onCreateClick}
              variant="premium"
              className="h-11 px-8 rounded-full text-[11px] font-semibold uppercase tracking-wider border-0 hover:scale-[1.02] active:scale-[0.95] transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Video
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <section className="p-6 max-w-[1400px] mx-auto w-full">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                      <h1 className="text-xl font-semibold tracking-tight text-foreground">
                        Welcome back!
                      </h1>
                      <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                        System Status:
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-emerald-500">Active</span>
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-semibold tracking-tight flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                            <LayoutGrid className="w-5 h-5 text-primary" />
                          </div>
                          Latest Creations
                        </h3>
                        <button
                          onClick={() => setActiveTab("gallery")}
                          className="focus:outline-none text-[12px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
                        >
                          View Library →
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {videos.map((video, idx) => (
                          <motion.div
                            key={video.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: idx * 0.1 + 0.5,
                              type: "spring",
                              stiffness: 100,
                            }}
                            whileHover={{ y: -4 }}
                          >
                            <Card className="rounded-xl border border-border/50 overflow-hidden hover:border-primary/40 transition-all group flex flex-col h-full bg-card/40 backdrop-blur-xl border-b-2 border-b-primary/5">
                              <div className="aspect-[9/16] max-h-[400px] bg-muted/20 relative overflow-hidden rounded-xl isolate">
                                {video.thumbnail ? (
                                  <img
                                    src={video.thumbnail}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out"
                                  />
                                ) : (
                                  <div className="absolute inset-0">
                                    <Skeleton className="w-full h-full rounded-none" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="flex flex-col items-center gap-3">
                                        <Spinner className="h-6 w-6 text-primary opacity-60" />
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/30">
                                          Processing...
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <div className="absolute top-4 right-4 z-10">
                                  <div
                                    className={cn(
                                      "px-3 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-wider border backdrop-blur-md",
                                      video.status === "Ready"
                                        ? "bg-emerald-500 text-white border-emerald-600"
                                        : "bg-amber-500 text-white border-amber-600"
                                    )}
                                  >
                                    {video.status}
                                  </div>
                                </div>
                                {video.url && (
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        setPlayingVideo(video.url!)
                                      }
                                      className="rounded-full bg-white text-black hover:bg-white/90 font-medium text-[11px] uppercase tracking-wider px-8 h-10 hover:scale-105 transition-transform active:scale-95"
                                    >
                                      Play Video
                                    </Button>
                                  </div>
                                )}
                              </div>
                              <div className="p-5 flex flex-col gap-2">
                                <h4 className="text-base font-medium tracking-tight truncate">
                                  {video.title}
                                </h4>
                                <p className="text-[10px] font-medium text-muted-foreground/40 uppercase tracking-wider">
                                  {video.date}
                                </p>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40 ml-1">
                          Milestones
                        </h3>
                        <Card className="rounded-xl border border-border/50 p-6 space-y-8 bg-background/50 relative overflow-hidden group border-b-2 border-b-primary/5">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full translate-x-1/4 -translate-y-1/4 pointer-events-none" />
                          <div className="flex items-center gap-6 relative z-10">
                            <div className="w-12 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-4xl group-hover:scale-110 transition-all duration-500">
                              🎟️
                            </div>
                            <div className="space-y-1">
                              <p className="text-[11px] font-medium text-primary uppercase tracking-wider">
                                Next Reward
                              </p>
                              <h4 className="text-xl font-semibold tracking-tight">
                                HD Reward Tier 1
                              </h4>
                            </div>
                          </div>
                          <div className="space-y-4 relative z-10">
                            <div className="flex justify-between items-end mb-1">
                              <span className="text-[10px] font-medium text-muted-foreground/40 uppercase tracking-wider">
                                3 / 5 Invites
                              </span>
                              <span className="text-[10px] font-medium text-primary">
                                60%
                              </span>
                            </div>
                            <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all duration-1000 rounded-full"
                                style={{ width: "60%" }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground font-medium opacity-80 leading-relaxed italic">
                              Refer 2 more friends to unlock 1080p high-fidelity
                              rendering tokens.
                            </p>
                          </div>
                          <Button
                            onClick={() => setShowReferral(true)}
                            className="w-full h-11 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-primary text-white border-0 hover:scale-[1.02] active:scale-[0.98] transition-all"
                          >
                            Invite Friends
                          </Button>
                        </Card>
                      </div>

                      <Card className="rounded-xl border border-border/50 p-6 bg-primary/[0.01] space-y-4 relative overflow-hidden border-b-2 border-b-primary/5">
                        <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/10">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">
                            Creator Pro Tip
                          </h4>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground/90 leading-relaxed">
                          9:16 videos often outperform standard 16:9 ratios by
                          4x on TikTok. Target vertical narratives for maximum
                          engagement depth.
                        </p>
                      </Card>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "gallery" && (
                <motion.div
                  key="gallery"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-semibold tracking-tight">
                        My Videos
                      </h2>
                      <p className="text-sm text-muted-foreground font-medium opacity-70">
                        Manage your created masterpieces and available storage
                        slots.
                      </p>
                    </div>
                    <div className="px-4 py-1.5 rounded-full bg-card border border-border/50 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Storage: {videos.length} / 5
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video, idx) => (
                      <motion.div
                        key={video.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: idx * 0.1,
                          type: "spring",
                          stiffness: 100,
                        }}
                        whileHover={{ y: -4 }}
                        className="h-full"
                      >
                        <Card className="rounded-xl border border-border/50 overflow-hidden group hover:border-primary/40 transition-all flex flex-col h-full bg-card/60 backdrop-blur-xl border-b-2 border-b-primary/5">
                          <div className="aspect-[9/16] bg-muted/40 relative overflow-hidden rounded-xl shrink-0 border-b border-border/20 isolate">
                            {video.thumbnail ? (
                              <img
                                src={video.thumbnail}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1500ms]"
                              />
                            ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-muted/10">
                                <Spinner className="h-6 w-6 text-primary opacity-60" />
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/30">
                                  Processing...
                                </span>
                              </div>
                            )}
                            <div
                              className={cn(
                                "absolute top-4 right-4 z-20 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider px-4 py-2 border",
                                video.status === "Ready"
                                  ? "bg-emerald-500 text-white font-semibold"
                                  : "bg-amber-500 text-white font-semibold"
                              )}
                            >
                              {video.status}
                            </div>
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 flex flex-col items-center justify-center p-6 text-center">
                              <div className="space-y-4 mb-8">
                                <h4 className="text-lg font-semibold tracking-tight text-white leading-tight">
                                  {video.title}
                                </h4>
                                <div className="flex flex-col items-center gap-1">
                                  <p className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
                                    {video.date}
                                  </p>
                                  <div className="flex items-center gap-2 px-2 py-0.5 rounded-md bg-white/10 border border-white/10">
                                    <span className="text-[9px] font-medium text-white/60 uppercase">
                                      1080P MP4
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    video.url && setPlayingVideo(video.url)
                                  }
                                  className="rounded-full bg-primary text-white font-medium text-[11px] uppercase tracking-wider px-8 h-10 border-0 hover:scale-105 transition-transform active:scale-95"
                                >
                                  Play
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-10 h-10 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                  <ExternalLink className="w-5 h-5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}

                    {Array.from({ length: 5 - videos.length }).map((_, i) => (
                      <motion.div
                        key={`empty-${i}`}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onCreateClick}
                        className="aspect-[9/16] rounded-xl border-2 border-dashed border-border/20 flex flex-col items-center justify-center gap-6 text-muted-foreground/20 hover:border-primary/30 hover:bg-primary/[0.01] hover:text-primary transition-all cursor-pointer group relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-16 h-16 rounded-xl bg-muted/5 border border-border/20 flex items-center justify-center group-hover:scale-110 group-hover:border-primary/20 transition-all duration-500 relative z-10">
                          <Plus className="w-8 h-8 text-muted-foreground/20 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="text-center space-y-1 relative z-10">
                          <span className="block text-[11px] font-semibold uppercase tracking-wider group-hover:text-primary transition-colors">
                            Available Slot
                          </span>
                          <span className="text-[9px] font-medium opacity-40 uppercase tracking-wider block">
                            Start new creation
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "rewards" && (
                <motion.div
                  key="rewards"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8"
                >
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      Rewards
                    </h2>
                    <p className="text-sm text-muted-foreground font-medium opacity-70">
                      Unlock additional high-fidelity rendering capabilities by
                      expanding the network.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        title: "HD Cinematic Upgrade",
                        req: "5 Invites",
                        current: 3,
                        total: 5,
                        icon: "🎟️",
                        color: "bg-orange-500",
                        border: "border-orange-500/20",
                        desc: "Permanently unlock 720p HD rendering for every video you create.",
                      },
                      {
                        title: "Ultra High-Fidelity",
                        req: "10 Invites",
                        current: 3,
                        total: 10,
                        icon: "🎬",
                        color: "bg-primary",
                        border: "border-primary/20",
                        desc: "Master pro-tier 1080p renders with full neural depth and motion clarity.",
                      },
                    ].map((reward, i) => (
                      <Card
                        key={i}
                        className="rounded-xl border border-border/50 p-6 flex flex-col bg-card hover:border-primary/20 transition-all relative overflow-hidden group"
                      >
                        <div
                          className={cn(
                            "absolute top-0 right-0 w-64 h-64 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity",
                            reward.color
                          )}
                        />

                        <div className="flex items-center gap-6 mb-10 relative z-10">
                          <div
                            className={cn(
                              "w-24 h-24 min-w-[96px] min-h-[96px] rounded-xl flex items-center justify-center text-5xl border bg-muted/20",
                              reward.border
                            )}
                          >
                            {reward.icon}
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold tracking-tight leading-none">
                              {reward.title}
                            </h3>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/20">
                              <div
                                className={cn(
                                  "w-1.5 h-1.5 rounded-full",
                                  reward.current >= reward.total
                                    ? "bg-emerald-500"
                                    : "bg-primary animate-pulse"
                                )}
                              />
                              <span className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
                                {reward.req} REQUIRED
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-8 relative z-10 flex-1 flex flex-col justify-between">
                          <p className="text-sm font-medium text-muted-foreground/80 leading-relaxed max-w-sm">
                            {reward.desc}
                          </p>

                          <div className="space-y-4">
                            <div className="flex justify-between items-end">
                              <div className="space-y-1">
                                <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground/40">
                                  Network Status
                                </p>
                                <p className="text-sm font-medium">
                                  {Math.round(
                                    (reward.current / reward.total) * 100
                                  )}
                                  % COMPLETE
                                </p>
                              </div>
                              <span className="text-xs font-medium text-primary">
                                {reward.current} / {reward.total}
                              </span>
                            </div>
                            <div className="h-3 w-full bg-muted/50 rounded-full overflow-hidden border border-border-10">
                              <div
                                className={cn(
                                  "h-full rounded-full transition-all duration-1000",
                                  reward.color
                                )}
                                style={{
                                  width: `${
                                    (reward.current / reward.total) * 100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Card className="rounded-xl border border-primary/20 bg-primary/[0.03] p-6 flex flex-col lg:flex-row items-center gap-6 overflow-hidden relative">
                    <div className="absolute right-[-10%] top-[-20%] w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />

                    <div className="w-32 h-32 shrink-0 rounded-xl bg-white dark:bg-black/20 border border-primary/20 flex items-center justify-center text-5xl relative z-10 group-hover:scale-110 transition-transform">
                      🎁
                    </div>

                    <div className="flex-1 space-y-8 relative z-10 text-center lg:text-left">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold tracking-tight leading-none">
                          The Invite Engine 🚀
                        </h3>
                        <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-xl">
                          Every successful invitation permanently boosts your
                          account's limit. Share your unique code and start
                          collecting rewards.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                        <div className="bg-background border border-border/60 px-6 h-11 flex items-center rounded-xl font-mono text-primary font-medium select-all tracking-wider text-base">
                          VIBE-MIKE-2024
                        </div>
                        <Button
                          onClick={() => setShowReferral(true)}
                          className="rounded-xl h-11 px-6 bg-primary text-white font-medium text-[11px] uppercase tracking-wider border-0 hover:scale-[1.02] transition-transform"
                        >
                          <Copy className="w-4 h-4 mr-3" />
                          Copy Link
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="w-full space-y-8"
                >
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold tracking-tight">
                      Account Settings
                    </h2>
                    <p className="text-sm text-muted-foreground font-medium opacity-70">
                      Manage your security preferences and account status.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
                    <div className="lg:col-span-8 space-y-8">
                      <Card className="rounded-xl border border-border/50 bg-card overflow-hidden">
                        <div className="p-6 flex flex-col sm:flex-row items-center gap-6 bg-muted/[0.15] border-b border-border/50">
                          <div className="w-20 h-20 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-2xl font-medium">
                            {user.email?.[0]?.toUpperCase()}
                          </div>
                          <div className="space-y-2 text-center sm:text-left">
                            <h3 className="text-xl font-semibold tracking-tight">
                              {user.email}
                            </h3>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                              <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 px-2 py-0.5">
                                Verified
                              </div>
                              <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-semibold uppercase tracking-wider text-primary px-2 py-0.5">
                                Creator Pro
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="divide-y divide-border/40">
                          <div className="p-6 space-y-8">
                            <div className="space-y-8">
                              <div className="space-y-1">
                                <p className="text-base font-medium tracking-tight flex items-center gap-2">
                                  <Shield className="w-5 h-5 text-primary" />
                                  {""}
                                  Change Password
                                </p>
                                <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-xl">
                                  Update your password to keep your account
                                  secure.
                                </p>
                              </div>
                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-2xl">
                                <Input
                                  type="password"
                                  placeholder="Enter new password..."
                                  value={newPassword}
                                  onChange={(e) =>
                                    setNewPassword(e.target.value)
                                  }
                                  className="flex-1 h-11 rounded-xl bg-muted/20 border-border/50 focus:ring-primary/30 text-sm font-medium px-6"
                                />
                                <Button
                                  onClick={handleChangePassword}
                                  disabled={!newPassword || isChangingPassword}
                                  className="h-11 px-6 rounded-xl text-[12px] font-semibold uppercase tracking-wider bg-primary text-white border-0"
                                >
                                  {isChangingPassword ? (
                                    <Spinner className="h-4 w-4" />
                                  ) : (
                                    "Update Password"
                                  )}
                                </Button>
                              </div>
                              <AnimatePresence>
                                {passwordMessage && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                      "p-5 rounded-xl border text-[11px] font-medium tracking-wider uppercase transition-all flex items-center gap-4",
                                      passwordMessage.type === "error"
                                        ? "bg-red-500/10 border-red-500/20 text-red-500"
                                        : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                    )}
                                  >
                                    <div
                                      className={cn(
                                        "w-2 h-2 rounded-full",
                                        passwordMessage.type === "error"
                                          ? "bg-red-500"
                                          : "bg-emerald-500"
                                      )}
                                    />
                                    {passwordMessage.text}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                      <Card className="rounded-xl border border-red-500/10 bg-red-500/[0.02] p-6 space-y-6 relative overflow-hidden border-b-4 border-b-red-500/10 transition-all hover:bg-red-500/[0.04]">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20">
                            <div className="animate-pulse">
                              <Shield className="w-7 h-7" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-2xl font-semibold tracking-tight text-red-500/90">
                              Danger Zone
                            </h4>
                            <p className="text-[12px] font-medium text-red-500/40 uppercase tracking-wider">
                              Privacy Safeguard
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground/80 font-medium leading-relaxed">
                          Permanently delete your account and all associated
                          videos. This action is irreversible.
                        </p>
                        <Button
                          variant="ghost"
                          onClick={handleDeleteAccount}
                          className="w-full rounded-full h-10 text-[13px] font-semibold uppercase tracking-wider text-red-500 hover:bg-red-50 hover:text-white border border-red-500/20 transition-all"
                        >
                          Delete Account
                        </Button>
                      </Card>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>

      {/* VIDEO MODAL */}
      <AnimatePresence>
        {playingVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl"
            onClick={() => setPlayingVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 20 }}
              className="relative w-full max-w-6xl aspect-video bg-black rounded-xl overflow-hidden border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="focus:outline-none absolute top-6 right-8 z-50 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/20 text-3xl backdrop-blur-xl shrink-0"
                onClick={() => setPlayingVideo(null)}
              >
                ×
              </button>
              <video
                src={playingVideo}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}

        {showReferral && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-2xl"
            onClick={() => setShowReferral(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="w-full max-w-lg bg-background border border-border/60 rounded-xl overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              <header className="p-6 border-b border-border/50 text-center space-y-3 relative overflow-hidden bg-muted/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full" />
                <h3 className="text-2xl font-semibold tracking-tight leading-none relative z-10">
                  Invite Rewards 🔑
                </h3>
                <p className="text-sm text-muted-foreground font-medium opacity-70 relative z-10">
                  Expand the network and boost your limit.
                </p>
              </header>
              <div className="p-6 space-y-8">
                <div className="space-y-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/30 block ml-1">
                    YOUR REFERRAL CODE
                  </span>
                  <div className="bg-muted/40 p-6 rounded-xl border-2 border-dashed border-primary/30 text-center select-all group hover:border-primary/50 transition-colors">
                    <span className="text-3xl font-mono font-medium tracking-wider text-primary">
                      VIBE-MIKE-2024
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <div className="flex-1 rounded-xl border border-border/60 h-11 bg-muted/20 flex items-center px-6 font-medium text-xs overflow-hidden whitespace-nowrap opacity-60">
                    vibevids.ai/ref/user123...
                  </div>
                  <Button className="rounded-xl h-11 px-8 bg-primary text-white text-[11px] font-semibold uppercase tracking-wider border-0 hover:scale-[1.02] transition-transform">
                    Copy
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

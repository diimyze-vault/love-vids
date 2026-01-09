import { useState } from "react";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Spinner } from "./ui/spinner";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import {
  Sun,
  Moon,
  Video,
  Trophy,
  Settings,
  LogOut,
  Plus,
  ExternalLink,
  Copy,
  Shield,
  Menu,
  Trash2,
} from "lucide-react";
import { api } from "../lib/api";
import { useEffect } from "react";

type Tab = "gallery" | "rewards" | "settings";

export function Dashboard({
  onCreateClick,
  onLogout,
  user,
  profile,
  setProfile,
  isLoggingOut,
  isDark,
  toggleTheme,
}: {
  onCreateClick: () => void;
  onLogout: () => void;
  user: User;
  profile: any;
  setProfile: (p: any) => void;
  isLoggingOut?: boolean;
  isDark?: boolean;
  toggleTheme?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("gallery");

  const [videos, setVideos] = useState<any[]>([]);
  const [referralStats, setReferralStats] = useState<any>(null);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, statsRes] = await Promise.all([
          api.getProfile(),
          api.getReferralStats(),
        ]);

        if (profileRes.data) {
          setProfile(profileRes.data);
          setVideos(profileRes.data.videos || []);
        }
        if (statsRes.data) {
          setReferralStats(statsRes.data);
        }
      } catch (err) {
        console.error("Dashboard: Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [profile?.id]);
  // Only re-fetch if identity changed or initial mount

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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    setIsDeleting(videoId);
    try {
      const res = await api.deleteVideo(videoId);
      if (res.status === "error") throw new Error(res.message);

      setVideos((prev) => prev.filter((v) => v.id !== videoId));
      if (profile?.profile) {
        setProfile({
          ...profile,
          profile: {
            ...profile.profile,
            storage_used: Math.max(0, profile.profile.storage_used - 1),
          },
        });
      }
    } catch (err) {
      console.error("Error deleting video:", err);
      alert("Failed to delete video.");
    } finally {
      setIsDeleting(null);
    }
  };

  const navItems = [
    { id: "gallery", label: "My Videos", icon: Video },
    { id: "rewards", label: "Referrals", icon: Trophy },
  ] as const;

  const SidebarContent = () => (
    <>
      <div className="hidden lg:flex h-20 items-center px-8 shrink-0 border-b border-border/50">
        <div className="text-xl font-bold text-gradient tracking-tight">
          VibeVids.ai
        </div>
      </div>

      <div className="flex-1 py-8 px-4 space-y-10 overflow-y-auto custom-scrollbar">
        <div className="space-y-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as Tab);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "group focus:outline-none w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-all duration-200 relative overflow-hidden cursor-pointer",
                    active
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/80 border border-transparent hover:border-border/50"
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
        <div className="p-4 rounded-xl bg-card border border-border/50 flex items-center gap-4 relative group">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-base font-bold border border-primary/20 shrink-0">
            {user.email?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold truncate text-foreground uppercase tracking-wider leading-none">
              {user.email?.split("@")[0]}
            </p>
          </div>
          <button
            onClick={() => {
              setActiveTab("settings");
              setIsMobileMenuOpen(false);
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all cursor-pointer border border-transparent hover:border-primary/20"
          >
            <Settings className="w-4 h-4" />
          </button>
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
    </>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/20 font-sans overflow-hidden">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-[280px] bg-background border-r border-border/50 flex flex-col h-screen shrink-0 z-50">
        <SidebarContent />
      </aside>

      {/* MOBILE SIDEBAR OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-background shadow-2xl z-[70] lg:hidden flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-muted/[0.02]">
        {/* HEADER BAR */}
        <header className="h-20 border-b border-border/50 bg-background/50 backdrop-blur-xl flex items-center justify-between px-4 lg:px-10 shrink-0 z-40">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 rounded-full border border-border/50 bg-card text-muted-foreground"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
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
              className="h-10 px-4 lg:px-8 rounded-full text-[11px] font-semibold uppercase tracking-wider border-0 hover:scale-[1.02] active:scale-[0.95] transition-all"
            >
              <Plus className="w-4 h-4 lg:mr-2" />
              <span className="hidden lg:inline">New Video</span>
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <section className="py-6 lg:py-8 px-4 lg:px-10 w-full">
            <AnimatePresence mode="wait">
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
                      Total: {videos.length}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
                          <div className="aspect-[9/16] bg-muted/20 relative overflow-hidden rounded-xl shrink-0 border-b border-border/20 group">
                            {/* 1. Video Background (always visible, plays on hover) */}
                            {video.status === "ready" &&
                              (video.video_url || video.url) && (
                                <video
                                  src={video.video_url || video.url}
                                  poster={
                                    video.thumbnail_url || video.thumbnail
                                  }
                                  className="w-full h-full object-cover absolute inset-0 z-10"
                                  muted
                                  loop
                                  playsInline
                                  onMouseEnter={(e) => e.currentTarget.play()}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.pause();
                                    e.currentTarget.currentTime = 0;
                                  }}
                                />
                              )}

                            {/* 2. Static Thumbnail (visible by default) */}
                            <img
                              src={
                                video.thumbnail_url ||
                                video.thumbnail ||
                                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80"
                              }
                              className="w-full h-full object-cover absolute inset-0 transition-all duration-700 group-hover:scale-105 z-0"
                              alt={video.title}
                              loading="lazy"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80";
                              }}
                            />

                            {/* 2b. Processing Overlay (if not ready) */}
                            {video.status !== "ready" && (
                              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-4 text-center">
                                <Spinner className="w-8 h-8 text-primary mb-3" />
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                                  {video.status === "failed"
                                    ? "Generation Failed"
                                    : "Crafting Vibe..."}
                                </span>
                              </div>
                            )}

                            {/* 3. Interactive Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 flex flex-col items-center justify-center p-6 text-center">
                              <div className="space-y-4 mb-8">
                                <h4 className="text-lg font-semibold tracking-tight text-white leading-tight">
                                  {video.title}
                                </h4>
                                <div className="flex flex-col items-center gap-1">
                                  <p className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
                                    {video.created_at
                                      ? new Date(
                                          video.created_at
                                        ).toLocaleDateString()
                                      : video.date}
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
                                  disabled={video.status !== "ready"}
                                  onClick={() => {
                                    const url = video.video_url || video.url;
                                    if (url) setPlayingVideo(url);
                                  }}
                                  className="rounded-full bg-primary text-white font-medium text-[11px] uppercase tracking-wider px-8 h-10 border-0 hover:scale-105 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteVideo(video.id);
                                  }}
                                  disabled={isDeleting === video.id}
                                  className="w-10 h-10 rounded-full text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                >
                                  {isDeleting === video.id ? (
                                    <Spinner className="w-4 h-4" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}

                    {videos.length === 0 && (
                      <motion.div
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
                            Zero Masterpieces
                          </span>
                          <span className="text-[9px] font-medium opacity-40 uppercase tracking-wider block">
                            Start your first creation
                          </span>
                        </div>
                      </motion.div>
                    )}
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
                      Referrals
                    </h2>
                    <p className="text-sm text-muted-foreground font-medium opacity-70">
                      Invite your friends and grow the VibeVids community.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        title: "Referral Stats",
                        req: "Successful Invites",
                        current: referralStats?.successful_referrals || 0,
                        total: referralStats?.successful_referrals || 0,
                        icon: "🎁",
                        color: "bg-primary",
                        border: "border-primary/20",
                        desc: "Track how many people have joined VibeVids using your unique invite code.",
                      },
                      {
                        title: "Invite Link",
                        req: "Share",
                        current: profile?.profile?.referral_code ? 1 : 0,
                        total: 1,
                        icon: "🔗",
                        color: "bg-orange-500",
                        border: "border-orange-500/20",
                        desc: "Your unique link is active. Share it with your network to spread the vibes.",
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
                              <span className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
                                {reward.req.toUpperCase()}
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
                                  Stats
                                </p>
                                <div className="space-y-1">
                                  {reward.title === "Referral Stats" ? (
                                    <>
                                      <p className="text-sm font-medium">
                                        {referralStats?.total_signups || 0}{" "}
                                        TOTAL SIGNUPS
                                      </p>
                                      <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest leading-tight mt-1">
                                        {referralStats?.successful_referrals ||
                                          0}{" "}
                                        VIDEOS MADE
                                      </p>
                                    </>
                                  ) : (
                                    <p className="text-sm font-medium">
                                      {reward.current ? "ACTIVE" : "INACTIVE"}
                                    </p>
                                  )}
                                </div>
                              </div>
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
                          Share your unique referral code with friends. Help us
                          build the most vibrant AI video community!
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                        <div className="bg-background border border-border/60 px-6 h-11 flex items-center rounded-xl font-mono text-primary font-medium select-all tracking-wider text-base">
                          {profile?.profile?.referral_code || "LOADING..."}
                        </div>
                        <Button
                          onClick={() => setShowReferral(true)}
                          className="rounded-xl h-11 px-6 bg-primary text-white font-medium text-[11px] uppercase tracking-wider border-0 hover:scale-[1.02] transition-transform"
                        >
                          <Copy className="w-4 h-4 mr-3" />
                          Invite Friends
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
                    <h2 className="text-2xl font-semibold tracking-tight">
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
                                  className="h-11 px-8 rounded-full text-[12px] font-semibold uppercase tracking-wider bg-primary text-white border-0 transition-all hover:scale-[1.02] active:scale-95"
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
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground/80 font-medium leading-relaxed">
                          Permanently delete your account and all associated
                          videos. This action is irreversible.
                        </p>
                        <Button
                          variant="ghost"
                          onClick={handleDeleteAccount}
                          className="w-full rounded-full h-10 text-[13px] font-semibold uppercase tracking-wider text-red-500 hover:bg-red-600 hover:text-white border border-red-500/20 hover:border-red-600 transition-all"
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
                  Invite Friends 🔑
                </h3>
                <p className="text-sm text-muted-foreground font-medium opacity-70 relative z-10">
                  Grow the VibeVids community.
                </p>
              </header>
              <div className="p-6 space-y-8">
                <div className="space-y-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/30 block ml-1">
                    YOUR REFERRAL CODE
                  </span>
                  <div className="bg-muted/40 p-6 rounded-xl border-2 border-dashed border-primary/30 text-center select-all group hover:border-primary/50 transition-colors">
                    <span className="text-3xl font-mono font-medium tracking-wider text-primary">
                      {profile?.profile?.referral_code}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <div className="flex-1 rounded-xl border border-border/60 h-11 bg-muted/20 flex items-center px-6 font-medium text-xs overflow-hidden whitespace-nowrap opacity-60">
                    {window.location.origin}/?ref=
                    {profile?.profile?.referral_code}
                  </div>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/?ref=${profile?.profile?.referral_code}`
                      );
                      alert("Link copied to clipboard!");
                    }}
                    className="rounded-full h-11 px-8 bg-primary text-white text-[11px] font-semibold uppercase tracking-wider border-0 hover:scale-[1.02] transition-transform active:scale-95"
                  >
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

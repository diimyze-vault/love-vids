import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";

export function Testimonials() {
  const reviews = [
    {
      name: "Tyler F.",
      comment: "My girlfriend literally cried. Best gift I ever gave.",
      role: "Verified Gifter",
      img: "https://i.pravatar.cc/150?u=tyler",
    },
    {
      name: "Jessica K.",
      comment: "The AI used our inside jokes perfectly. 10/10 recommendation.",
      role: "Best Friend",
      img: "https://i.pravatar.cc/150?u=jessica",
    },
    {
      name: "Marcus",
      comment: "So fast and actually looks high effort. Saved my anniversary.",
      role: "Husband",
      img: "https://i.pravatar.cc/150?u=marcus",
    },
    {
      name: "Sarah L.",
      comment: "Made a tribute for my mom's 60th. Everyone was in tears.",
      role: "Daughter",
      img: "https://i.pravatar.cc/150?u=sarah",
    },
    {
      name: "David R.",
      comment: "No editing skills needed. I looked like a pro in seconds.",
      role: "Tech Lead",
      img: "https://i.pravatar.cc/150?u=david",
    },
    {
      name: "Elena G.",
      comment: "The music sync is actually insane. It feels so professional.",
      role: "Designer",
      img: "https://i.pravatar.cc/150?u=elena",
    },
    {
      name: "Chris P.",
      comment: "Better than any card or physical gift I've ever sent.",
      role: "Visionary",
      img: "https://i.pravatar.cc/150?u=chris",
    },
    {
      name: "Maya W.",
      comment: "Used it for a pet tribute. Absolutely beautiful results.",
      role: "Pet Parent",
      img: "https://i.pravatar.cc/150?u=maya",
    },
  ];

  const firstRow = [...reviews.slice(0, 4), ...reviews.slice(0, 4)];
  const secondRow = [...reviews.slice(4), ...reviews.slice(4)];

  return (
    <section className="py-40 relative overflow-visible" id="social">
      <div className="absolute top-0 left-1/2 w-[1000px] h-[1000px] bg-primary/5 blur-[160px] rounded-full -translate-x-1/2 -translate-y-1/2 opacity-20 dark:opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-24 relative z-10 text-center space-y-7">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="label-caps px-6 py-2 rounded-full bg-primary/10 border border-primary/20 inline-flex"
        >
          Wall of Love
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight"
        >
          People <span className="text-gradient">Love</span> VibeVids 💖
        </motion.h2>
        <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
          Join 50,000+ people sending magical AI video gifts to the people they
          love.
        </p>
      </div>

      <div className="flex flex-col gap-8 relative overflow-visible">
        {/* Extreme Performance Overlays: Using zero-cost gradients instead of mask-image */}
        <div className="absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-r from-background to-transparent z-30 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-background to-transparent z-30 pointer-events-none" />

        <div className="flex overflow-visible py-24 -my-24 overflow-x-hidden">
          <div className="flex gap-10 whitespace-nowrap px-10 animate-marquee will-change-transform">
            {firstRow.map((review, i) => (
              <TestimonialCard key={i} review={review} />
            ))}
          </div>
        </div>

        <div className="flex overflow-visible py-24 -my-24 overflow-x-hidden">
          <div className="flex gap-10 whitespace-nowrap px-10 animate-marquee-reverse will-change-transform">
            {secondRow.map((review, i) => (
              <TestimonialCard key={i} review={review} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ review }: { review: any }) {
  return (
    <div className="w-[420px] flex-none rounded-2xl bg-card border border-border/50 p-12 flex flex-col justify-between hover:border-primary/50 transition-all duration-700 group relative overflow-hidden hover:">
      <div className="relative z-10">
        <div className="text-6xl text-gradient opacity-20 mb-8 font-serif leading-none italic group-hover:opacity-60 transition-opacity duration-700">
          “
        </div>
        <p className="text-xl text-foreground font-medium leading-[1.6] whitespace-normal italic tracking-tight mb-4">
          {review.comment}
        </p>
      </div>

      <div className="mt-12 flex items-center gap-6 relative z-10 pt-10">
        <div className="relative">
          <img
            src={review.img}
            alt={review.name}
            className="w-16 h-16 rounded-full border-2 border-white/10 group-hover:border-primary/40 transition-all relative z-10"
          />
        </div>
        <div className="space-y-1">
          <div className="font-bold text-foreground text-xl leading-none">
            {review.name}
          </div>
          <div className="text-primary text-[10px] font-bold uppercase tracking-wider">
            {review.role}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Pricing({ onCreateClick }: { onCreateClick: () => void }) {
  const [currency, setCurrency] = useState("INR");

  const prices = {
    INR: { symbol: "₹", rates: [35, 49, 55, 79] },
    USD: { symbol: "$", rates: [0.39, 0.59, 0.69, 0.99] },
    EUR: { symbol: "€", rates: [0.39, 0.55, 0.65, 0.89] },
    GBP: { symbol: "£", rates: [0.35, 0.49, 0.59, 0.79] },
  };

  const current = prices[currency as keyof typeof prices];

  const tiers = [
    {
      name: "Quick Surprise",
      desc: "Good quality short video",
      quality: "720p HD",
      duration: "5 Seconds",
      popular: false,
      color: "default",
    },
    {
      name: "Pro Surprise",
      desc: "High quality short video",
      quality: "1080p Full HD",
      duration: "5 Seconds",
      popular: true,
      color: "primary",
    },
    {
      name: "Magic Gift",
      desc: "Good quality long video",
      quality: "720p HD",
      duration: "10 Seconds",
      popular: false,
      color: "default",
    },
    {
      name: "Epic Cinematic",
      desc: "Best quality long video",
      quality: "1080p Full HD",
      duration: "10 Seconds",
      popular: false,
      color: "gradient",
    },
  ];

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto" id="pricing">
      <div className="text-center mb-28 space-y-7">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="label-caps px-5 py-2 rounded-full bg-primary/10 border border-primary/20 inline-flex"
        >
          Pricing Plans
        </motion.div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight mb-4">
          Simple Pricing
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
          Pay only for what you need. <br className="hidden md:block" />
          <span className="text-primary">
            No subscriptions. No hidden fees.
          </span>
        </p>
      </div>

      <div className="flex justify-center mb-24">
        <div className="inline-flex items-center glass p-2 rounded-full border border-black/10 dark:border-white/10 relative">
          {(Object.keys(prices) as Array<keyof typeof prices>).map((curr) => (
            <button
              key={curr}
              onClick={() => setCurrency(curr)}
              className={cn(
                "focus:outline-none px-8 py-3 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all relative z-10",
                currency === curr
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {currency === curr && (
                <motion.div
                  layoutId="currency-active"
                  className="absolute inset-0 bg-primary rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {curr}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {tiers.map((tier, idx) => (
          <Card
            key={idx}
            className={cn(
              "flex flex-col transition-all rounded-xl overflow-visible group relative",
              tier.popular
                ? "border-primary bg-card lg:scale-110 z-20 border-2 ring-offset-background ring-offset-4 ring-primary"
                : "border-border/50 bg-card hover:border-primary/20 hover:scale-[1.02] active:scale-95"
            )}
          >
            {tier.popular && (
              <div className="absolute inset-0 bg-primary/[0.03] pointer-events-none" />
            )}
            {tier.popular && (
              <div className="absolute top-8 left-1/2 -translate-x-1/2 label-caps bg-primary text-white px-5 py-1.5 rounded-full">
                RECOMMENDED
              </div>
            )}

            <div
              className={cn(
                "p-10 space-y-8 flex-grow",
                tier.popular && "pt-20"
              )}
            >
              <div className="space-y-2">
                <h3
                  className={cn(
                    "text-2xl font-semibold tracking-tight leading-none",
                    tier.color === "gradient"
                      ? "text-gradient"
                      : "text-foreground"
                  )}
                >
                  {tier.name}
                </h3>
                <p className="text-xs font-medium text-muted-foreground">
                  {tier.desc}
                </p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-semibold tracking-tight text-foreground">
                  {current.symbol}
                  {current.rates[idx]}
                </span>
                <span className="font-bold italic text-sm text-muted-foreground/50">
                  /video
                </span>
              </div>

              <div className="space-y-4 pt-4">
                <Feature text={tier.quality} />
                <Feature text={tier.duration} />
                <Feature text="Quick Rendering" />
                <Feature text="No Watermark" />
              </div>
            </div>

            <div className="p-10 pt-0">
              <Button
                variant={tier.popular ? "premium" : "secondary"}
                className={cn(
                  "w-full py-7 rounded-full font-semibold text-[11px] uppercase tracking-wider transition-all active:scale-95"
                )}
                onClick={onCreateClick}
              >
                Send a Vibe
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px]">
        ✓
      </div>
      <span className="text-[13px] font-semibold tracking-tight text-foreground/90">
        {text}
      </span>
    </div>
  );
}

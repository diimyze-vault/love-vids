import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function HowItWorks() {
  const steps = [
    {
      id: "01",
      icon: "📸",
      title: "Upload & Context",
      desc: "Drop a photo and write a few words. Tell us the occasion—birthday, anniversary, or a romantic surprise.",
    },
    {
      id: "02",
      icon: "🪄",
      title: "Pick Your Vibe",
      desc: "Select the artistic visual style. Our AI uses this as the foundation for your personalized cinematic masterpiece.",
    },
    {
      id: "03",
      icon: "💳",
      title: "One-Time Payment",
      desc: "Unlock the generation process with a secure, single payment. No subscriptions, just pure magic.",
    },
    {
      id: "04",
      icon: "💝",
      title: "Instant Delivery",
      desc: "Our AI synthesizes your custom HD video in seconds. Download and share the surprise instantly.",
    },
  ];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollRef.current.scrollLeft - clientWidth / 2
          : scrollRef.current.scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const cardSpring: any = {
    type: "spring",
    stiffness: 60,
    damping: 20,
    mass: 1.2,
  };

  return (
    <section
      className="pt-16 pb-12 px-6 max-w-7xl mx-auto overflow-visible relative"
      id="how-it-works"
    >
      <div className="absolute inset-0 -z-10 bg-radial-at-c from-primary/5 to-transparent blur-3xl opacity-50" />

      <div className="text-center mb-16 space-y-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
        >
          From Photo to <span className="text-gradient">Magic Gift</span> 🎁
        </motion.h2>
        <p className="text-lg text-muted-foreground font-medium">
          Four simple steps to create an unforgettable moment.
        </p>
      </div>

      <div className="relative group">
        <AnimatePresence>
          {canScrollLeft && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-1/2 -translate-y-1/2 -left-4 lg:-left-8 z-20"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => scroll("left")}
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-lg flex items-center justify-center text-foreground cursor-pointer"
              >
                ←
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {canScrollRight && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-1/2 -translate-y-1/2 -right-4 lg:-right-8 z-20"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => scroll("right")}
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-lg flex items-center justify-center text-foreground cursor-pointer"
              >
                →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-6 md:gap-8 pb-8 lg:pb-0 no-scrollbar snap-x snap-mandatory scroll-smooth"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...cardSpring, delay: index * 0.1 }}
              className="relative group p-8 lg:p-10 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-500 flex-none w-[280px] md:w-[320px] lg:w-auto snap-center flex flex-col items-center text-center overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="relative mb-8 lg:mb-10">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl bg-primary/5 flex items-center justify-center text-3xl lg:text-4xl relative group-hover:scale-110 transition-transform duration-500">
                  <span className="absolute -top-2 -right-2 lg:-top-3 lg:-right-3 w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-primary flex items-center justify-center text-[9px] lg:text-[10px] font-semibold text-white border-2 border-card z-20">
                    {step.id}
                  </span>
                  <span className="relative z-10">{step.icon}</span>
                </div>
              </div>

              <div className="space-y-3 lg:space-y-4">
                <h3 className="text-lg lg:text-xl font-bold group-hover:text-primary transition-colors duration-300 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-[14px] lg:text-[15px] text-muted-foreground leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DemoVideos() {
  const [playingMap, setPlayingMap] = useState<{ [key: number]: boolean }>({});
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollTo =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - clientWidth / 2
          : scrollContainerRef.current.scrollLeft + clientWidth / 2;
      scrollContainerRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  };

  const demos = [
    {
      title: "Birthday Magic",
      user: "@sarah_gift",
      vibe: "Birthday 🎂",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    },
    {
      title: "Proposal Surprise",
      user: "@romeo_ai",
      vibe: "Proposal 💍",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    },
    {
      title: "Sweet Anniversary",
      user: "@love_vids",
      vibe: "Anniversary ❤️",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    },
    {
      title: "Bestie Tribute",
      user: "@gift_master",
      vibe: "Friends 👯‍♂️",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    },
    {
      title: "Graduation Vibe",
      user: "@proud_parent",
      vibe: "Graduation 🎓",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    },
    {
      title: "New Puppy Surprise",
      user: "@doggo_lover",
      vibe: "New Pet 🐾",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    },
  ];

  const togglePlay = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      if (video.paused) {
        video.play();
        setPlayingMap((prev) => ({ ...prev, [index]: true }));
      } else {
        video.pause();
        setPlayingMap((prev) => ({ ...prev, [index]: false }));
      }
    }
  };

  return (
    <section
      className="py-16 max-w-[100vw] relative bg-background overflow-visible"
      id="demos"
    >
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full translate-y-1/2 opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full opacity-20 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center space-y-7">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight"
        >
          Made with <span className="text-gradient">VibeVids</span> 🎬
        </motion.h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
          Emotional moments captured and created by our global community.
        </p>
      </div>

      <div className="relative group overflow-visible">
        <AnimatePresence>
          {canScrollLeft && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8 lg:left-12 z-50 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => scroll("left")}
                className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-lg flex items-center justify-center text-foreground cursor-pointer"
              >
                ←
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {canScrollRight && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-1/2 -translate-y-1/2 right-4 md:right-8 lg:right-12 z-50 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => scroll("right")}
                className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-lg flex items-center justify-center text-foreground cursor-pointer"
              >
                →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto gap-8 px-[max(1.5rem,calc((100vw-1280px)/2+1.5rem))] py-12 no-scrollbar snap-x snap-mandatory scroll-smooth"
        >
          {demos.map((demo, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "100px" }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: idx * 0.05,
              }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="relative flex-none w-[300px] md:w-[340px] aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer group snap-center border border-white/10 will-change-transform"
              onClick={() => togglePlay(idx)}
            >
              <video
                ref={(el) => {
                  videoRefs.current[idx] = el;
                }}
                src={demo.url}
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                playsInline
                loop
                muted
              />

              <AnimatePresence>
                {!playingMap[idx] && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/30 flex items-center justify-center"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 glass rounded-full flex items-center justify-center border border-white/20"
                    >
                      <span className="text-white text-2xl ml-1">▶</span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none p-8 flex flex-col justify-end">
                <div className="space-y-4">
                  <motion.span
                    initial={{ opacity: 0.8 }}
                    whileHover={{ scale: 1.05, opacity: 1 }}
                    className="inline-block px-4 py-1.5 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-wider border border-white/10"
                  >
                    {demo.vibe}
                  </motion.span>
                  <div className="flex flex-col text-white">
                    <span className="font-bold text-2xl leading-none mb-1.5">
                      {demo.title}
                    </span>
                    <span className="text-xs font-bold text-white/60">
                      {demo.user}
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-white/10 via-white/5 to-transparent transition-opacity duration-700 pointer-events-none" />
            </motion.div>
          ))}

          <div className="flex-none w-[max(1.5rem,calc((100vw-1280px)/2+1.5rem))]" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 flex items-center gap-6">
        <div className="flex gap-2.5">
          <motion.div
            animate={{ width: [32, 48, 32] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 bg-primary rounded-full"
          />
          <div className="h-1.5 w-4 bg-muted/20 rounded-full" />
          <div className="h-1.5 w-4 bg-muted/20 rounded-full" />
        </div>
        <span className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-wider">
          Scroll to see magic in action
        </span>
      </div>
    </section>
  );
}

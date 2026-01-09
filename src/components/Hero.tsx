import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function Hero({ onCreateClick }: { onCreateClick: () => void }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const slides = [
    {
      id: 1,
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      label: "For Your Soulmate 💘",
      user: "@sarah_j",
    },
    {
      id: 2,
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      label: "Bestie Birthday 🎂",
      user: "@mike_t",
    },
    {
      id: 3,
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      label: "Mom's Special Day �",
      user: "@gift_master",
    },
  ];

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === activeSlide) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });
  }, [activeSlide]);

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsPlaying(true);
  };

  const togglePlay = (index: number) => {
    if (index !== activeSlide) return;
    const video = videoRefs.current[index];
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  // Elite natural spring
  const springTransition: any = {
    type: "spring",
    stiffness: 100,
    damping: 24,
    mass: 1.2,
    restDelta: 0.001,
  };

  // Organic stagger variants
  const entranceVariants: any = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.07,
        duration: 1,
        ease: [0.23, 1, 0.32, 1],
      },
    }),
  };

  return (
    <div className="relative flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-6 lg:py-0 gap-8 lg:gap-20 lg:min-h-[calc(100vh-100px)] overflow-visible">
      <div className="w-full lg:w-[45%] text-left space-y-8 lg:space-y-10 z-10 order-2 lg:order-1 pt-12 lg:pt-0">
        <div className="space-y-6">
          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={entranceVariants}
            className="text-5xl md:text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-foreground"
          >
            Vibe Checks into <br className="hidden lg:block" />
            <span className="text-gradient">Viral Videos</span> 🎥
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={entranceVariants}
            className="text-lg lg:text-xl text-muted-foreground max-w-2xl leading-relaxed font-medium opacity-80"
          >
            Upload a photo. Pick a vibe. Get a stunning AI video in seconds.
            Perfect for Valentine's, Birthdays or Roasts.
          </motion.p>
        </div>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={entranceVariants}
          className="flex pt-4"
        >
          <Button
            size="lg"
            variant="premium"
            className="group relative h-16 pl-8 pr-3 rounded-full bg-black dark:bg-white text-white dark:text-black hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center gap-6 border-0 shadow-2xl shadow-primary/20"
            onClick={onCreateClick}
          >
            <span className="text-sm font-bold tracking-widest uppercase">
              Send a Magic Gift
            </span>
            <div className="w-10 h-10 rounded-full bg-white dark:bg-black flex items-center justify-center text-black dark:text-white transition-transform duration-500 group-hover:rotate-45">
              <span className="text-lg font-bold">→</span>
            </div>
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
        className="hidden lg:flex w-full lg:w-[50%] relative items-center justify-center lg:justify-end mt-12 lg:mt-0 z-20 order-1 lg:order-2 px-4 md:px-0"
      >
        <div className="relative w-full max-w-[280px] md:max-w-[320px] lg:max-w-[350px] aspect-[9/16] perspective-2000 preserve-3d">
          <div className="absolute top-1/2 -translate-y-1/2 left-2 md:-left-16 lg:-left-20 z-50">
            <motion.button
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.9 }}
              className="rounded-full bg-background/80 backdrop-blur-md border border-border/50 hover:border-primary/30 shadow-lg transition-all w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 flex items-center justify-center text-foreground cursor-pointer group"
              onClick={handlePrev}
            >
              <span className="group-hover:-translate-x-0.5 transition-transform duration-300">
                ←
              </span>
            </motion.button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-2 md:-right-16 lg:-right-20 z-50">
            <motion.button
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.9 }}
              className="rounded-full bg-background/80 backdrop-blur-md border border-border/50 hover:border-primary/30 shadow-lg transition-all w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 flex items-center justify-center text-foreground cursor-pointer group"
              onClick={handleNext}
            >
              <span className="group-hover:translate-x-0.5 transition-transform duration-300">
                →
              </span>
            </motion.button>
          </div>

          <AnimatePresence mode="popLayout" initial={false}>
            {slides.map((slide, index) => {
              const offset =
                (index - activeSlide + slides.length) % slides.length;
              const isFront = offset === 0;
              const isNext = offset === 1;
              const isPrev = offset === slides.length - 1;

              let transformStyles =
                "translateX(0) translateZ(-400px) rotateY(0deg) scale(0.8)";
              let zIndexValue = 1;
              let opacityValue = 0;

              if (isFront) {
                transformStyles =
                  "translateX(0) translateZ(0) rotateY(0deg) scale(1)";
                zIndexValue = 30;
                opacityValue = 1;
              } else if (isNext) {
                transformStyles =
                  "translateX(40px) translateZ(-200px) rotateY(-7deg) scale(0.92)";
                zIndexValue = 20;
                opacityValue = 0.4;
              } else if (isPrev && slides.length > 2) {
                transformStyles =
                  "translateX(-40px) translateZ(-200px) rotateY(7deg) scale(0.92)";
                zIndexValue = 20;
                opacityValue = 0.4;
              }

              return (
                <motion.div
                  key={slide.id}
                  layout
                  initial={false}
                  animate={{
                    transform: transformStyles,
                    zIndex: zIndexValue,
                    opacity: opacityValue,
                  }}
                  transition={springTransition}
                  className={`absolute inset-0 interactive-video-card cursor-pointer rounded-[40px] overflow-hidden bg-black border border-white/10 ${
                    isFront ? "" : ""
                  }`}
                  onClick={() => togglePlay(index)}
                >
                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el;
                    }}
                    src={slide.url}
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />

                  {!isPlaying && isFront && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-black/30 backdrop-blur-xl rounded-full w-20 h-20 flex items-center justify-center text-white text-3xl border border-white/20"
                      >
                        ▶
                      </motion.div>
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/95 via-black/20 to-transparent pointer-events-none">
                    <div className="absolute bottom-8 left-8 right-8 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="user-pill bg-white/10 backdrop-blur-xl text-[10px] font-bold px-4 py-1.5 rounded-full text-white/90 border border-white/10 tracking-wider transition-all">
                          {slide.user}
                        </span>
                      </div>
                      <span className="vibe-pill bg-primary/20 backdrop-blur-xl border border-primary/40 text-[11px] font-bold px-4 py-2 rounded-full text-white tracking-tight text-center">
                        {slide.label}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

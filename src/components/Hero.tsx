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
    <div className="relative flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-8 lg:py-0 gap-12 lg:gap-20 lg:min-h-[calc(100vh-85px)] overflow-visible">
      <div className="w-full lg:w-[42%] text-center lg:text-left space-y-6 lg:space-y-9 z-10 order-2 lg:order-1">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={entranceVariants}
          className="label-caps px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl mb-4 inline-flex"
        >
          ✨ VALENTINE'S MODE ACTIVE
        </motion.div>

        <div className="space-y-4">
          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={entranceVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.02] tracking-tight text-foreground"
          >
            Transform Photos <br className="hidden lg:block" />
            into <span className="text-gradient">AI Video Gifts</span> 🎁
          </motion.h1>
        </div>

        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={entranceVariants}
          className="text-base lg:text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 leading-relaxed font-medium"
        >
          Create a moving cinematic tribute for your Valentine, Birthday, or
          Anniversary in seconds. Just upload a photo and let our AI do the
          magic.
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={entranceVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2"
        >
          <Button
            size="lg"
            variant="premium"
            className="text-[13px] lg:text-[14px] px-10 py-5 h-auto rounded-full relative group overflow-hidden cursor-pointer transition-all active:scale-95"
            onClick={onCreateClick}
          >
            <span className="relative z-10 font-bold tracking-wider uppercase">
              SEND A VIBE 🎁
            </span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="text-[13px] lg:text-[14px] px-10 py-5 h-auto rounded-full cursor-pointer transition-all duration-300 text-foreground font-semibold uppercase tracking-[0.1em] active:scale-95"
            onClick={() =>
              document
                .getElementById("demos")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            SEE EXAMPLES
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
        className="w-full lg:w-[52%] relative flex items-center justify-center lg:justify-end mt-4 lg:mt-0 z-20 order-1 lg:order-2"
      >
        <div className="relative w-[280px] md:w-[320px] lg:w-[350px] aspect-[9/16] max-h-[580px] perspective-2000 preserve-3d">
          <div className="absolute top-1/2 -translate-y-1/2 -left-12 lg:-left-16 z-50">
            <motion.button
              whileHover={{ scale: 1.15, x: -4 }}
              whileTap={{ scale: 0.9 }}
              className="rounded-full bg-background border-2 border-foreground/5 hover:border-primary/30 transition-all w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center text-foreground cursor-pointer group"
              onClick={handlePrev}
            >
              <span className="group-hover:-translate-x-0.5 transition-transform duration-300">
                ←
              </span>
            </motion.button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 -right-12 lg:-right-16 z-50">
            <motion.button
              whileHover={{ scale: 1.15, x: 4 }}
              whileTap={{ scale: 0.9 }}
              className="rounded-full bg-background border-2 border-foreground/5 hover:border-primary/30 transition-all w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center text-foreground cursor-pointer group"
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

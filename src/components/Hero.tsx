import { useState, useRef } from 'react';

export function Hero({ onCreateClick }: { onCreateClick: () => void }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Using reliable Google Storage samples for stability
  const slides = [
    { id: 1, url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', label: 'Cinematic Love 🎬', user: '@sarah_j' },
    { id: 2, url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', label: 'Bestie Roast 🔥', user: '@mike_t' },
    { id: 3, url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', label: 'Pet Tribute 🐾', user: '@doggo_lover' },
  ];

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsPlaying(true);
  };

  const togglePlay = (index: number) => {
    if (index !== activeSlide) return; // Only control active slide
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

  return (
    <div className="hero">
      <div className="hero-content">
        <div className="badge-new">💘 Valentine's Mode Live!</div>
        <h1 className="hero-title">
          Vibe Checks into <br />
          <span className="gradient-text">Viral Videos</span> 🎥
        </h1>
        <p className="hero-text">
          Upload a photo. Pick a vibe. Get a stunning AI video in seconds.
          Perfect for Valentine's, Birthdays, or Roasts.
        </p>
        <button className="cta-button" onClick={onCreateClick}>
          START CREATING <span style={{fontSize:'1.2em'}}>✨</span>
        </button>
      </div>

      <div className="hero-visual">
         <div className="card-stack-video">
           <div className="stack-controls">
             <button onClick={handlePrev} className="stack-btn">←</button>
             <button onClick={handleNext} className="stack-btn">→</button>
           </div>
           
           {slides.map((slide, index) => {
             const offset = (index - activeSlide + slides.length) % slides.length;
             const isFront = offset === 0;
             const isNext = offset === 1;
             
             let style: React.CSSProperties = {};
             if (isFront) {
               style = { transform: 'scale(1) translateX(0)', zIndex: 10, opacity: 1, pointerEvents: 'auto' };
             } else if (isNext) {
               style = { transform: 'scale(0.92) translateX(40px) rotate(4deg)', zIndex: 5, opacity: 0.6, pointerEvents: 'none' };
             } else {
               style = { transform: 'scale(0.85) translateX(80px) rotate(8deg)', zIndex: 1, opacity: 0.3, pointerEvents: 'none' };
             }

             return (
               <div 
                  key={slide.id} 
                  className={`interactive-video-card ${isFront ? 'active' : ''}`} 
                  style={style}
                  onClick={() => togglePlay(index)}
               >
                 <video 
                   ref={(el) => { videoRefs.current[index] = el; }}
                   src={slide.url}
                   autoPlay={isFront}
                   loop
                   muted
                   playsInline
                   className="hero-video-stacked"
                 />
                 
                 {/* Play/Pause Overlay Indicator if needed */}
                 {!isPlaying && isFront && (
                    <div className="play-indicator">▶</div>
                 )}

                 <div className="video-card-overlay">
                   <div className="video-meta">
                     <span className="user-pill">{slide.user}</span>
                     <span className="vibe-pill">{slide.label}</span>
                   </div>
                 </div>
               </div>
             );
           })}
         </div>
      </div>
    </div>
  );
}

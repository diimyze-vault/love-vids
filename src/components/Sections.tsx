import { useState, useRef } from 'react';

export function HowItWorks() {
  const steps = [
    {
      id: "01",
      icon: "📸",
      title: "Upload & Context",
      desc: "Drop a photo and add a few words. 'Make it funny' or 'Make it romantic'."
    },
    {
      id: "02",
      icon: "🪄",
      title: "AI Analysis",
      desc: "Our engine scans the image and text to craft a perfect video narrative with music."
    },
    {
      id: "03",
      icon: "🔓",
      title: "Unlock Vibe",
      desc: "Preview 3 generated options. Pay a small fee to unlock the HD video without watermarks."
    },
    {
      id: "04",
      icon: "🚀",
      title: "Go Viral",
      desc: "Download MP4 instantly. Ready for TikTok, Reels, or WhatsApp status."
    }
  ];

  return (
    <section className="steps-section" id="how-it-works">
      <div className="section-header">
        <h2 className="section-title">From Pic to Viral in Minutes 🚀</h2>
        <p className="section-subtitle">No editing skills required. Just vibes.</p>
      </div>
      
      <div className="steps-flow-container">
        <div className="steps-connector-line"></div>
        <div className="steps-grid-flow">
          {steps.map((step, index) => (
            <div className="step-item-flow" key={index}>
               <div className="step-icon-circle shadow-pop">{step.icon}</div>
               <div className="step-content-flow">
                 <span className="step-number-tiny">STEP {step.id}</span>
                 <h3>{step.title}</h3>
                 <p>{step.desc}</p>
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DemoVideos() {
  const [playingMap, setPlayingMap] = useState<{[key:number]: boolean}>({});
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const demos = [
    { title: "Birthday Roast", user: "@mike_t", vibe: "Roast Mode 🔥", url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" },
    { title: "Anniversary", user: "@sarah_j", vibe: "Romantic 🌹", url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" },
    { title: "Job Promotion", user: "@alex_work", vibe: "Hype 🚀", url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
    { title: "Valentine's", user: "@romeo_ai", vibe: "Cinematic 🎬", url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
    { title: "Vacation Reel", user: "@travel_bug", vibe: "Chill 🌊", url: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" },
    { title: "Pet Bloopers", user: "@doggo_lover", vibe: "Meme 🐶", url: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" }
  ];

  const togglePlay = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
        if (video.paused) {
            video.play();
            setPlayingMap(prev => ({...prev, [index]: true}));
        } else {
            video.pause();
            setPlayingMap(prev => ({...prev, [index]: false}));
        }
    }
  };

  return (
    <section className="demos-section" id="demos">
      <div className="section-header">
        <h2 className="section-title">Made with VibeVids</h2>
        <p className="section-subtitle">See what others are creating.</p>
      </div>

      <div className="demos-container">
        <div className="demos-grid">
          {demos.map((demo, idx) => (
            <div className="demo-card-video" key={idx} onClick={() => togglePlay(idx)}>
              <video 
                ref={(el) => { videoRefs.current[idx] = el; }}
                src={demo.url}
                className="demo-video-element"
                playsInline
                loop
                muted={false} 
              />
              
              {!playingMap[idx] && (
                 <div className="demo-overlay-glass">
                   <div className="play-button-glass">▶</div>
                   <div className="demo-info">
                     <span className="demo-user">{demo.user}</span>
                     <span className="demo-vibe">{demo.vibe}</span>
                   </div>
                 </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useState } from 'react';

export function Dashboard({ onCreateClick, onLogout, userEmail }: { onCreateClick: () => void, onLogout: () => void, userEmail?: string }) {
  // Mock data for user's videos
  const [videos] = useState([
    { id: 1, title: "Birthday Roast for Mike", date: "2 mins ago", status: "Processing", thumbnail: "" },
    { id: 2, title: "Anniversary Surprise", date: "2 days ago", status: "Ready", thumbnail: "https://picsum.photos/seed/dash1/300/169", url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" },
  ]);

  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [showReferral, setShowReferral] = useState(false);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dash-brand" onClick={() => window.location.reload()} style={{cursor: 'pointer'}}>
          VibeVids.ai
        </div>
        <div className="dash-user-controls">
           <button className="dash-referral-btn" onClick={() => setShowReferral(true)}>🎁 Invite Friends</button>
           <span className="user-email">{userEmail || 'user@example.com'}</span>
           <button className="dash-logout" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main className="dash-content">
        <div className="dash-welcome">
          <h1>Welcome back, Creator! 👋</h1>
          <button className="create-new-btn" onClick={onCreateClick}>
            + Create New Video
          </button>
        </div>

        {/* REWARDS SECTION */}
        <section className="rewards-section">
           <h2>Rewards 🏆</h2>
           <div className="rewards-grid">
              
              {/* Reward Card 1 */}
              <div className="reward-card">
                 <div className="circular-progress">
                    <svg viewBox="0 0 36 36" className="circular-chart orange">
                      <path className="circle-bg"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path className="circle"
                        strokeDasharray="60, 100" // 3 out of 5 = 60%
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="reward-icon">🎟️</div>
                 </div>
                 <div className="reward-info">
                   <h3>Free HD Video</h3>
                   <p><strong>3</strong> / 5 Referrals</p>
                   <span className="reward-status locked">2 more to unlock</span>
                 </div>
              </div>

              {/* Reward Card 2 */}
              <div className="reward-card">
                 <div className="circular-progress">
                    <svg viewBox="0 0 36 36" className="circular-chart purple">
                      <path className="circle-bg"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path className="circle"
                        strokeDasharray="30, 100" // 3 out of 10 = 30%
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="reward-icon">🎬</div>
                 </div>
                 <div className="reward-info">
                   <h3>Free 4K Epic</h3>
                   <p><strong>3</strong> / 10 Referrals</p>
                   <span className="reward-status locked">7 more to unlock</span>
                 </div>
              </div>

           </div>
        </section>

        <section className="dash-videos-section">
          <h2>Your Videos (Persistent Gallery)</h2>
          <div className="dash-video-grid">
            {videos.map(video => (
              <div key={video.id} className="dash-video-card" onClick={() => video.url && setPlayingVideo(video.url)}>
                 <div className={`dash-video-thumb ${!video.thumbnail ? 'processing' : ''}`}>
                    {video.thumbnail ? (
                      <>
                         <img src={video.thumbnail} alt={video.title} />
                         <div className="thumb-play-icon">▶</div>
                      </>
                    ) : (
                      <div className="processing-placeholder">
                        <div className="spinner-small"></div>
                        <span>Rendering...</span>
                      </div>
                    )}
                 </div>
                 <div className="dash-video-info">
                   <h3>{video.title}</h3>
                   <div className="dash-meta">
                     <span>{video.date}</span>
                     <span className={`status-badge ${video.status.toLowerCase()}`}>{video.status}</span>
                   </div>
                 </div>
              </div>
            ))}
            
            {/* Empty state slots (max 5) */}
            {[...Array(3)].map((_, i) => (
               <div key={`empty-${i}`} className="dash-video-card empty" onClick={onCreateClick}>
                  <div className="empty-slot-icon">+</div>
                  <span>Empty Slot</span>
               </div>
            ))}
          </div>
        </section>

        {/* Video Player Modal */}
        {playingVideo && (
            <div className="video-modal-overlay" onClick={() => setPlayingVideo(null)}>
                <div className="video-modal-content" onClick={e => e.stopPropagation()}>
                    <button className="close-player" onClick={() => setPlayingVideo(null)}>×</button>
                    <video src={playingVideo} controls autoPlay className="modal-video-player" />
                    <div className="video-actions-bar">
                        <button className="video-action-btn">⬇ Download</button>
                        <button className="video-action-btn">🔗 Share Link</button>
                    </div>
                </div>
            </div>
        )}

        {/* Referral Modal */}
        {showReferral && (
            <div className="video-modal-overlay" onClick={() => setShowReferral(false)}>
                <div className="referral-modal-content" onClick={e => e.stopPropagation()}>
                    <button className="close-player" onClick={() => setShowReferral(false)}>×</button>
                    <h2>Invite Friends 🎁</h2>
                    <p>Share your code and get rewards!</p>
                    
                    <div className="referral-code-reveal-section">
                        <div className="code-display">
                           <span className="code-label">YOUR CODE:</span>
                           <RevealCode code="VIBE-MIKE-2024" />
                        </div>
                        <p className="mini-hint">Share this code with friends to enter during signup.</p>
                    </div>

                    <div className="referral-link-section" style={{marginTop: '2rem'}}>
                        <p style={{marginBottom: '0.5rem', fontWeight: 600, color: '#555', fontSize: '0.9rem'}}>Or share via link:</p>
                        <div className="referral-link-box">
                            <input readOnly value="vibevids.ai/ref/user123" />
                            <button onClick={(e) => {
                                const btn = e.target as HTMLButtonElement;
                                const originalText = btn.innerText;
                                btn.innerText = 'Copied!';
                                setTimeout(() => btn.innerText = originalText, 2000);
                            }}>Copy</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}

function RevealCode({ code }: { code: string }) {
   const [revealed, setRevealed] = useState(false);
   
   return (
      <div className="reveal-wrapper" onClick={() => setRevealed(true)}>
          {revealed ? (
             <span className="actual-code">{code}</span>
          ) : (
             <span className="masked-code">••••••••••••• <span className="click-reveal">(Tap to reveal)</span></span>
          )}
      </div>
   );
}

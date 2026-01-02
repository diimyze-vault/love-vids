import { useState } from 'react';

export function Dashboard({ onCreateClick, onLogout }: { onCreateClick: () => void, onLogout: () => void }) {
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
           <span className="user-email">user@example.com</span>
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
                    <p>Share the vibe and get 2 free credits for every friend who joins!</p>
                    
                    <div className="qr-code-mock">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://vibevids.ai/ref/user123" alt="Referral QR" />
                    </div>
                    
                    <div className="referral-link-box">
                        <input readOnly value="vibevids.ai/ref/user123" />
                        <button>Copy</button>
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}

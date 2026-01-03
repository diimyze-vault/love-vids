import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export function Dashboard({ onCreateClick, onLogout, user, isLoggingOut }: { onCreateClick: () => void, onLogout: () => void, user: User, isLoggingOut?: boolean }) {
  // Mock data for user's videos
  const [videos] = useState([
    { id: 1, title: "Birthday Roast for Mike", date: "2 mins ago", status: "Processing", thumbnail: "" },
    { id: 2, title: "Anniversary Surprise", date: "2 days ago", status: "Ready", thumbnail: "https://picsum.photos/seed/dash1/300/169", url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" },
  ]);

  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [showReferral, setShowReferral] = useState(false);
  const [isLinking, setIsLinking] = useState(false);

  // Check linked identities
  const googleIdentity = user.identities?.find(id => id.provider === 'google');
  
  const handleLinkGoogle = async () => {
      setIsLinking(true);
      const { error } = await supabase.auth.linkIdentity({ provider: 'google', options: { redirectTo: window.location.origin } });
      if (error) {
          alert('Error linking Google: ' + error.message);
          setIsLinking(false);
      }
      // Redirects away, so no need to set false usually
  };

  const handleUnlinkGoogle = async () => {
      if (!googleIdentity) return;
      if (confirm('Are you sure you want to disconnect Google? You will need your password to login next time.')) {
          setIsLinking(true);
          const { error } = await supabase.auth.unlinkIdentity(googleIdentity);
          setIsLinking(false);
          if (error) alert(error.message);
          else window.location.reload(); // Refresh to update user object
      }
  };

  // Profile Management State
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleChangePassword = async () => {
      if (!newPassword) return;
      setIsChangingPassword(true);
      setPasswordMessage(null);
      
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      setIsChangingPassword(false);
      
      if (error) {
          setPasswordMessage({ type: 'error', text: error.message });
      } else {
          setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
          setNewPassword(''); // Clear input
      }
  };

  const handleDeleteAccount = async () => {
      // Soft Delete Logic:
      // 1. We flag the account in metadata as "scheduled for deletion".
      // 2. We sign the user out.
      // (Actual hard deletion would require a backend cron job to check this flag after 30 days)
      
      if (confirm('Are you sure? Your account will be deactivated immediately and permanently deleted in 30 days.')) {
           // Update metadata to flag for deletion
           const deletionDate = new Date();
           deletionDate.setDate(deletionDate.getDate() + 30);
           
           const { error } = await supabase.auth.updateUser({
               data: {
                   status: 'deleted',
                   deletion_scheduled_at: deletionDate.toISOString()
               }
           });
           
           if (error) {
               alert('Error scheduling deletion: ' + error.message);
           } else {
               // Initial Soft Delete successful - Log them out to simulate deactivation
               await supabase.auth.signOut();
               alert('Your account has been deactivated. It will be permanently removed in 30 days.');
               window.location.reload();
           }
      }
  };

  return (
    <div className="dashboard-container">
      {/* ... header ... */}
      <header className="dashboard-header">
        <div className="dash-brand" onClick={() => window.location.reload()} style={{cursor: 'pointer'}}>
          VibeVids.ai
        </div>
        <div className="dash-user-controls">
           <button className="dash-referral-btn" onClick={() => setShowReferral(true)}>🎁 Invite Friends</button>
           <span className="user-email">{user.email || 'user@example.com'}</span>
           <button className="dash-logout" onClick={onLogout} disabled={isLoggingOut} style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
             {isLoggingOut && <div className="spinner-small" style={{width: '16px', height: '16px', borderTopColor: '#666', borderRightColor: '#ddd', borderWidth: '2px', margin: 0}}></div>}
             {isLoggingOut ? '...' : 'Logout'}
           </button>
        </div>
      </header>

      <main className="dash-content">
        {/* ... welcome ... */}
        <div className="dash-welcome">
          <h1>Welcome back, Creator! 👋</h1>
          <button className="create-new-btn" onClick={onCreateClick}>
            + Create New Video
          </button>
        </div>

        {/* ... sections ... */}
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

        {/* LINKED ACCOUNTS SECTION */}
        <section className="accounts-section" style={{marginBottom: '4rem'}}>
           <h2>Account & Security 🔐</h2>
           <div className="account-card" style={{
               background: 'white', 
               padding: '2rem', 
               borderRadius: '20px', 
               boxShadow: 'var(--shadow-sm)',
               border: '1px solid rgba(0,0,0,0.05)',
               display: 'flex',
               flexDirection: 'column',
               gap: '1.5rem'
           }}>
              <div className="account-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #eee'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                      <span style={{fontSize: '1.5rem'}}>📧</span>
                      <div>
                          <h4 style={{margin: 0}}>Email Address</h4>
                          <p style={{margin: 0, color: '#666', fontSize: '0.9rem'}}>{user.email}</p>
                      </div>
                  </div>
                  <span className="status-badge" style={{background: '#e0f2f1', color: '#00695c', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600}}>Primary</span>
              </div>

              <div className="account-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                      <img src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" alt="G" style={{width: 24, height: 24}} />
                      <div>
                          <h4 style={{margin: 0}}>Google Account</h4>
                          <p style={{margin: 0, color: '#666', fontSize: '0.9rem'}}>{googleIdentity ? 'Connected' : 'Not connected'}</p>
                      </div>
                  </div>
                  {googleIdentity ? (
                      <button onClick={handleUnlinkGoogle} disabled={isLinking} style={{
                          background: 'transparent', 
                          border: '1px solid #ddd', 
                          color: '#666', 
                          padding: '0.5rem 1rem', 
                          borderRadius: '8px', 
                          fontSize: '0.9rem',
                          fontWeight: 600
                      }}>
                          {isLinking ? '...' : 'Disconnect'}
                      </button>
                  ) : (
                      <button onClick={handleLinkGoogle} disabled={isLinking} style={{
                          background: '#4285F4', 
                          color: 'white', 
                          padding: '0.5rem 1rem', 
                          borderRadius: '8px', 
                          fontSize: '0.9rem', 
                          fontWeight: 600,
                          border: 'none',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}>
                          {isLinking ? 'Connecting...' : 'Connect Google'}
                      </button>
                  )}
              </div>

              {/* CHANGE PASSWORD */}
              <div className="account-row" style={{display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem'}}>
                   <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                      <span style={{fontSize: '1.5rem'}}>🔐</span>
                      <div>
                          <h4 style={{margin: 0}}>Change Password</h4>
                          <p style={{margin: 0, color: '#666', fontSize: '0.9rem'}}>Update your login password securely.</p>
                      </div>
                   </div>
                   <div style={{display: 'flex', gap: '0.5rem', width: '100%', alignItems: 'center'}}>
                       <input 
                         type="password" 
                         placeholder="New Secure Password" 
                         value={newPassword}
                         onChange={(e) => setNewPassword(e.target.value)}
                         style={{
                             flex: 1, 
                             padding: '10px 14px', 
                             borderRadius: '8px', 
                             border: '1px solid #ddd', 
                             fontSize: '0.95rem'
                         }}
                       />
                       <button onClick={handleChangePassword} disabled={!newPassword || isChangingPassword} style={{
                           background: '#111', 
                           color: 'white', 
                           border: 'none', 
                           padding: '10px 16px', 
                           borderRadius: '8px', 
                           fontWeight: 600, 
                           cursor: 'pointer',
                           opacity: (!newPassword || isChangingPassword) ? 0.6 : 1
                       }}>
                           {isChangingPassword ? 'updating...' : 'Update'}
                       </button>
                   </div>
                   {passwordMessage && (
                       <div style={{
                           fontSize: '0.85rem', 
                           color: passwordMessage.type === 'error' ? '#d32f2f' : '#2e7d32', 
                           padding: '0.5rem', 
                           borderRadius: '6px', 
                           background: passwordMessage.type === 'error' ? '#ffebee' : '#e8f5e9'
                       }}>
                           {passwordMessage.text}
                       </div>
                   )}
              </div>

               {/* DELETE ACCOUNT */}
              <div className="account-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '1rem'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                      <span style={{fontSize: '1.5rem'}}>⚠️</span>
                      <div>
                          <h4 style={{margin: 0, color: '#d32f2f'}}>Delete Account</h4>
                          <p style={{margin: 0, color: '#666', fontSize: '0.9rem'}}>Permanently delete your data and videos.</p>
                      </div>
                  </div>
                  <button onClick={handleDeleteAccount} style={{
                      background: 'white', 
                      color: '#d32f2f', 
                      border: '1px solid #ffcdd2', 
                      padding: '0.5rem 1rem', 
                      borderRadius: '8px', 
                      fontSize: '0.9rem', 
                      fontWeight: 600,
                      cursor: 'pointer'
                  }}>
                      Delete
                  </button>
              </div>
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

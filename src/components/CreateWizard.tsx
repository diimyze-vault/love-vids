import { useState } from 'react';

export function CreateWizard({ onClose, isLoggedIn, onLogin }: { onClose: () => void, isLoggedIn?: boolean, onLogin?: () => void }) {
  // If logged in, start at Step 2 (Basics), else Step 1 (Auth)
  const [step, setStep] = useState(isLoggedIn ? 2 : 1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // Form State
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [selectedVibe, setSelectedVibe] = useState('');
  
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn || false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);

  // Payment State
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const handlePayment = () => {
    setPaymentStatus('processing');
    setTimeout(() => {
        setPaymentStatus('success');
        handleGenerate();
    }, 2000);
  };

  const handleGenerate = () => {
    setIsProcessing(true);
    // Simulate AI Generation
    setTimeout(() => {
      setIsProcessing(false);
      setResult('success');
      setStep(6);
    }, 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleEmailAuth = () => {
     if(email) setShowOtp(true);
  };
  
  const handleVerifyFn = () => {
      setIsAuthenticated(true);
      setStep(2);
  };

  return (
    <div className="wizard-overlay">
      <div className="wizard-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        
        {/* STEP 1: AUTHENTICATION (Skipped if isLoggedIn) */}
        {step === 1 && (
           <div className="wizard-step fade-in">
             <h2>Welcome to VibeVids 👋</h2>
             <p className="auth-subtitle">Login to start creating your viral video.</p>
             
             <div className="auth-container">
               <button className="google-btn" onClick={() => { 
                   if (onLogin) onLogin();
                   else {
                     setIsAuthenticated(true); 
                     setStep(2); 
                   }
               }}>
                 <img src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" alt="G" />
                 Continue with Google
               </button>
               
               <div className="auth-divider">
                 <span>OR</span>
               </div>

               {!showOtp ? (
                 <div className="email-auth">
                   <div className="form-group">
                     <label>Email Address</label>
                     <input 
                       type="email" 
                       className="wizard-input"
                       placeholder="you@example.com"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                     />
                   </div>
                   
                   {/* Referral Code Logic */}
                   <div className="referral-input-section">
                     <details className="referral-details">
                       <summary>Have a referral code?</summary>
                       <input 
                         type="text" 
                         className="wizard-input referral-code-input"
                         placeholder="Enter code (e.g. VIBE20)"
                       />
                     </details>
                   </div>
                   
                   <button className="wizard-btn outline" disabled={!email} onClick={handleEmailAuth}>
                     Send Login Code
                   </button>
                 </div>
               ) : (
                 <div className="otp-auth fade-in">
                   <div className="form-group">
                      <label>Enter Code sent to {email}</label>
                      <input 
                        type="text" 
                        className="wizard-input otp-input"
                        placeholder="123456"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                   </div>
                   <button className="wizard-btn primary-glow" disabled={otp.length < 4} onClick={handleVerifyFn}>
                     Verify & Continue
                   </button>
                 </div>
               )}
             </div>
           </div>
        )}

        {step === 2 && (
          <div className="wizard-step fade-in">
            <h2>Step 2: The Basics</h2>
            <div className="form-group">
              <label>Upload a Photo 📸</label>
              <div className="upload-box" onClick={() => document.getElementById('file-upload')?.click()}>
                {file ? (
                  <div className="file-preview">
                    <img src={URL.createObjectURL(file)} alt="Preview" style={{borderRadius: 8, height: 100, objectFit: 'cover'}} />
                    <span>{file.name}</span>
                  </div>
                ) : (
                  <span>Click to Upload</span>
                )}
                <input 
                  id="file-upload" 
                  type="file" 
                  hidden 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Add your Message ✍️</label>
              <textarea 
                placeholder="Ex: Happy Birthday to the queen of procrastination!" 
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <div className="wizard-actions">
                {/* If came from Dashboard (isLoggedIn), going back from step 2 should probably close or keep at 2? For now going back to Start if not logged in. */}
                {!isLoggedIn && <button className="wizard-btn secondary" onClick={() => setStep(1)}>← Back</button>}
                <button 
                  className="wizard-btn" 
                  disabled={!file || !text}
                  onClick={() => setStep(3)}
                >
                  Next: Pick Vibe →
                </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="wizard-step fade-in">
             <h2>Step 3: Choose Vibe ✨</h2>
             <div className="vibes-grid">
               {['Romantic 🌹', 'Roast 🔥', 'Cinematic 🎬', 'Meme 🤪', 'Retro 🕹️', 'Minimal 🌫️'].map(vibe => (
                 <div 
                   key={vibe} 
                   className={`vibe-option ${selectedVibe === vibe ? 'selected' : ''}`}
                   onClick={() => setSelectedVibe(vibe)}
                 >
                   {vibe}
                 </div>
               ))}
             </div>
             <div className="wizard-actions">
               <button className="wizard-btn secondary" onClick={() => setStep(2)}>← Back</button>
               <button 
                className="wizard-btn" 
                disabled={!selectedVibe}
                onClick={() => setStep(4)}
              >
                Next: Review →
              </button>
             </div>
          </div>
        )}

        {step === 4 && (
          <div className="wizard-step fade-in">
            <h2>Step 4: Review Summary</h2>
            <div className="summary-box">
              <p><strong>Image:</strong> {file?.name}</p>
              <p><strong>Message:</strong> "{text}"</p>
              <p><strong>Vibe:</strong> {selectedVibe}</p>
              <p className="price-tag">Total: $4.99</p>
            </div>
            <div className="wizard-actions">
              <button className="wizard-btn secondary" onClick={() => setStep(3)}>← Back</button>
              <button 
                className="wizard-btn primary-glow" 
                onClick={() => setStep(5)} // Go to Payment
              >
                Proceed to Payment →
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
            <div className="wizard-step fade-in payment-step">
                <h2>Step 5: Secure Payment 💳</h2>
                <div className="payment-summary-card">
                    <div className="pay-row">
                        <span>Video Package (1080p)</span>
                        <span>$4.99</span>
                    </div>
                    <div className="pay-row total">
                        <span>Total</span>
                        <span>$4.99</span>
                    </div>
                </div>
                
                {paymentStatus === 'idle' && (
                    <div className="dummy-payment-options">
                        <button className="pay-method selected">
                           <span>💳 Card</span>
                        </button>
                         <button className="pay-method">
                           <span>🅿️ PayPal</span>
                        </button>
                    </div>
                )}
                
                {paymentStatus === 'processing' ? (
                     <div className="processing-state compact">
                        <div className="spinner-small"></div>
                        <p>Processing Transaction...</p>
                     </div>
                ) : (
                    <div className="wizard-actions">
                      <button className="wizard-btn secondary" onClick={() => setStep(4)}>← Back</button>
                      <button className="wizard-btn primary-glow" onClick={handlePayment}>
                        Pay $4.99 & Generate
                      </button>
                    </div>
                )}
            </div>
        )}

        {step === 6 && (
          <div className="wizard-step fade-in">
            {isProcessing ? (
              <div className="processing-state">
                <div className="spinner"></div>
                <h3>Cooking up your video... 🍳</h3>
                <p>Analyzing pixels, sprinkling vibes, validating hype.</p>
              </div>
            ) : (
               <div className="result-container">
                 <div className="success-anim">🎉</div>
                 <h2>Video Ready!</h2>
                 <div className="result-preview">
                   <div className="video-mock">
                     <div className="play-icon">▶</div>
                   </div>
                 </div>
                 <p style={{marginTop: '1rem'}}>Your video is processed and ready to download.</p>
                 <button className="wizard-btn" onClick={onClose}>Download & Share</button>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

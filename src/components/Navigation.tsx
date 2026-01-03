export function Navbar({ onCreateClick, onLogin }: { onCreateClick: () => void, onLogin: () => void }) {
  return (
    <nav className="navbar">
      <div className="logo">VibeVids.ai</div>
      <div className="nav-links">
        <a href="#demos">Demos</a>
        <a href="#how-it-works">How it works</a>
        <a href="#pricing">Pricing</a>
        <button className="nav-login" onClick={onLogin}>Login</button>
        <button className="nav-cta" onClick={onCreateClick}>Create Now</button>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>VibeVids.ai</h3>
          <p>Making moments viral, one generated video at a time.</p>
        </div>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Twitter</a>
          <a href="#">TikTok</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} VibeVids AI. All rights served.</p>
      </div>
    </footer>
  );
}

import { useState, useEffect } from 'react'
import './App.css'
import { Navbar, Footer } from './components/Navigation'
import { Hero } from './components/Hero'
import { HowItWorks, DemoVideos } from './components/Sections'
import { Testimonials, Pricing } from './components/SocialAndPricing'
import { CreateWizard } from './components/CreateWizard'
import { Dashboard } from './components/Dashboard'
import { supabase } from './lib/supabase'
import type { User } from '@supabase/supabase-js'

function App() {
  const [showWizard, setShowWizard] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
     const { error } = await supabase.auth.signInWithOAuth({
       provider: 'google',
       options: {
         redirectTo: window.location.origin
       }
     });
     if (error) console.error('Error logging in:', error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
     return <div className="app-loading"><div className="spinner"></div></div>;
  }

  return (
    <>
      {user ? (
        <Dashboard 
          onCreateClick={() => setShowWizard(true)} 
          onLogout={handleLogout}
          userEmail={user.email} 
        />
      ) : (
        <>
          <div className="app-container">
            <Navbar 
              onCreateClick={() => setShowWizard(true)} 
              onLogin={handleLogin} 
            />
            
            <main>
              <Hero onCreateClick={() => setShowWizard(true)} />
              <DemoVideos />
              <HowItWorks />
              <Testimonials />
              <Pricing onCreateClick={() => setShowWizard(true)} />
            </main>
          </div>
          <Footer />
        </>
      )}

      {showWizard && (
        <CreateWizard 
          onClose={() => setShowWizard(false)} 
          isLoggedIn={!!user}
          onLogin={handleLogin}
        />
      )}
    </>
  )
}

export default App

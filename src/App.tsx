import { useState } from 'react'
import './App.css'
import { Navbar, Footer } from './components/Navigation'
import { Hero } from './components/Hero'
import { HowItWorks, DemoVideos } from './components/Sections'
import { Testimonials, Pricing } from './components/SocialAndPricing'
import { CreateWizard } from './components/CreateWizard'
import { Dashboard } from './components/Dashboard'

function App() {
  const [showWizard, setShowWizard] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      {isLoggedIn ? (
        <Dashboard 
          onCreateClick={() => setShowWizard(true)} 
          onLogout={() => setIsLoggedIn(false)} 
        />
      ) : (
        <div className="app-container">
          <Navbar 
            onCreateClick={() => setShowWizard(true)} 
            onLogin={() => setIsLoggedIn(true)} 
          />
          
          <main>
            <Hero onCreateClick={() => setShowWizard(true)} />
            <DemoVideos />
            <HowItWorks />
            <Testimonials />
            <Pricing onCreateClick={() => setShowWizard(true)} />
          </main>

          <Footer />
        </div>
      )}

      {showWizard && (
        <CreateWizard onClose={() => setShowWizard(false)} />
      )}
    </>
  )
}

export default App

import React, { useState, useEffect } from 'react';
import CRTGlitchHero from './components/CRTGlitchHero';
import LanyardIDCard from './components/LanyardIDCard';
import './index.css';

export default function App() {
  const [isAudioLive, setIsAudioLive] = useState(false);
  const [isRegistered, setIsRegistered] = useState(() => {
    // Check localStorage or URL query for registration status
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('registered') === 'true' || window.location.hash === '#pass') {
        return true;
      }
      return localStorage.getItem('still_alive_registered') === 'true';
    }
    return false;
  });

  // Listen for window focus so when user finishes Luma popup or tab and returns, pass unlocks
  useEffect(() => {
    const handleFocus = () => {
      if (localStorage.getItem('still_alive_registered') === 'true') {
        setIsRegistered(true);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleRegisterClick = () => {
    // Flag intent in localStorage so upon return the pass is unlocked
    localStorage.setItem('still_alive_registered', 'true');
    // Also unlock in local state after a brief moment in case Luma opens modal overlay
    setTimeout(() => {
      setIsRegistered(true);
    }, 1200);
  };

  const handleManualUnlock = () => {
    localStorage.setItem('still_alive_registered', 'true');
    setIsRegistered(true);
    setTimeout(() => {
      const badgeElem = document.getElementById('badge-section');
      badgeElem?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleResetRegistration = () => {
    localStorage.removeItem('still_alive_registered');
    setIsRegistered(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-root">
      {/* Film Grain Noise Overlay */}
      <div className="noise" aria-hidden="true" />

      {/* ---- HERO SECTION: Audio-Synced CRT Glitch "Still Alive!" ---- */}
      <section className="hero-crt-section" id="hero">
        <CRTGlitchHero onAudioStateChange={setIsAudioLive} />

        {/* Dynamic Action: Register Button or Scroll Prompt */}
        {!isRegistered ? (
          <div className="hero-cta-container">
            <a
              href="https://luma.com/event/evt-nDIGhgaVh8vUEZw"
              className="luma-checkout--button hero-register-btn"
              data-luma-action="checkout"
              data-luma-event-id="evt-nDIGhgaVh8vUEZw"
              onClick={handleRegisterClick}
            >
              <span>Register for Event</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>

            <button
              className="already-registered-link"
              onClick={handleManualUnlock}
            >
              Already registered? Access your pass →
            </button>
          </div>
        ) : (
          <a href="#badge-section" className="hero-scroll-prompt">
            <span className="registered-badge-tag">✓ REGISTRATION CONFIRMED</span>
            <div className="scroll-hint-row">
              <span>Scroll to Access Your Pass</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </a>
        )}
      </section>

      {/* ---- LANYARD ID CARD SECTION (Visible once registered / unlocked) ---- */}
      {isRegistered && (
        <LanyardIDCard onResetRegistration={handleResetRegistration} />
      )}
    </div>
  );
}

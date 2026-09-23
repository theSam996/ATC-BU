import React, { useState } from 'react';
import CRTGlitchHero from './components/CRTGlitchHero';
import LanyardIDCard from './components/LanyardIDCard';
import './index.css';

export default function App() {
  const [isAudioLive, setIsAudioLive] = useState(false);

  return (
    <div className="app-root">
      {/* Film Grain Noise Overlay */}
      <div className="noise" aria-hidden="true" />

      {/* ---- HERO SECTION: Audio-Synced CRT Glitch "Still Alive!" ---- */}
      <section className="hero-crt-section" id="hero">
        <CRTGlitchHero onAudioStateChange={setIsAudioLive} />
        
        {/* Scroll Down to Credential Pass */}
        <a href="#badge-section" className="hero-scroll-prompt">
          <span>Scroll for Pass</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </a>
      </section>

      {/* ---- LANYARD ID CARD SECTION ---- */}
      <LanyardIDCard />
    </div>
  );
}




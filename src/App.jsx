import React, { useState } from 'react';
import CRTGlitchHero from './components/CRTGlitchHero';
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
      </section>
    </div>
  );
}

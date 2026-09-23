import React, { useRef, useEffect, useState, useCallback } from 'react';

export default function CRTGlitchHero({ onAudioStateChange }) {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const animFrameRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);

  // Beat & Energy State
  const beatStateRef = useRef({
    bass: 0,
    isBeat: false,
    lastBeatTime: 0
  });

  // Play audio safely
  const handlePlayAudio = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 1.0;
    audio.muted = false;

    try {
      await audio.play();
      setIsPlaying(true);
      onAudioStateChange?.(true);
    } catch (err) {
      console.warn('Playback waiting for user gesture:', err);
      setIsPlaying(false);
      onAudioStateChange?.(false);
    }
  }, [onAudioStateChange]);

  // Try immediate autoplay + listen for gestures
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 1.0;
      audio.muted = false;
      handlePlayAudio();
    }

    const unlockAndPlay = async () => {
      const el = audioRef.current;
      if (el && el.paused) {
        el.volume = 1.0;
        el.muted = false;
        try {
          await el.play();
          setIsPlaying(true);
        } catch (e) {}
      }
    };

    const events = ['click', 'pointerdown', 'touchstart', 'scroll', 'keydown'];
    events.forEach(evt => window.addEventListener(evt, unlockAndPlay, { passive: true }));

    return () => {
      events.forEach(evt => window.removeEventListener(evt, unlockAndPlay));
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [handlePlayAudio]);


  // CRT Glitch Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    const handleResize = () => {
      const parent = canvas.parentElement || document.body;
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let frameCount = 0;
    let glitchDisplacements = [];
    let scanlineOffset = 0;

    const render = () => {
      frameCount++;
      scanlineOffset = (scanlineOffset + 2) % height;

      // 1. Calculate Rhythmic Audio Beat Pulse based on playback
      const audio = audioRef.current;
      const currentTime = audio ? audio.currentTime : frameCount * 0.016;
      const bpm = 138;
      const beatInterval = 60 / bpm;
      const beatPhase = (currentTime % beatInterval) / beatInterval;
      
      const rawBass = Math.pow(1 - beatPhase, 3);
      const isBeat = beatPhase < 0.12;

      beatStateRef.current = {
        bass: rawBass,
        isBeat
      };

      const bass = isPlaying ? rawBass : (0.15 + 0.1 * Math.sin(frameCount * 0.08));
      const glitchStrength = bass * 1.0 + (isBeat ? 0.6 : 0.02);
      const chromaticSplit = (bass * 4 + (isBeat ? 5 : 1)) * (width / 1000);

      // 2. Clear Screen
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // 3. Screen Shake on heavy beat (subtle)
      const shakeX = isBeat ? (Math.random() - 0.5) * 6 * bass : (Math.random() - 0.5) * 1;
      const shakeY = isBeat ? (Math.random() - 0.5) * 4 * bass : (Math.random() - 0.5) * 1;

      ctx.save();
      ctx.translate(shakeX, shakeY);

      // 4. CRT Center Ambient Red Glow
      const glowRadius = Math.max(width, height) * 0.65;
      const glowGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        glowRadius
      );
      const glowAlpha = 0.08 + bass * 0.14;
      glowGrad.addColorStop(0, `rgba(229, 57, 53, ${glowAlpha})`);
      glowGrad.addColorStop(0.5, `rgba(139, 0, 0, ${glowAlpha * 0.45})`);
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // 5. Dynamic Glitch Slices (cleaner, sharper)
      if (isBeat || (Math.random() < 0.25 + bass * 0.2)) {
        const sliceCount = Math.floor(3 + bass * 6);
        glitchDisplacements = [];
        for (let i = 0; i < sliceCount; i++) {
          glitchDisplacements.push({
            y: Math.random() * height,
            h: Math.random() * 18 + 4,
            shiftX: (Math.random() - 0.5) * (glitchStrength * 16),
            alpha: Math.random() * 0.7 + 0.3
          });
        }
      } else if (frameCount % 2 === 0) {
        glitchDisplacements = glitchDisplacements.map(s => ({
          ...s,
          shiftX: s.shiftX * 0.5
        }));
      }

      // 6. Draw Text "STILL ALIVE!"
      const fontSize = Math.min(width * 0.17, height * 0.20, 135);
      ctx.font = `900 ${fontSize}px 'Bebas Neue', Impact, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const textX = width / 2;
      const textY = height / 2;

      const drawTextPass = (offsetX, offsetY, fillStyle, filterMode) => {
        ctx.save();
        if (filterMode) ctx.globalCompositeOperation = filterMode;
        ctx.fillStyle = fillStyle;

        ctx.fillText('STILL ALIVE!', textX + offsetX, textY + offsetY);

        for (const slice of glitchDisplacements) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, slice.y, width, slice.h);
          ctx.clip();
          ctx.fillText(
            'STILL ALIVE!',
            textX + offsetX + slice.shiftX,
            textY + offsetY
          );
          ctx.restore();
        }
        ctx.restore();
      };

      // Chromatic Aberration Passes (subtle edge fringe only)
      if (chromaticSplit > 0.5) {
        drawTextPass(
          -chromaticSplit,
          0,
          'rgba(255, 23, 68, 0.65)',
          'screen'
        );
        drawTextPass(
          chromaticSplit * 0.8,
          0,
          'rgba(20, 180, 255, 0.35)',
          'screen'
        );
      }

      // Main Crisp Red Glowing Text Body
      ctx.save();
      ctx.shadowColor = '#ff1744';
      ctx.shadowBlur = 14 + bass * 25;
      drawTextPass(0, 0, '#e53935');
      ctx.restore();

      // Sharp Crisp Crimson Overlay
      ctx.fillStyle = '#ff2b40';
      ctx.fillText('STILL ALIVE!', textX, textY);

      // 7. Horizontal Video Tearing Streaks
      if (isBeat || Math.random() < 0.45) {
        const tearCount = Math.floor(1 + bass * 5);
        for (let t = 0; t < tearCount; t++) {
          const tearY = Math.random() * height;
          const tearH = Math.random() * 4 + 1;
          const tearW = Math.random() * width * 0.8 + width * 0.2;
          const tearX = Math.random() * (width - tearW);
          ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 23, 68, 0.75)' : 'rgba(255, 255, 255, 0.85)';
          ctx.fillRect(tearX, tearY, tearW, tearH);
        }
      }

      // 8. CRT Analog Scanlines
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 2);
      }

      // 9. CRT Rolling Scan Beam
      const beamGrad = ctx.createLinearGradient(0, scanlineOffset - 60, 0, scanlineOffset + 60);
      beamGrad.addColorStop(0, 'rgba(255, 23, 68, 0)');
      beamGrad.addColorStop(0.5, `rgba(255, 50, 70, ${0.1 + bass * 0.15})`);
      beamGrad.addColorStop(1, 'rgba(255, 23, 68, 0)');
      ctx.fillStyle = beamGrad;
      ctx.fillRect(0, scanlineOffset - 60, width, 120);



      // 11. CRT Vignette
      const crtVignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.45,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75
      );
      crtVignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      crtVignette.addColorStop(0.7, 'rgba(0, 0, 0, 0.4)');
      crtVignette.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
      ctx.fillStyle = crtVignette;
      ctx.fillRect(0, 0, width, height);

      // 12. CRT Corner Crosshairs
      ctx.strokeStyle = 'rgba(255, 23, 68, 0.35)';
      ctx.lineWidth = 1;

      const pad = 24;
      const crossSize = 10;
      const drawCross = (cx, cy) => {
        ctx.beginPath();
        ctx.moveTo(cx - crossSize, cy);
        ctx.lineTo(cx + crossSize, cy);
        ctx.moveTo(cx, cy - crossSize);
        ctx.lineTo(cx, cy + crossSize);
        ctx.stroke();
      };
      drawCross(pad, pad);
      drawCross(width - pad, pad);
      drawCross(pad, height - pad);
      drawCross(width - pad, height - pad);

      // Top Right LED Indicator
      const ledX = width - pad - 12;
      const ledY = pad + 20;
      ctx.fillStyle = isBeat || bass > 0.5 ? '#ff1744' : '#550000';
      ctx.beginPath();
      ctx.arc(ledX, ledY, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div className="crt-hero-container">
      {/* HTML5 Native Audio */}
      <audio
        ref={audioRef}
        src="/audio/bg_music.mp3"
        preload="auto"
        loop
        playsInline
        autoPlay
        onPlay={() => {
          setIsPlaying(true);
          onAudioStateChange?.(true);
        }}
        onPause={() => {
          setIsPlaying(false);
          onAudioStateChange?.(false);
        }}
      />

      {/* Canvas for the CRT Glitch Visualizer */}
      <canvas ref={canvasRef} className="crt-hero-canvas" />


    </div>
  );
}

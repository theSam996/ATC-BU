import React, { useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'motion/react';
import './LanyardIDCard.css';

export default function LanyardIDCard() {
  const [attendeeName, setAttendeeName] = useState('SAMAR KUMAR');
  const [passType, setPassType] = useState('ALL ACCESS');
  const [isEditing, setIsEditing] = useState(false);

  const cardRef = useRef(null);

  // Smooth motion physics for mouse/touch tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.8 };
  const rotateX = useSpring(useTransform(mouseY, [-150, 150], [14, -14]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-150, 150], [-14, 14]), springConfig);
  const swayX = useSpring(useTransform(mouseX, [-150, 150], [-10, 10]), springConfig);

  const handlePointerMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section className="id-card-section" id="badge-section">
      <div className="id-card-header">
        <h2 className="id-card-heading">STILL ALIVE PASS</h2>
        <p className="id-card-subheading">
          Tap name to customize your credential.
        </p>
      </div>

      <div
        className="lanyard-container"
        onPointerMove={handlePointerMove}

        onPointerLeave={handlePointerLeave}
        ref={cardRef}
      >
        {/* ---- 1. LANYARD STRAP & HARDWARE ---- */}
        <div className="lanyard-strap-assembly">
          {/* Top Woven Strap */}
          <div className="lanyard-ribbon">
            <div className="ribbon-pattern">
              <span className="ribbon-text">STILL ALIVE</span>
              <span className="ribbon-dot">◆</span>
              <span className="ribbon-text">CODE & COKE</span>
              <span className="ribbon-dot">◆</span>
              <span className="ribbon-dot">◆</span>
            </div>
          </div>

          {/* Quick Release Matte Buckle */}
          <div className="lanyard-buckle">
            <div className="buckle-top-bar" />
            <div className="buckle-body">
              <div className="buckle-prong left" />
              <div className="buckle-center-lock" />
              <div className="buckle-prong right" />
            </div>
            <div className="buckle-bottom-bar" />
          </div>

          {/* Lower Webbing Loop */}
          <div className="lanyard-lower-strap">
            <div className="strap-stitch" />
          </div>

          {/* Chrome Swivel Carabiner Clip Hardware */}
          <div className="lanyard-metal-hook">
            <svg
              className="clip-svg"
              viewBox="0 0 60 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e6e6e6" />
                  <stop offset="25%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#8c8c94" />
                  <stop offset="75%" stopColor="#d1d1d6" />
                  <stop offset="100%" stopColor="#55555c" />
                </linearGradient>
                <filter id="metalShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.5)" />
                </filter>
              </defs>

              {/* D-Ring */}
              <path
                d="M 12 12 Q 30 0 48 12 L 44 24 Q 30 18 16 24 Z"
                fill="url(#metalGrad)"
                stroke="#444"
                strokeWidth="1"
                filter="url(#metalShadow)"
              />
              {/* Swivel Collar */}
              <rect
                x="24"
                y="24"
                width="12"
                height="10"
                rx="2"
                fill="url(#metalGrad)"
                stroke="#333"
                strokeWidth="0.8"
              />
              <ellipse cx="30" cy="34" rx="7" ry="3" fill="#666" />

              {/* Lobster Snap Hook Body */}
              <path
                d="M 27 35 C 22 45 18 60 22 75 C 25 85 36 86 40 76 C 43 68 40 55 35 48 L 33 35 Z"
                fill="url(#metalGrad)"
                stroke="#333"
                strokeWidth="1"
                filter="url(#metalShadow)"
              />
              {/* Trigger Gate */}
              <path
                d="M 38 52 C 48 54 50 62 43 68 L 39 63 C 43 60 41 56 36 55 Z"
                fill="url(#metalGrad)"
                stroke="#444"
                strokeWidth="0.8"
              />
              {/* Hook Tip */}
              <path
                d="M 23 75 Q 30 90 38 80 Q 42 74 39 68"
                stroke="url(#metalGrad)"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        </div>

        {/* ---- 2. PHYSICAL EVENT ID BADGE ---- */}
        <motion.div
          className="id-badge-card"
          style={{
            rotateX,
            rotateY,
            x: swayX,
            transformPerspective: 1200
          }}
        >
          {/* Badge Hole Punch Slot */}
          <div className="badge-slot">
            <div className="slot-inner" />
          </div>

          {/* Specular Light Sheen Overlay */}
          <div className="badge-glass-glare" />

          {/* TOP HALF: Black Background */}
          <div className="badge-top-half">
            <div className="badge-top-row">
              {/* Event Badge Icon */}
              <div className="badge-logo-mark">
                <span className="logo-bracket">[</span>
                <span className="logo-core">STILL ALIVE</span>
                <span className="logo-bracket">]</span>
              </div>

              {/* Event Meta info */}
              <div className="badge-event-meta">
                <span className="meta-line bold">OCT 7th, 26</span>
                <span className="meta-line">6 PM Onwards</span>
                <span className="meta-line dim">PLH - 101</span>
              </div>
            </div>

            {/* Attendee Name (Editable) */}
            <div className="badge-attendee-block">
              {isEditing ? (
                <input
                  type="text"
                  className="badge-name-input"
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value.toUpperCase())}
                  onBlur={() => setIsEditing(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                  autoFocus
                  maxLength={24}
                />
              ) : (
                <div
                  className="badge-name-display"
                  onClick={() => setIsEditing(true)}
                  title="Click to edit name"
                >
                  <h1 className="attendee-first">
                    {attendeeName.split(' ')[0] || 'STILL'}
                  </h1>
                  <h1 className="attendee-last">
                    {attendeeName.split(' ').slice(1).join(' ') || 'ALIVE'}
                  </h1>
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM HALF: Vivid Red Slogan Block */}
          <div className="badge-bottom-half">
            <div className="slogan-container">
              <span className="slogan-line">CODE FOR</span>
              <span className="slogan-line">AN HOUR.</span>
              <span className="slogan-line">COKE FOR</span>
              <span className="slogan-line">AN HOUR.</span>
            </div>

            <div className="badge-bottom-footer">
              <div className="footer-location">
                <span className="foot-bold">Alan Turing Club</span>
                <span className="foot-dim">Bennett University</span>
              </div>

              {/* Infinity Symbol / Event Sigil */}
              <div className="footer-sigil">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import React, { useState } from 'react';
import TearTicket from './TearTicket';

export default function TicketSection() {
  const [ticketKey, setTicketKey] = useState(0);
  const [isTorn, setIsTorn] = useState(false);

  const handleTear = () => {
    setIsTorn(true);
  };

  const handleReset = () => {
    setTicketKey(prev => prev + 1);
    setIsTorn(false);
  };

  return (
    <section className="ticket-landing-section" id="ticket-section">
      {/* Top right refresh/reset button as shown in reference */}
      <div className="ticket-controls">
        <button
          className="ticket-refresh-btn"
          onClick={handleReset}
          title="Reset Ticket"
          aria-label="Reset ticket"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M8 16H3v5" />
          </svg>
        </button>
      </div>

      <div className="ticket-container-wrapper">
        <div className="ticket-header-meta">
          <span className="ticket-badge">
            {isTorn ? 'TICKET USED · ADMITTED' : 'INTERACTIVE PASS'}
          </span>
          <h2 className="ticket-section-title">Claim Your Pass</h2>
          <p className="ticket-section-hint">
            {isTorn ? 'Stub torn successfully. Press the reset icon to re-attach.' : 'Pull and drag the right perforated stub to tear off your ticket.'}
          </p>
        </div>

        <div className="ticket-stage-box">
          <TearTicket
            key={ticketKey}
            image="/spectrum.jpg"
            imageAlt="Visitors in a walkway of coloured glass"
            stub={
              <div className="ticket-stub-inner">
                <div>
                  <h3>Admit one</h3>
                  <p>Rooftop gallery</p>
                  <p>Until 30 Nov</p>
                </div>
                <div className="ticket-stub-footer">
                  <span className="ticket-num">No. 284619</span>
                </div>
              </div>
            }
            orientation="horizontal"
            scrim
            imageRadius={8}
            onTear={handleTear}
            width={460}
            height={250}
            stubSize={150}
            radius={16}
            holes={12}
            holeSize={6}
            notch={3}
            roughness={0}
            tearAngle={30}
            stretch={30}
            resistance={0.45}
            rotate={0}
            tilt={false}
            tiltMax={0}
            tiltReach={0}
            parallax={0}
            perspective={0}
            background="#27272a"
            color="#f5f5f5"
            border
            borderWidth={1}
            recenter

          >
            <div className="ticket-body-info">
              <span className="ticket-main-title">Spectrum</span>
              <span className="ticket-main-date">14 Nov</span>
            </div>
          </TearTicket>
        </div>

        {/* Scroll link to Badge section */}
        <a href="#badge-section" className="ticket-next-prompt">
          <span>View Lanyard Credential</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </a>
      </div>
    </section>
  );
}


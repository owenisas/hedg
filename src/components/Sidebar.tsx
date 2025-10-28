"use client";

import { useState } from "react";

interface SidebarProps {
  onNewHedge?: () => void;
}

export default function Sidebar({ onNewHedge }: SidebarProps) {
  const [activeHedge, setActiveHedge] = useState<string | null>(null);

  const handleNewHedge = () => {
    console.log("Creating new hedge");
    if (onNewHedge) {
      onNewHedge();
    }
  };

  const handleHedgeClick = (hedgeName: string) => {
    setActiveHedge(hedgeName === activeHedge ? null : hedgeName);
    console.log(`Selected hedge: ${hedgeName}`);
  };

  return (
    <aside className="sidebar glass-sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <img 
            alt="Polyhedg Logo" 
            width="300" 
            height="75" 
            decoding="async" 
            className="logo-image" 
            style={{ color: 'transparent' }} 
            src="/logo.png" 
          />
        </div>
      </div>
      <div className="sidebar-content">
        <button className="create-hedge-btn glass-button-primary" onClick={handleNewHedge}>
          <svg 
            className="btn-icon" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14"></path>
          </svg>
          <span className="btn-text">New Hedge</span>
        </button>
        <div className="hedges-section">
          <div className="section-header">
            <h3 className="hedges-title">Your Hedges</h3>
            <span className="hedges-count">2</span>
          </div>
          <div className="hedges-list">
            <div 
              className={`hedge-item ${activeHedge === 'Currency Risk Shield' ? 'selected' : ''}`}
              onClick={() => handleHedgeClick('Currency Risk Shield')}
            >
              <div className="hedge-icon">
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <span className="hedge-name">Currency Risk Shield</span>
            </div>
            <div 
              className={`hedge-item ${activeHedge === 'Commodity Protection' ? 'selected' : ''}`}
              onClick={() => handleHedgeClick('Commodity Protection')}
            >
              <div className="hedge-icon">
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <span className="hedge-name">Commodity Protection</span>
            </div>
          </div>
        </div>
      </div>
      <div className="sidebar-footer glass-footer">
        <div className="user-info">
          <div className="user-avatar">
            <span className="user-initials">JD</span>
          </div>
          <div className="user-details">
            <span className="user-name">John Doe</span>
            <span className="user-description">CFO at Stephens and Co</span>
          </div>
          <button className="user-menu-btn">
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
"use client";

import { useState } from "react";

interface SidebarProps {
  onNewHedge?: () => void;
  onViewChange?: (view: 'chat' | 'execution' | 'positions' | 'candidates' | 'exposure') => void;
}

export default function Sidebar({ onNewHedge, onViewChange }: SidebarProps) {
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

  const handleViewChange = (view: 'chat' | 'execution' | 'positions' | 'candidates' | 'exposure') => {
    if (onViewChange) {
      onViewChange(view);
    }
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
        <div className="navigation-section">
          <div className="section-header">
            <h3 className="hedges-title">Navigation</h3>
          </div>
          <div className="navigation-list">
            <button 
              className="hedge-item"
              onClick={() => handleViewChange('exposure')}
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
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <span className="hedge-name">Define Exposure</span>
            </button>
            <button 
              className="hedge-item"
              onClick={() => handleViewChange('execution')}
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
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
              </div>
              <span className="hedge-name">Execution Sheet</span>
            </button>
            <button 
              className="hedge-item"
              onClick={() => handleViewChange('positions')}
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
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <span className="hedge-name">Positions</span>
            </button>
            <button 
              className="hedge-item"
              onClick={() => handleViewChange('candidates')}
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
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <span className="hedge-name">Candidates</span>
            </button>
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
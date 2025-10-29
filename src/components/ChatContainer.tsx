"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import NetworkGraph from "./NetworkGraph";
import ExposureForm from "./ExposureForm";
import { ExposureFormValues } from '@/lib/schemas';

interface ChatContainerProps {
  showCanvas: boolean;
  setShowCanvas: (show: boolean) => void;
}

// Helper function to get market descriptions
function getMarketDescription(node: { title: string; fit: number; liquidity: number }): string {
  return `Market: ${node.title}
Fit Score: ${Math.round((node.fit || 0) * 100)}%
Liquidity: $${(node.liquidity || 0).toLocaleString()}`;
}

export default function ChatContainer({ showCanvas, setShowCanvas }: ChatContainerProps) {
  const [inputValue, setInputValue] = useState("");
  const [selectedNode, setSelectedNode] = useState<{ id: string; title: string; fit: number; liquidity: number; type: string } | null>(null);
  const [showExposureForm, setShowExposureForm] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Memoize the callback to prevent NetworkGraph from re-rendering
  const handleNodeClick = useCallback((node: { id: string; title: string; fit: number; liquidity: number; type: string }) => {
    setSelectedNode(node);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setInputValue("");
      setShowCanvas(true);
      setShowExposureForm(false);
    }
  };

  const handleExposureSubmit = (data: ExposureFormValues) => {
    setShowExposureForm(false);
    setShowCanvas(true);
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  // Focus textarea on initial render
  useEffect(() => {
    if (textareaRef.current && !showCanvas) {
      textareaRef.current.focus();
    }
  }, [showCanvas]);

  return (
    <div className="chat-container">
      {!showCanvas ? (
        <>
          <div className="welcome-section">
            <h1 className="welcome-title">Welcome back, John!</h1>
            <p className="welcome-subtitle">How can I help you create a hedge today?</p>
          </div>
          <div className="chat-input-section">
            <form className="chat-form" onSubmit={handleSubmit}>
              <div className="chat-input-container">
                <textarea 
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    handleInput();
                  }}
                  onInput={handleInput}
                  placeholder="How can I help you today?" 
                  className="chat-input" 
                  rows={1}
                />
              </div>
              <button 
                type="submit" 
                className="send-button" 
                disabled={!inputValue.trim()}
              >
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M12 19V5M5 12l7-7 7 7"></path>
                </svg>
              </button>
            </form>
            <div className="example-prompts">
              <div className="prompts-row">
                <button 
                  className="prompt-tag" 
                  onClick={() => setInputValue("Help me hedge against electronics trade risks")}
                >
                  Electronics Trade
                </button>
                <button 
                  className="prompt-tag" 
                  onClick={() => setInputValue("How can I protect agricultural exports?")}
                >
                  Agricultural Exports
                </button>
                <button 
                  className="prompt-tag" 
                  onClick={() => setInputValue("What's the best way to hedge pharmaceuticals?")}
                >
                  Pharmaceuticals
                </button>
                <button 
                  className="prompt-tag" 
                  onClick={() => setInputValue("I need protection for automotive parts")}
                >
                  Automotive Parts
                </button>
                <button 
                  className="prompt-tag" 
                  onClick={() => setInputValue("How to hedge seafood exports?")}
                >
                  Seafood Exports
                </button>
                <button 
                  className="prompt-tag" 
                  onClick={() => setInputValue("Natural gas price protection")}
                >
                  Natural Gas
                </button>
                <button 
                  className="prompt-tag" 
                  onClick={() => setInputValue("Luxury goods market hedging")}
                >
                  Luxury Goods
                </button>
              </div>
            </div>
          </div>
        </>
      ) : showExposureForm ? (
        <div className="p-6">
          <div className="mb-6 flex gap-4">
            <button 
              className="action-btn secondary"
              onClick={() => setShowExposureForm(false)}
            >
              ← Back to Graph
            </button>
          </div>
          <ExposureForm onSubmit={handleExposureSubmit} />
        </div>
      ) : (
        <div style={{ 
          position: "fixed",
          top: 0,
          left: "280px",
          right: 0,
          bottom: 0,
          width: "calc(100% - 280px)",
          height: "100vh",
          zIndex: 5
        }}>
            <NetworkGraph onNodeClick={handleNodeClick} />          {selectedNode && (
            <div
              style={{
                position: "fixed",
                top: 20,
                right: 20,
                width: 350,
                maxHeight: "90vh",
                padding: "24px",
                background: "linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(20, 20, 20, 0.95))",
                border: "1px solid #6366f133",
                borderRadius: "16px",
                color: "#fff",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                overflowY: "auto",
                zIndex: 1000
              }}
            >
              <button
                onClick={() => setSelectedNode(null)}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "rgba(99, 102, 241, 0.2)",
                  border: "1px solid #6366f166",
                  color: "#fff",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "18px",
                  fontWeight: 700,
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(99, 102, 241, 0.4)";
                  e.currentTarget.style.borderColor = "#6366f1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(99, 102, 241, 0.2)";
                  e.currentTarget.style.borderColor = "#6366f166";
                }}
              >
                ×
              </button>
              <h3 style={{ 
                marginBottom: "16px", 
                marginRight: "32px",
                color: "#6366f1",
                fontSize: "20px",
                fontWeight: 700
              }}>
                {selectedNode.title}
              </h3>
              
              {/* Node type badge */}
              <div style={{
                display: "inline-block",
                background: selectedNode.type === 'central' ? "rgba(255, 255, 255, 0.2)" : "rgba(16, 185, 129, 0.3)",
                border: `1px solid ${selectedNode.type === 'central' ? "#ffffff66" : "#10b98166"}`,
                borderRadius: "8px",
                padding: "6px 12px",
                fontSize: "12px",
                marginBottom: "20px",
                fontWeight: 600,
                textTransform: "capitalize"
              }}>
                {selectedNode.type === 'central' ? 'Exposure Statement' : 'Market Node'}
              </div>
              
              {/* Description based on market type */}
              <div style={{marginBottom: "16px"}}>
                <div style={{
                  color: "#9ca3af", 
                  fontSize: "14px",
                  marginBottom: "6px",
                  fontWeight: 600
                }}>
                  Description
                </div>
                <div style={{ 
                  color: "#e5e7eb", 
                  fontSize: "14px",
                  lineHeight: "1.5",
                  padding: "12px",
                  background: "rgba(0, 0, 0, 0.2)",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.05)"
                }}>
                  {getMarketDescription(selectedNode)}
                </div>
              </div>
              
              {/* Fit score indicator */}
              <div style={{
                marginBottom: "16px"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "6px"
                }}>
                  <div style={{color: "#9ca3af", fontSize: "14px"}}>Fit Score</div>
                  <div style={{fontWeight: 600, color: selectedNode.fit > 0.6 ? "#10b981" : "#ef4444"}}>
                    {Math.round((selectedNode.fit || 0) * 100)}%
                  </div>
                </div>
                <div style={{
                  height: "6px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "3px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    height: "100%",
                    width: `${(selectedNode.fit || 0) * 100}%`,
                    background: selectedNode.fit > 0.6 ? "linear-gradient(90deg, #10b981, #059669)" : "linear-gradient(90deg, #ef4444, #dc2626)",
                    borderRadius: "3px"
                  }}></div>
                </div>
              </div>
              
              {/* Liquidity indicator */}
              <div style={{
                marginBottom: "16px"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "6px"
                }}>
                  <div style={{color: "#9ca3af", fontSize: "14px"}}>Liquidity</div>
                  <div style={{fontWeight: 600, color: "#6366f1"}}>
                    ${(selectedNode.liquidity || 0).toLocaleString()}
                  </div>
                </div>
                <div style={{
                  height: "6px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "3px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    height: "100%",
                    width: `${Math.min(100, (selectedNode.liquidity || 0) / 1000000 * 100)}%`,
                    background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                    borderRadius: "3px"
                  }}></div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowExposureForm(true)}
            style={{
              position: "fixed",
              bottom: 24,
              left: "calc(280px + 24px)",
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "14px",
              boxShadow: "0 4px 16px rgba(16, 185, 129, 0.4)",
              transition: "all 0.3s",
              zIndex: 1000
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 6px 24px rgba(16, 185, 129, 0.6)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(16, 185, 129, 0.4)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Define Exposure
          </button>
          
          <button
            onClick={() => setShowCanvas(false)}
            style={{
              position: "fixed",
              bottom: 24,
              left: "calc(280px + 24px + 180px + 16px)",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "14px",
              boxShadow: "0 4px 16px rgba(99, 102, 241, 0.4)",
              transition: "all 0.3s",
              zIndex: 1000
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 6px 24px rgba(99, 102, 241, 0.6)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(99, 102, 241, 0.4)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            ← Back to Chat
          </button>
        </div>
      )}
    </div>
  );
}
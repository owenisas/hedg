"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatContainer from "@/components/ChatContainer";
import ExecutionSheet from "@/components/ExecutionSheet";
import PositionsTable from "@/components/PositionsTable";
import CandidateList from "@/components/CandidateList";
import ExposureForm from "@/components/ExposureForm";
import { ExposureFormValues } from '@/lib/schemas';
import { mockExposureSpec } from '@/lib/mockData';

type ViewType = 'chat' | 'execution' | 'positions' | 'candidates' | 'exposure';

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>('chat');
  const [showCanvas, setShowCanvas] = useState(false);
  const [exposureSpec, setExposureSpec] = useState(mockExposureSpec);

  const handleNewHedge = () => {
    setShowCanvas(false);
    setCurrentView('chat');
  };

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    if (view !== 'chat') {
      setShowCanvas(false);
    }
  };

  const handleExposureSubmit = (data: ExposureFormValues) => {
    // In a real implementation, this would save to the backend
    setExposureSpec({
      ...exposureSpec,
      statement: data.statement,
      horizon: data.horizon,
      budget: data.budget,
      venuesAllowed: data.venuesAllowed,
      jurisdiction: data.jurisdiction,
      updatedAt: new Date().toISOString()
    });
    
    // Switch to the candidates view after submitting exposure
    setCurrentView('candidates');
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar onNewHedge={handleNewHedge} onViewChange={handleViewChange} />
      <main className="main-content">
        {currentView === 'chat' ? (
          <ChatContainer showCanvas={showCanvas} setShowCanvas={setShowCanvas} />
        ) : currentView === 'exposure' ? (
          <div className="p-6">
            <div className="mb-6 flex gap-4">
              <button 
                className="action-btn secondary"
                onClick={() => handleViewChange('chat')}
              >
                ← Back to Chat
              </button>
            </div>
            <ExposureForm onSubmit={handleExposureSubmit} />
          </div>
        ) : currentView === 'execution' ? (
          <div className="p-6">
            <div className="mb-6 flex gap-4">
              <button 
                className="action-btn secondary"
                onClick={() => handleViewChange('chat')}
              >
                ← Back to Chat
              </button>
              <button 
                className="action-btn secondary"
                onClick={() => handleViewChange('positions')}
              >
                View Positions
              </button>
              <button 
                className="action-btn secondary"
                onClick={() => handleViewChange('candidates')}
              >
                View Candidates
              </button>
            </div>
            <ExecutionSheet />
          </div>
        ) : currentView === 'positions' ? (
          <div className="p-6">
            <div className="mb-6 flex gap-4">
              <button 
                className="action-btn secondary"
                onClick={() => handleViewChange('chat')}
              >
                ← Back to Chat
              </button>
              <button 
                className="action-btn secondary"
                onClick={() => handleViewChange('execution')}
              >
                View Execution Sheet
              </button>
              <button 
                className="action-btn secondary"
                onClick={() => handleViewChange('candidates')}
              >
                View Candidates
              </button>
            </div>
            <PositionsTable />
          </div>
        ) : currentView === 'candidates' ? (
          <div className="p-6">
            <div className="mb-6 flex gap-4">
              <button 
                className="action-btn secondary"
                onClick={() => handleViewChange('chat')}
              >
                ← Back to Chat
              </button>
              <button 
                className="action-btn secondary"
                onClick={() => handleViewChange('execution')}
              >
                View Execution Sheet
              </button>
              <button 
                className="action-btn secondary"
                onClick={() => handleViewChange('positions')}
              >
                View Positions
              </button>
            </div>
            <CandidateList />
          </div>
        ) : null}
      </main>
    </div>
  );
}
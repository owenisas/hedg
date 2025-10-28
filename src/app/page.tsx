"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatContainer from "@/components/ChatContainer";

export default function Home() {
  const [showCanvas, setShowCanvas] = useState(false);

  const handleNewHedge = () => {
    setShowCanvas(false);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar onNewHedge={handleNewHedge} />
      <main className="main-content">
        <ChatContainer showCanvas={showCanvas} setShowCanvas={setShowCanvas} />
      </main>
    </div>
  );
}
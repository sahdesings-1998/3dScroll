'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import WatchExplodeScroll from '../components/WatchExplodeScroll';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-amber-400 selection:text-black">
      <Navbar />
      <WatchExplodeScroll />
    </main>
  );
}

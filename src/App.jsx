import React from 'react';
import Navbar from './components/Navbar';
import WatchExplodeScroll from './components/WatchExplodeScroll';

function App() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-amber-400 selection:text-black">
      <Navbar />
      <WatchExplodeScroll />
    </div>
  );
}

export default App;

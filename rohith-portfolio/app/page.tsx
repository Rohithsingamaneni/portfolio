"use client";
import React from 'react';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Capabilities from '@/components/Capabilities';
import Lab from '@/components/Lab';
import About from '@/components/About';
import Footer from '@/components/Footer';

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-[#020202] text-slate-300 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* Background FX */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/10 blur-[150px] rounded-full" />
      </div>

      <main className="relative max-w-7xl mx-auto px-6">
        <Hero />
        <Marquee />
        <Capabilities />
        <Lab />
        <About />
      </main>
      
      <Footer />
    </div>
  );
}

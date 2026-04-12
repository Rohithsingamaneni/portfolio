"use client";
import React from "react";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Capabilities from "@/components/Capabilities";
import Lab from "@/components/Lab";
import SystemStats from "@/components/SystemStats";
import About from "@/components/About";
import Footer from "@/components/Footer";
import Travel from "@/components/Travel";

export default function Portfolio() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/10 blur-[150px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6">
        <Hero />
        <Marquee />
        <Capabilities />
        <Lab />
        <SystemStats />
        <About />
        <Activity />
        <Tinker />
        <Projects />
        <Travel />
      </main>

      <Footer />
    </div>
  );
}

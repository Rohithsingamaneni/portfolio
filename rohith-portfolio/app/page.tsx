"use client";
import React from "react"; // Removed { Activity } - that was the collision
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Capabilities from "@/components/Capabilities";
import Lab from "@/components/Lab";
import SystemStats from "@/components/SystemStats";
import About from "@/components/About";
import Footer from "@/components/Footer";
import Travel from "@/components/Travel";

// ADD THESE THREE LINES:
import ActivityStats from "@/components/ActivityStats";
import Tinker from "@/components/Tinker";
import Projects from "@/components/Projects";

export default function Portfolio() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#020202]">
      {/* ... (Background Glows) ... */}

      <main className="relative z-10 max-w-7xl mx-auto px-6">
        <Hero />
        <Marquee />
        <Capabilities />
        <Lab />
        <SystemStats />
        <About />
        {/* These will now resolve because of the imports added above */}
        <ActivityStats />
        <Tinker />
        <Projects />
        <Travel />
      </main>

      <Footer />
    </div>
  );
}

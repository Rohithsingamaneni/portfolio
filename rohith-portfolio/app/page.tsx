"use client";
import React from "react";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Capabilities from "@/components/Capabilities";
import Experience from "@/components/Experience";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";

import ParticleBackground from "@/components/ParticleBackground";

export default function Portfolio() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#020202]">
      <ParticleBackground />

      <main className="relative z-10 max-w-7xl mx-auto px-6">
        <Hero />
        <Marquee />
        <Capabilities />
        <Experience />
        <Projects />
        <About />
      </main>

      <Footer />
    </div>
  );
}

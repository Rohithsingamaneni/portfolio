"use client";
import React from "react";
import TopNav from "@/components/TopNav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Capabilities from "@/components/Capabilities";
import Experience from "@/components/Experience";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import MagneticLayer from "@/components/MagneticLayer";
import ParticleBackground from "@/components/ParticleBackground";
import ParticleHoverLayer from "@/components/ParticleHoverLayer";
import ScrollAnimator from "@/components/ScrollAnimator";
import ScrollSignal from "@/components/ScrollSignal";
import SectionRevealBurst from "@/components/SectionRevealBurst";
import SmoothScroll from "@/components/SmoothScroll";

export default function Portfolio() {
  return (
    <div className="page-shell">
      <ParticleBackground />
      <SectionRevealBurst />
      <ParticleHoverLayer />
      <ScrollAnimator />
      <MagneticLayer />
      <Cursor />
      <SmoothScroll />
      <ScrollSignal />
      <TopNav />

      <main className="relative z-10 mx-auto w-[min(1220px,calc(100%-1.5rem))] px-0 pb-16 pt-28 md:pt-32">
        <Hero />
        <Marquee />
        <Capabilities />
        <Experience />
        <Projects />
        <About />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

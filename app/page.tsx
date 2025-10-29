"use client";

import React, { useEffect, useRef, useState } from "react";
import SplashScreen from "@/components/ui/splash-screen";
import LineAnimation from "@/components/LineAnimation";
import { TimelineContent } from "@/components/ui/framer-timeline";
import StartNowButton from "@/components/ui/start-now-button";

export default function Home() {
  // Splash / preloader state
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  // Simple ref passed to TimelineContent components (client component)
  const heroRef = useRef<HTMLDivElement | null>(null);

  // Simulate loading progress for splash screen (keeps API calls untouched)
  useEffect(() => {
    let rafId: number;
    let startTime: number | null = null;
    const duration = 1400; // simulated loading duration (ms)

    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 100) {
        rafId = requestAnimationFrame(step);
      } else {
        // keep splash visible briefly for exit animation
        const t = window.setTimeout(() => {
          setShowSplash(false);
          window.clearTimeout(t);
        }, 350);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const revealVariants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 0 },
  };

  return (
    <div className="min-h-screen w-full bg-neutral-900 text-white relative overflow-hidden">
      {/* Splash screen overlay (client) */}
      <SplashScreen isVisible={showSplash} progress={progress} />

      {/* Background animation placed behind the main content */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <LineAnimation />
      </div>

      {/* Main content */}
      <main
        ref={heroRef}
        className="relative z-10 min-h-screen flex items-center justify-center"
      >
        <div className="max-w-2xl w-full px-6 py-12 text-center">
          <TimelineContent
            as="p"
            animationNum={1}
            timelineRef={heroRef}
            variants={revealVariants}
            className="inline-block mb-4 px-4 py-1 rounded-xl border border-orange-600/80 text-xs font-medium tracking-tighter text-white/90 uppercase shadow-sm bg-transparent"
          >
            IFNMG <em className="not-italic">CAMPUS</em> JANUÁRIA
          </TimelineContent>

          <TimelineContent
            as="h1"
            animationNum={2}
            timelineRef={heroRef}
            variants={revealVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-6"
          >
            InterclasseIF <span className="text-orange-500 uppercase">xxv</span>
          </TimelineContent>

          <TimelineContent
            as="div"
            animationNum={3}
            timelineRef={heroRef}
            variants={revealVariants}
            className="mt-4"
          >
            <StartNowButton />
          </TimelineContent>
        </div>
      </main>
    </div>
  );
}

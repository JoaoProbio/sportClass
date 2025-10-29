"use client";

import React, { useEffect, useRef, useState } from "react";
import SplashScreen from "@/components/ui/splash-screen";
import LineAnimation from "@/components/LineAnimation";
import { TimelineContent } from "@/components/ui/framer-timeline";
import StartNowButton from "@/components/ui/start-now-button";

/* Jogos page components (content copied here to show at the top of Home) */
import PageLayout from "./components/PageLayout";
import GamesTable from "./components/GamesTable";
import TransitionLayout from "./components/TransitionLayout";

export default function Home() {
  // Splash / preloader state
  // Only show the splash screen on the first visit in this browser tab (sessionStorage).
  // We keep `showSplash` controlled and introduce `shouldPlaySplash` so the
  // loading animation runs only once per session and won't replay on navigation.
  const [showSplash, setShowSplash] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [shouldPlaySplash, setShouldPlaySplash] = useState<boolean>(false);

  // Simple ref passed to TimelineContent components (client component)
  const heroRef = useRef<HTMLDivElement | null>(null);

  // Decide once per session whether to play the splash. Use sessionStorage so the
  // animation runs only on the user's first entry in this tab and not on internal navigation.
  useEffect(() => {
    try {
      const seen = sessionStorage.getItem("hasSeenSplash");
      if (!seen) {
        setShouldPlaySplash(true);
        setShowSplash(true);
      } else {
        setShouldPlaySplash(false);
        setShowSplash(false);
      }
    } catch (e) {
      // If sessionStorage isn't available, default to not showing the splash to avoid blocking UX.
      setShouldPlaySplash(false);
      setShowSplash(false);
    }
  }, []);

  // Simulate loading progress for splash screen (only when shouldPlaySplash is true)
  useEffect(() => {
    if (!shouldPlaySplash) return;

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
          // mark splash as seen for the session so it doesn't replay on navigation
          try {
            sessionStorage.setItem("hasSeenSplash", "1");
          } catch (e) {
            // ignore storage errors
          }
          window.clearTimeout(t);
        }, 350);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [shouldPlaySplash]);

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

      {/* Jogos section copied from /app/jogos/page.tsx — shown at the top */}
      <div id="jogos" className="relative z-10">
        <TransitionLayout backgroundColor="transparent">
          <PageLayout>
            <div className="mt-2">
              <div className="space-y-4 md:space-y-6">
                {/* Header da Página */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-text-primary mb-1 md:mb-2">
                      Jogos do Interclasse
                    </h1>
                    <p className="text-xs md:text-sm text-text-muted">
                      Acompanhe todos os jogos em tempo real
                    </p>
                  </div>
                </div>

                {/* Tabela de Jogos */}
                <GamesTable />
              </div>
            </div>
          </PageLayout>
        </TransitionLayout>
      </div>
    </div>
  );
}

"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Util } from "@/lib/utils";

/* Easing functions (kept simple) */
const Easing = {
  ExpoEaseOut: (t: number) => (t === 1 ? 1 : -(Math.pow(2, -10 * t) - 1)),
  ExpoEaseInOut: (t: number) =>
    t === 0
      ? 0
      : t === 1
        ? 1
        : (t /= 0.5) < 1
          ? 0.5 * Math.pow(2, 10 * (t - 1))
          : 0.5 * (-Math.pow(2, -10 * --t) + 2),
};

function hslToCss(h: number, s: number, l: number) {
  // s and l are 0..1
  return `hsl(${h}, ${s * 100}%, ${l * 100}%)`;
}

interface LineComponentProps {
  index: number;
  delay: number;
}

const LineComponent: React.FC<LineComponentProps> = ({ index, delay }) => {
  const elRef = useRef<HTMLDivElement | null>(null);
  const [nodes, setNodes] = useState<React.ReactNode[]>([]);
  // configuration tuned for lighter animation
  const totalChars = 60;
  const animationDuration = 700; // ms
  const restartDelay = 800; // ms between show/hide cycles

  const showRateA = useRef(0); // controls reveal
  const showRateB = useRef(0); // controls color/randomization sweep
  const animationFrameId = useRef<number | null>(null);
  const timeoutId = useRef<number | null>(null);

  // text blocks (one per line usually)
  const textBlocks = useRef<Array<{ t: string; start: number; end: number }>>(
    [],
  );
  const allTexts = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";

  const animateValue = useCallback(
    (
      startVal: number,
      endVal: number,
      duration: number,
      easing: (t: number) => number,
      onUpdate: (val: number) => void,
      onComplete?: () => void,
    ) => {
      let frameId: number;
      const startTime = performance.now();
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const eased = easing(progress);
        const val = startVal + (endVal - startVal) * eased;
        onUpdate(val);
        if (progress < 1) {
          frameId = requestAnimationFrame(animate);
        } else {
          onComplete?.();
        }
      };
      frameId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frameId);
    },
    [],
  );

  const updateNodes = useCallback(() => {
    const sA = showRateA.current;
    const sB = showRateB.current;

    const visibleCharsCount = Math.floor(Util.map(sA, 0, 1, 0, totalChars));
    const etcLimit = Math.floor(Util.map(sB, 0, 1, 0, totalChars));

    const parts: React.ReactNode[] = [];

    for (let i = 0; i < totalChars; i++) {
      // characters beyond visible count are underscore placeholders
      if (i >= visibleCharsCount) {
        parts.push(
          <span
            key={i}
            style={{
              opacity: 0,
              color: "rgba(120,140,120,0)",
            }}
          >
            _
          </span>,
        );
        continue;
      }

      let inBlock = false;
      for (const block of textBlocks.current) {
        if (i >= block.start && i < block.end) {
          const ch = block.t.charAt(i - block.start) || " ";
          inBlock = true;
          if (i >= etcLimit) {
            // apply green monochrome gradient
            const hue = 140; // green hue
            const sat = Util.map(i / totalChars, 0, 1, 0.5, 0.9); // 0.5..0.9
            const lig = Util.map(i / totalChars, 0, 1, 0.28, 0.52); // 0.28..0.52
            const color = hslToCss(hue, sat, lig);
            parts.push(
              <span key={i} style={{ color }}>
                {ch}
              </span>,
            );
          } else {
            parts.push(
              <span key={i} style={{ color: "rgba(120,140,120,0.85)" }}>
                {ch}
              </span>,
            );
          }
        }
      }

      if (!inBlock) {
        if (i >= etcLimit) {
          const randChar = allTexts.charAt(Util.random(0, allTexts.length - 1));
          const hue = 140;
          const sat = Util.map(i / totalChars, 0, 1, 0.45, 0.9);
          const lig = Util.map(i / totalChars, 0, 1, 0.3, 0.55);
          const color = hslToCss(hue, sat, lig);
          parts.push(
            <span key={i} style={{ color }}>
              {randChar}
            </span>,
          );
        } else {
          parts.push(
            <span
              key={i}
              style={{
                opacity: 0,
                color: "rgba(120,140,120,0.7)",
              }}
            >
              _
            </span>,
          );
        }
      }
    }

    setNodes(parts);
  }, [totalChars, allTexts]);

  const startShow = useCallback(() => {
    // reset rates
    showRateA.current = 0;
    showRateB.current = 0;

    // start reveal
    animateValue(0, 1, animationDuration, Easing.ExpoEaseOut, (v) => {
      showRateA.current = v;
    });

    // start color/random sweep slightly delayed
    timeoutId.current = window.setTimeout(() => {
      animateValue(
        0,
        1,
        animationDuration,
        Easing.ExpoEaseInOut,
        (v) => {
          showRateB.current = v;
        },
        () => {
          // after fully shown, schedule hide
          timeoutId.current = window.setTimeout(startHide, restartDelay);
        },
      );
    }, animationDuration * 0.6);
  }, [animateValue, animationDuration, restartDelay]);

  const startHide = useCallback(() => {
    // reverse the sweeps
    animateValue(1, 0, animationDuration, Easing.ExpoEaseInOut, (v) => {
      showRateB.current = v;
    });

    // reverse reveal with small delay
    timeoutId.current = window.setTimeout(() => {
      animateValue(1, 0, animationDuration, Easing.ExpoEaseOut, (v) => {
        showRateA.current = v;
      });
    }, animationDuration * 0.5);

    // schedule next show after full hide
    timeoutId.current = window.setTimeout(() => {
      startShow();
    }, animationDuration + restartDelay);
  }, [animateValue, animationDuration, restartDelay, startShow]);

  useEffect(() => {
    // initialize text blocks once per mount
    textBlocks.current = [];
    const possible = [
      "GREMIO ESTUDANTIL",
      "FLOR DO CERRADO",
      "VEJA AS INFORMAÇÕES",
      "",
      "PROGRAMAÇÃO DO INTERCLASSE",
    ];
    let offset = 0;
    const numBlocks = 1; // keep it light
    for (let b = 0; b < numBlocks; b++) {
      let txt = Util.randomArr(possible);
      txt = txt.substring(0, totalChars - 6);
      if (offset + txt.length < totalChars - 3) {
        const start = Util.random(
          offset,
          Math.max(offset + 1, totalChars - 3 - txt.length),
        );
        const end = start + txt.length;
        textBlocks.current.push({ t: txt, start, end });
        offset = end;
      }
    }

    // start the show after configured delay
    timeoutId.current = window.setTimeout(
      () => {
        startShow();
      },
      Math.max(50, delay),
    );

    // main render loop (updates nodes each frame but rates are cheap due to reduced chars/lines)
    const loop = () => {
      updateNodes();
      animationFrameId.current = requestAnimationFrame(loop);
    };
    animationFrameId.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
      if (timeoutId.current) clearTimeout(timeoutId.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run once

  return (
    <div
      ref={elRef}
      className="l-line"
      style={{
        // monospace font and tighter spacing requested
        fontFamily:
          'Inter, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Segoe UI Mono", monospace',
        letterSpacing: "-0.08em",
        whiteSpace: "nowrap",
        display: "block",
        lineHeight: "1.1",
        fontSize: 14,
        fontWeight: 500,
        padding: "2px 6px",
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      {nodes}
    </div>
  );
};

const LineAnimation: React.FC = () => {
  const numLines = 2; // Reduced number of lines to improve perf
  const lines = Array.from({ length: numLines }, (_, i) => i);

  return (
    <div
      className="l-wrapper absolute inset-0 overflow-hidden pointer-events-none"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 2,
        padding: 12,
        // overall monospace fallback to ensure consistency
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Segoe UI Mono", monospace',
        letterSpacing: "0.02em",
      }}
    >
      {lines.map((i) => (
        <LineComponent key={i} index={i} delay={120 + i * 120} />
      ))}
    </div>
  );
};

export default LineAnimation;

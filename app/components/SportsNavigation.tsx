"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSport } from "../providers/SportContext";

// SVG icons imported as React components (Next.js/webpack/svg loader required)
import FutsalIcon from "@/public/icons/nav/soccer.svg";
import BasqueteIcon from "@/public/icons/nav/basketball.svg";
import VoleiIcon from "@/public/icons/nav/volleyball.svg";
import HandebolIcon from "@/public/icons/nav/handball.svg";
import TenisDeMesaIcon from "@/public/icons/nav/table-tennis.svg";

interface SportsNavigationProps {
  onSportFilter?: (sport: string) => void;
  showFilter?: boolean;
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
}

export default function SportsNavigation({
  onSportFilter,
  showFilter = true,
  isSidebarOpen = true,
  toggleSidebar,
}: SportsNavigationProps) {
  const { activeSport, setActiveSport } = useSport();

  const sports = [
    {
      id: "futsal",
      label: "Futsal",
      Icon: FutsalIcon,
      colorClass: "text-sport-football",
    },
    {
      id: "basquete",
      label: "Basquete",
      Icon: BasqueteIcon,
      colorClass: "text-sport-basketball",
    },
    {
      id: "volei",
      label: "Vôlei",
      Icon: VoleiIcon,
      colorClass: "text-sport-volleyball",
    },
    {
      id: "handebol",
      label: "Handebol",
      Icon: HandebolIcon,
      colorClass: "text-sport-handball",
    },
    {
      id: "tenis-de-mesa",
      label: "Tênis de Mesa",
      Icon: TenisDeMesaIcon,
      colorClass: "text-sport-tennis",
    },
  ];

  const containerRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [bg, setBg] = useState<{
    left: number;
    width: number;
    visible: boolean;
  }>({
    left: 0,
    width: 0,
    visible: false,
  });

  const updateBgForSport = (sportId?: string) => {
    const id = sportId ?? activeSport ?? sports[0]?.id;
    const el = tabRefs.current[id];
    if (!el || !containerRef.current) {
      setBg({ left: 0, width: 0, visible: false });
      return;
    }

    // left relative to the scroll container
    const left = el.offsetLeft - containerRef.current.scrollLeft;
    const width = el.getBoundingClientRect().width;
    setBg({ left, width, visible: true });
  };

  const handleSportClick = (sportId: string) => {
    setActiveSport(sportId);
    if (onSportFilter && showFilter) onSportFilter(sportId);

    // ensure the background moves after state change / layout updates
    requestAnimationFrame(() => updateBgForSport(sportId));

    // optionally bring the clicked item into view smoothly
    const el = tabRefs.current[sportId];
    if (el && containerRef.current) {
      const parent = containerRef.current;
      const elLeft = el.offsetLeft;
      const elRight = elLeft + el.getBoundingClientRect().width;
      const parentLeft = parent.scrollLeft;
      const parentWidth = parent.clientWidth;
      if (elLeft < parentLeft) {
        parent.scrollTo({ left: elLeft, behavior: "smooth" });
      } else if (elRight > parentLeft + parentWidth) {
        parent.scrollTo({
          left: elRight - parentWidth + 8,
          behavior: "smooth",
        });
      }
    }
  };

  useEffect(() => {
    updateBgForSport(activeSport ?? sports[0]?.id);
    const handleResize = () => updateBgForSport(activeSport ?? sports[0]?.id);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSport, sports]);

  return (
    <nav aria-label="Navegação por modalidades">
      <div
        ref={containerRef}
        className="flex gap-2 overflow-x-auto py-2 px-2 w-full relative"
      >
        {/* Sliding background / highlight */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 -translate-y-1/2 h-[calc(100%-0.5rem)] rounded-md transition-all duration-300 bg-primary-50 dark:bg-primary-700 pointer-events-none z-0"
          style={{
            left: bg.visible ? `${bg.left}px` : "-9999px",
            width: bg.visible ? `${bg.width}px` : "0px",
          }}
        />

        {sports.map(({ id, label, Icon, colorClass }) => {
          const isActive = String(activeSport) === String(id);
          const baseClasses =
            "relative z-10 flex items-center gap-2 px-3 py-1 justify-between uppercase font-[700] rounded-md whitespace-nowrap transition";
          const activeClasses = isActive
            ? "text-primary-700"
            : `text-color-variant-darkGreen hover:text-text-primary`;

          return (
            <button
              key={id}
              ref={(el) => (tabRefs.current[id] = el)}
              type="button"
              aria-pressed={isActive}
              onClick={() => handleSportClick(id)}
              className={`${baseClasses} ${activeClasses}`}
            >
              <span className="flex items-center justify-center">
                <Icon className="w-4 h-4" aria-hidden="true" />
              </span>
              <span className="text-xs tracking-tighter">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

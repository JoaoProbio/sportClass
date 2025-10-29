"use client";

import React from "react";
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

  const handleSportClick = (sportId: string) => {
    setActiveSport(sportId);
    if (onSportFilter && showFilter) onSportFilter(sportId);
  };

  return (
    <nav aria-label="Navegação por modalidades">
      <div className="flex gap-2 overflow-x-auto  py-2 px-2 w-full">
        {sports.map(({ id, label, Icon, colorClass }) => {
          const isActive = String(activeSport) === String(id);
          const baseClasses =
            "flex items-center gap-2 px-3 py-2 justify-between rounded-md whitespace-nowrap transition";
          const activeClasses = isActive
            ? "bg-primary-50 text-primary-700"
            : "text-text-secondary hover:bg-background-card hover:text-text-primary";
          return (
            <button
              key={id}
              type="button"
              aria-pressed={isActive}
              onClick={() => handleSportClick(id)}
              className={`${baseClasses} ${activeClasses}`}
            >
              <span
                className={`flex items-center justify-center ${colorClass}`}
              >
                {/* use explicit value for aria-hidden to avoid invalid JSX boolean attribute */}
                <Icon className="w-5 h-5" aria-hidden="true" />
              </span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

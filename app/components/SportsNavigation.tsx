"use client";

import { useSport } from "../providers/SportContext";

// Importe os ícones SVG como componentes React
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
      IconComponent: FutsalIcon, // Use o componente importado
      color: "text-sport-football",
    },
    {
      id: "basquete",
      label: "Basquete",
      IconComponent: BasqueteIcon,
      color: "text-sport-basketball",
    },
    {
      id: "volei",
      label: "Vôlei",
      IconComponent: VoleiIcon,
      color: "text-sport-volleyball",
    },
    {
      id: "handebol",
      label: "Handebol",
      IconComponent: HandebolIcon,
      color: "text-sport-handball",
    },
    {
      id: "tenis-de-mesa",
      label: "Tênis de Mesa",
      IconComponent: TenisDeMesaIcon,
      color: "text-sport-tennis",
    },
  ];

  const handleSportClick = (sportId: string) => {
    setActiveSport(sportId);
    if (onSportFilter && showFilter) {
      onSportFilter(sportId);
    }
  };

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto scrollbar-hide py-1 px-0 md:px-6">
        {sports.map((sport) => {
          // Renomeie para IconComponent para usar em JSX
          const { IconComponent } = sport;
          return (
            <button
              key={sport.id}
              onClick={() => handleSportClick(sport.id)}
              className={`flex md:flex-row flex-col flex-1 md:flex-0 items-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-0 md:mt-2 text-sm font-normal duration-75 whitespace-nowrap cursor-pointer rounded-sm transition-[opacity,background-color,transform] hover:opacity-80 active:scale-90 active:transition-[opacity,background-color,transform] active:duration-50 [&:not(:active)]:transition-[opacity,background-color,transform] [&:not(:active)]:duration-[83ms,83ms,167ms] outline-none outline-offset-0 outline-0 outline-[#00000000] ${
                activeSport === sport.id
                  // ? "text-primary-700 bg-primary-400/20"
                  : "text-text-secondary hover:text-text-primary hover:bg-background-card"
              }`}
            >
              <span
                className={`py-2 flex items-center justify-center ${sport.color}`}
              >
                {/* Renderize o componente de ícone e aplique classes de estilo */}
                <IconComponent className="w-5 h-5 md:w-4 md:h-4" />
              </span>

              <span className="sm:inline">{sport.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

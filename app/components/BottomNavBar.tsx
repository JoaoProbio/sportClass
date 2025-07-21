"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, GitBranch, BarChart2, Calendar } from "lucide-react";

const navItems = [
  { href: "/jogos", label: "Jogos", icon: Trophy },
  { href: "/chaveamento", label: "Chaveamento", icon: GitBranch },
  { href: "/estatisticas", label: "Estatísticas", icon: BarChart2 },
  { href: "/calendario", label: "Calendário", icon: Calendar },
];

const BottomNavBar = () => {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-background flex justify-around items-center h-16 md:hidden"
      role="navigation"
      aria-label="Bottom Navigation"
    >
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center justify-center flex-1 focus:outline-none py-2 px-3"
            aria-label={label}
            tabIndex={0}
          >
            <Icon className={`w-5 h-5 mb-1 ${isActive ? "text-white" : "text-text-muted"}`} aria-hidden="true" />
            <span className={`text-xs ${isActive ? "text-white" : "text-text-muted"}`}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNavBar; 
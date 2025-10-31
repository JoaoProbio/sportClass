"use client";

import React from "react";
import NavigationHeader from "./NavigationHeader";
import SportsNavigation from "./SportsNavigation";
import BottomNavBar from "./BottomNavBar";
import { usePathname } from "next/navigation";

interface PageLayoutProps {
  children: React.ReactNode;
}

/**
 * Simplified PageLayout
 *
 * - Removed unused sidebar state
 * - Guards pathname (may be undefined during SSR)
 * - Replaced yellow info bar colors with theme variant classes (tokens)
 */

export default function PageLayout({ children }: PageLayoutProps) {
  // usePathname is a client hook; guard it in case it returns undefined
  const rawPath = usePathname() ?? "/";
  const pathParts = rawPath.split("/").filter(Boolean);

  const breadcrumbItems = [
    { href: "/", label: "Início" },
    ...pathParts.map((part, idx) => {
      const href = "/" + pathParts.slice(0, idx + 1).join("/");
      const label = part
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
      return { href, label };
    }),
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Informational bar using theme variant classes instead of hard-coded yellow */}
      <div className="bg-background-elevated/10 border-b border-border-default px-4 py-2">
        <div className="flex items-center justify-center gap-2 text-sm text-text-secondary">
          <span className="font-medium text-xs">
            Você está em <strong>Modo teste.</strong> Todas as interações são
            simuladas.
          </span>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto">
        {/* Header */}
        <NavigationHeader />

        {/* Sports navigation */}
        <SportsNavigation />
      </div>

      {/* Main layout container */}
      <div className="flex max-w-[1320px] mx-auto">
        <main className="flex-1 p-4 md:p-6 pb-32 md:pb-20">{children}</main>
      </div>

      {/* Bottom navigation for mobile */}
      <BottomNavBar />
    </div>
  );
}

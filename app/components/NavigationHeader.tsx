"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, isActive, getAriaLabel } from "./navConfig";

/**
 * NavigationHeader
 *
 * - Desktop: shows the full navigation with active highlighting.
 * - Mobile: navigation is provided by BottomNavBar; header keeps branding only.
 * - Adds an accessible skip link to jump to main content.
 */
export default function NavigationHeader() {
  const pathname = usePathname();

  return (
    <header className="w-full bg-transparent">
      {/* Accessible skip link for keyboard users */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:block px-4 py-2 text-sm bg-background rounded-md"
      >
        Pular para o conteúdo
      </a>

      <div className="max-w-[1320px] mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" aria-label="Home" className="flex items-center gap-3">
          <img
            src="/logo/logo_rapoze_darkGreen.svg"
            alt="IFNMG logo"
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
          />
          <span className="hidden sm:inline text-sm font-medium text-text-primary">
            InterclasseIF
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
          className="hidden md:flex items-center gap-4"
          role="navigation"
          aria-label="Main menu"
        >
          <ul
            className="flex items-center gap-4"
            role="menubar"
            aria-label="Menu principal"
          >
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item);
              // Render the Jogos link to point to the home page (/) while keeping active
              // detection based on the original nav item. This preserves visual active
              // state even if the item href differs from the link target.
              const linkHref = item.id === "jogos" ? "/" : item.href;
              return (
                <li key={item.id} role="none">
                  <Link
                    href={linkHref}
                    aria-label={getAriaLabel(item, active)}
                    aria-current={active ? "page" : undefined}
                    role="menuitem"
                    className={`text-sm transition inline-block tracking-tighter uppercase px-2 py-1 rounded ${
                      active
                        ? "text-text-primary font-semibold"
                        : "text-text-secondary hover:text-text-primary hover:bg-background-card"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}

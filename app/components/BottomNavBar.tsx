"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, GitBranch, BarChart2, Calendar } from "lucide-react";
import { MOBILE_NAV_ITEMS, isActive, getAriaLabel } from "./navConfig";

/**
 * BottomNavBar
 *
 * - Uses the shared MOBILE_NAV_ITEMS configuration so labels/hrefs stay in sync
 *   with the header.
 * - Maps `iconName` strings to lucide-react icon components.
 * - Uses centralized `isActive` logic so highlighting matches the header.
 * - Improved accessibility: explicit aria-current when active, clearer labels
 *   and focusable areas.
 */

const ICON_MAP: Record<string, any> = {
  Trophy,
  GitBranch,
  BarChart2,
  Calendar,
};

const BottomNavBar = () => {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-background flex justify-around items-center h-16 md:hidden"
      role="navigation"
      aria-label="Bottom Navigation"
    >
      {MOBILE_NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item);
        const Icon = ICON_MAP[item.iconName ?? "Trophy"] ?? Trophy;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={getAriaLabel(item, active)}
            aria-current={active ? "page" : undefined}
            className={`flex flex-col items-center justify-center flex-1 py-2 px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-primary`}
          >
            <Icon
              className={`w-5 h-5 mb-1 ${active ? "text-white" : "text-text-muted"}`}
              aria-hidden="true"
            />
            <span
              className={`text-xs ${active ? "text-white" : "text-text-muted"}`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNavBar;

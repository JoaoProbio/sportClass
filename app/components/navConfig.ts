/**
 * Shared navigation configuration for header and bottom navigation.
 *
 * This file contains the canonical list of navigation items (labels + hrefs)
 * and small helpers to determine active state. The visual components
 * (NavigationHeader, BottomNavBar) should import the items from here so
 * they remain consistent across desktop and mobile.
 *
 * Note: Icons are not imported here to keep this module UI-agnostic. Instead
 * an `iconName` string is provided for components that want to map names to
 * actual icon components (for example, lucide-react icons).
 */

export type NavItem = {
  id: string;
  label: string;
  href: string;
  /**
   * Optional icon name to be resolved by the UI component (e.g. "Trophy",
   * "GitBranch"). Keeping icons as strings avoids coupling this module to a
   * specific icon library.
   */
  iconName?: string;
  /**
   * If true, the active detection will use an exact match (pathname === href).
   * Otherwise, it will use prefix-match (pathname.startsWith(href)).
   */
  exact?: boolean;
};

/**
 * Base navigation items used by the desktop header.
 * Keep this list minimal (no icons).
 */
export const NAV_ITEMS: NavItem[] = [
  { id: "jogos", label: "Jogos", href: "/jogos" },
  { id: "chaveamento", label: "Chaveamento", href: "/chaveamento" },
  { id: "estatisticas", label: "Estatísticas", href: "/estatisticas" },
];

/**
 * Mobile navigation items: same hrefs/labels but include an `iconName`
 * that mobile components (BottomNavBar) can resolve to an actual icon.
 *
 * Add `exact: true` when a route should only be active on an exact match.
 */
export const MOBILE_NAV_ITEMS: NavItem[] = [
  { id: "jogos", label: "Jogos", href: "/jogos", iconName: "Trophy" },
  {
    id: "chaveamento",
    label: "Chaveamento",
    href: "/chaveamento",
    iconName: "GitBranch",
  },
  {
    id: "estatisticas",
    label: "Estatísticas",
    href: "/estatisticas",
    iconName: "BarChart2",
  },
];

/**
 * Helper: determines if a nav item should be considered active for a given
 * pathname. This centralizes the logic so header and bottom nav behave the same.
 *
 * Usage:
 *   import { isActive } from './navConfig';
 *   const active = isActive(pathname, item);
 */
export function isActive(
  pathname: string | null | undefined,
  item: NavItem,
): boolean {
  if (!pathname) return false;
  // Normalize (strip trailing slash except for root)
  const normalize = (p: string) =>
    p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
  const pn = normalize(pathname);
  const href = normalize(item.href);

  if (item.exact) {
    return pn === href;
  }
  // treat root specially: only active if pathname is exactly "/"
  if (href === "/") return pn === "/";
  return pn === href || pn.startsWith(href + "/") || pn.startsWith(href);
}

/**
 * Small utility to expose a consistent aria-label if needed.
 * Example: `${label} (Página atual)` could be used when active.
 */
export function getAriaLabel(item: NavItem, active = false) {
  return active ? `${item.label} (Página atual)` : item.label;
}

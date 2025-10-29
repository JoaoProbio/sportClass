import type { Config } from "tailwindcss";

const config = {
  darkMode: "class" as const,
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Background tokens */
        background: "var(--background)",
        "background-elevated": "var(--background-elevated)",
        "background-card": "var(--background-card)",
        "background-sidebar": "var(--background-sidebar)",

        /* Primary palette mapped to CSS variables for utilities like bg-primary-500 */
        primary: {
          50: "var(--primary-50)",
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
        },

        /* Secondary (grayscale) palette */
        secondary: {
          50: "var(--secondary-50)",
          100: "var(--secondary-100)",
          200: "var(--secondary-200)",
          300: "var(--secondary-300)",
          400: "var(--secondary-400)",
          500: "var(--secondary-500)",
          600: "var(--secondary-600)",
          700: "var(--secondary-700)",
          800: "var(--secondary-800)",
          900: "var(--secondary-900)",
        },

        /* Variants (named tokens) */
        "color-variant-light": "var(--color-variant-light)",
        "color-variant-orange": "var(--color-variant-orange)",
        "color-variant-darkGreen": "var(--color-variant-darkGreen)",

        /* Accent and semantic mappings (kept for backward compatibility) */
        "accent-primary": "var(--accent-primary)",
        "accent-primary-hover": "var(--accent-primary-hover)",
        "accent-secondary": "var(--accent-secondary)",
        "accent-tertiary": "var(--accent-tertiary)",
        "accent-success": "var(--accent-success)",
        "accent-warning": "var(--accent-warning)",
        "accent-live": "var(--accent-live)",

        /* Text / border / status tokens */
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "text-inverse": "var(--text-inverse)",

        "border-default": "var(--border-default)",
        "border-muted": "var(--border-muted)",
        "border-accent": "var(--border-accent)",

        "status-live": "var(--status-live)",
        "status-finished": "var(--status-finished)",
        "status-upcoming": "var(--status-upcoming)",
        "status-postponed": "var(--status-postponed)",

        /* Sport colors mapped to primary for consistency */
        "sport-football": "var(--sport-football)",
        "sport-basketball": "var(--sport-basketball)",
        "sport-tennis": "var(--sport-tennis)",
        "sport-volleyball": "var(--sport-volleyball)",
        "sport-handball": "var(--sport-handball)",
        "sport-baseball": "var(--sport-baseball)",

        /* Legacy special 'verde' key removed in favor of 'primary' scale above.
           If you still need the old 'verde' object, re-add it mapping to the new tokens. */
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      spacing: {
        "15": "60px",
        "70": "280px",
      },
      animation: {
        pulse: "pulse 2s infinite",
      },
      screens: {
        xs: "475px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  safelist: [
    /* primary bg/text/border */
    "bg-primary-50",
    "bg-primary-100",
    "bg-primary-200",
    "bg-primary-300",
    "bg-primary-400",
    "bg-primary-500",
    "bg-primary-600",
    "bg-primary-700",
    "bg-primary-800",
    "bg-primary-900",
    "text-primary-50",
    "text-primary-100",
    "text-primary-200",
    "text-primary-300",
    "text-primary-400",
    "text-primary-500",
    "text-primary-600",
    "text-primary-700",
    "text-primary-800",
    "text-primary-900",
    "border-primary-50",
    "border-primary-100",
    "border-primary-200",
    "border-primary-300",
    "border-primary-400",
    "border-primary-500",
    "border-primary-600",
    "border-primary-700",
    "border-primary-800",
    "border-primary-900",

    /* secondary bg/text/border */
    "bg-secondary-50",
    "bg-secondary-100",
    "bg-secondary-200",
    "bg-secondary-300",
    "bg-secondary-400",
    "bg-secondary-500",
    "bg-secondary-600",
    "bg-secondary-700",
    "bg-secondary-800",
    "bg-secondary-900",
    "text-secondary-50",
    "text-secondary-100",
    "text-secondary-200",
    "text-secondary-300",
    "text-secondary-400",
    "text-secondary-500",
    "text-secondary-600",
    "text-secondary-700",
    "text-secondary-800",
    "text-secondary-900",
    "border-secondary-50",
    "border-secondary-100",
    "border-secondary-200",
    "border-secondary-300",
    "border-secondary-400",
    "border-secondary-500",
    "border-secondary-600",
    "border-secondary-700",
    "border-secondary-800",
    "border-secondary-900",

    /* named variants */
    "bg-color-variant-light",
    "bg-color-variant-orange",
    "bg-color-variant-darkGreen",
    "text-color-variant-light",
    "text-color-variant-orange",
    "text-color-variant-darkGreen",
    "border-color-variant-light",
    "border-color-variant-orange",
    "border-color-variant-darkGreen",

    /* semantic tokens (kept for convenience) */
    "bg-accent-primary",
    "bg-accent-primary-hover",
    "bg-accent-secondary",
    "bg-accent-tertiary",
    "text-accent-primary",
    "text-accent-secondary",
    "text-accent-tertiary",
    "border-accent-primary",
    "border-accent-secondary",

    /* background / card / sidebar / ring (semantic) */
    "bg-background",
    "bg-background-elevated",
    "bg-background-card",
    "bg-background-sidebar",
    "text-text-primary",
    "text-text-secondary",
    "text-text-muted",
    "text-text-inverse",
    "border-border-default",
    "border-border-muted",
    "ring-primary-500",
    "ring-accent-primary",

    /* chart tokens */
    "bg-chart-1",
    "bg-chart-2",
    "bg-chart-3",
    "bg-chart-4",
    "bg-chart-5",

    /* legacy/compat */
    "bg-primary",
    "text-primary",
    "border-primary",
    "bg-accent-primary-hover",
  ],
  plugins: [],
};

export default config;

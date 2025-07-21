import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        "background-elevated": "var(--background-elevated)",
        "background-card": "var(--background-card)",
        "background-sidebar": "var(--background-sidebar)",
        
        "accent-primary": "var(--accent-primary)",
        "accent-primary-hover": "var(--accent-primary-hover)",
        "accent-secondary": "var(--accent-secondary)",
        "accent-tertiary": "var(--accent-tertiary)",
        "accent-success": "var(--accent-success)",
        "accent-warning": "var(--accent-warning)",
        "accent-live": "var(--accent-live)",
        
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
        
        "sport-football": "var(--sport-football)",
        "sport-basketball": "var(--sport-basketball)",
        "sport-tennis": "var(--sport-tennis)",
        "sport-volleyball": "var(--sport-volleyball)",
        "sport-handball": "var(--sport-handball)",
        "sport-baseball": "var(--sport-baseball)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      spacing: {
        '15': '60px',
        '70': '280px',
      },
      animation: {
        'pulse': 'pulse 2s infinite',
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
};

export default config; 
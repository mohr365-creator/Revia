import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dawn palette — see src/app/globals.css for the CSS variable source of truth.
        navy: "rgb(var(--navy) / <alpha-value>)",
        amber: "rgb(var(--amber) / <alpha-value>)",
        ember: "rgb(var(--ember) / <alpha-value>)",
        saffron: "rgb(var(--saffron) / <alpha-value>)",
        cream: "rgb(var(--cream) / <alpha-value>)",
      },
      fontFamily: {
        wordmark: ["var(--font-wordmark)", "ui-sans-serif", "sans-serif"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose: "68ch",
      },
      letterSpacing: {
        eyebrow: "0.22em",
        wordmark: "0.32em",
      },
      keyframes: {
        "draw-in": {
          from: { strokeDashoffset: "1" },
          to: { strokeDashoffset: "0" },
        },
        beacon: {
          "0%, 100%": { opacity: "0.35", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.25)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        beacon: "beacon 3.2s ease-in-out infinite",
        "fade-up": "fade-up 0.8s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;

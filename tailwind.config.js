// tailwind.config.js
import { heroui } from "@heroui/theme";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
        "label-caps": ["Sora", "sans-serif"],
        "display-lg": ["Sora", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "headline-md": ["Sora", "sans-serif"],
        "display-art": ["Playfair Display", "serif"],
        "body-md": ["Inter", "sans-serif"],
        "display-lg-mobile": ["Sora", "sans-serif"],
      },
      colors: {
        "on-secondary-fixed-variant": "#852400",
        "tertiary-fixed": "#ffdad6",
        "on-tertiary-container": "#ffe7e4",
        "on-tertiary-fixed-variant": "#93000b",
        "surface-container-high": "#2a2837",
        "error": "#ffb4ab",
        "inverse-on-surface": "#312f3e",
        "secondary-container": "#ff571a",
        "primary-fixed": "#f0dbff",
        "on-primary-container": "#f6e6ff",
        "surface-container-highest": "#353342",
        "primary": "#ddb8ff",
        "on-primary-fixed-variant": "#6800b4",
        "outline-variant": "#4d4354",
        "tertiary-fixed-dim": "#ffb4ab",
        "secondary-fixed": "#ffdbd0",
        "on-primary": "#490080",
        "surface-dim": "#131220",
        "secondary": "#ffb59e",
        "primary-fixed-dim": "#ddb8ff",
        "surface": "#131220",
        "inverse-primary": "#861fdd",
        "on-background": "#e5e0f4",
        "outline": "#988ca0",
        "on-surface": "#e5e0f4",
        "on-secondary-container": "#521300",
        "surface-container": "#201e2c",
        "on-secondary": "#5e1700",
        "on-surface-variant": "#cfc2d7",
        "surface-container-lowest": "#0e0c1a",
        "on-tertiary": "#690005",
        "background": "#131220",
        "on-error": "#690005",
        "surface-variant": "#353342",
        "primary-container": "#9333ea",
        "tertiary-container": "#cb2b27",
        "error-container": "#93000a",
        "on-secondary-fixed": "#3a0b00",
        "on-primary-fixed": "#2c0051",
        "on-tertiary-fixed": "#410002",
        "surface-tint": "#ddb8ff",
        "surface-container-low": "#1c1a28",
        "inverse-surface": "#e5e0f4",
        "tertiary": "#ffb4ab",
        "surface-bright": "#3a3747",
        "on-error-container": "#ffdad6",
        "secondary-fixed-dim": "#ffb59e",
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px",
      },
      spacing: {
        "auth-card-width": "440px",
        "unit": "8px",
        "gutter": "1.5rem",
        "container-padding": "2rem",
        "stack-sm": "0.5rem",
        "stack-lg": "3rem",
        "stack-md": "1.5rem",
      },
      fontSize: {
        "label-caps": ["12px", { lineHeight: "1.0", letterSpacing: "0.1em", fontWeight: "600" }],
        "display-lg": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "display-art": ["40px", { lineHeight: "1.2", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "display-lg-mobile": ["32px", { lineHeight: "1.2", fontWeight: "700" }],
      },
    },
    heroui: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          foreground: "#111827",
          background: "#f9fafb",
          primary: "#4f46e5",
          secondary: "#10b981",
        },
        layout: {
          borderRadius: "0.5rem",
          spacing: "1rem",
        },
      },
      dark: {
        colors: {
          foreground: "#f9fafb",
          background: "#1f2937",
          primary: "#6366f1",
          secondary: "#22c55e",
        },
        layout: {
          borderRadius: "0.5rem",
          spacing: "1rem",
        },
      },
    },
  },
},
  plugins: [heroui(), animate], // ← animate đã hỗ trợ ESM ở v1.0.7+
};

export default config;

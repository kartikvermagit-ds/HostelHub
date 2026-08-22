/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#00685f",
        "primary-container": "#008378",
        "on-primary": "#ffffff",
        "on-primary-container": "#f4fffc",
        "primary-fixed": "#89f5e7",
        "primary-fixed-dim": "#6bd8cb",
        "on-primary-fixed": "#00201d",
        "on-primary-fixed-variant": "#005049",
        "inverse-primary": "#6bd8cb",

        "secondary": "#585f6c",
        "secondary-container": "#dce2f3",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#5e6572",
        "secondary-fixed": "#dce2f3",
        "secondary-fixed-dim": "#c0c7d6",
        "on-secondary-fixed": "#151c27",
        "on-secondary-fixed-variant": "#404754",

        "tertiary": "#924628",
        "tertiary-container": "#b05e3d",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#fffbff",
        "tertiary-fixed": "#ffdbce",
        "tertiary-fixed-dim": "#ffb59a",
        "on-tertiary-fixed": "#370e00",
        "on-tertiary-fixed-variant": "#773215",

        "surface": "#f9f9ff",
        "surface-dim": "#d3daef",
        "surface-bright": "#f9f9ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f1f3ff",
        "surface-container": "#e9edff",
        "surface-container-high": "#e1e8fd",
        "surface-container-highest": "#dce2f7",
        "surface-variant": "#dce2f7",
        "surface-border": "#E5E7EB",
        "surface-tint": "#006a61",
        "app-bg": "#F9FAFB",

        "on-surface": "#141b2b",
        "on-surface-variant": "#3d4947",
        "inverse-surface": "#293040",
        "inverse-on-surface": "#edf0ff",

        "outline": "#6d7a77",
        "outline-variant": "#bcc9c6",

        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",

        "status-info": "#3B82F6",
        "background": "#f9f9ff",
        "on-background": "#141b2b"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "full": "9999px"
      },
      spacing: {
        "stack-xs": "4px",
        "stack-sm": "12px",
        "stack-md": "20px",
        "stack-lg": "40px",
        "unit": "4px",
        "container-max": "1280px",
        "gutter-grid": "24px",
        "margin-page": "32px",
        "pb-safe": "env(safe-area-inset-bottom)"
      },
      fontFamily: {
        "sans": ["'Hanken Grotesk'", "sans-serif"],
        "manrope": ["'Manrope'", "sans-serif"],
        "display": ["'Manrope'", "sans-serif"],
        "headline-lg": ["'Manrope'", "sans-serif"],
        "headline-md": ["'Manrope'", "sans-serif"],
        "headline-sm": ["'Manrope'", "sans-serif"],
        "body-lg": ["'Hanken Grotesk'", "sans-serif"],
        "body-md": ["'Hanken Grotesk'", "sans-serif"],
        "body-sm": ["'Hanken Grotesk'", "sans-serif"],
        "label-md": ["'Hanken Grotesk'", "sans-serif"],
        "label-sm": ["'Hanken Grotesk'", "sans-serif"]
      },
      fontSize: {
        "display": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-lg-mobile": ["28px", { lineHeight: "36px", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "headline-sm": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "headline-sm-mobile": ["18px", { lineHeight: "24px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "16px", letterSpacing: "0.01em", fontWeight: "600" }],
        "label-sm": ["12px", { lineHeight: "14px", letterSpacing: "0.02em", fontWeight: "500" }]
      },
      boxShadow: {
        "academic": "0px 2px 4px rgba(17, 24, 39, 0.05)",
        "ambient": "0px 2px 4px rgba(17, 24, 39, 0.05)",
        "card": "0 2px 8px rgba(17, 24, 39, 0.02)",
        "card-hover": "0 4px 12px rgba(17, 24, 39, 0.05)",
        "modal": "0px 4px 24px rgba(17, 24, 39, 0.02)"
      }
    },
  },
  plugins: [],
}

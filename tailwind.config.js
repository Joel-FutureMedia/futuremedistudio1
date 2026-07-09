/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#313e4a",
          dark: "#27333d",
          light: "#dbe2ea",
          muted: "#b3c0ce",
          faint: "rgba(255,255,255,0.22)",
          surface: "rgba(255,255,255,0.08)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      letterSpacing: { tightest: "-0.04em" },
      boxShadow: {
        card: "0 1px 3px rgba(9, 12, 15, 0.25), 0 10px 24px rgba(9, 12, 15, 0.22)",
        "card-hover": "0 4px 12px rgba(9, 12, 15, 0.3), 0 18px 42px rgba(9, 12, 15, 0.26)",
        nav: "0 8px 32px rgba(9, 12, 15, 0.22)",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#323e4a",
          dark: "#28333e",
          light: "#4a5664",
          muted: "#8b95a1",
          faint: "#e8eaec",
          surface: "#f4f5f7",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      letterSpacing: { tightest: "-0.04em" },
      boxShadow: {
        card: "0 1px 3px rgba(50, 62, 74, 0.06), 0 8px 24px rgba(50, 62, 74, 0.08)",
        "card-hover": "0 4px 12px rgba(50, 62, 74, 0.1), 0 16px 40px rgba(50, 62, 74, 0.12)",
        nav: "0 4px 24px rgba(50, 62, 74, 0.08)",
      },
    },
  },
  plugins: [],
};

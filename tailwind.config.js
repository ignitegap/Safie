/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        safie: {
          blush: "#FFF1F2",
          blushSoft: "#FFF5F6",
          roseLight: "#FFE4E6",
          roseBorder: "#FECDD3",
          rose: "#E11D48",
          roseDark: "#BE123C",
          roseDeep: "#9F1239",
          plum: "#2A0B1E",
          plumDeep: "#190513",
          plumBorder: "#4A1536",
          charcoal: "#1C1917",
          cream: "#FAF6F5",
          emerald: "#059669",
          emeraldLight: "#D1FAE5",
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "soft-float": "float 4s ease-in-out infinite",
      }
    },
  },
  plugins: [],
};

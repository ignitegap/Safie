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
          crimson: "#E53935",
          redDark: "#991B1B",
          cream: "#F9F7F2",
          sand: "#F4F0E8",
          charcoal: "#111111",
          slate: "#0F172A",
          emerald: "#10B981",
          emeraldDark: "#166534",
          amber: "#F59E0B",
          blue: "#2563EB",
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "radar-sweep": "spin 4s linear infinite",
      }
    },
  },
  plugins: [],
};

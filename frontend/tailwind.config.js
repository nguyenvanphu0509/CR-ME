/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          background: "#050505",
          foreground: "#FFF4DE",
          primary: "#C98A48",
          primaryHover: "#d89753",
          secondary: "#0B0B0B",
          accent: "#E94362",
          muted: "rgba(255, 255, 255, 0.62)",
          surface: "#0E0E0E",
          surfaceElevated: "#161616",
          chocolate: "#5A2E22",
          honeycomb: "#E5A84B",
          pistachio: "#9FBC69",
          white: "#FFFFFF",
          black: "#000000",
          border: "rgba(255, 255, 255, 0.08)",
          borderStrong: "rgba(255, 255, 255, 0.18)",
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Playfair Display', 'Cinzel', 'Georgia', 'serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};

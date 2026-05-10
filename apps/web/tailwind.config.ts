import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#05111f",
          900: "#0a1626",
          800: "#102136"
        },
        surface: {
          50: "#f7f9fc",
          100: "#eef3f8"
        },
        accent: {
          50: "#ecfeff",
          200: "#a5f3fc",
          400: "#22d3ee",
          600: "#0891b2"
        }
      },
      boxShadow: {
        soft: "0 24px 80px rgba(2, 8, 23, 0.18)",
        panel: "0 18px 60px rgba(2, 8, 23, 0.12)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" }
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0px)" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        fadeUp: "fadeUp 0.7s ease-out both"
      }
    }
  },
  plugins: []
};

export default config;
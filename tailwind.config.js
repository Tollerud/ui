/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}",
    "./pages/**/*.{js,ts,jsx,tsx,html}",
    "./components/**/*.{js,ts,jsx,tsx,html}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      /* ─── Tia Noir Color Palette ─── */
      colors: {
        tia: {
          /* Brand */
          yellow:  "#E8D500",
          "yellow-bright": "#FFFF00",
          "yellow-dim":  "#B8A800",
          amber:   "#FFB800",
          "amber-glow": "#FF8C00",

          /* Noir Base */
          noir: {
            black:  "#0A0A0A",
            900: "#121212",
            800: "#1A1A1A",
            700: "#252525",
            600: "#333333",
            500: "#4A4A4A",
            400: "#666666",
            300: "#888888",
            200: "#AAAAAA",
            100: "#CCCCCC",
            50:  "#E5E5E5",
            white: "#F5F5F5",
          },

          /* Semantic */
          surface: {
            DEFAULT: "#0A0A0A",
            raised:  "#121212",
            overlay: "#1A1A1A",
            hover:   "#252525",
          },
          text: {
            primary:   "#F5F5F5",
            secondary: "#AAAAAA",
            muted:     "#666666",
            inverse:   "#0A0A0A",
          },
          border: {
            DEFAULT: "#333333",
            subtle:  "#252525",
            accent:  "#E8D500",
          },
          state: {
            success: "#22C55E",
            warning: "#E8D500",
            error:   "#EF4444",
            info:    "#3B82F6",
          },
        },
      },

      /* ─── Typography ─── */
      fontFamily: {
        sans:      ['"Inter"', '"SF Pro"', "system-ui", "sans-serif"],
        mono:      ['"JetBrains Mono"', '"Fira Code"', "monospace"],
        display:   ['"Inter"', '"SF Pro Display"', "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs":  ["0.625rem", { lineHeight: "0.875rem" }],
        xs:     ["0.75rem",  { lineHeight: "1rem" }],
        sm:     ["0.875rem", { lineHeight: "1.25rem" }],
        base:   ["1rem",     { lineHeight: "1.5rem" }],
        lg:     ["1.125rem", { lineHeight: "1.75rem" }],
        xl:     ["1.25rem",  { lineHeight: "1.75rem" }],
        "2xl":  ["1.5rem",   { lineHeight: "2rem" }],
        "3xl":  ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl":  ["2.25rem",  { lineHeight: "2.5rem" }],
        "5xl":  ["3rem",     { lineHeight: "1.1" }],
        "6xl":  ["3.75rem",  { lineHeight: "1.05" }],
        "7xl":  ["4.5rem",   { lineHeight: "1" }],
        "8xl":  ["6rem",     { lineHeight: "1" }],
        "9xl":  ["8rem",     { lineHeight: "1" }],
      },
      fontWeight: {
        normal:  "400",
        medium:  "500",
        semibold: "600",
        bold:    "700",
        black:   "900",
      },

      /* ─── Spacing ─── */
      spacing: {
        0.5: "0.125rem",
        1:   "0.25rem",
        1.5: "0.375rem",
        2:   "0.5rem",
        2.5: "0.625rem",
        3:   "0.75rem",
        3.5: "0.875rem",
        4:   "1rem",
        5:   "1.25rem",
        6:   "1.5rem",
        7:   "1.75rem",
        8:   "2rem",
        9:   "2.25rem",
        10:  "2.5rem",
        11:  "2.75rem",
        12:  "3rem",
        14:  "3.5rem",
        16:  "4rem",
        18:  "4.5rem",
        20:  "5rem",
        24:  "6rem",
        28:  "7rem",
        32:  "8rem",
        36:  "9rem",
        40:  "10rem",
        44:  "11rem",
        48:  "12rem",
        52:  "13rem",
        56:  "14rem",
        60:  "15rem",
        64:  "16rem",
        72:  "18rem",
        80:  "20rem",
        96:  "24rem",
      },

      /* ─── Border Radius ─── */
      borderRadius: {
        none:  "0",
        sm:    "0.125rem",
        DEFAULT: "0.25rem",
        md:    "0.375rem",
        lg:    "0.5rem",
        xl:    "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full:  "9999px",
      },

      /* ─── Box Shadows — Noir style ─── */
      boxShadow: {
        "tia-sm":    "0 1px 2px 0 rgba(0,0,0,0.4)",
        "tia":       "0 1px 3px 0 rgba(0,0,0,0.5), 0 1px 2px -1px rgba(0,0,0,0.3)",
        "tia-md":    "0 4px 6px -1px rgba(0,0,0,0.5), 0 2px 4px -2px rgba(0,0,0,0.3)",
        "tia-lg":    "0 10px 15px -3px rgba(0,0,0,0.5), 0 4px 6px -4px rgba(0,0,0,0.3)",
        "tia-xl":    "0 20px 25px -5px rgba(0,0,0,0.5), 0 8px 10px -6px rgba(0,0,0,0.3)",
        "tia-2xl":   "0 25px 50px -12px rgba(0,0,0,0.6)",
        "tia-glow":  "0 0 15px rgba(232,213,0,0.3), 0 0 30px rgba(232,213,0,0.1)",
        "tia-inner": "inset 0 2px 4px 0 rgba(0,0,0,0.4)",
      },

      /* ─── Animation ─── */
      animation: {
        "fade-in":   "fadeIn 200ms ease-out",
        "fade-out":  "fadeOut 150ms ease-in",
        "slide-up":  "slideUp 250ms ease-out",
        "slide-down": "slideDown 250ms ease-out",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%":   { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideUp: {
          "0%":   { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)",   opacity: "1" },
        },
        slideDown: {
          "0%":   { transform: "translateY(-8px)", opacity: "0" },
          "100%": { transform: "translateY(0)",    opacity: "1" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(232,213,0,0.2)" },
          "50%":      { boxShadow: "0 0 25px rgba(232,213,0,0.5)" },
        },
      },

      /* ─── Transition ─── */
      transitionDuration: {
        fast:   "150ms",
        normal: "250ms",
        slow:   "350ms",
      },
      transitionTimingFunction: {
        "tia-ease": "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      /* ─── Backdrop Blur (Glass) ─── */
      backdropBlur: {
        glass: "20px",
      },

      /* ─── Background Patterns ─── */
      backgroundImage: {
        "tia-grid": `
          linear-gradient(rgba(232, 213, 0, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(232, 213, 0, 0.03) 1px, transparent 1px)
        `,
        "tia-gradient-bar": `
          linear-gradient(90deg,
            transparent,
            #E8D500 35%,
            #FFB800 50%,
            #E8D500 65%,
            transparent)
        `,
        "tia-gradient-soft": `
          linear-gradient(135deg,
            rgba(232, 213, 0, 0.8),
            rgba(255, 184, 0, 0.4))
        `,
      },
      backgroundSize: {
        "tia-grid": "40px 40px",
      },

      /* ─── Letter Spacing ─── */
      letterSpacing: {
        tightest: "-0.045em",
        tighter:  "-0.035em",
        tight:    "-0.025em",
      },
    },
  },
  plugins: [],
};
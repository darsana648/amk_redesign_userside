/* Tailwind (Play CDN) theme — single source of truth for the design tokens.
   Global B2B marketplace look: white surfaces on a cool grey canvas, AMK navy
   for identity, one confident orange for every call to action. */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0b2b5c",
          950: "#061631",
          900: "#082149",
          800: "#0b2b5c",
          700: "#16407f",
          600: "#1f53a3",
          100: "#e4ebf5",
          50: "#f1f5fb",
        },
        accent: {
          DEFAULT: "#ff6a00",
          dark: "#e55d00",
          light: "#fff2e8",
          soft: "#ffe3cf",
        },
        brand: {
          DEFAULT: "#1d5fd1",
          dark: "#174ca8",
          light: "#eef4ff",
        },
        trust: {
          DEFAULT: "#0a8f5b",
          light: "#e8f7ef",
        },
        ink: {
          DEFAULT: "#1f2329",
          muted: "#4e5663",
          soft: "#7a8290",
        },
        line: {
          DEFAULT: "#e6e8ec",
          strong: "#d3d7de",
        },
        canvas: "#f4f5f7",
        paper: "#f8f9fb",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", '"Segoe UI"', "Roboto", "Arial", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)",
        lift: "0 12px 32px -12px rgba(16,24,40,0.22)",
        pop: "0 20px 48px -16px rgba(11,43,92,0.35)",
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
    },
  },
};

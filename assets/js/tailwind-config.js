/* Tailwind (Play CDN) theme — single source of truth for the design tokens.
   "Dark navy & red": white surfaces on a cool neutral canvas, very dark navy
   for structure, crimson red (white text) for every call to action, brighter
   red for highlights on dark backgrounds. Matches the red in the AMK logo.
   (Colour keys keep their old names — `navy` is the dark navy, `accent` is
   crimson; `peach` is kept only as an alias of crimson.) */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0a1530",
          950: "#060d1f",
          900: "#08112a",
          800: "#0a1530",
          700: "#15254a",
          600: "#223566",
          100: "#e4e8f1",
          50: "#f1f3f8",
        },
        accent: {
          DEFAULT: "#c8102e",
          dark: "#a50d25",
          light: "#fdecee",
          soft: "#f7cdd3",
        },
        peach: {
          DEFAULT: "#c8102e",
          dark: "#a50d25",
          light: "#fdecee",
        },
        brand: {
          DEFAULT: "#2a4f9a",
          dark: "#1f3d7a",
          light: "#edf2fb",
        },
        trust: {
          DEFAULT: "#1f7a52",
          light: "#eaf4ee",
        },
        ink: {
          DEFAULT: "#1f2329",
          muted: "#4e5663",
          soft: "#7a8290",
        },
        line: {
          DEFAULT: "#e2e6ee",
          strong: "#cfd6e2",
        },
        canvas: "#f4f6fa",
        paper: "#f9fafc",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", '"Segoe UI"', "Roboto", "Arial", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)",
        lift: "0 12px 32px -12px rgba(16,24,40,0.22)",
        pop: "0 20px 48px -16px rgba(10,21,48,0.35)",
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
    },
  },
};

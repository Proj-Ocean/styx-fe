import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ["var(--font-sans)", ...fontFamily.sans],
      "sf-pro-display": ["SF Pro Display", "sans-serif"],
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    fontSize: {
      tableHead: ["12px", "1.2"],
      label: ["12px", "1.66"],
      rank: ["14px", "1.4"],
      small: ["14px", "1.4"],
      body: ["16px", "1.4"],
      tab: ["24px", "1.2"],
      heading1: ["58px", "1.2"],
      heading2: ["36px", "1.2"],
      heading3: ["32px", "1.25"],
      heading4: ["24px", "1.25"],
    },
    height: {
      header: "72px",
    },
    colors: {
      primary: "#C7B27F",
      tableBg: "#FBFAF1",
      tableBorder: "#C7B27F",
      lose: "#FE7051",
      win: "#C7FE51",
      card: {
        DEFAULT: "#141414",
        gray: "#2D2D2D",
        black: "#0F0F0F",
      },
      button: {
        pill: "#202020",
        secondary: "#313131",
      },
      content: {
        primary: "#ffffff",
        onBrand: "#000",
        pink: "#FF108D",
      },
      dialog: {
        content: "#1A1A1A",
      },
      brand: {
        DEFAULT: "#C7FE51",
      },
      blastoff: {
        black: {
          primary: "#0D0D0D",
        },
        green: {
          primary: "#CDFE62",
          secondary: "#182808",
          tertiary: "#3B5600",
        },
        gray: {
          primary: "#C8C8C8",
        },
      },
    },
  },
  plugins: [],
};
export default config;

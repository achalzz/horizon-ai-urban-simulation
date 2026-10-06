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
        bgDark: "#090d16",
        cardDark: "#111726",
        panelDark: "#172033",
        borderDark: "#232e47",
        primaryEmerald: "#10b981",
        accentTeal: "#14b8a6",
        negativeRed: "#f43f5e",
        warningAmber: "#f59e0b",
        cyanBuffer: "#06b6d4",
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        marquee: 'marquee 30s linear infinite',
        slowspin: "spin 6s linear infinite"
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' }, // Move by half (since we duplicated)
        },
      },
    },
  },
  plugins: [],
}
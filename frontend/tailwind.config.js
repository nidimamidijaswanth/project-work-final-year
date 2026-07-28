/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        ink: '#07070c',
        pulse: '#ff5a1f',
        aqua: '#ff8a00',
        volt: '#ffcf33',
        royal: '#c2410c',
        solar: '#f97316',
      },
      boxShadow: {
        glow: '0 0 48px rgba(249, 115, 22, 0.34)',
        hot: '0 0 58px rgba(255, 90, 31, 0.35)',
      },
      animation: {
        marquee: 'marquee 24s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};

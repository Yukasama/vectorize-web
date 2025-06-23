import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/components/**/*.{tsx}',
    './src/app/**/*.{tsx}',
    './src/features/**/*.{tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'scroll-bar': 'scroll-bar 1.5s linear infinite',
      },
      keyframes: {
        'scroll-bar': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(300%)' },
        },
      },
    },
  },
};

export default config;

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/components/**/*.{tsx}',
    './src/app/**/*.{tsx}',
    './src/features/**/*.{tsx}',
  ],
  darkMode: 'class',
};

export default config;

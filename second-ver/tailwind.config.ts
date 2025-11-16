import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './app/style.css', './app/styles/**/*.css'],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;

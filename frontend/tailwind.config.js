/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Main background - Dark Gray
        'bg-dark': '#4A4A4A',
        'bg-darker': '#3A3A3A',
        'bg-light': '#F5F5F5',

        // Sidebar - Red (matching design)
        sidebar: {
          DEFAULT: '#FF6767',
          dark: '#E63939',
          hover: '#FF8787',
          light: '#FFB6B6',
        },

        // Primary coral/salmon for buttons and accents
        primary: {
          DEFAULT: '#FF8787',
          light: '#FFB6B6',
          dark: '#FF6767',
          accent: '#F24E1E',
          50: '#FFF5F5',
          100: '#FFE5E5',
          200: '#FFD4D4',
          300: '#FFB6B6',
          400: '#FF8787',
          500: '#FF6767',
          600: '#FF4D4D',
          700: '#E63939',
          800: '#CC2E2E',
          900: '#B32424',
        },

        // Secondary colors
        secondary: {
          blue: {
            DEFAULT: '#4A90E2',
            light: '#6BA3E8',
            dark: '#357ABD',
            50: '#EBF4FD',
            100: '#D6E9FB',
            200: '#B3D3F7',
            300: '#80B8F0',
            400: '#4A90E2',
            500: '#357ABD',
            600: '#2A5F94',
            700: '#1F456B',
            800: '#152B42',
            900: '#0A1119',
          },
          purple: {
            DEFAULT: '#9B59B6',
            light: '#B77BC8',
            dark: '#7D3C98',
            50: '#F4ECF7',
            100: '#E8D9EF',
            200: '#D1B3DF',
            300: '#BA8DCF',
            400: '#9B59B6',
            500: '#7D3C98',
            600: '#5E2D6F',
            700: '#3F1E47',
            800: '#1F0F23',
            900: '#0F0712',
          },
        },

        // Neutral colors for text and borders
        neutral: {
          text: '#1F2937',
          'text-muted': '#6B7280',
          'text-light': '#9CA3AF',
          border: '#E5E7EB',
          bg: '#F9FAFB',
          'bg-dark': '#F3F4F6',
        },

        // Status colors
        status: {
          completed: '#04C400',
          progress: '#4A90E2',
          'not-started': '#FF6767',
          warning: '#FFA500',
          info: '#4A90E2',
        },

        // Text colors
        text: {
          primary: '#FFFFFF',
          secondary: '#A1A3AB',
          dark: '#000000',
          muted: '#6B7280',
          light: '#9CA3AF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'strong': '0 8px 24px rgba(0, 0, 0, 0.16)',
      },
    },
  },
  plugins: [],
}

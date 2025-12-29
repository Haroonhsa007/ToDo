/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Main background colors
        'bg-main': '#F5F8FF',
        'bg-light': '#F8F8F8',
        'bg-white': '#FFFFFF',

        // Sidebar - Coral/Salmon (matching design)
        sidebar: {
          DEFAULT: '#FF6767',
          dark: '#F24E1E',
          hover: '#FF8787',
          light: '#FFB6B6',
        },

        // Primary coral for buttons, underlines, accents
        primary: {
          DEFAULT: '#FF6767',
          light: '#FF8787',
          dark: '#F24E1E',
          hover: '#E55A5A',
        },

        // Status colors (exact from design)
        status: {
          'not-started': '#F21E1E',  // Red
          'progress': '#0225FF',      // Blue
          'completed': '#05A301',     // Green
        },

        // Priority colors (exact from design)
        priority: {
          'extreme': '#F21E1E',       // Red
          'moderate': '#0225FF',      // Blue  
          'low': '#05A301',           // Green
        },

        // Text colors
        neutral: {
          'text': '#000000',          // Black
          'text-secondary': '#747474', // Dark gray
          'text-muted': '#A1A3AB',    // Gray
          'text-light': '#D9D9D9',    // Light gray
          'border': '#D9D9D9',        // Border gray
          'bg': '#F8F8F8',            // Light background
        },

        // Additional colors from design
        'link-blue': '#008BD9',
        'calendar-purple': '#5B5FC7',
        'orange-accent': '#FF9090',
        'add-icon': '#FF4C23',

        // Legacy compatibility
        text: {
          primary: '#FFFFFF',
          secondary: '#A1A3AB',
          dark: '#000000',
          muted: '#A1A3AB',
          light: '#D9D9D9',
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

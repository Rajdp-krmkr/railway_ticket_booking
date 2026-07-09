/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        railway: {
          light: '#f8fafc',
          blue: '#1d4ed8',     // Royal Blue primary
          darkBlue: '#1e3a8a', // Deep navy
          dark: '#0f172a',     // Slate-900 background/text
          gray: '#64748b',     // Slate-500 mute text
          steel: '#f1f5f9'     // Slate-100 borders/cards
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}

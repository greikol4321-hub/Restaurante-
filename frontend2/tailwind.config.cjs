/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#000000',
          light: '#121212',
          dark: '#000000',
          gradient: 'linear-gradient(to right, #000000, #1a1a1a)',
        },
        accent: {
          DEFAULT: '#d4af37',
          light: '#ffd700',
          dark: '#c5a028',
          gradient: 'linear-gradient(to right, #d4af37, #c5a028)',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#d4af37',
          muted: '#888888',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-serif'],
      },
      boxShadow: {
        'gold-sm': '0 2px 4px rgba(255,215,0,0.1)',
        'gold': '0 4px 6px rgba(255,215,0,0.15)',
        'gold-lg': '0 10px 15px rgba(255,215,0,0.2)',
        'gold-xl': '0 15px 25px rgba(255,215,0,0.25)',
        'gold-inner': 'inset 0 2px 4px rgba(255,215,0,0.1)',
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(to right, #000000, #d4af37)',
        'gradient-radial': 'radial-gradient(circle at center, #d4af37 0%, #000000 100%)',
        'gradient-shine': 'linear-gradient(45deg, transparent 25%, rgba(212, 175, 55, 0.1) 50%, transparent 75%)',
        'gradient-dark': 'linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.95))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
        'scale-in': 'scaleIn 0.5s ease-in-out',
        'shine': 'shine 2s infinite linear',
        'glow-pulse': 'glowPulse 2s infinite ease-in-out',
        'float': 'float 6s infinite ease-in-out',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shine: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        glowPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.2)',
            borderColor: 'rgba(212, 175, 55, 0.3)'
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(212, 175, 55, 0.4)',
            borderColor: 'rgba(212, 175, 55, 0.5)'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
          '50%': { boxShadow: '0 0 30px rgba(0,180,216,0.2)' },
        },
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0,180,216,0.1)',
        'glow': '0 0 20px rgba(0,180,216,0.2)',
      },
    },
  }
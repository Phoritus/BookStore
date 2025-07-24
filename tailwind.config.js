/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Book Café Custom Color Palette
        cream: {
          50: '#FDFCF8',
          100: '#F5F2E8',
          200: '#EDE7D3',
          300: '#E4DCBE',
          400: '#DCD2A9',
          500: '#D3C794',
          600: '#C4B67E',
          700: '#B4A569',
          800: '#A49454',
          900: '#94833F',
        },
        brown: {
          50: '#FAF6F2',
          100: '#F0E6D6',
          200: '#E1CCAD',
          300: '#D1B284',
          400: '#C2985B',
          500: '#B37E32',
          600: '#9A6A2B',
          700: '#815624',
          800: '#68421D',
          900: '#4F2E16',
        },
        darkBrown: {
          50: '#F7F3F0',
          100: '#E8DDD6',
          200: '#D1BAAD',
          300: '#BA9784',
          400: '#A3745B',
          500: '#8B4513', // Primary brown
          600: '#793D10',
          700: '#67350E',
          800: '#552D0B',
          900: '#432509',
        },
        gold: {
          50: '#FEFCF3',
          100: '#FDF5D7',
          200: '#FBEBAF',
          300: '#F9E187',
          400: '#F7D75F',
          500: '#DAA520', // Primary gold
          600: '#C8941D',
          700: '#B6831A',
          800: '#A47217',
          900: '#926114',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Playfair Display', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(139, 69, 19, 0.1)',
        'warm': '0 8px 32px rgba(218, 165, 32, 0.2)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#F4F7F4',
          100: '#E5EDE5',
          200: '#CADAC9',
          300: '#AEC7AD',
          400: '#8FA58F',
          500: '#5F7C60',
          600: '#4A624B',
          700: '#384B39',
          800: '#2C3E2D',
          900: '#1C271D',
          950: '#12251A',
        },
        clay: {
          50: '#FAF5F2',
          100: '#F4E8E3',
          200: '#E8CEC3',
          300: '#DCB3A3',
          400: '#CE937E',
          500: '#C76546',
          600: '#A95133',
          700: '#853E26',
          800: '#642E1C',
          900: '#352820',
        },
        earth: {
          cream: '#F7F2E7',
          surface: '#FFFCF5',
          softsage: '#EDF1E6',
          linen: '#EFECE4',
          sand: '#DFD9CB',
          border: '#DED7C8',
          espresso: '#352820',
          forest: '#12251A',
          primary: '#25261F',
          secondary: '#6C665C',
        }
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-plus-jakarta)', 'Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'float-slow': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
};

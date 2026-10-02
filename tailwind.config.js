/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FDF7F7',
          100: '#FBEBEB',
          200: '#F5D0D2',
          300: '#ECA9AD',
          400: '#DD6D73',
          500: '#C73841',
          600: '#A4232C',
          700: '#7E171E',
          800: '#641318', // Nusantara Primary Maroon
          900: '#4D0E13',
          950: '#2E0609',
        },
        gold: {
          50: '#FAF7EE',
          100: '#F4ECD4',
          200: '#E9D6A3',
          300: '#DCBD71',
          400: '#CFA748',
          500: '#B88E30',
          600: '#946E22',
          700: '#71521B',
          800: '#543D17',
          900: '#3D2C13',
        },
        cream: {
          50: '#FCFBF9',
          100: '#F7F4EE',
          200: '#EEE7DB',
          300: '#E1D6C3',
          400: '#CFC0A7',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.04), 0 8px 30px rgba(0, 0, 0, 0.04)',
        'elevated': '0 4px 20px -2px rgba(100, 19, 24, 0.08), 0 12px 32px -4px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        'dm-sans': ['DM Sans', 'sans-serif'],
      },
      fontWeight: {
        'thin': 100,
      },
      backgroundColor: {
        'primary-100': 'rgb(68, 200, 245)',
        'primary-200': 'rgb(68, 200, 245)',
        'primary-300': 'rgb(0, 112, 255)',
        'primary-400': 'rgb(0, 112, 255)',
        'primary-500': 'rgb(0, 112, 255)', 
        'primary-600': 'rgb(0, 30,180)',
        'primary-700': 'rgb(0, 0, 90)',  // Ajustado para ser más oscuro
        'primary-800': 'rgb(0, 35, 85)',   // Ajustado para ser más oscuro
        'primary-900': 'rgb(0, 25, 65)',   // Ajustado para ser más oscuro
      },
      
      colors: {
        'primary-50': 'rgb(var(--primary-50))',
        'primary-100': 'rgb(68, 200, 245)',
        'primary-200': 'rgb(68, 200, 245)',
        'primary-300': 'rgb(0, 112, 255)',
        'primary-400': 'rgb(0, 112, 255)',
        'primary-500': 'rgb(0, 112, 255)',
        'primary-600': 'rgb(0, 30,180)',
        'primary-700': 'rgb(0, 0, 90)',
        'primary-800': 'rgb(var(--primary-800))',
        'primary-900': 'rgb(var(--primary-900))',
        'primary-950': 'rgb(var(--primary-950))',
        'surface-0': 'rgb(var(--surface-0))',
        'surface-50': 'rgb(var(--surface-50))',
        'surface-100': 'rgb(var(--surface-100))',
        'surface-200': 'rgb(var(--surface-200))',
        'surface-300': 'rgb(var(--surface-300))',
        'surface-400': 'rgb(var(--surface-400))',
        'surface-500': 'rgb(var(--surface-500))',
        'surface-600': 'rgb(var(--surface-600))',
        'surface-700': 'rgb(var(--surface-700))',
        'surface-800': 'rgb(var(--surface-800))',
        'surface-900': 'rgb(var(--surface-900))',
        'surface-950': 'rgb(var(--surface-950))'
    }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),

  ],
}
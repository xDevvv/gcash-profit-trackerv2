/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './resources/**/*.blade.php',
    './resources/**/*.tsx',
    './resources/**/*.ts',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Baloo 2"', 'ui-rounded', 'system-ui', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        clay: {
          bg: 'var(--clay-bg)',
          bgAlt: 'var(--clay-bg-alt)',
          surface: 'var(--clay-surface)',
          primary: 'var(--clay-primary)',
          primarySoft: 'var(--clay-primary-soft)',
          secondary: 'var(--clay-secondary)',
          secondarySoft: 'var(--clay-secondary-soft)',
          success: 'var(--clay-success)',
          successSoft: 'var(--clay-success-soft)',
          danger: 'var(--clay-danger)',
          text: 'var(--clay-text)',
          textSoft: 'var(--clay-text-soft)',
          textFaint: 'var(--clay-text-faint)',
        },
      },
      borderRadius: {
        clay: '28px',
        'clay-sm': '18px',
      },
    },
  },
  plugins: [],
};

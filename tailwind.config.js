// Semantic tokens are defined as RGB triplets in app/globals.css (light on
// :root, dark on .dark) so every utility keeps Tailwind's alpha modifier.
// Mirrors the forcecalendar.org design system.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Surfaces
        surface: token('surface'),
        raised: token('surface-raised'),
        sunken: token('surface-sunken'),
        // Borders
        hairline: token('hairline'),
        line: token('line'),
        // Text
        fg: token('fg'),
        muted: token('fg-muted'),
        subtle: token('fg-subtle'),
        // Accent (one hue, everywhere)
        accent: {
          DEFAULT: token('accent'),
          hover: token('accent-hover'),
          fg: token('accent-fg'),
          text: token('accent-text'),
          soft: token('accent-soft'),
          line: token('accent-line'),
        },
        ring: token('ring'),
        // Status hues for severity / state pills
        ok: { DEFAULT: token('ok'), soft: token('ok-soft'), line: token('ok-line') },
        warn: { DEFAULT: token('warn'), soft: token('warn-soft'), line: token('warn-line') },
        bad: { DEFAULT: token('bad'), soft: token('bad-soft'), line: token('bad-line') },
        // Code windows
        code: {
          bg: token('code-bg'),
          chrome: token('code-chrome'),
          border: token('code-border'),
          fg: token('code-fg'),
          muted: token('code-muted'),
        },
        brand: {
          50: '#eef3ff',
          100: '#dbe5ff',
          200: '#bccfff',
          300: '#8faeff',
          400: '#5c84ff',
          500: '#3563f5',
          600: '#2448e0',
          700: '#1d38b8',
          800: '#1b3194',
          900: '#1b2c75',
          950: '#111b47',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['var(--font-display)', 'Instrument Sans', 'var(--font-inter)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'monospace'],
      },
      fontSize: {
        'display-xl': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '600' }],
        'display-lg': ['2.75rem', { lineHeight: '1.1', letterSpacing: '-0.028em', fontWeight: '600' }],
        'display-md': ['2rem', { lineHeight: '1.15', letterSpacing: '-0.024em', fontWeight: '600' }],
        'display-sm': ['1.5rem', { lineHeight: '1.25', letterSpacing: '-0.02em', fontWeight: '600' }],
      },
      borderRadius: {
        sm: '0.375rem',
        DEFAULT: '0.5rem',
        md: '0.625rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        'elev-1': '0 1px 2px rgb(15 20 30 / 0.04), 0 1px 3px rgb(15 20 30 / 0.03)',
        'elev-2': '0 2px 4px rgb(15 20 30 / 0.04), 0 8px 24px -8px rgb(15 20 30 / 0.10)',
        'elev-3': '0 4px 8px rgb(15 20 30 / 0.05), 0 24px 48px -16px rgb(15 20 30 / 0.18)',
        'inner-hi': 'inset 0 1px 0 rgb(255 255 255 / 0.06)',
      },
      maxWidth: {
        page: '72rem',
        prose: '44rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideIn: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } },
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};

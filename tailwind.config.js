/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        vibe: {
          50:  '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        neon: {
          purple: '#bf5dfa',
          pink:   '#e040fb',
          cyan:   '#22d3ee',
        },
        dark: {
          base:   '#080810',
          surface:'#0e0e1c',
          card:   '#13132a',
          border: '#1e1e3a',
          muted:  '#2a2a4a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'neon-sm': '0 0 8px 2px rgba(168, 85, 247, 0.35)',
        'neon':    '0 0 16px 4px rgba(168, 85, 247, 0.45)',
        'neon-lg': '0 0 32px 8px rgba(168, 85, 247, 0.55)',
        'neon-pink': '0 0 16px 4px rgba(224, 64, 251, 0.45)',
        glow:     '0 0 40px 10px rgba(168, 85, 247, 0.2)',
      },
      animation: {
        'pulse-slow':    'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in':       'fadeIn 0.5s ease-in-out',
        'slide-up':      'slideUp 0.4s ease-out',
        'ripple':        'ripple 2s linear infinite',
        'glow-pulse':    'glowPulse 2.5s ease-in-out infinite',
        'float':         'float 6s ease-in-out infinite',
        'spin-slow':     'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        ripple: {
          '0%':   { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 16px 4px rgba(168, 85, 247, 0.45)' },
          '50%':      { boxShadow: '0 0 32px 10px rgba(168, 85, 247, 0.7)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
      },
      backgroundImage: {
        'vibe-radial': 'radial-gradient(ellipse at 50% 0%, rgba(168,85,247,0.15) 0%, transparent 70%)',
        'vibe-mesh':   'radial-gradient(at 40% 20%, rgba(168,85,247,0.12) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(224,64,251,0.08) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(34,211,238,0.05) 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
};

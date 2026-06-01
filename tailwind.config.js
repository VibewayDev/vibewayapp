/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Night palette (default / dark mode)
        night: {
          base:    '#04091a',
          deep:    '#060d24',
          surface: '#0a1530',
          card:    '#0d1c3f',
          border:  '#1a2d55',
          muted:   '#243a68',
        },
        // Day palette
        day: {
          base:    '#f0f4ff',
          surface: '#e8edf9',
          card:    '#ffffff',
          border:  '#d1d9f0',
          muted:   '#a8b4d8',
          text:    '#1a2340',
        },
        // Radar / accent colors
        radar: {
          gold:    '#f5a623',
          amber:   '#f59e0b',
          orange:  '#ea580c',
          neon:    '#00e5ff',
          green:   '#00ff9d',
          red:     '#ff3b5c',
        },
        vibe: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'radar':       '0 0 60px 20px rgba(245,166,35,0.15)',
        'radar-ring':  '0 0 0 1px rgba(245,166,35,0.25)',
        'neon-gold':   '0 0 12px 3px rgba(245,166,35,0.5)',
        'neon-teal':   '0 0 12px 3px rgba(0,229,255,0.4)',
        'neon-red':    '0 0 16px 4px rgba(255,59,92,0.6)',
        'avatar':      '0 0 0 2px rgba(245,166,35,0.6), 0 0 12px rgba(245,166,35,0.3)',
        'card-night':  '0 4px 24px rgba(0,0,0,0.5)',
        'card-day':    '0 4px 24px rgba(0,0,0,0.08)',
        'sos':         '0 0 24px 6px rgba(255,59,92,0.7)',
      },
      animation: {
        'radar-spin':   'radarSpin 4s linear infinite',
        'radar-pulse':  'radarPulse 2.5s ease-in-out infinite',
        'ping-slow':    'ping 2.5s cubic-bezier(0,0,0.2,1) infinite',
        'ping-slower':  'ping 3.5s cubic-bezier(0,0,0.2,1) infinite',
        'fade-in':      'fadeIn 0.4s ease-out',
        'slide-up':     'slideUp 0.35s ease-out',
        'slide-in-right':'slideInRight 0.3s ease-out',
        'sos-flash':    'sosFlash 0.5s ease-in-out infinite',
        'float':        'float 5s ease-in-out infinite',
        'glow-pulse':   'glowPulse 2s ease-in-out infinite',
        'beacon':       'beacon 2s ease-in-out infinite',
      },
      keyframes: {
        radarSpin: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        radarPulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        sosFlash: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 12px 3px rgba(245,166,35,0.4)' },
          '50%':      { boxShadow: '0 0 24px 8px rgba(245,166,35,0.7)' },
        },
        beacon: {
          '0%':   { transform: 'scale(1)',   opacity: '0.8' },
          '50%':  { transform: 'scale(1.15)', opacity: '1' },
          '100%': { transform: 'scale(1)',   opacity: '0.8' },
        },
      },
      backgroundImage: {
        'radar-gradient':  'radial-gradient(ellipse at center, rgba(245,166,35,0.08) 0%, transparent 70%)',
        'night-gradient':  'radial-gradient(ellipse at 50% 30%, rgba(10,30,70,1) 0%, rgba(4,9,26,1) 100%)',
        'day-gradient':    'radial-gradient(ellipse at 50% 30%, rgba(220,230,255,1) 0%, rgba(240,244,255,1) 100%)',
        'gold-gradient':   'linear-gradient(135deg, #f5a623, #f59e0b)',
        'danger-gradient': 'linear-gradient(135deg, #ff3b5c, #ff6b35)',
      },
    },
  },
  plugins: [],
};

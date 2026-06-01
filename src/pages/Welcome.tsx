import { useNavigate } from 'react-router-dom';
import { ArrowRight, Radar, Shield, Zap } from 'lucide-react';
import Logo from '../components/Logo';
import { useTheme } from '../lib/timeTheme';

export default function Welcome() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isNight = theme === 'night';

  return (
    <div
      className={`min-h-screen flex flex-col overflow-hidden transition-colors duration-700 ${
        isNight ? 'bg-night-base' : 'bg-day-base'
      }`}
    >
      {/* Radar bg decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {[300, 220, 140, 70].map((r, i) => (
            <div
              key={r}
              className="absolute rounded-full border"
              style={{
                width: r * 2, height: r * 2,
                top: -r, left: -r,
                borderColor: isNight
                  ? `rgba(245,166,35,${0.04 + i * 0.03})`
                  : `rgba(180,100,0,${0.05 + i * 0.03})`,
              }}
            />
          ))}
        </div>
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
          <defs>
            <pattern id="wgrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke={isNight ? '#f5a623' : '#92400e'} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wgrid)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 items-center justify-center px-6 text-center">
        <div className="animate-float mb-8">
          <Logo size={72} />
        </div>

        <h1 className={`text-4xl font-bold mb-2 ${isNight ? 'text-white' : 'text-day-text'}`}>
          vibe<span className={isNight ? 'text-radar-gold' : 'text-amber-600'}>way</span>
        </h1>
        <p className={`text-lg font-medium mb-2 ${isNight ? 'text-radar-gold/80' : 'text-amber-600/80'}`}>
          Match en tiempo real para viajeros
        </p>
        <p className={`text-sm leading-relaxed max-w-xs mb-10 ${isNight ? 'text-slate-400' : 'text-slate-500'}`}>
          Descubre quién viaja en tu mismo medio de transporte y conecta de forma segura.
        </p>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-xs mb-10">
          {[
            { icon: Radar,  label: 'Radar en vivo' },
            { icon: Shield, label: 'Privacidad total' },
            { icon: Zap,    label: 'Conexión instant.' },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl border ${
                isNight ? 'bg-night-card border-night-border' : 'bg-white border-day-border shadow-card-day'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isNight ? 'bg-radar-gold/15' : 'bg-amber-100'
              }`}>
                <Icon size={16} className={isNight ? 'text-radar-gold' : 'text-amber-600'} />
              </div>
              <span className={`text-[10px] font-medium text-center leading-tight ${isNight ? 'text-slate-400' : 'text-slate-500'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/radar')}
          className="group flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base text-night-base transition-all active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #f5a623, #ea580c)',
            boxShadow: isNight ? '0 0 24px 6px rgba(245,166,35,0.35)' : '0 4px 20px rgba(245,166,35,0.4)',
          }}
        >
          Abrir Radar
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <p className={`mt-6 text-xs ${isNight ? 'text-slate-600' : 'text-slate-400'}`}>
          Sin registro · Sin tracking permanente
        </p>
      </div>

      <div className={`relative z-10 py-5 text-center text-[10px] ${isNight ? 'text-slate-700' : 'text-slate-400'}`}>
        © 2026 vibeway · Hecho para los que se mueven
      </div>
    </div>
  );
}

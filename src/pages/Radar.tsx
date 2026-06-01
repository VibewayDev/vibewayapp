import { useState, useEffect, useRef } from 'react';
import { Pencil, Check, MapPin, Navigation } from 'lucide-react';
import { connectivity, type NearbyTraveler } from '../lib/connectivity';
import { useTheme } from '../lib/timeTheme';
import { useProfile } from '../lib/profileContext';
import type { VisibilityMode } from '../lib/connectivity';

const TRANSPORT_ICONS: Record<string, string> = {
  bus: '🚌', metro: '🚇', train: '🚆', tram: '🚃', ferry: '⛴️', car: '🚗', walking: '🚶',
};

function HexAvatar({
  initial, color, size = 52, glow = false, label,
}: {
  initial: string; color: string; size?: number; glow?: boolean; label?: string;
}) {
  const s = size;
  const h = s * 0.866;
  return (
    <div className="flex flex-col items-center gap-1" style={{ width: s }}>
      <div className="relative" style={{ width: s, height: h }}>
        <svg width={s} height={h} viewBox={`0 0 ${s} ${h}`} className="absolute inset-0">
          <defs>
            <linearGradient id={`hg-${initial}-${size}`} x1="0" y1="0" x2={s} y2={h} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(245,166,35,0.5)" />
              <stop offset="100%" stopColor="rgba(245,166,35,0.15)" />
            </linearGradient>
          </defs>
          <polygon
            points={`${s/2},0 ${s},${h*0.25} ${s},${h*0.75} ${s/2},${h} 0,${h*0.75} 0,${h*0.25}`}
            fill={`url(#hg-${initial}-${size})`}
            stroke="rgba(245,166,35,0.7)"
            strokeWidth={glow ? 1.5 : 1}
          />
        </svg>
        <div
          className={`absolute inset-0 flex items-center justify-center rounded-sm bg-gradient-to-br ${color} text-white font-bold`}
          style={{
            clipPath: `polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)`,
            fontSize: s * 0.3,
            boxShadow: glow ? '0 0 12px rgba(245,166,35,0.6)' : undefined,
          }}
        >
          {initial}
        </div>
      </div>
      {label && (
        <span className="text-[9px] font-medium text-radar-gold/80 truncate max-w-full px-1 text-center leading-tight">
          {label}
        </span>
      )}
    </div>
  );
}

const VISIBILITY_OPTIONS: { value: VisibilityMode; label: string; desc: string; color: string }[] = [
  { value: 'public',  label: 'PÚBLICO',  desc: 'Visible en el radar',     color: 'text-radar-green' },
  { value: 'enigma',  label: 'ENIGMA',   desc: 'Sin nombre ni estado',    color: 'text-radar-gold' },
  { value: 'off',     label: 'APAGADO',  desc: 'Invisible para todos',    color: 'text-slate-400' },
];

export default function RadarPage() {
  const { theme, hour, setSimHour, simHour } = useTheme();
  const { profile, setMood, setVisibility } = useProfile();
  const [travelers, setTravelers]   = useState<NearbyTraveler[]>([]);
  const [editingMood, setEditingMood] = useState(false);
  const [moodDraft, setMoodDraft]   = useState(profile.moodStatus);
  const [selected, setSelected]     = useState<NearbyTraveler | null>(null);
  const [showSimBar, setShowSimBar] = useState(false);
  const radarRef = useRef<HTMLDivElement>(null);
  const isNight  = theme === 'night';

  useEffect(() => {
    connectivity.start();
    const unsub = connectivity.onTravelers(setTravelers);
    return () => { unsub(); connectivity.stop(); };
  }, []);

  function saveMood() {
    setMood(moodDraft);
    setEditingMood(false);
  }

  const visibleTravelers = travelers.filter((t) =>
    profile.visibility !== 'off' && t.visibility !== 'off'
  );

  return (
    <div
      className={`relative flex flex-col min-h-screen overflow-hidden transition-colors duration-700 ${
        isNight ? 'bg-night-base' : 'bg-day-base'
      }`}
    >
      {/* ── STREET MAP BACKGROUND ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Grid street-map effect */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-major" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke={isNight ? '#f5a623' : '#92400e'} strokeWidth="0.8" />
            </pattern>
            <pattern id="grid-minor" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke={isNight ? '#f5a623' : '#92400e'} strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-minor)" />
          <rect width="100%" height="100%" fill="url(#grid-major)" />
        </svg>

        {/* Diagonal "streets" */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
          {[...Array(8)].map((_, i) => (
            <line
              key={i}
              x1={i * 80 - 40} y1="0"
              x2={i * 80 + 200} y2="100%"
              stroke={isNight ? '#f5a623' : '#92400e'}
              strokeWidth="0.6"
            />
          ))}
        </svg>

        {/* Ambient glow center */}
        <div
          className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{
            width: 420, height: 420,
            background: isNight
              ? 'radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* ── TOP BAR ── */}
      <header className="relative z-10 flex items-center justify-between px-4 pt-12 pb-3">
        <div className="flex items-center gap-2">
          <Navigation size={14} className={isNight ? 'text-radar-gold' : 'text-amber-600'} />
          <span className={`text-xs font-mono ${isNight ? 'text-radar-gold/70' : 'text-amber-700/80'}`}>
            {profile.route}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={13} className={isNight ? 'text-night-muted' : 'text-day-muted'} />
          <span className={`text-[10px] font-mono ${isNight ? 'text-night-muted' : 'text-day-muted'}`}>
            {visibleTravelers.length} cerca
          </span>
          <button
            onClick={() => setShowSimBar((v) => !v)}
            className={`ml-2 text-[9px] px-2 py-0.5 rounded-full border font-mono ${
              isNight
                ? 'border-night-border text-slate-500 hover:text-radar-gold hover:border-radar-gold/40'
                : 'border-day-border text-slate-400 hover:text-amber-600'
            } transition-colors`}
          >
            SIM
          </button>
        </div>
      </header>

      {/* ── HOUR SIMULATOR ── */}
      {showSimBar && (
        <div className={`relative z-10 mx-4 mb-2 px-4 py-3 rounded-xl border flex items-center gap-3 ${
          isNight ? 'bg-night-card border-night-border' : 'bg-white border-day-border'
        }`}>
          <span className={`text-xs font-medium ${isNight ? 'text-slate-400' : 'text-slate-500'}`}>
            Hora: {simHour ?? hour}:00
          </span>
          <input
            type="range" min={0} max={23} step={1}
            value={simHour ?? hour}
            onChange={(e) => setSimHour(Number(e.target.value))}
            className="flex-1 accent-amber-500 h-1.5"
          />
          <button
            onClick={() => setSimHour(null)}
            className="text-[10px] text-amber-500 hover:text-amber-400 font-medium"
          >
            Real
          </button>
        </div>
      )}

      {/* ── MOOD STATUS BOX ── */}
      <div className="relative z-10 mx-4 mb-3">
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${
            isNight
              ? 'bg-night-card/80 border-night-border backdrop-blur-sm'
              : 'bg-white/80 border-day-border backdrop-blur-sm shadow-card-day'
          }`}
        >
          <div className="flex-shrink-0">
            <HexAvatar initial={profile.avatarInitial} color={profile.avatarColor} size={38} glow />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-[9px] font-bold tracking-widest mb-1 ${isNight ? 'text-radar-gold/60' : 'text-amber-600/70'}`}>
              TU SENTIR HOY
            </p>
            {editingMood ? (
              <input
                autoFocus
                value={moodDraft}
                onChange={(e) => setMoodDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveMood()}
                maxLength={60}
                className={`w-full text-sm font-medium bg-transparent border-b outline-none ${
                  isNight ? 'text-white border-radar-gold/50' : 'text-day-text border-amber-400/60'
                }`}
              />
            ) : (
              <p
                className={`text-sm font-medium truncate ${isNight ? 'text-white' : 'text-day-text'}`}
              >
                {profile.moodStatus || <span className="opacity-40 italic text-xs">Escribe tu estado...</span>}
              </p>
            )}
          </div>
          <button
            onClick={() => editingMood ? saveMood() : setEditingMood(true)}
            className={`flex-shrink-0 p-1.5 rounded-lg transition-all ${
              isNight ? 'text-radar-gold/60 hover:text-radar-gold hover:bg-radar-gold/10' : 'text-amber-500 hover:bg-amber-50'
            }`}
          >
            {editingMood ? <Check size={15} /> : <Pencil size={13} />}
          </button>
        </div>
      </div>

      {/* ── RADAR CANVAS ── */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-2">
        <div
          ref={radarRef}
          className="relative w-full"
          style={{ maxWidth: 340, aspectRatio: '1 / 1' }}
        >
          {/* Radar rings */}
          {[1, 0.66, 0.33].map((scale, i) => (
            <div
              key={i}
              className="absolute rounded-full border pointer-events-none"
              style={{
                width:  `${scale * 100}%`,
                height: `${scale * 100}%`,
                top:    `${(1 - scale) / 2 * 100}%`,
                left:   `${(1 - scale) / 2 * 100}%`,
                borderColor: isNight
                  ? `rgba(245,166,35,${0.12 + i * 0.08})`
                  : `rgba(180,120,20,${0.10 + i * 0.06})`,
                boxShadow: i === 0 && isNight ? '0 0 40px 4px rgba(245,166,35,0.06)' : undefined,
              }}
            />
          ))}

          {/* Radar sweep arm */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden pointer-events-none animate-radar-spin"
            style={{ transformOrigin: 'center' }}
          >
            <div
              className="absolute top-0 left-1/2 w-px origin-bottom"
              style={{
                height: '50%',
                background: isNight
                  ? 'linear-gradient(to top, rgba(245,166,35,0.8), transparent)'
                  : 'linear-gradient(to top, rgba(245,140,0,0.6), transparent)',
              }}
            />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: isNight
                  ? 'conic-gradient(from 0deg, rgba(245,166,35,0.18) 0deg, transparent 70deg)'
                  : 'conic-gradient(from 0deg, rgba(245,140,0,0.12) 0deg, transparent 70deg)',
              }}
            />
          </div>

          {/* Cross-hair lines */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-0 right-0 h-px" style={{ background: isNight ? 'rgba(245,166,35,0.08)' : 'rgba(180,120,0,0.07)' }} />
            <div className="absolute left-1/2 top-0 bottom-0 w-px"  style={{ background: isNight ? 'rgba(245,166,35,0.08)' : 'rgba(180,120,0,0.07)' }} />
          </div>

          {/* Center dot — YOU */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-full animate-ping-slow pointer-events-none"
                style={{ background: 'rgba(245,166,35,0.12)' }}
              />
              <HexAvatar
                initial={profile.avatarInitial}
                color={profile.avatarColor}
                size={48}
                glow
              />
            </div>
          </div>

          {/* Traveler dots */}
          {visibleTravelers.map((t) => {
            const cx = 50 + t.radarX * 46;
            const cy = 50 + t.radarY * 46;
            const isEnigma = t.visibility === 'enigma';
            return (
              <button
                key={t.id}
                onClick={() => setSelected(selected?.id === t.id ? null : t)}
                className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700"
                style={{ left: `${cx}%`, top: `${cy}%` }}
              >
                <HexAvatar
                  initial={isEnigma ? '?' : t.avatarInitial}
                  color={isEnigma ? 'from-slate-600 to-slate-700' : t.avatarColor}
                  size={34}
                  label={isEnigma ? '~enigma' : `@${t.username}`}
                />
              </button>
            );
          })}

          {/* Distance labels */}
          {[165, 330, 500].map((m, i) => (
            <span
              key={m}
              className={`absolute font-mono text-[8px] pointer-events-none ${
                isNight ? 'text-radar-gold/30' : 'text-amber-700/30'
              }`}
              style={{ right: `${(1 - [1, 0.66, 0.33][i]) / 2 * 100 + 1}%`, top: '50%', transform: 'translateY(-50%)' }}
            >
              {m}m
            </span>
          ))}
        </div>
      </div>

      {/* ── TRAVELER POPUP ── */}
      {selected && (
        <div
          className={`relative z-20 mx-4 mb-3 px-4 py-4 rounded-2xl border animate-slide-up ${
            isNight
              ? 'bg-night-card border-night-border shadow-card-night'
              : 'bg-white border-day-border shadow-card-day'
          }`}
        >
          <div className="flex items-center gap-3">
            <HexAvatar
              initial={selected.visibility === 'enigma' ? '?' : selected.avatarInitial}
              color={selected.visibility === 'enigma' ? 'from-slate-600 to-slate-700' : selected.avatarColor}
              size={42}
              glow
            />
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm ${isNight ? 'text-white' : 'text-day-text'}`}>
                {selected.visibility === 'enigma' ? '~enigma' : `@${selected.username}`}
              </p>
              {selected.moodStatus && selected.visibility !== 'enigma' && (
                <p className={`text-xs mt-0.5 truncate ${isNight ? 'text-slate-400' : 'text-slate-500'}`}>
                  {selected.moodStatus}
                </p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm">{TRANSPORT_ICONS[selected.transport] ?? '🚌'}</span>
                <span className={`text-[10px] ${isNight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {selected.route} · {selected.distance}m
                </span>
              </div>
            </div>
            <a
              href="/chats"
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isNight
                  ? 'bg-radar-gold/15 text-radar-gold border border-radar-gold/30 hover:bg-radar-gold/25'
                  : 'bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200'
              }`}
            >
              Conectar
            </a>
          </div>
        </div>
      )}

      {/* ── VISIBILITY CONTROL ── */}
      <div className="relative z-10 mx-4 mb-4">
        <div
          className={`flex items-center rounded-2xl border overflow-hidden ${
            isNight ? 'bg-night-card border-night-border' : 'bg-white border-day-border'
          }`}
        >
          {VISIBILITY_OPTIONS.map(({ value, label, color }) => (
            <button
              key={value}
              onClick={() => setVisibility(value)}
              className={`flex-1 py-3 text-[10px] font-bold tracking-widest transition-all duration-200 ${
                profile.visibility === value
                  ? isNight
                    ? 'bg-radar-gold/15 text-radar-gold border-r border-radar-gold/20'
                    : 'bg-amber-50 text-amber-700 border-r border-amber-100'
                  : `${color} opacity-40 hover:opacity-70`
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

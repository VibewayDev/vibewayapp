import { useState } from 'react';
import { Pencil, Check, MapPin, Shield, Clock, ChevronRight, LogOut } from 'lucide-react';
import { useTheme } from '../lib/timeTheme';
import { useProfile } from '../lib/profileContext';
import type { TransportMode } from '../lib/connectivity';

const TRANSPORTS: { value: TransportMode; label: string; icon: string }[] = [
  { value: 'bus',     label: 'Autobús',  icon: '🚌' },
  { value: 'metro',   label: 'Metro',    icon: '🚇' },
  { value: 'train',   label: 'Tren',     icon: '🚆' },
  { value: 'tram',    label: 'Tranvía',  icon: '🚃' },
  { value: 'ferry',   label: 'Ferry',    icon: '⛴️' },
  { value: 'car',     label: 'Coche',    icon: '🚗' },
  { value: 'walking', label: 'A pie',    icon: '🚶' },
];

const HISTORY = [
  { id: 1, username: 'alex_v',    avatarColor: 'from-emerald-500 to-teal-600',  avatarInitial: 'A', route: 'Línea 42',     date: 'Hoy, 08:32' },
  { id: 2, username: 'viajera_M', avatarColor: 'from-rose-500 to-pink-600',     avatarInitial: 'M', route: 'L2 → Centro',  date: 'Ayer, 07:55' },
  { id: 3, username: 'luna_t',    avatarColor: 'from-violet-500 to-purple-600', avatarInitial: 'L', route: 'T1 Norte',     date: 'Lun, 18:10' },
];

function Avatar({ color, initial, size = 72 }: { color: string; initial: string; size?: number }) {
  return (
    <div
      className={`rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold`}
      style={{ width: size, height: size, fontSize: size * 0.36, boxShadow: '0 0 20px rgba(245,166,35,0.35)' }}
    >
      {initial}
    </div>
  );
}

export default function Perfil() {
  const { theme } = useTheme();
  const { profile, setMood, setTransport } = useProfile();
  const isNight = theme === 'night';

  const [editingUsername, setEditingUsername] = useState(false);
  const [moodDraft, setMoodDraft]             = useState(profile.moodStatus);
  const [editingMood, setEditingMood]         = useState(false);

  const bg      = isNight ? 'bg-night-base'    : 'bg-day-base';
  const surface = isNight ? 'bg-night-surface' : 'bg-white';
  const card    = isNight ? 'bg-night-card'    : 'bg-white';
  const border  = isNight ? 'border-night-border' : 'border-day-border';
  const textPri = isNight ? 'text-white'       : 'text-day-text';
  const textSec = isNight ? 'text-slate-400'   : 'text-slate-500';
  const gold    = isNight ? 'text-radar-gold'  : 'text-amber-600';
  const goldBg  = isNight ? 'bg-radar-gold/10 border-radar-gold/25' : 'bg-amber-50 border-amber-200';

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-700 pb-32`}>
      {/* Top banner */}
      <div
        className="relative h-36 overflow-hidden"
        style={{
          background: isNight
            ? 'linear-gradient(135deg, #04091a 0%, #0a1530 50%, #0d1c3f 100%)'
            : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)',
        }}
      >
        {/* Radar dots overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          {[60,110,160].map((r) => (
            <circle key={r} cx="50%" cy="100%" r={r} fill="none" stroke={isNight ? '#f5a623' : '#92400e'} strokeWidth="1" />
          ))}
        </svg>
      </div>

      {/* Avatar row */}
      <div className="px-5 -mt-10 flex items-end justify-between mb-5">
        <Avatar color={profile.avatarColor} initial={profile.avatarInitial} size={72} />
        <button className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${goldBg} ${gold}`}>
          Editar
        </button>
      </div>

      {/* Name + mood */}
      <div className="px-5 mb-6">
        <div className="flex items-center gap-2">
          <h2 className={`text-xl font-bold ${textPri}`}>@{profile.username}</h2>
        </div>
        <div className={`mt-1 flex items-center gap-2 rounded-xl px-3 py-2 border ${goldBg} w-fit`}>
          {editingMood ? (
            <>
              <input
                autoFocus
                value={moodDraft}
                onChange={(e) => setMoodDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { setMood(moodDraft); setEditingMood(false); } }}
                maxLength={60}
                className={`text-sm bg-transparent outline-none ${gold} w-48`}
              />
              <button onClick={() => { setMood(moodDraft); setEditingMood(false); }}>
                <Check size={13} className={gold} />
              </button>
            </>
          ) : (
            <>
              <span className={`text-sm ${gold}`}>{profile.moodStatus}</span>
              <button onClick={() => setEditingMood(true)}>
                <Pencil size={11} className={`${gold} opacity-60`} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className={`mx-5 grid grid-cols-3 rounded-2xl border overflow-hidden mb-5 ${border}`} style={{ background: isNight ? '#0d1c3f' : '#fff' }}>
        {[
          { label: 'Encuentros', value: '14' },
          { label: 'Rutas',      value: '7'  },
          { label: 'Viajes',     value: '89' },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center py-4 border-r last:border-r-0" style={{ borderColor: isNight ? '#1a2d55' : '#e8edf9' }}>
            <span className={`text-xl font-bold ${isNight ? 'text-radar-gold' : 'text-amber-600'}`}>{value}</span>
            <span className={`text-[10px] mt-0.5 ${textSec}`}>{label}</span>
          </div>
        ))}
      </div>

      {/* Transport mode */}
      <div className="px-5 mb-5">
        <p className={`text-xs font-bold tracking-widest mb-3 ${textSec}`}>MEDIO DE TRANSPORTE</p>
        <div className="grid grid-cols-4 gap-2">
          {TRANSPORTS.map(({ value, label, icon }) => (
            <button
              key={value}
              onClick={() => setTransport(value)}
              className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-xs transition-all ${
                profile.transport === value
                  ? isNight
                    ? 'bg-radar-gold/15 border-radar-gold/40 text-radar-gold shadow-neon-gold'
                    : 'bg-amber-100 border-amber-300 text-amber-700'
                  : `${card} ${border} ${textSec}`
              }`}
            >
              <span className="text-lg leading-none">{icon}</span>
              <span className="text-[9px]">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Encounter history */}
      <div className="px-5 mb-5">
        <p className={`text-xs font-bold tracking-widest mb-3 ${textSec}`}>HISTORIAL DE ENCUENTROS</p>
        <div className={`rounded-2xl border overflow-hidden divide-y ${border}`} style={{ divideColor: isNight ? '#1a2d55' : '#e8edf9', background: isNight ? '#0d1c3f' : '#fff' }}>
          {HISTORY.map((h) => (
            <div key={h.id} className="flex items-center gap-3 px-4 py-3">
              <div
                className={`w-9 h-9 rounded-full bg-gradient-to-br ${h.avatarColor} flex items-center justify-center text-white text-sm font-bold`}
              >
                {h.avatarInitial}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${textPri}`}>@{h.username}</p>
                <div className="flex items-center gap-2">
                  <MapPin size={9} className={textSec} />
                  <span className={`text-[10px] ${textSec}`}>{h.route}</span>
                  <Clock size={9} className={textSec} />
                  <span className={`text-[10px] ${textSec}`}>{h.date}</span>
                </div>
              </div>
              <ChevronRight size={14} className={textSec} />
            </div>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="px-5 mb-5">
        <div className={`flex items-center gap-3 px-4 py-4 rounded-2xl border ${card} ${border}`}>
          <Shield size={18} className={gold} />
          <div className="flex-1">
            <p className={`text-sm font-medium ${textPri}`}>Privacidad y datos</p>
            <p className={`text-xs mt-0.5 ${textSec}`}>Gestiona lo que compartes en el radar</p>
          </div>
          <ChevronRight size={14} className={textSec} />
        </div>
      </div>

      {/* Sign out */}
      <div className="px-5">
        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-all">
          <LogOut size={14} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

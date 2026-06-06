import { useState, useRef } from 'react';
import { Pencil, Check, MapPin, Shield, Clock, ChevronRight, LogOut, Camera, X } from 'lucide-react';
import { useTheme } from '../lib/timeTheme';
import { useProfile } from '../lib/profileContext';
import { useAuth } from '../contexts/AuthContext';
import type { TransportMode } from '../lib/connectivity';

const TRANSPORTS: { value: TransportMode; label: string; icon: string }[] = [
  { value: 'bus',     label: 'Autobús', icon: '🚌' },
  { value: 'metro',   label: 'Metro',   icon: '🚇' },
  { value: 'train',   label: 'Tren',    icon: '🚆' },
  { value: 'tram',    label: 'Tranvía', icon: '🚃' },
  { value: 'ferry',   label: 'Ferry',   icon: '⛴️' },
  { value: 'car',     label: 'Coche',   icon: '🚗' },
  { value: 'walking', label: 'A pie',   icon: '🚶' },
  { value: 'plane',   label: 'Avión',   icon: '✈️' },
];

const FEMALE_AVATARS = ['Sofia','Luna','Maya','Valentina','Isabella','Camila','Daniela','Fernanda','Gabriela','Natalia'];
const MALE_AVATARS   = ['Mateo','Santiago','Alejandro','Diego','Sebastian','Andres','Felipe','Ricardo','Miguel','Carlos'];

const HISTORY = [
  { id: 1, username: 'alex_v',    avatarColor: 'from-emerald-500 to-teal-600',  avatarInitial: 'A', route: 'Línea 42',    date: 'Hoy, 08:32' },
  { id: 2, username: 'viajera_M', avatarColor: 'from-rose-500 to-pink-600',     avatarInitial: 'M', route: 'L2 → Centro', date: 'Ayer, 07:55' },
  { id: 3, username: 'luna_t',    avatarColor: 'from-violet-500 to-purple-600', avatarInitial: 'L', route: 'T1 Norte',    date: 'Lun, 18:10' },
];

export default function Perfil() {
  const { theme } = useTheme();
  const { profile, setMood, setTransport } = useProfile();
  const { signOut, updateProfile } = useAuth();
  const isNight = theme === 'night';

  const [moodDraft, setMoodDraft]       = useState(profile.moodStatus);
  const [editingMood, setEditingMood]   = useState(false);
  const [avatarModal, setAvatarModal]   = useState(false);
  const [avatarUrl, setAvatarUrl]       = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const bg      = isNight ? 'bg-night-base'       : 'bg-day-base';
  const card    = isNight ? 'bg-night-card'       : 'bg-white';
  const border  = isNight ? 'border-night-border' : 'border-day-border';
  const textPri = isNight ? 'text-white'          : 'text-day-text';
  const textSec = isNight ? 'text-slate-400'      : 'text-slate-500';
  const gold    = isNight ? 'text-radar-gold'     : 'text-amber-600';
  const goldBg  = isNight ? 'bg-radar-gold/10 border-radar-gold/25' : 'bg-amber-50 border-amber-200';

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setAvatarUrl(url);
      updateProfile?.({ avatar_url: url });
      setAvatarModal(false);
    };
    reader.readAsDataURL(file);
  }

  function selectDicebearAvatar(seed: string) {
    const url = `https://api.dicebear.com/7.x/personas/svg?seed=${seed}`;
    setAvatarUrl(url);
    updateProfile?.({ avatar_url: url });
    setAvatarModal(false);
  }

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-700 pb-32`}>
      {/* Top banner */}
      <div className="relative h-36 overflow-hidden"
        style={{ background: isNight ? 'linear-gradient(135deg,#04091a,#0a1530,#0d1c3f)' : 'linear-gradient(135deg,#fef3c7,#fde68a,#fcd34d)' }}>
        <svg className="absolute inset-0 w-full h-full opacity-10">
          {[60,110,160].map((r) => (
            <circle key={r} cx="50%" cy="100%" r={r} fill="none" stroke={isNight ? '#f5a623' : '#92400e'} strokeWidth="1" />
          ))}
        </svg>
      </div>

      {/* Avatar row */}
      <div className="px-5 -mt-10 flex items-end justify-between mb-5">
        <button onClick={() => setAvatarModal(true)} className="relative">
          {avatarUrl ? (
            avatarUrl.startsWith('data:') ? (
              <img src={avatarUrl} className="w-[72px] h-[72px] rounded-2xl object-cover" style={{ boxShadow: '0 0 20px rgba(245,166,35,0.35)' }} />
            ) : (
              <img src={avatarUrl} className="w-[72px] h-[72px] rounded-2xl bg-[#0d1c3f] p-1" style={{ boxShadow: '0 0 20px rgba(245,166,35,0.35)' }} />
            )
          ) : (
            <div className={`w-[72px] h-[72px] rounded-2xl bg-gradient-to-br ${profile.avatarColor} flex items-center justify-center text-white font-bold text-2xl`}
              style={{ boxShadow: '0 0 20px rgba(245,166,35,0.35)' }}>
              {profile.avatarInitial}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
            <Camera size={11} className="text-black" />
          </div>
        </button>
        <button className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${goldBg} ${gold}`}>Editar</button>
      </div>

      {/* Name + mood */}
      <div className="px-5 mb-6">
        <h2 className={`text-xl font-bold ${textPri}`}>@{profile.username}</h2>
        <div className={`mt-1 flex items-center gap-2 rounded-xl px-3 py-2 border ${goldBg} w-fit`}>
          {editingMood ? (
            <>
              <input autoFocus value={moodDraft} onChange={(e) => setMoodDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { setMood(moodDraft); setEditingMood(false); } }}
                maxLength={60} className={`text-sm bg-transparent outline-none ${gold} w-48`} />
              <button onClick={() => { setMood(moodDraft); setEditingMood(false); }}><Check size={13} className={gold} /></button>
            </>
          ) : (
            <>
              <span className={`text-sm ${gold}`}>{profile.moodStatus}</span>
              <button onClick={() => setEditingMood(true)}><Pencil size={11} className={`${gold} opacity-60`} /></button>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className={`mx-5 grid grid-cols-3 rounded-2xl border overflow-hidden mb-5 ${border}`}
        style={{ background: isNight ? '#0d1c3f' : '#fff' }}>
        {[{ label: 'Encuentros', value: '14' }, { label: 'Rutas', value: '7' }, { label: 'Viajes', value: '89' }].map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center py-4 border-r last:border-r-0"
            style={{ borderColor: isNight ? '#1a2d55' : '#e8edf9' }}>
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
            <button key={value} onClick={() => setTransport(value)}
              className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-xs transition-all ${
                profile.transport === value
                  ? isNight ? 'bg-radar-gold/15 border-radar-gold/40 text-radar-gold shadow-neon-gold' : 'bg-amber-100 border-amber-300 text-amber-700'
                  : `${card} ${border} ${textSec}`
              }`}>
              <span className="text-lg leading-none">{icon}</span>
              <span className="text-[9px]">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Encounter history */}
      <div className="px-5 mb-5">
        <p className={`text-xs font-bold tracking-widest mb-3 ${textSec}`}>HISTORIAL DE ENCUENTROS</p>
        <div className={`rounded-2xl border overflow-hidden divide-y ${border}`}
          style={{ background: isNight ? '#0d1c3f' : '#fff' }}>
          {HISTORY.map((h) => (
            <div key={h.id} className="flex items-center gap-3 px-4 py-3">
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${h.avatarColor} flex items-center justify-center text-white text-sm font-bold`}>
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
        <button onClick={signOut}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-all">
          <LogOut size={14} />
          Cerrar sesión
        </button>
      </div>

      {/* Avatar Modal */}
      {avatarModal && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full rounded-t-3xl p-5 pb-10" style={{ background: '#0a1530' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold text-base">Cambiar foto de perfil</h3>
              <button onClick={() => setAvatarModal(false)}><X size={18} className="text-slate-400" /></button>
            </div>

            {/* Upload option */}
            <button onClick={() => fileRef.current?.click()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#1a2d55] mb-4 text-left">
              <Camera size={18} className="text-amber-400" />
              <span className="text-white text-sm">📷 Subir desde galería</span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

            {/* Avatar grid */}
            <p className="text-slate-400 text-xs mb-3 font-semibold tracking-wider">FEMENINOS</p>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {FEMALE_AVATARS.map((seed) => (
                <button key={seed} onClick={() => selectDicebearAvatar(seed)}
                  className="w-full aspect-square rounded-xl overflow-hidden border border-[#1a2d55] hover:border-amber-500 transition-all">
                  <img src={`https://api.dicebear.com/7.x/personas/svg?seed=${seed}`} className="w-full h-full bg-[#0d1c3f] p-0.5" />
                </button>
              ))}
            </div>
            <p className="text-slate-400 text-xs mb-3 font-semibold tracking-wider">MASCULINOS</p>
            <div className="grid grid-cols-5 gap-2">
              {MALE_AVATARS.map((seed) => (
                <button key={seed} onClick={() => selectDicebearAvatar(seed)}
                  className="w-full aspect-square rounded-xl overflow-hidden border border-[#1a2d55] hover:border-amber-500 transition-all">
                  <img src={`https://api.dicebear.com/7.x/personas/svg?seed=${seed}`} className="w-full h-full bg-[#0d1c3f] p-0.5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

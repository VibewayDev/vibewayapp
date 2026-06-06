import { useState, useEffect, useRef } from 'react';
import { Pencil, Check, MapPin, Navigation, Plus, Thermometer } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { connectivity, type NearbyTraveler } from '../lib/connectivity';
import { useTheme } from '../lib/timeTheme';
import { useProfile } from '../lib/profileContext';
import type { VisibilityMode } from '../lib/connectivity';

// Fix default Leaflet marker icons in Vite
const DefaultIcon = L.icon({ iconUrl, shadowUrl: iconShadow });
L.Marker.mergeOptions({ icon: DefaultIcon });

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

// Build a colored div icon for a traveler marker
function buildTravelerIcon(initial: string, isEnigma: boolean) {
  const bg = isEnigma ? '#475569' : '#f5a623';
  const html = `
    <div style="
      width:32px;height:32px;border-radius:50%;
      background:${bg};display:flex;align-items:center;
      justify-content:center;color:white;font-weight:700;
      font-size:13px;border:2px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
    ">${isEnigma ? '?' : initial}</div>`;
  return L.divIcon({ html, className: '', iconSize: [32, 32], iconAnchor: [16, 16] });
}

function buildUserIcon(initial: string) {
  const html = `
    <div style="
      width:40px;height:40px;border-radius:50%;
      background:linear-gradient(135deg,#f5a623,#e8850a);
      display:flex;align-items:center;justify-content:center;
      color:white;font-weight:800;font-size:16px;
      border:3px solid white;
      box-shadow:0 0 16px rgba(245,166,35,0.7);
    ">${initial}</div>`;
  return L.divIcon({ html, className: '', iconSize: [40, 40], iconAnchor: [20, 20] });
}

// Scatter simulated travelers within ~400m of the user
function nearbyCoords(lat: number, lng: number, radarX: number, radarY: number): [number, number] {
  const spread = 0.003;
  return [lat + radarY * spread, lng + radarX * spread];
}

const DEFAULT_CENTER: [number, number] = [-33.45, -70.65]; // Santiago, Chile

export default function RadarPage() {
  const { theme, hour, setSimHour, simHour } = useTheme();
  const { profile, setMood, setVisibility } = useProfile();
  const [travelers, setTravelers]     = useState<NearbyTraveler[]>([]);
  const [editingMood, setEditingMood] = useState(false);
  const [moodDraft, setMoodDraft]     = useState(profile.moodStatus);
  const [selected, setSelected]       = useState<NearbyTraveler | null>(null);
  const [showSimBar, setShowSimBar]   = useState(false);
  const [userPos, setUserPos]         = useState<[number, number]>(DEFAULT_CENTER);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [toast, setToast]             = useState(false);
  const isNight = theme === 'night';

  // Connectivity
  useEffect(() => {
    connectivity.start();
    const unsub = connectivity.onTravelers(setTravelers);
    return () => { unsub(); connectivity.stop(); };
  }, []);

  // GPS
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      () => setUserPos(DEFAULT_CENTER),
    );
  }, []);

  // Temperature from Open-Meteo
  useEffect(() => {
    const [lat, lon] = userPos;
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
      .then((r) => r.json())
      .then((d) => setTemperature(Math.round(d.current_weather?.temperature ?? 0)))
      .catch(() => {});
  }, [userPos]);

  function saveMood() {
    setMood(moodDraft);
    setEditingMood(false);
  }

  function showVibesToast() {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  }

  const visibleTravelers = travelers.filter(
    (t) => profile.visibility !== 'off' && t.visibility !== 'off',
  );

  return (
    <div
      className={`relative flex flex-col min-h-screen overflow-hidden transition-colors duration-700 ${
        isNight ? 'bg-night-base' : 'bg-day-base'
      }`}
    >
      {/* ── TOP BAR ── */}
      <header className="relative z-20 flex items-center justify-between px-4 pt-12 pb-3">
        <div className="flex items-center gap-2">
          <Navigation size={14} className={isNight ? 'text-radar-gold' : 'text-amber-600'} />
          <span className={`text-xs font-mono ${isNight ? 'text-radar-gold/70' : 'text-amber-700/80'}`}>
            {profile.route}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {temperature !== null && (
            <div className={`flex items-center gap-1 text-[10px] font-mono ${isNight ? 'text-slate-400' : 'text-slate-500'}`}>
              <Thermometer size={11} />
              <span>{temperature}°C</span>
            </div>
          )}
          <MapPin size={13} className={isNight ? 'text-night-muted' : 'text-day-muted'} />
          <span className={`text-[10px] font-mono ${isNight ? 'text-night-muted' : 'text-day-muted'}`}>
            {visibleTravelers.length} cerca
          </span>
          <button
            onClick={() => setShowSimBar((v) => !v)}
            className={`ml-2 text-[9px] px-2 py-0.5 rounded-full border font-mono transition-colors ${
              isNight
                ? 'border-night-border text-slate-500 hover:text-radar-gold hover:border-radar-gold/40'
                : 'border-day-border text-slate-400 hover:text-amber-600'
            }`}
          >
            SIM
          </button>
        </div>
      </header>

      {/* ── HOUR SIMULATOR ── */}
      {showSimBar && (
        <div className={`relative z-20 mx-4 mb-2 px-4 py-3 rounded-xl border flex items-center gap-3 ${
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
      <div className="relative z-20 mx-4 mb-3">
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
              <p className={`text-sm font-medium truncate ${isNight ? 'text-white' : 'text-day-text'}`}>
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

      {/* ── REAL MAP ── */}
      <div className="relative z-10 flex-1 mx-4 mb-3 rounded-2xl overflow-hidden border" style={{
        minHeight: 280,
        borderColor: isNight ? 'rgba(245,166,35,0.2)' : '#e8edf9',
      }}>
        <MapContainer
          center={userPos}
          zoom={15}
          style={{ width: '100%', height: '100%', minHeight: 280 }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {/* Radius circle */}
          <Circle
            center={userPos}
            radius={500}
            pathOptions={{
              color: '#7c3aed',
              fillColor: '#7c3aed',
              fillOpacity: 0.06,
              weight: 1.5,
              dashArray: '6 4',
            }}
          />

          {/* User marker */}
          <Marker position={userPos} icon={buildUserIcon(profile.avatarInitial)}>
            <Popup>
              <strong>@{profile.username}</strong>
              <br />
              <span style={{ fontSize: 11, color: '#666' }}>{profile.moodStatus}</span>
            </Popup>
          </Marker>

          {/* Traveler markers */}
          {visibleTravelers.map((t) => {
            const isEnigma = t.visibility === 'enigma';
            const pos = nearbyCoords(userPos[0], userPos[1], t.radarX, t.radarY);
            return (
              <Marker
                key={t.id}
                position={pos}
                icon={buildTravelerIcon(t.avatarInitial, isEnigma)}
                eventHandlers={{ click: () => setSelected(selected?.id === t.id ? null : t) }}
              >
                <Popup>
                  <strong>{isEnigma ? '~enigma' : `@${t.username}`}</strong>
                  {!isEnigma && t.moodStatus && (
                    <><br /><span style={{ fontSize: 11, color: '#666' }}>{t.moodStatus}</span></>
                  )}
                  <br />
                  <span style={{ fontSize: 11 }}>{TRANSPORT_ICONS[t.transport] ?? '🚌'} {t.route} · {t.distance}m</span>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
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

      {/* ── VISIBILITY CONTROL + "+" BUTTON ── */}
      <div className="relative z-20 mx-4 mb-4 flex items-center gap-2">
        <div
          className={`flex-1 flex items-center rounded-2xl border overflow-hidden ${
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

        {/* "+" floating action button */}
        <button
          onClick={showVibesToast}
          className={`flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center border transition-all active:scale-95 ${
            isNight
              ? 'bg-radar-gold/15 border-radar-gold/30 text-radar-gold hover:bg-radar-gold/25 shadow-neon-gold'
              : 'bg-amber-100 border-amber-200 text-amber-700 hover:bg-amber-200'
          }`}
        >
          <Plus size={18} />
        </button>
      </div>

      {/* ── TOAST ── */}
      {toast && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className={`px-5 py-3 rounded-2xl text-sm font-medium shadow-lg border ${
            isNight
              ? 'bg-night-card border-night-border text-white'
              : 'bg-white border-day-border text-day-text shadow-card-day'
          }`}>
            Proxímamente: dejar un Vibe en el mapa
          </div>
        </div>
      )}
    </div>
  );
}

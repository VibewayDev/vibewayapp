import { useState, useEffect, useRef } from 'react';
import { Pencil, Check, MapPin, Navigation, Plus, Thermometer } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { connectivity, type NearbyTraveler } from '../lib/connectivity';
import { useTheme } from '../lib/timeTheme';
import { useProfile } from '../lib/profileContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { VisibilityMode } from '../lib/connectivity';

interface LiveTraveler {
  id: string;
  username: string;
  avatar_url: string | null;
  lat: number;
  lng: number;
  visibility: string;
}

const DefaultIcon = L.icon({ iconUrl, shadowUrl: iconShadow });
L.Marker.mergeOptions({ icon: DefaultIcon });

const TRANSPORT_ICONS: Record<string, string> = {
  bus: '🚌', metro: '🚇', train: '🚆', tram: '🚃', ferry: '⛴️', car: '🚗', walking: '🚶',
};

function haversineM(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R  = 6_371_000;
  const dL = ((lat2 - lat1) * Math.PI) / 180;
  const dl = ((lng2 - lng1) * Math.PI) / 180;
  const a  =
    Math.sin(dL / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dl / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const RADAR_RADIUS_M = 5_000;

function HexAvatar({
  initial, color, avatarUrl, size = 52, glow = false, label,
}: {
  initial: string; color: string; avatarUrl?: string | null; size?: number; glow?: boolean; label?: string;
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
        {avatarUrl ? (
          <img
            src={avatarUrl}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
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
        )}
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

function buildTravelerIcon(initial: string, isEnigma: boolean, avatarUrl?: string | null) {
  const bg = isEnigma ? '#475569' : '#f5a623';
  const inner = (avatarUrl && !isEnigma)
    ? `<img src="${avatarUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" onerror="this.style.display='none'" />`
    : `<span style="color:white;font-weight:700;font-size:13px;">${isEnigma ? '?' : initial}</span>`;
  const html = `
    <div style="
      width:32px;height:32px;border-radius:50%;
      background:${bg};display:flex;align-items:center;
      justify-content:center;overflow:hidden;
      border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);
    ">${inner}</div>`;
  return L.divIcon({ html, className: '', iconSize: [32, 32], iconAnchor: [16, 16] });
}

function buildUserIcon(initial: string, avatarUrl?: string | null) {
  const inner = avatarUrl
    ? `<img src="${avatarUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" onerror="this.style.display='none'" />`
    : `<span style="color:white;font-weight:800;font-size:16px;">${initial}</span>`;
  const html = `
    <div style="
      width:40px;height:40px;border-radius:50%;
      background:linear-gradient(135deg,#f5a623,#e8850a);
      display:flex;align-items:center;justify-content:center;overflow:hidden;
      border:3px solid white;box-shadow:0 0 16px rgba(245,166,35,0.7);
    ">${inner}</div>`;
  return L.divIcon({ html, className: '', iconSize: [40, 40], iconAnchor: [20, 20] });
}

function nearbyCoords(lat: number, lng: number, radarX: number, radarY: number): [number, number] {
  const spread = 0.003;
  return [lat + radarY * spread, lng + radarX * spread];
}

function MapController({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom(), { animate: true });
  }, [position]);
  return null;
}

const DEFAULT_CENTER: [number, number] = [-33.45, -70.65];

export default function RadarPage() {
  const { theme, hour, setSimHour, simHour } = useTheme();
  const { profile, setMood, setVisibility }  = useProfile();
  const { user, profile: authProfile }       = useAuth();
  const [travelers, setTravelers]         = useState<NearbyTraveler[]>([]);
  const [liveTravelers, setLiveTravelers] = useState<LiveTraveler[]>([]);
  const [editingMood, setEditingMood]     = useState(false);
  const [moodDraft, setMoodDraft]         = useState(profile.moodStatus);
  const [selected, setSelected]           = useState<NearbyTraveler | null>(null);
  const [showSimBar, setShowSimBar]       = useState(false);
  const [userPos, setUserPos]             = useState<[number, number]>(DEFAULT_CENTER);
  const [gpsAccuracy, setGpsAccuracy]     = useState<number | null>(null);
  const [temperature, setTemperature]     = useState<number | null>(null);
  const [toast, setToast]                 = useState(false);
  const [gpsReady, setGpsReady]           = useState(false);
  const isNight = theme === 'night';

  const userPosRef    = useRef(userPos);
  const visibilityRef = useRef(profile.visibility);
  const gpsReadyRef   = useRef(false);
  useEffect(() => { userPosRef.current    = userPos; },            [userPos]);
  useEffect(() => { visibilityRef.current = profile.visibility; }, [profile.visibility]);
  useEffect(() => { gpsReadyRef.current   = gpsReady; },           [gpsReady]);

  // Connectivity module (simulated travelers)
  useEffect(() => {
    connectivity.start();
    const unsub = connectivity.onTravelers(setTravelers);
    return () => { unsub(); connectivity.stop(); };
  }, []);

  // GPS watchPosition — publica posición en Supabase en cada actualización
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(newPos);
        setGpsAccuracy(Math.round(pos.coords.accuracy));
        setGpsReady(true);
        gpsReadyRef.current = true;
        if (user?.id && visibilityRef.current !== 'off') {
          supabase.from('profiles').update({
            last_lat:  pos.coords.latitude,
            last_lng:  pos.coords.longitude,
            last_seen: new Date().toISOString(),
          }).eq('id', user.id).then(({ error }) => {
            if (error) console.error('[Radar] GPS publish error:', error.message);
          });
        }
      },
      () => setUserPos(DEFAULT_CENTER),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [user]);

  // Temperatura desde Open-Meteo
  useEffect(() => {
    const [lat, lon] = userPos;
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
      .then((r) => r.json())
      .then((d) => setTemperature(Math.round(d.current_weather?.temperature ?? 0)))
      .catch(() => {});
  }, [userPos]);

  // Publicar posición cada 30s (respaldo del watchPosition)
  useEffect(() => {
    if (!user?.id) return;
    async function publishPosition() {
      if (visibilityRef.current === 'off') return;
      if (!gpsReadyRef.current) return; // No publicar hasta tener GPS real
      const [lat, lng] = userPosRef.current;
      await supabase.from('profiles').update({
        last_lat:  lat,
        last_lng:  lng,
        last_seen: new Date().toISOString(),
      }).eq('id', user!.id);
    }
    publishPosition();
    const id = setInterval(publishPosition, 30_000);
    return () => clearInterval(id);
  }, [user]);

  // Carga inicial de viajeros reales
  useEffect(() => {
    if (!user?.id) return;
    async function fetchLive() {
      const cutoff = new Date(Date.now() - 30 * 60 * 1000).toISOString();
      const { data } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, last_lat, last_lng, visibility')
        .neq('id', user!.id)
        .gte('last_seen', cutoff)
        .not('last_lat', 'is', null)
        .not('last_lng', 'is', null)
        .neq('visibility', 'off');

      if (data) {
        const [myLat, myLng] = userPosRef.current;
        setLiveTravelers(
          data
            .filter((r) => haversineM(myLat, myLng, r.last_lat as number, r.last_lng as number) <= RADAR_RADIUS_M)
            .map((r) => ({
              id:         r.id,
              username:   r.username,
              avatar_url: r.avatar_url,
              lat:        r.last_lat as number,
              lng:        r.last_lng as number,
              visibility: r.visibility ?? 'public',
            })),
        );
      }
    }
    fetchLive();
  }, [user]);

  // ── SUPABASE REALTIME — actualización instantánea de posiciones ──
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('live-travelers')
      .on(
        'postgres_changes',
        {
          event:  'UPDATE',
          schema: 'public',
          table:  'profiles',
        },
        (payload) => {
          const p = payload.new as {
            id: string; username: string; avatar_url: string | null;
            last_lat: number | null; last_lng: number | null;
            visibility: string; last_seen: string;
          };

          // Ignorar propio perfil o usuarios apagados o sin coordenadas
          if (p.id === user.id) return;
          if (p.visibility === 'off') {
            setLiveTravelers((prev) => prev.filter((t) => t.id !== p.id));
            return;
          }
          if (!p.last_lat || !p.last_lng) return;

          const dist = haversineM(userPosRef.current[0], userPosRef.current[1], p.last_lat, p.last_lng);

          if (dist > RADAR_RADIUS_M) {
            // Salió del radio — eliminarlo
            setLiveTravelers((prev) => prev.filter((t) => t.id !== p.id));
            return;
          }

          // Actualizar o agregar al mapa instantáneamente
          setLiveTravelers((prev) => {
            const exists = prev.find((t) => t.id === p.id);
            const updated: LiveTraveler = {
              id:         p.id,
              username:   p.username,
              avatar_url: p.avatar_url,
              lat:        p.last_lat!,
              lng:        p.last_lng!,
              visibility: p.visibility,
            };
            if (exists) return prev.map((t) => t.id === p.id ? updated : t);
            return [...prev, updated];
          });
        },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  function saveMood() { setMood(moodDraft); setEditingMood(false); }
  function showVibesToast() { setToast(true); setTimeout(() => setToast(false), 3000); }

  const visibleTravelers = travelers.filter((t) => profile.visibility !== 'off' && t.visibility !== 'off');
  const visibleLive      = liveTravelers.filter((t) => t.visibility !== 'off');

  const myAvatarUrl   = authProfile?.avatar_url ?? null;
  const myInitial     = (authProfile?.username ?? profile.username)[0]?.toUpperCase() ?? 'T';
  const myDisplayName = authProfile?.username ?? profile.username;

  const glassNight = 'bg-[#0a1628]/80 border-amber-500/20 backdrop-blur-md';
  const glassDay   = 'bg-white/85 border-slate-200/80 backdrop-blur-md shadow-sm';
  const glass = isNight ? glassNight : glassDay;

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">

      {/* ── FULLSCREEN MAP ── */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={userPos}
          zoom={13}
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
        >
          <MapController position={userPos} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <Circle
            center={userPos}
            radius={RADAR_RADIUS_M}
            pathOptions={{ color: '#f5a623', fillColor: '#f5a623', fillOpacity: 0.04, weight: 1.5, dashArray: '6 4' }}
          />

          {/* Marcador del usuario actual */}
          <Marker position={userPos} icon={buildUserIcon(myInitial, myAvatarUrl)}>
            <Popup>
              <strong>@{myDisplayName}</strong><br />
              <span style={{ fontSize: 11, color: '#666' }}>{authProfile?.status_text || profile.moodStatus}</span>
            </Popup>
          </Marker>

          {/* Viajeros simulados */}
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
                  {!isEnigma && t.moodStatus && (<><br /><span style={{ fontSize: 11, color: '#666' }}>{t.moodStatus}</span></>)}
                  <br />
                  <span style={{ fontSize: 11 }}>{TRANSPORT_ICONS[t.transport] ?? '🚌'} {t.route} · {t.distance}m</span>
                </Popup>
              </Marker>
            );
          })}

          {/* Viajeros reales desde Supabase Realtime */}
          {visibleLive.map((t) => {
            const isEnigma = t.visibility === 'enigma';
            const initial  = t.username?.[0]?.toUpperCase() ?? '?';
            return (
              <Marker
                key={t.id}
                position={[t.lat, t.lng]}
                icon={buildTravelerIcon(initial, isEnigma, t.avatar_url)}
              >
                <Popup>
                  <strong>{isEnigma ? '~enigma' : `@${t.username}`}</strong>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* ── TOP HEADER ── */}
      <header className="absolute top-0 left-0 right-0 z-20 px-4 pt-12 pb-2 pointer-events-none">
        <div className={`flex items-center justify-between px-4 py-2.5 rounded-2xl border ${glass} pointer-events-auto`}>
          <div className="flex items-center gap-2">
            <Navigation size={13} className={isNight ? 'text-amber-400' : 'text-amber-600'} />
            <span className={`text-xs font-mono ${isNight ? 'text-amber-400/80' : 'text-amber-700/80'}`}>{profile.route}</span>
          </div>
          <div className="flex items-center gap-3">
            {temperature !== null && (
              <div className={`flex items-center gap-1 text-[11px] font-mono font-semibold ${isNight ? 'text-slate-300' : 'text-slate-600'}`}>
                <Thermometer size={12} /><span>{temperature}°C</span>
              </div>
            )}
            <div className={`flex items-center gap-1 text-[11px] font-mono ${isNight ? 'text-slate-400' : 'text-slate-500'}`}>
              <MapPin size={12} />
              <span>{visibleTravelers.length + visibleLive.length} cerca</span>
            </div>
            {gpsAccuracy !== null && (
              <div className={`flex items-center gap-0.5 text-[11px] font-mono font-semibold ${gpsAccuracy <= 100 ? 'text-emerald-400' : 'text-orange-400'}`}>
                <span>🎯</span><span>{gpsAccuracy}m</span>
              </div>
            )}
            <button
              onClick={() => setShowSimBar((v) => !v)}
              className={`text-[9px] px-2 py-0.5 rounded-full border font-mono transition-colors ${
                isNight ? 'border-amber-500/30 text-slate-500 hover:text-amber-400' : 'border-slate-300 text-slate-400 hover:text-amber-600'
              }`}
            >SIM</button>
          </div>
        </div>
        {showSimBar && (
          <div className={`mt-2 px-4 py-3 rounded-xl border flex items-center gap-3 ${glass} pointer-events-auto`}>
            <span className={`text-xs font-medium ${isNight ? 'text-slate-400' : 'text-slate-500'}`}>Hora: {simHour ?? hour}:00</span>
            <input type="range" min={0} max={23} step={1} value={simHour ?? hour}
              onChange={(e) => setSimHour(Number(e.target.value))} className="flex-1 accent-amber-500 h-1.5" />
            <button onClick={() => setSimHour(null)} className="text-[10px] text-amber-500 font-medium">Real</button>
          </div>
        )}
      </header>

      {/* ── MOOD BOX ── */}
      <div className="absolute left-4 right-4 z-20" style={{ top: 110 }}>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${glass}`}>
          <div className="flex-shrink-0">
            <HexAvatar initial={myInitial} color={profile.avatarColor} avatarUrl={myAvatarUrl} size={38} glow />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-[9px] font-bold tracking-widest mb-1 ${isNight ? 'text-amber-400/60' : 'text-amber-600/70'}`}>TU SENTIR HOY</p>
            {editingMood ? (
              <input autoFocus value={moodDraft} onChange={(e) => setMoodDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveMood()} maxLength={60}
                className={`w-full text-sm font-medium bg-transparent border-b outline-none ${isNight ? 'text-white border-amber-400/50' : 'text-slate-800 border-amber-400/60'}`} />
            ) : (
              <p className={`text-sm font-medium truncate ${isNight ? 'text-white' : 'text-slate-800'}`}>
                {authProfile?.status_text || profile.moodStatus || <span className="opacity-40 italic text-xs">Escribe tu estado...</span>}
              </p>
            )}
          </div>
          <button onClick={() => editingMood ? saveMood() : setEditingMood(true)}
            className={`flex-shrink-0 p-1.5 rounded-lg transition-all ${isNight ? 'text-amber-400/60 hover:text-amber-400' : 'text-amber-500 hover:bg-amber-50'}`}>
            {editingMood ? <Check size={15} /> : <Pencil size={13} />}
          </button>
        </div>
      </div>

      {/* ── TRAVELER POPUP ── */}
      {selected && (
        <div className="absolute left-4 right-4 z-20" style={{ top: 200 }}>
          <div className={`px-4 py-4 rounded-2xl border animate-slide-up ${glass}`}>
            <div className="flex items-center gap-3">
              <HexAvatar initial={selected.visibility === 'enigma' ? '?' : selected.avatarInitial}
                color={selected.visibility === 'enigma' ? 'from-slate-600 to-slate-700' : selected.avatarColor} size={42} glow />
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${isNight ? 'text-white' : 'text-slate-800'}`}>
                  {selected.visibility === 'enigma' ? '~enigma' : `@${selected.username}`}
                </p>
                {selected.moodStatus && selected.visibility !== 'enigma' && (
                  <p className={`text-xs mt-0.5 truncate ${isNight ? 'text-slate-400' : 'text-slate-500'}`}>{selected.moodStatus}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm">{TRANSPORT_ICONS[selected.transport] ?? '🚌'}</span>
                  <span className={`text-[10px] ${isNight ? 'text-slate-500' : 'text-slate-400'}`}>{selected.route} · {selected.distance}m</span>
                </div>
              </div>
              <a href="/chats" className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isNight ? 'bg-amber-400/15 text-amber-400 border border-amber-400/30' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                Conectar
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── VISIBILITY + "+" ── */}
      <div className="absolute bottom-24 left-4 right-4 z-20 flex items-center gap-2">
        <div className={`flex-1 flex items-center rounded-2xl border overflow-hidden ${glass}`}>
          {VISIBILITY_OPTIONS.map(({ value, label, color }) => (
            <button key={value} onClick={() => setVisibility(value)}
              className={`flex-1 py-3 text-[10px] font-bold tracking-widest transition-all duration-200 ${
                profile.visibility === value
                  ? isNight ? 'bg-amber-400/15 text-amber-400' : 'bg-amber-50 text-amber-700'
                  : `${color} opacity-40 hover:opacity-70`
              }`}>{label}</button>
          ))}
        </div>
        <button onClick={showVibesToast}
          className={`flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center border transition-all active:scale-95 ${
            isNight ? 'bg-amber-400/15 border-amber-400/30 text-amber-400' : 'bg-amber-100 border-amber-200 text-amber-700'}`}>
          <Plus size={18} />
        </button>
      </div>

      {/* ── TOAST ── */}
      {toast && (
        <div className="absolute bottom-40 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className={`px-5 py-3 rounded-2xl text-sm font-medium shadow-lg border ${glass}`}>
            Próximamente: dejar un Vibe en el mapa
          </div>
        </div>
      )}
    </div>
  );
}

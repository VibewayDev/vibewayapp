import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export type GpsMode = 'full' | 'eco';

interface GpsCtx {
  userPos: [number, number];
  gpsAccuracy: number | null;
  gpsReady: boolean;
  gpsMode: GpsMode;
  setGpsMode: (mode: GpsMode) => void;
}

const DEFAULT_CENTER: [number, number] = [-33.45, -70.65];

const Ctx = createContext<GpsCtx>({
  userPos: DEFAULT_CENTER,
  gpsAccuracy: null,
  gpsReady: false,
  gpsMode: 'full',
  setGpsMode: () => {},
});

export function GpsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [userPos, setUserPos]         = useState<[number, number]>(DEFAULT_CENTER);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsReady, setGpsReady]       = useState(false);
  const [gpsMode, setGpsMode]         = useState<GpsMode>('full');

  const userPosRef    = useRef<[number, number]>(DEFAULT_CENTER);
  const gpsReadyRef   = useRef(false);
  const gpsModeRef    = useRef<GpsMode>('full');
  const visibilityRef = useRef<string>('public');

  useEffect(() => { gpsModeRef.current = gpsMode; }, [gpsMode]);

  // GPS persistente
  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(newPos);
        setGpsAccuracy(Math.round(pos.coords.accuracy));
        setGpsReady(true);
        userPosRef.current  = newPos;
        gpsReadyRef.current = true;

        // En modo full publicar en cada actualización GPS
        if (gpsModeRef.current === 'full' && user?.id && visibilityRef.current !== 'off') {
          supabase.from('profiles').update({
            last_lat:  pos.coords.latitude,
            last_lng:  pos.coords.longitude,
            last_seen: new Date().toISOString(),
          }).eq('id', user.id).catch(() => {});
        }
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [user]);

  // Intervalo de publicación según modo
  useEffect(() => {
    if (!user?.id) return;

    // Full GPS: cada 15 segundos | Ahorro GPS: cada 2 minutos
    const interval = gpsMode === 'full' ? 15_000 : 120_000;

    const id = setInterval(() => {
      if (!gpsReadyRef.current) return;
      if (visibilityRef.current === 'off') return;
      const [lat, lng] = userPosRef.current;
      supabase.from('profiles').update({
        last_lat:  lat,
        last_lng:  lng,
        last_seen: new Date().toISOString(),
      }).eq('id', user.id).catch(() => {});
    }, interval);

    return () => clearInterval(id);
  }, [user, gpsMode]);

  return (
    <Ctx.Provider value={{ userPos, gpsAccuracy, gpsReady, gpsMode, setGpsMode }}>
      {children}
    </Ctx.Provider>
  );
}

export function useGps() { return useContext(Ctx); }

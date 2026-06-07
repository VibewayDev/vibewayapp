import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface GpsCtx {
  userPos: [number, number];
  gpsAccuracy: number | null;
  gpsReady: boolean;
}

const DEFAULT_CENTER: [number, number] = [-33.45, -70.65];

const Ctx = createContext<GpsCtx>({
  userPos: DEFAULT_CENTER,
  gpsAccuracy: null,
  gpsReady: false,
});

export function GpsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [userPos, setUserPos]       = useState<[number, number]>(DEFAULT_CENTER);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsReady, setGpsReady]     = useState(false);

  const userPosRef    = useRef<[number, number]>(DEFAULT_CENTER);
  const gpsReadyRef   = useRef(false);
  const visibilityRef = useRef<string>('public');

  // Escuchar cambios de visibilidad desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem('vibeway_visibility');
    if (stored) visibilityRef.current = stored;
  }, []);

  // GPS persistente — nunca se detiene mientras la app esté abierta
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

        // Publicar posición en Supabase si hay sesión activa
        if (user?.id && visibilityRef.current !== 'off') {
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

  // Publicar posición cada 30s (respaldo)
  useEffect(() => {
    if (!user?.id) return;
    const id = setInterval(() => {
      if (!gpsReadyRef.current) return;
      if (visibilityRef.current === 'off') return;
      const [lat, lng] = userPosRef.current;
      supabase.from('profiles').update({
        last_lat:  lat,
        last_lng:  lng,
        last_seen: new Date().toISOString(),
      }).eq('id', user.id).catch(() => {});
    }, 30_000);
    return () => clearInterval(id);
  }, [user]);

  return (
    <Ctx.Provider value={{ userPos, gpsAccuracy, gpsReady }}>
      {children}
    </Ctx.Provider>
  );
}

export function useGps() { return useContext(Ctx); }

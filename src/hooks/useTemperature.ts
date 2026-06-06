
import { useState, useEffect } from 'react';

interface TemperatureResult {
  temp: number | null;
  loading: boolean;
}

export function useTemperature(): TemperatureResult {
  const [temp, setTemp]       = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchTemp(lat: number, lon: number) {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      const data = await res.json();
      setTemp(Math.round(data.current_weather.temperature));
    } catch {
      setTemp(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!navigator.geolocation) { setLoading(false); return; }

    navigator.geolocation.getCurrentPosition(
      (pos) => fetchTemp(pos.coords.latitude, pos.coords.longitude),
      ()    => { setTemp(null); setLoading(false); }
    );

    // Actualizar cada 10 minutos
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchTemp(pos.coords.latitude, pos.coords.longitude),
        () => {}
      );
    }, 600_000);

    return () => clearInterval(interval);
  }, []);

  return { temp, loading };
}

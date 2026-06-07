// Simulated wireless connectivity module
// Abstracts GPS, BLE Mesh, and Wi-Fi Direct behind a clean interface.
// All hardware calls are mocked — no native packages required.

export type TransportMode = 'bus' | 'metro' | 'train' | 'tram' | 'ferry' | 'car' | 'walking';
export type VisibilityMode = 'public' | 'enigma' | 'off';

export interface NearbyTraveler {
  id: string;
  username: string;
  avatarColor: string;
  avatarInitial: string;
  moodStatus: string;
  visibility: VisibilityMode;
  transport: TransportMode;
  route: string;
  distance: number; // meters
  bearing: number;  // 0-360 degrees from north
  radarX: number;   // normalized -1 to 1
  radarY: number;   // normalized -1 to 1
  signalStrength: number; // 0-1
  lastSeen: Date;
}

export interface GPSPosition {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: Date;
}

const MOCK_TRAVELERS: Omit<NearbyTraveler, 'radarX' | 'radarY'>[] = [];

function bearingToXY(bearing: number, distance: number, maxRadius: number): { x: number; y: number } {
  const norm = Math.min(distance / maxRadius, 0.92);
  const rad = ((bearing - 90) * Math.PI) / 180;
  return {
    x: Math.cos(rad) * norm,
    y: Math.sin(rad) * norm,
  };
}

class ConnectivityModule {
  private listeners: Set<(travelers: NearbyTraveler[]) => void> = new Set();
  private gpsListeners: Set<(pos: GPSPosition) => void> = new Set();
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private gpsIntervalId: ReturnType<typeof setInterval> | null = null;
  private currentPosition: GPSPosition = { lat: 41.3874, lng: 2.1686, accuracy: 12, timestamp: new Date() };
  private readonly MAX_RADAR_METERS = 500;
  private jitter = 0;

  start() {
    this.intervalId = setInterval(() => this.tick(), 3500);
    this.gpsIntervalId = setInterval(() => this.tickGPS(), 5000);
    this.tick();
  }

  stop() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.gpsIntervalId) clearInterval(this.gpsIntervalId);
  }

  private tick() {
    this.jitter += 1;
    const travelers: NearbyTraveler[] = MOCK_TRAVELERS.map((t) => {
      const distanceVariation = t.distance + Math.sin(this.jitter * 0.3 + t.bearing) * 25;
      const bearingVariation  = t.bearing  + Math.cos(this.jitter * 0.2 + t.distance * 0.01) * 5;
      const { x, y } = bearingToXY(bearingVariation, distanceVariation, this.MAX_RADAR_METERS);
      return { ...t, radarX: x, radarY: y, distance: Math.round(distanceVariation), lastSeen: new Date() };
    });
    this.listeners.forEach((cb) => cb(travelers));
  }

  private tickGPS() {
    this.currentPosition = {
      lat: 41.3874 + (Math.random() - 0.5) * 0.0002,
      lng: 2.1686  + (Math.random() - 0.5) * 0.0002,
      accuracy: 8 + Math.random() * 8,
      timestamp: new Date(),
    };
    this.gpsListeners.forEach((cb) => cb(this.currentPosition));
  }

  onTravelers(cb: (travelers: NearbyTraveler[]) => void) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  onGPS(cb: (pos: GPSPosition) => void) {
    this.gpsListeners.add(cb);
    return () => this.gpsListeners.delete(cb);
  }

  getPosition() { return this.currentPosition; }
}

export const connectivity = new ConnectivityModule();

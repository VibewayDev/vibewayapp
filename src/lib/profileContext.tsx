// Global user context — simulates a logged-in traveler for the prototype
import { createContext, useContext, useState, ReactNode } from 'react';
import type { VisibilityMode, TransportMode } from './connectivity';

export interface SelfProfile {
  id: string;
  username: string;
  avatarColor: string;
  avatarInitial: string;
  moodStatus: string;
  visibility: VisibilityMode;
  transport: TransportMode;
  route: string;
}

interface ProfileCtx {
  profile: SelfProfile;
  setMood: (mood: string) => void;
  setVisibility: (v: VisibilityMode) => void;
  setTransport: (t: TransportMode) => void;
}

const DEFAULT: SelfProfile = {
  id:            'self',
  username:      'tú',
  avatarColor:   'from-amber-400 to-orange-500',
  avatarInitial: 'T',
  moodStatus:    'En camino al trabajo 🚌',
  visibility:    'public',
  transport:     'bus',
  route:         'Línea 42',
};

const Ctx = createContext<ProfileCtx>({
  profile: DEFAULT,
  setMood: () => {},
  setVisibility: () => {},
  setTransport: () => {},
});

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<SelfProfile>(DEFAULT);

  const setMood       = (moodStatus: string)    => setProfile((p) => ({ ...p, moodStatus }));
  const setVisibility = (visibility: VisibilityMode) => setProfile((p) => ({ ...p, visibility }));
  const setTransport  = (transport: TransportMode)   => setProfile((p) => ({ ...p, transport }));

  return <Ctx.Provider value={{ profile, setMood, setVisibility, setTransport }}>{children}</Ctx.Provider>;
}

export function useProfile() { return useContext(Ctx); }

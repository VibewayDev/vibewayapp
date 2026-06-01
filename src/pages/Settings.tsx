import { useState } from 'react';
import {
  User, Bell, Shield, Palette, Globe, Headphones,
  ChevronRight, Toggle, Moon, Sun, Volume2, Wifi,
} from 'lucide-react';

const sections = [
  {
    id: 'account',
    icon: User,
    label: 'Account',
    desc: 'Profile, email, password',
  },
  {
    id: 'notifications',
    icon: Bell,
    label: 'Notifications',
    desc: 'Manage your alerts',
  },
  {
    id: 'privacy',
    icon: Shield,
    label: 'Privacy & Security',
    desc: 'Who can see your activity',
  },
  {
    id: 'appearance',
    icon: Palette,
    label: 'Appearance',
    desc: 'Theme, colors, layout',
  },
  {
    id: 'audio',
    icon: Headphones,
    label: 'Audio',
    desc: 'Quality, equalizer, output',
  },
  {
    id: 'language',
    icon: Globe,
    label: 'Language & Region',
    desc: 'Locale, timezone',
  },
];

interface ToggleRowProps {
  label: string;
  desc?: string;
  defaultOn?: boolean;
}

function ToggleRow({ label, desc, defaultOn = false }: ToggleRowProps) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-white text-sm font-medium">{label}</p>
        {desc && <p className="text-gray-500 text-xs mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`relative w-11 h-6 rounded-full transition-all duration-300 ${on ? 'bg-vibe-600 shadow-neon-sm' : 'bg-dark-muted'}`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${on ? 'left-5.5 left-[calc(100%-22px)]' : 'left-0.5'}`}
        />
      </button>
    </div>
  );
}

export default function Settings() {
  const [active, setActive] = useState('account');

  const current = sections.find((s) => s.id === active);
  const Icon = current?.icon ?? User;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Settings</h1>
        <p className="text-gray-500 text-sm">Manage your vibeway experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar nav */}
        <div className="space-y-1">
          {sections.map(({ id, icon: SIcon, label, desc }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 group ${
                active === id
                  ? 'bg-vibe-600/20 border border-vibe-600/30 shadow-neon-sm'
                  : 'border border-transparent hover:bg-dark-surface hover:border-dark-border'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${active === id ? 'bg-vibe-600/30' : 'bg-dark-card group-hover:bg-dark-muted'}`}>
                <SIcon size={15} className={active === id ? 'text-vibe-400' : 'text-gray-500'} />
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-medium ${active === id ? 'text-vibe-300' : 'text-gray-300'}`}>{label}</p>
                <p className="text-xs text-gray-600 truncate">{desc}</p>
              </div>
              {active === id && <ChevronRight size={14} className="ml-auto text-vibe-400" />}
            </button>
          ))}
        </div>

        {/* Content panel */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-dark-surface border border-dark-border">
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-dark-border">
            <div className="w-9 h-9 rounded-xl bg-vibe-600/20 flex items-center justify-center">
              <Icon size={16} className="text-vibe-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">{current?.label}</h2>
              <p className="text-gray-500 text-xs">{current?.desc}</p>
            </div>
          </div>

          {/* Account section */}
          {active === 'account' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-vibe-500 to-neon-pink flex items-center justify-center text-white text-xl font-bold shadow-neon">
                  V
                </div>
                <div>
                  <p className="text-white font-medium">vibeway user</p>
                  <p className="text-gray-500 text-xs">user@vibeway.app</p>
                  <button className="mt-1 text-xs text-vibe-400 hover:text-vibe-300 transition-colors duration-200">
                    Change avatar
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {[{ label: 'Display name', val: 'vibeway user' }, { label: 'Username', val: '@vibeuser' }, { label: 'Email', val: 'user@vibeway.app' }].map(({ label, val }) => (
                  <div key={label}>
                    <label className="text-xs text-gray-500 font-medium block mb-1.5">{label}</label>
                    <input
                      defaultValue={val}
                      className="w-full px-4 py-3 rounded-xl bg-dark-card border border-dark-border text-white text-sm focus:outline-none focus:border-vibe-600/60 focus:shadow-neon-sm transition-all duration-200"
                    />
                  </div>
                ))}
                <button className="px-5 py-2.5 rounded-xl bg-vibe-600 text-white text-sm font-medium hover:bg-vibe-500 shadow-neon-sm transition-all duration-200">
                  Save changes
                </button>
              </div>
            </div>
          )}

          {/* Notifications section */}
          {active === 'notifications' && (
            <div className="divide-y divide-dark-border">
              <ToggleRow label="Likes" desc="When someone likes your vibe" defaultOn />
              <ToggleRow label="New followers" desc="When someone follows you" defaultOn />
              <ToggleRow label="Revibes" desc="When someone revibes your track" defaultOn />
              <ToggleRow label="Live alerts" desc="When followed artists go live" />
              <ToggleRow label="Weekly digest" desc="Summary of your week on vibeway" defaultOn />
              <ToggleRow label="Marketing emails" desc="Tips, features, and updates" />
            </div>
          )}

          {/* Privacy section */}
          {active === 'privacy' && (
            <div className="divide-y divide-dark-border">
              <ToggleRow label="Private profile" desc="Only followers can see your vibes" />
              <ToggleRow label="Hide listening activity" desc="Don't show what you're playing" />
              <ToggleRow label="Two-factor authentication" desc="Add an extra layer of security" defaultOn />
              <ToggleRow label="Allow tagging" desc="Others can tag you in posts" defaultOn />
            </div>
          )}

          {/* Appearance section */}
          {active === 'appearance' && (
            <div className="space-y-5">
              <div>
                <p className="text-white text-sm font-medium mb-3">Theme</p>
                <div className="flex gap-3">
                  {[{ icon: Moon, label: 'Dark', active: true }, { icon: Sun, label: 'Light', active: false }].map(({ icon: T, label, active: a }) => (
                    <button
                      key={label}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${a ? 'bg-vibe-600/20 border-vibe-600/30 text-vibe-300 shadow-neon-sm' : 'border-dark-border text-gray-400 hover:border-vibe-600/30 hover:text-white'}`}
                    >
                      <T size={14} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="divide-y divide-dark-border">
                <ToggleRow label="Reduce motion" desc="Minimize animations and transitions" />
                <ToggleRow label="Compact layout" desc="Show more content in less space" />
              </div>
            </div>
          )}

          {/* Audio section */}
          {active === 'audio' && (
            <div className="space-y-5">
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-2">Streaming quality</label>
                <select className="w-full px-4 py-3 rounded-xl bg-dark-card border border-dark-border text-white text-sm focus:outline-none focus:border-vibe-600/60 transition-all duration-200">
                  <option>High (320kbps)</option>
                  <option>Standard (128kbps)</option>
                  <option>Low (64kbps)</option>
                </select>
              </div>
              <div className="divide-y divide-dark-border">
                <ToggleRow label="Normalize volume" desc="Keep consistent volume across tracks" defaultOn />
                <ToggleRow label="Crossfade" desc="Smooth transitions between tracks" />
              </div>
            </div>
          )}

          {/* Language section */}
          {active === 'language' && (
            <div className="space-y-4">
              {[{ label: 'Language', options: ['English', 'Spanish', 'French', 'German', 'Japanese'] }, { label: 'Timezone', options: ['UTC', 'UTC-5 (EST)', 'UTC+1 (CET)', 'UTC+8 (CST)'] }].map(({ label, options }) => (
                <div key={label}>
                  <label className="text-xs text-gray-500 font-medium block mb-1.5">{label}</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-dark-card border border-dark-border text-white text-sm focus:outline-none focus:border-vibe-600/60 transition-all duration-200">
                    {options.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

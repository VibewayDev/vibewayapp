import { NavLink } from 'react-router-dom';
import { Radar, MessageSquare, User } from 'lucide-react';
import { useTheme } from '../lib/timeTheme';

const tabs = [
  { to: '/radar',    icon: Radar,         label: 'Radar' },
  { to: '/chats',    icon: MessageSquare, label: 'Encuentros' },
  { to: '/perfil',   icon: User,          label: 'Perfil' },
];

export default function Navbar() {
  const { theme } = useTheme();
  const isNight = theme === 'night';

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-xl ${
        isNight
          ? 'bg-night-deep/90 border-night-border'
          : 'bg-white/90 border-day-border'
      }`}
    >
      <div className="flex items-center justify-around max-w-md mx-auto px-2 py-2">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-6 py-2 rounded-2xl transition-all duration-200 ${
                isActive
                  ? isNight
                    ? 'text-radar-gold'
                    : 'text-amber-600'
                  : isNight
                    ? 'text-night-muted'
                    : 'text-day-muted'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? isNight
                        ? 'bg-radar-gold/15 shadow-neon-gold'
                        : 'bg-amber-100'
                      : ''
                  }`}
                >
                  <Icon
                    size={20}
                    className={isActive
                      ? isNight ? 'text-radar-gold' : 'text-amber-600'
                      : isNight ? 'text-slate-500' : 'text-slate-400'
                    }
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                </div>
                <span
                  className={`text-[10px] font-medium ${
                    isActive
                      ? isNight ? 'text-radar-gold' : 'text-amber-600'
                      : isNight ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

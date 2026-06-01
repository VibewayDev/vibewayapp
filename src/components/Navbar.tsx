import { NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, Bell, User, Settings, Zap } from 'lucide-react';
import Logo from './Logo';

const navItems = [
  { to: '/home',     icon: Home,     label: 'Home' },
  { to: '/explore',  icon: Compass,  label: 'Explore' },
  { to: '/vibes',    icon: Zap,      label: 'Vibes' },
  { to: '/activity', icon: Bell,     label: 'Activity' },
  { to: '/profile',  icon: User,     label: 'Profile' },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-dark-surface border-r border-dark-border z-40">
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-dark-border">
          <Logo size={40} animated />
          <span className="text-xl font-bold tracking-tight text-white">
            vibe<span className="text-vibe-400">way</span>
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-vibe-600/20 text-vibe-300 shadow-neon-sm border border-vibe-600/30'
                    : 'text-gray-400 hover:text-white hover:bg-dark-card'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    className={`transition-all duration-200 ${
                      isActive ? 'text-vibe-400' : 'text-gray-500 group-hover:text-gray-300'
                    }`}
                  />
                  {label}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-vibe-400 shadow-neon-sm" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Settings at bottom */}
        <div className="px-3 py-4 border-t border-dark-border">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-vibe-600/20 text-vibe-300 shadow-neon-sm border border-vibe-600/30'
                  : 'text-gray-400 hover:text-white hover:bg-dark-card'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Settings
                  size={18}
                  className={`transition-all duration-200 ${
                    isActive ? 'text-vibe-400' : 'text-gray-500 group-hover:text-gray-300'
                  }`}
                />
                Settings
              </>
            )}
          </NavLink>

          {/* User pill */}
          <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-card border border-dark-border">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-vibe-500 to-neon-pink flex items-center justify-center text-white text-xs font-bold shadow-neon-sm">
              V
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">vibeway user</p>
              <p className="text-xs text-gray-500 truncate">Free plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-surface/95 backdrop-blur-md border-t border-dark-border z-40">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                  isActive ? 'text-vibe-300' : 'text-gray-500'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-lg transition-all duration-200 ${isActive ? 'bg-vibe-600/25' : ''}`}>
                    <Icon size={18} className={isActive ? 'text-vibe-400' : 'text-gray-500'} />
                  </div>
                  <span className={isActive ? 'text-vibe-300' : ''}>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-dark-surface/95 backdrop-blur-md border-b border-dark-border z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Logo size={32} animated />
            <span className="text-lg font-bold tracking-tight text-white">
              vibe<span className="text-vibe-400">way</span>
            </span>
          </div>
          <NavLink to="/profile">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-vibe-500 to-neon-pink flex items-center justify-center text-white text-xs font-bold shadow-neon-sm">
              V
            </div>
          </NavLink>
        </div>
      </header>
    </>
  );
}

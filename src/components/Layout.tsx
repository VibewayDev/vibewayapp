import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useTheme } from '../lib/timeTheme';

export default function Layout() {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen transition-colors duration-700 ${
        theme === 'night' ? 'bg-night-base' : 'bg-day-base'
      }`}
    >
      <main className="pb-24 min-h-screen">
        <Outlet />
      </main>
      <Navbar />
    </div>
  );
}

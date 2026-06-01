import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-dark-base bg-vibe-mesh">
      <Navbar />

      {/* Content area — offset for sidebar on desktop, top/bottom bars on mobile */}
      <main className="md:ml-64 pt-16 pb-20 md:pt-0 md:pb-0 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

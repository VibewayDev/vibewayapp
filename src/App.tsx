import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './lib/timeTheme';
import { ProfileProvider } from './lib/profileContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GpsProvider } from './contexts/GpsContext';
import Layout from './components/Layout';
import Welcome from './pages/Welcome';
import RadarPage from './pages/Radar';
import Chats from './pages/Chats';
import Perfil from './pages/Perfil';
import LoginPage from './pages/LoginPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-[#04091a] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
    </div>
  );
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { session } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={session ? <Navigate to="/radar" replace /> : <LoginPage />} />
      <Route path="/" element={<Welcome />} />
      <Route element={<Layout />}>
        <Route path="/radar"  element={<ProtectedRoute><RadarPage /></ProtectedRoute>} />
        <Route path="/chats"  element={<ProtectedRoute><Chats /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function AppWithGps() {
  const { session } = useAuth();
  if (!session) return <AppRoutes />;
  return (
    <GpsProvider>
      <AppRoutes />
    </GpsProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppWithGps />
          </BrowserRouter>
        </AuthProvider>
      </ProfileProvider>
    </ThemeProvider>
  );
}

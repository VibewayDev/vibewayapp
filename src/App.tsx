import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './lib/timeTheme';
import { ProfileProvider } from './lib/profileContext';
import Layout from './components/Layout';
import Welcome from './pages/Welcome';
import RadarPage from './pages/Radar';
import Chats from './pages/Chats';
import Perfil from './pages/Perfil';

export default function App() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route element={<Layout />}>
              <Route path="/radar"  element={<RadarPage />} />
              <Route path="/chats"  element={<Chats />} />
              <Route path="/perfil" element={<Perfil />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ProfileProvider>
    </ThemeProvider>
  );
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Vibes from './pages/Vibes';
import Activity from './pages/Activity';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route element={<Layout />}>
          <Route path="/home"     element={<Home />} />
          <Route path="/explore"  element={<Explore />} />
          <Route path="/vibes"    element={<Vibes />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/profile"  element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

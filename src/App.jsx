import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Auth from './Auth';
import Chat from './Chat';
import Profile from './Profile';
import SettingsView from './SettingsView';
import SubscriptionView from './SubscriptionView';
import Background3D from './Background3D';
import BottomNav from './BottomNav';
import './App.css';

export default function App() {
  const [auth, setAuth] = useState(() => {
    try {
      const saved = localStorage.getItem('ps_auth');
      return saved && saved !== 'undefined' ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('ps_theme') || 'theme-5';
  });

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('ps_theme', theme);
  }, [theme]);

  useEffect(() => {
    if (auth) {
      localStorage.setItem('ps_auth', JSON.stringify(auth));
    } else {
      localStorage.removeItem('ps_auth');
    }
  }, [auth]);

  return (
    <Router>
      <Background3D />
      <Routes>
        <Route path="/" element={!auth ? <Auth setAuth={setAuth} /> : <Navigate to="/chat" />} />
        <Route path="/chat" element={auth ? <Chat auth={auth} setAuth={setAuth} /> : <Navigate to="/" />} />
        <Route path="/profile" element={auth ? <Profile auth={auth} setAuth={setAuth} /> : <Navigate to="/" />} />
        <Route path="/settings" element={auth ? <SettingsView auth={auth} theme={theme} setTheme={setTheme} /> : <Navigate to="/" />} />
        <Route path="/subscription" element={auth ? <SubscriptionView auth={auth} /> : <Navigate to="/" />} />
      </Routes>
      {auth && <BottomNav />}
    </Router>
  );
}

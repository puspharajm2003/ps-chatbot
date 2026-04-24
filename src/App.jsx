import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './Auth';
import Chat from './Chat';
import Profile from './Profile';
import SettingsView from './SettingsView';
import Background3D from './Background3D';
import BottomNav from './BottomNav';
import './App.css';

export default function App() {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem('ps_auth');
    return saved ? JSON.parse(saved) : null;
  });

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
        <Route 
          path="/" 
          element={!auth ? <Auth setAuth={setAuth} /> : <Navigate to="/chat" />} 
        />
        <Route 
          path="/chat" 
          element={auth ? <Chat auth={auth} setAuth={setAuth} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/profile" 
          element={auth ? <Profile auth={auth} setAuth={setAuth} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/settings" 
          element={auth ? <SettingsView auth={auth} /> : <Navigate to="/" />} 
        />
      </Routes>
      {auth && <BottomNav />}
    </Router>
  );
}

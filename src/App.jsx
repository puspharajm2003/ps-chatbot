import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './Auth';
import Chat from './Chat';
import Profile from './Profile';
import './App.css';

export default function App() {
  const [auth, setAuth] = useState(null);

  return (
    <Router>
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
      </Routes>
    </Router>
  );
}

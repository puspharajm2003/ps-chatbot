import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Mail, User, Sparkles } from 'lucide-react';
import './Auth.css';

export default function Auth({ setAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Authentication failed');

      setAuth({
        ...data,
        type: 'premium'
      });
      if (data.api_key) localStorage.setItem('openRouterKey', data.api_key);
      navigate('/chat');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTempChat = () => {
    setAuth({
      name: 'Guest User',
      type: 'guest'
    });
    navigate('/chat');
  };

  return (
    <div className="auth-container">
      <div className="auth-brand">
        <img src="/logo.png" alt="PS Chatbot Logo" className="auth-logo" />
        <h2>PS Chatbot</h2>
        <p>The Pinnacle of Luxury Intelligence</p>
      </div>

      <motion.div 
        className="auth-card glass-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3>{isLogin ? 'Welcome Back' : 'Create Account'}</h3>
        <p className="auth-subtitle">
          {isLogin ? 'Enter your credentials to access your intelligence suite.' : 'Join the elite echelon of AI users.'}
        </p>

        {error && (
          <div style={{ padding: 10, marginBottom: 16, borderRadius: 8, background: 'rgba(255, 0, 0, 0.1)', color: '#f87171', fontSize: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="input-group">
              <User size={18} className="input-icon" />
              <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          )}
          
          <div className="input-group">
            <Mail size={18} className="input-icon" />
            <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className="input-group">
            <Lock size={18} className="input-icon" />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn-primary w-full mt-4" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')} <ArrowRight size={18} style={{ display: 'inline', marginLeft: '8px' }} />
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button onClick={handleTempChat} className="btn-glass w-full flex-center">
          <Sparkles size={18} style={{ marginRight: '8px' }} /> Continue as Guest (Temp Chat)
        </button>

        <p className="auth-switch">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-gradient">
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}

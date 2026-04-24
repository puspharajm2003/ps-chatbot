import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Lock, Key, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile({ auth, setAuth }) {
  const navigate = useNavigate();
  const [name, setName] = useState(auth?.name || '');
  const [password, setPassword] = useState('');
  const [apiKey, setApiKey] = useState(auth?.api_key || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!auth || auth.type === 'guest') {
      setMessage('Guest users cannot save profile settings.');
      return;
    }
    
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: auth.id,
          name,
          password: password || undefined,
          api_key: apiKey
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setAuth({ ...auth, name: data.name, api_key: data.api_key });
      localStorage.setItem('openRouterKey', data.api_key); // keep local sync for chat
      setMessage('Profile updated successfully!');
      setPassword(''); // clear password field
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ position: 'relative' }}>
      <button 
        onClick={() => navigate('/chat')} 
        className="btn-glass"
        style={{ position: 'absolute', top: 32, left: 32, display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <ArrowLeft size={16} /> Back to Chat
      </button>

      <motion.div 
        className="auth-card glass-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 style={{ marginBottom: 24, fontSize: 28, color: 'var(--accent-gold)' }}>Profile & Settings</h3>
        
        {message && (
          <div style={{ padding: 12, marginBottom: 20, borderRadius: 8, background: message.includes('success') ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)', color: message.includes('success') ? '#4ade80' : '#f87171', fontSize: 14 }}>
            {message}
          </div>
        )}

        <form onSubmit={handleUpdate} className="auth-form">
          <div className="input-group">
            <User size={18} className="input-icon" />
            <input 
              type="text" 
              placeholder="Username" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required={auth?.type !== 'guest'} 
              disabled={auth?.type === 'guest'}
            />
          </div>

          <div className="input-group">
            <Lock size={18} className="input-icon" />
            <input 
              type="password" 
              placeholder="New Password (leave blank to keep current)" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              disabled={auth?.type === 'guest'} 
            />
          </div>

          <div className="input-group" style={{ marginTop: 16 }}>
            <Key size={18} className="input-icon" />
            <input 
              type="password" 
              placeholder="OpenRouter API Key" 
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)} 
              disabled={auth?.type === 'guest'}
            />
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginLeft: 8 }}>This key securely saves to your account and authenticates Free Text Models.</p>

          <button type="submit" className="btn-primary w-full mt-4" disabled={loading || auth?.type === 'guest'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Save size={18} /> {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

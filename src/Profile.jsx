import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Key, Lock, Save, Sparkles, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { getUsageStats } from './accountData';
import './AccountPages.css';

export default function Profile({ auth, setAuth }) {
  const navigate = useNavigate();
  const [name, setName] = useState(auth?.name || '');
  const [password, setPassword] = useState('');
  const [apiKey, setApiKey] = useState(auth?.api_key || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const profileRef = useRef(null);
  const stats = getUsageStats(auth);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.prof-anim',
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1, ease: 'power4.out' },
      );
    }, profileRef);

    return () => ctx.revert();
  }, []);

  const handleUpdate = async (event) => {
    event.preventDefault();
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
          api_key: apiKey,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setAuth({ ...auth, name: data.name, api_key: data.api_key });
      localStorage.setItem('openRouterKey', data.api_key);
      setMessage('Profile updated successfully!');
      setPassword('');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-page" ref={profileRef}>
      <button onClick={() => navigate('/chat')} className="btn-glass account-back prof-anim">
        <ArrowLeft size={16} /> Back to Hub
      </button>

      <div className="account-shell">
        <section className="account-hero prof-anim">
          <div className="account-kicker">
            <Sparkles size={14} /> Profile
          </div>
          <h1 className="text-gradient">Identity management</h1>
          <p>
            Update your saved profile, keep your OpenRouter key synced, and review your usage at a glance without leaving the dashboard.
          </p>
        </section>

        <section className="account-stat-grid prof-anim">
          {stats.metrics.map((metric) => (
            <article key={metric.label} className="account-stat-card">
              <div className="account-stat-label">{metric.label}</div>
              <div className="account-stat-value">{metric.value}</div>
              <div className="account-stat-note">{metric.note}</div>
            </article>
          ))}
        </section>

        <section className="account-main-grid">
          <article className="account-panel prof-anim">
            <h2>Profile details</h2>
            <p>Saved changes sync to your authenticated workspace. Guest sessions can view details here but cannot persist updates.</p>

            {message && (
              <div className={`account-message ${message.includes('successfully') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleUpdate} className="account-form">
              <div>
                <label className="account-field-label">Display name</label>
                <div className="account-input-row">
                  <User size={18} />
                  <input
                    type="text"
                    placeholder="Username"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required={auth?.type !== 'guest'}
                    disabled={auth?.type === 'guest'}
                  />
                </div>
              </div>

              <div>
                <label className="account-field-label">Password</label>
                <div className="account-input-row">
                  <Lock size={18} />
                  <input
                    type="password"
                    placeholder="New Password (leave blank to keep current)"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={auth?.type === 'guest'}
                  />
                </div>
              </div>

              <div>
                <label className="account-field-label">OpenRouter API key</label>
                <div className="account-input-row">
                  <Key size={18} />
                  <input
                    type="password"
                    placeholder="OpenRouter API Key"
                    value={apiKey}
                    onChange={(event) => setApiKey(event.target.value)}
                    disabled={auth?.type === 'guest'}
                  />
                </div>
                <p className="account-helper">This key is saved to your account and used for compatible text models inside chat.</p>
              </div>

              <button type="submit" className="btn-primary account-button" disabled={loading || auth?.type === 'guest'}>
                <Save size={18} /> {loading ? 'Saving...' : 'Save profile'}
              </button>
            </form>
          </article>

          <aside className="account-panel prof-anim">
            <h2>Account summary</h2>
            <p>{stats.plan} / {stats.renewal}</p>
            <div className="account-summary-list">
              {stats.usageRows.map((row) => (
                <div key={row.label} className="account-summary-item">
                  <div>
                    <strong>{row.label}</strong>
                    <span>{row.detail}</span>
                  </div>
                  <span className="usage-pill">{row.value}</span>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

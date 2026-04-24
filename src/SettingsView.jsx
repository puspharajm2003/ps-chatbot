import { useEffect, useRef, useState } from 'react';
import { Activity, ArrowLeft, BarChart3, Database, Image as ImageIcon, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { getUsageStats, subscribeToUsage } from './accountData';
import './AccountPages.css';

export default function SettingsView({ auth }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [stats, setStats] = useState(() => getUsageStats(auth));

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.stagger-item',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out' },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    setStats(getUsageStats(auth));

    const unsubscribe = subscribeToUsage(() => {
      setStats(getUsageStats(auth));
    });

    const intervalId = window.setInterval(() => {
      setStats(getUsageStats(auth));
    }, 30000);

    return () => {
      unsubscribe();
      window.clearInterval(intervalId);
    };
  }, [auth]);

  const icons = [Activity, ImageIcon, Video];
  const liveSignals = [
    { label: 'Session', value: stats.sessionStatus },
    { label: 'Plan', value: stats.plan },
    { label: 'API key', value: stats.apiKeyStatus },
    { label: 'Last activity', value: stats.lastActivity },
  ];

  return (
    <div className="account-page settings-page" ref={containerRef}>
      <button onClick={() => navigate('/chat')} className="btn-glass account-back stagger-item">
        <ArrowLeft size={16} /> Back to Hub
      </button>

      <div className="settings-layout">
        <div className="settings-main-column">
          <section className="account-hero stagger-item">
            <div className="account-kicker">
              <BarChart3 size={14} /> Usage
            </div>
            <h1 className="text-gradient">Intelligence dashboard</h1>
            <p>Live usage pulled from your current app activity across chat, image, and video tools.</p>
          </section>

          <section className="account-stat-grid">
            {stats.metrics.map((metric, index) => {
              const Icon = icons[index] || Activity;

              return (
                <article key={metric.label} className="account-stat-card stagger-item">
                  <div className="account-kicker" style={{ marginBottom: 14 }}>
                    <Icon size={14} /> {metric.label}
                  </div>
                  <div className="account-stat-value">{metric.value}</div>
                  <div className="account-stat-note">{metric.note}</div>
                </article>
              );
            })}
          </section>

          <section className="account-panel stagger-item">
            <h2>Usage breakdown</h2>
            <p>{stats.usageSummary}</p>
            <div className="usage-list">
              {stats.usageRows.map((row) => (
                <div key={row.label} className="usage-row">
                  <div>
                    <strong>{row.label}</strong>
                    <span>{row.detail}</span>
                  </div>
                  <span className="usage-pill">{row.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="account-panel stagger-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <Database size={24} color="var(--accent-gold)" />
              <h2 style={{ marginBottom: 0 }}>Recent activity</h2>
            </div>

            <div className="usage-list">
              {stats.history.length > 0 ? (
                stats.history.map((item) => (
                  <div key={item.id} className="usage-row">
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.timestamp} / {item.detail}</span>
                    </div>
                    <span className="usage-pill">{item.type}</span>
                  </div>
                ))
              ) : (
                <div className="usage-empty">
                  Start chatting or generating media to see real usage data here.
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="settings-art-panel stagger-item">
          <div className="settings-art-divider" />
          <section className="account-panel settings-side-card">
            <div className="account-kicker">
              <Database size={14} /> Live data
            </div>
            <h2>Current session</h2>
            <p>This panel refreshes from your actual local usage state and saved account details.</p>

            <div className="signal-grid">
              {liveSignals.map((signal) => (
                <div key={signal.label} className="signal-card">
                  <span className="signal-label">{signal.label}</span>
                  <strong className="signal-value">{signal.value}</strong>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

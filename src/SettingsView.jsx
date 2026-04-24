import { useEffect, useRef } from 'react';
import { Activity, ArrowLeft, BarChart3, Database, Image as ImageIcon, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { getUsageStats } from './accountData';
import './AccountPages.css';

export default function SettingsView({ auth }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const stats = getUsageStats(auth);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.stagger-item',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="account-page" ref={containerRef}>
      <button onClick={() => navigate('/chat')} className="btn-glass account-back stagger-item">
        <ArrowLeft size={16} /> Back to Hub
      </button>

      <div className="account-shell">
        <section className="account-hero stagger-item">
          <div className="account-kicker">
            <BarChart3 size={14} /> Usage
          </div>
          <h1 className="text-gradient">Intelligence dashboard</h1>
          <p>Advanced telemetry and usage statistics for {auth?.name || 'Guest'} across chat, image, and video tools.</p>
        </section>

        <section className="account-stat-grid">
          {stats.metrics.map((metric, index) => {
            const icons = [Activity, ImageIcon, Video];
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
            <h2 style={{ marginBottom: 0 }}>Chat history log</h2>
          </div>
          <div className="usage-list">
            {[
              { id: 1, title: 'Quantum Physics Explained', tokens: '1.2k', date: 'Today, 10:45 AM', type: 'Text' },
              { id: 2, title: 'Generate UI Mockup', tokens: 'Media', date: 'Yesterday', type: 'Image' },
              { id: 3, title: 'Real Estate Video Script', tokens: '450', date: 'Oct 12', type: 'Text' },
              { id: 4, title: 'Luxury Brand Strategy', tokens: '2.8k', date: 'Oct 10', type: 'Text' },
            ].map((log) => (
              <div key={log.id} className="usage-row">
                <div>
                  <strong>{log.title}</strong>
                  <span>{log.date} · {log.type}</span>
                </div>
                <span className="usage-pill">{log.tokens}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

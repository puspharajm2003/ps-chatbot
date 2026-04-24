import React, { useEffect, useRef } from 'react';
import { ArrowLeft, Activity, Image as ImageIcon, Video, MessageSquare, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

export default function SettingsView({ auth }) {
  const navigate = useNavigate();
  const containerRef = useRef();

  useEffect(() => {
    // GSAP Animation Sequence
    const ctx = gsap.context(() => {
      gsap.fromTo('.stagger-item', 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="auth-container" style={{ position: 'relative', background: 'transparent' }} ref={containerRef}>
      <button 
        onClick={() => navigate('/chat')} 
        className="btn-glass stagger-item"
        style={{ position: 'absolute', top: 32, left: 32, display: 'flex', alignItems: 'center', gap: 8, zIndex: 10 }}
      >
        <ArrowLeft size={16} /> Back to Hub
      </button>

      <div style={{ width: '100%', maxWidth: 900, padding: 40, marginTop: 40 }}>
        <h2 className="text-gradient stagger-item" style={{ fontSize: 48, marginBottom: 8 }}>Intelligence Dashboard</h2>
        <p className="stagger-item" style={{ color: 'var(--text-secondary)', marginBottom: 40 }}>Advanced telemetry and usage statistics for {auth?.name || 'Guest'}.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          
          <div className="glass-panel stagger-item" style={{ padding: 32, borderRadius: 24, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.1, color: 'var(--accent-gold)' }}>
              <MessageSquare size={120} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div className="btn-icon" style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent-gold)' }}>
                <Activity size={20} />
              </div>
              <h3 style={{ fontSize: 18, color: 'var(--text-secondary)' }}>Total Interactions</h3>
            </div>
            <p style={{ fontSize: 48, fontWeight: 700, color: '#fff' }}>1,284</p>
            <p style={{ fontSize: 12, color: '#4ade80', marginTop: 8 }}>+12% from last week</p>
          </div>

          <div className="glass-panel stagger-item" style={{ padding: 32, borderRadius: 24, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.1, color: 'var(--accent-gold)' }}>
              <ImageIcon size={120} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div className="btn-icon" style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent-gold)' }}>
                <ImageIcon size={20} />
              </div>
              <h3 style={{ fontSize: 18, color: 'var(--text-secondary)' }}>Images Synthesized</h3>
            </div>
            <p style={{ fontSize: 48, fontWeight: 700, color: '#fff' }}>342</p>
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 8 }}>Using PS Vision Model</p>
          </div>

          <div className="glass-panel stagger-item" style={{ padding: 32, borderRadius: 24, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.1, color: 'var(--accent-gold)' }}>
              <Video size={120} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div className="btn-icon" style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent-gold)' }}>
                <Video size={20} />
              </div>
              <h3 style={{ fontSize: 18, color: 'var(--text-secondary)' }}>Cinematic Renders</h3>
            </div>
            <p style={{ fontSize: 48, fontWeight: 700, color: '#fff' }}>89</p>
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 8 }}>Using PS Motion Model</p>
          </div>

        </div>

        <div className="glass-panel stagger-item" style={{ marginTop: 24, padding: 32, borderRadius: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <Database size={24} color="var(--accent-gold)" />
            <h3 style={{ fontSize: 20 }}>Chat History Log</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { id: 1, title: 'Quantum Physics Explained', tokens: '1.2k', date: 'Today, 10:45 AM', type: 'Text' },
              { id: 2, title: 'Generate UI Mockup', tokens: 'Media', date: 'Yesterday', type: 'Image' },
              { id: 3, title: 'Real Estate Video Script', tokens: '450', date: 'Oct 12', type: 'Text' },
              { id: 4, title: 'Luxury Brand Strategy', tokens: '2.8k', date: 'Oct 10', type: 'Text' },
            ].map((log) => (
              <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <h4 style={{ fontSize: 16, marginBottom: 4, color: '#fff' }}>{log.title}</h4>
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{log.date} • {log.type}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent-gold)', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                    {log.tokens}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

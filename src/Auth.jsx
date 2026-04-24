import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Apple, Facebook } from 'lucide-react';
import gsap from 'gsap';
import './Auth.css';

// Simple Google icon component since it's not in lucide by default
const Google = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
  </svg>
);

export default function Auth({ setAuth }) {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const authRef = React.useRef();

  React.useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo('.auth-anim', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power4.out" }
      );
      gsap.fromTo('.auth-image-anim',
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1.5, ease: "power4.out" }
      );
    }, authRef);
    return () => ctx.revert();
  }, [isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin ? { email, password } : { name: `${firstName} ${lastName}`, email, password };

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
    <div className="auth-split-container" ref={authRef}>
      
      {/* LEFT PANEL - MARKETING */}
      <div className="auth-left-panel">
        <button className="btn-glass auth-anim" onClick={handleTempChat} style={{ position: 'absolute', top: 32, left: 32, zIndex: 10 }}>
          ← Continue as Guest
        </button>

        <div className="auth-hero-content auth-image-anim">
          <h1 className="hero-title-bg">Your AI</h1>
          <h1 className="hero-title-fg">Assistant</h1>
          <img src="/robot.png" alt="AI Robot" className="hero-robot-img" />

          {/* Floating Widgets */}
          <div className="widget widget-hours">
            <span className="widget-val">+15 Hours</span>
            <span className="widget-label">Battery life</span>
          </div>

          <div className="widget widget-users">
            <span className="widget-val">+ 2000</span>
            <span className="widget-label">Users every day</span>
          </div>

          {/* User Review Cards */}
          <div className="review-cards">
            <div className="review-card">
              <div className="review-header">
                <div className="review-avatar">DS</div>
                <div>
                  <h4>David S.</h4>
                  <p>CEO & Co-founder</p>
                </div>
              </div>
              <p className="review-text">Best Ever.</p>
              <div className="review-arrow">↗</div>
            </div>

            <div className="review-card">
              <div className="review-header">
                <div className="review-avatar">MK</div>
                <div>
                  <h4>Mira K.</h4>
                  <p>Marketing manager</p>
                </div>
              </div>
              <p className="review-text">Revolutionary.</p>
              <div className="review-arrow">↗</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - FORM */}
      <div className="auth-right-panel">
        <div className="auth-form-wrapper auth-anim">
          <h2>{isLogin ? 'Welcome Back.' : 'Start Your Journey.'}</h2>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="premium-form">
            {!isLogin && (
              <div className="form-row">
                <input type="text" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                <input type="text" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} required />
              </div>
            )}
            
            <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />

            {!isLogin && (
              <label className="terms-checkbox">
                <input type="checkbox" required />
                <span>Accept terms and conditions</span>
              </label>
            )}

            <div className="divider">
              <span>Or<br/>{isLogin ? 'Login' : 'Sign up'} with</span>
            </div>

            <div className="social-logins">
              <button type="button" className="social-btn"><Google size={20} /></button>
              <button type="button" className="social-btn"><Apple size={20} /></button>
              <button type="button" className="social-btn"><Facebook size={20} /></button>
            </div>

            <div className="form-footer">
              <span className="toggle-auth">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button type="button" className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
                  {isLogin ? 'Sign Up' : 'Login'}
                </button>
              </span>
              <button type="submit" className="submit-btn" disabled={loading}>
                {isLogin ? 'Login' : 'Sign'} <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

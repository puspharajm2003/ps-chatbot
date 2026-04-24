import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Apple } from 'lucide-react';
import gsap from 'gsap';
import RobotHeroScene from './3d-models/RobotHeroScene';
import './Auth.css';

const Google = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
  </svg>
);

const FacebookIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
  </svg>
);

export default function Auth({ setAuth }) {
  const [isLogin, setIsLogin] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const authRef = React.useRef();

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.auth-anim',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power4.out' },
      );
      gsap.fromTo(
        '.auth-image-anim',
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1.5, ease: 'power4.out' },
      );
    }, authRef);

    return () => ctx.revert();
  }, [isLogin]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin ? { email, password } : { name: `${firstName} ${lastName}`, email, password };

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setAuth({
        ...data,
        type: 'premium',
      });

      if (data.api_key) {
        localStorage.setItem('openRouterKey', data.api_key);
      }

      navigate('/chat');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTempChat = () => {
    setAuth({
      name: 'Guest User',
      type: 'guest',
    });
    navigate('/chat');
  };

  return (
    <div className="auth-split-container" ref={authRef}>
      <div className="auth-left-panel">
        <button className="btn-glass auth-anim" onClick={handleTempChat} style={{ position: 'absolute', top: 32, left: 32, zIndex: 10 }}>
          Continue as Guest
        </button>

        <div className="auth-hero-content auth-image-anim">
          <h1 className="hero-title-bg">Your AI</h1>
          <h1 className="hero-title-fg">Assistant</h1>
          <RobotHeroScene />
        </div>
      </div>

      <div className="auth-right-panel">
        <div className="auth-form-wrapper auth-anim">
          <h2>{isLogin ? 'Welcome Back.' : 'Start Your Journey.'}</h2>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="premium-form">
            {!isLogin && (
              <div className="form-row">
                <input type="text" placeholder="First name" value={firstName} onChange={(event) => setFirstName(event.target.value)} required />
                <input type="text" placeholder="Last name" value={lastName} onChange={(event) => setLastName(event.target.value)} required />
              </div>
            )}

            <input type="email" placeholder="E-mail" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} required />

            {!isLogin && (
              <label className="terms-checkbox">
                <input type="checkbox" required />
                <span>Accept terms and conditions</span>
              </label>
            )}

            <div className="divider">
              <span>Or<br />{isLogin ? 'Login' : 'Sign up'} with</span>
            </div>

            <div className="social-logins">
              <button type="button" className="social-btn"><Google size={20} /></button>
              <button type="button" className="social-btn"><Apple size={20} /></button>
              <button type="button" className="social-btn"><FacebookIcon size={20} /></button>
            </div>

            <div className="form-footer">
              <span className="toggle-auth">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
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

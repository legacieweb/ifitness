import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crimson-auth-wrapper">
      <div className="ambient-particles"></div>
      <div className="hero-noise-overlay"></div>
      
      <div className="auth-container reveal-active">
        <div className="auth-card-creative glass-morphism">
          <div className="auth-card-header">
            <div className="protocol-status mb-4">
              <span className="status-dot pulse"></span>
              <span className="status-label">IDENTITY VERIFICATION REQUIRED</span>
            </div>
            
            <h1 className="creative-title mb-2">
              LEVEL <span className="title-outline">ACCESS</span><br/>
              <span className="title-bold">RESTRICTED</span>
            </h1>
            <p className="auth-subtitle text-muted mb-4">Enter credentials to bypass security gateway</p>
          </div>

          <div className="auth-card-body">
            {error && (
              <div className="auth-error-glitch mb-4">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <span>{error.toUpperCase()}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="creative-form">
              <div className="form-group-creative mb-4">
                <label className="creative-label">OPERATOR_ID</label>
                <div className="input-frame">
                  <input
                    type="email"
                    className="creative-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="NAME@DOMAIN.COM"
                    required
                  />
                  <div className="input-focus-line"></div>
                </div>
              </div>

              <div className="form-group-creative mb-4">
                <label className="creative-label">ACCESS_KEY</label>
                <div className="input-frame">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="creative-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="input-icon-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`bi bi-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                  </button>
                  <div className="input-focus-line"></div>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-5">
                <label className="creative-checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="checkbox-box"></span>
                  <span className="checkbox-text">MAINTAIN_SESSION</span>
                </label>
                <Link to="/forgot-password" hidden className="forgot-password-link">
                  RESET_ENCRYPTION
                </Link>
              </div>

              <button
                type="submit"
                className="btn-glitch w-100 border-0"
                disabled={loading}
              >
                <span className="glitch-text" data-text={loading ? "VERIFYING..." : "AUTHORIZE"}>
                  {loading ? "VERIFYING..." : "AUTHORIZE"}
                </span>
                <div className="glitch-line"></div>
              </button>
            </form>
          </div>

          <div className="auth-card-footer mt-5 text-center">
            <p className="text-muted small">
              NEW OPERATOR?{' '}
              <Link to="/register" className="text-crimson fw-bold text-decoration-none">
                INITIALIZE_RECRUITMENT
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

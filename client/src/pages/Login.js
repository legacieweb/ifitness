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
    <div className="immersive-auth-layout">
      {/* Background elements */}
      <div className="cyber-grid-overlay"></div>
      <div className="scanning-line"></div>
      <div className="status-ring"></div>
      <div className="status-ring ring-2"></div>
      <div className="data-stream ds-1">ACCESS_GATEWAY_V2 // SYNCING_BIOMETRICS // PROTOCOL_LEVEL_9</div>
      <div className="data-stream ds-2">ENCRYPTION_ACTIVE // SESSION_PERSISTENCE_ENABLED // BYPASS_RESTRICTED</div>

      <div className="cyber-content-v2">
        <div className="cyber-header-v2">
          <h1 className="cyber-title-v2">
            <span className="outline-text">LEVEL_ACCESS</span>
            <span className="glow-text">RESTRICTED</span>
          </h1>
          <p className="cyber-subtitle-v2">Enter credentials to bypass security gateway</p>
        </div>

        {error && (
          <div className="auth-error-glitch mb-5">
            <i className="bi bi-exclamation-triangle-fill"></i>
            <span>{error.toUpperCase()}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="cyber-form-v2">
          <div className="cyber-field-v2">
            <input
              type="email"
              className="cyber-input-v2"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className="cyber-label-v2">OPERATOR_ID</label>
            <div className="cyber-focus-bar"></div>
          </div>

          <div className="cyber-field-v2">
            <input
              type={showPassword ? 'text' : 'password'}
              className="cyber-input-v2"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label className="cyber-label-v2">ACCESS_KEY</label>
            <div className="cyber-focus-bar"></div>
            <button
              type="button"
              className="input-icon-btn"
              onClick={() => setShowPassword(!showPassword)}
              style={{ bottom: '15px', top: 'auto', transform: 'none' }}
            >
              <i className={`bi bi-${showPassword ? 'eye-slash' : 'eye'}`}></i>
            </button>
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
          </div>

          <button
            type="submit"
            className="cyber-btn-v2"
            disabled={loading}
          >
            {loading ? "VERIFYING..." : "AUTHORIZE_ACCESS"}
          </button>
        </form>

        <div className="cyber-footer-v2">
          <Link to="/register" className="footer-link-v2">
            NEW_OPERATOR? <span>INITIALIZE_RECRUITMENT</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

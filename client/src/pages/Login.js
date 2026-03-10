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
    <>
      <div className="auth-page">
        <div className="auth-card-modern">
          <div className="auth-card-header">
            <div className="auth-logo">
              <i className="bi bi-activity"></i>
              <span>iFitness</span>
            </div>
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Enter your details to sign in and continue your journey</p>
          </div>

          <div className="auth-card-body">
            {error && (
              <div className="auth-error">
                <i className="bi bi-exclamation-circle-fill"></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group-modern">
                <label htmlFor="email" className="form-label-modern">
                  Email Address
                </label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    className="form-control-modern"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group-modern">
                <label htmlFor="password" className="form-label-modern">
                  Password
                </label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control-modern password-input"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`bi bi-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-modern">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
                <Link to="/forgot-password" disabled className="forgot-password">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="btn-auth-primary"
                disabled={loading}
              >
                {loading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <div className="social-login">
              <button className="social-btn">
                <i className="bi bi-google"></i>
                <span>Google</span>
              </button>
              <button className="social-btn">
                <i className="bi bi-apple"></i>
                <span>Apple</span>
              </button>
            </div>
          </div>

          <div className="auth-card-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

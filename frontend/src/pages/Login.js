import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');
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
    <div className="auth-page">
      <div className="auth-background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>
      
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-lg-5 col-md-7">
            <div className="auth-card-modern">
              <div className="auth-card-header">
                <div className="auth-logo">
                  <i className="bi bi-activity"></i>
                  <span>FitTracker</span>
                </div>
                <h1 className="auth-title">Welcome Back</h1>
                <p className="auth-subtitle">Sign in to continue your fitness journey</p>
              </div>

              <div className="auth-card-body">
                {error && (
                  <div className="auth-error">
                    <i className="bi bi-exclamation-triangle"></i>
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                  <div className="form-group-modern">
                    <label htmlFor="email" className="form-label-modern">
                      <i className="bi bi-envelope"></i>
                      Email Address
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        className="form-control-modern"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                      <div className="input-focus-line"></div>
                    </div>
                  </div>

                  <div className="form-group-modern">
                    <label htmlFor="password" className="form-label-modern">
                      <i className="bi bi-lock"></i>
                      Password
                    </label>
                    <div className="input-wrapper">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control-modern"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi bi-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                      </button>
                      <div className="input-focus-line"></div>
                    </div>
                  </div>

                  <div className="form-options">
                    <label className="checkbox-modern">
                      <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span className="checkmark"></span>
                      Remember me
                    </label>
                    <Link to="/forgot-password" className="forgot-password">
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="btn-auth-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="loading-spinner"></div>
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <i className="bi bi-arrow-right"></i>
                      </>
                    )}
                  </button>
                </form>

                <div className="auth-divider">
                  <span>or continue with</span>
                </div>

                <div className="social-login">
                  <button className="social-btn">
                    <i className="bi bi-google"></i>
                    <span>Google</span>
                  </button>
                  <button className="social-btn">
                    <i className="bi bi-facebook"></i>
                    <span>Facebook</span>
                  </button>
                </div>
              </div>

              <div className="auth-card-footer">
                <p>
                  Don't have an account?{' '}
                  <Link to="/register" className="auth-link">
                    Create account
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-7 d-none d-lg-block">
            <div className="auth-illustration">
              <div className="illustration-content">
                <div className="fitness-mockup">
                  <div className="mockup-card card-1">
                    <div className="mockup-icon">
                      <i className="bi bi-heart-pulse"></i>
                    </div>
                    <div className="mockup-content">
                      <h4>Heart Rate</h4>
                      <p>142 BPM</p>
                    </div>
                  </div>
                  <div className="mockup-card card-2">
                    <div className="mockup-icon">
                      <i className="bi bi-fire"></i>
                    </div>
                    <div className="mockup-content">
                      <h4>Calories</h4>
                      <p>485 burned</p>
                    </div>
                  </div>
                  <div className="mockup-card card-3">
                    <div className="mockup-icon">
                      <i className="bi bi-trophy"></i>
                    </div>
                    <div className="mockup-content">
                      <h4>Achievement</h4>
                      <p>7 Day Streak!</p>
                    </div>
                  </div>
                  <div className="mockup-avatar">
                    <i className="bi bi-person-circle"></i>
                  </div>
                </div>
                <div className="illustration-text">
                  <h2>Track Your Progress</h2>
                  <p>Monitor your fitness journey with detailed analytics and AI-powered insights.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

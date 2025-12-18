import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    weight: '',
    height: '',
    goal: 'maintain fitness',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [focusedField, setFocusedField] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const { register } = useAuth();

  const calculatePasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.name || !formData.email || !formData.password)) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
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
          <div className="col-lg-6 col-md-8">
            <div className="auth-card-modern register-card">
              <div className="auth-card-header">
                <div className="auth-logo">
                  <i className="bi bi-activity"></i>
                  <span>FitTracker</span>
                </div>
                <h1 className="auth-title">Create Your Account</h1>
                <p className="auth-subtitle">Start your fitness journey today</p>
                
                {/* Progress Steps */}
                <div className="progress-steps">
                  <div className={`step ${step >= 1 ? 'active' : ''}`}>
                    <div className="step-number">1</div>
                    <span>Account</span>
                  </div>
                  <div className="step-line"></div>
                  <div className={`step ${step >= 2 ? 'active' : ''}`}>
                    <div className="step-number">2</div>
                    <span>Profile</span>
                  </div>
                </div>
              </div>

              <div className="auth-card-body">
                {error && (
                  <div className="auth-error">
                    <i className="bi bi-exclamation-triangle"></i>
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                  {step === 1 && (
                    <>
                      <div className="form-group-modern">
                        <label htmlFor="name" className="form-label-modern">
                          <i className="bi bi-person"></i>
                          Full Name
                        </label>
                        <div className="input-wrapper">
                          <input
                            type="text"
                            className="form-control-modern"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                          />
                          <div className="input-focus-line"></div>
                        </div>
                      </div>

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
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
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
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a strong password"
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
                        <div className="password-strength">
                          <div className="strength-bar">
                            <div className="strength-fill" style={{ 
                              width: `${(passwordStrength / 4) * 100}%`,
                              backgroundColor: passwordStrength === 0 ? '#ddd' : passwordStrength === 1 ? '#ff6b6b' : passwordStrength === 2 ? '#ffa500' : passwordStrength === 3 ? '#4CAF50' : '#00BCD4'
                            }}></div>
                          </div>
                          <span className="strength-text">
                            {passwordStrength === 0 && 'Enter a password'}
                            {passwordStrength === 1 && 'Weak password'}
                            {passwordStrength === 2 && 'Fair password'}
                            {passwordStrength === 3 && 'Good password'}
                            {passwordStrength === 4 && 'Strong password'}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn-auth-primary"
                        onClick={nextStep}
                      >
                        <span>Continue</span>
                        <i className="bi bi-arrow-right"></i>
                      </button>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div className="form-row">
                        <div className="form-group-modern">
                          <label htmlFor="age" className="form-label-modern">
                            <i className="bi bi-calendar"></i>
                            Age
                          </label>
                          <div className="input-wrapper">
                            <input
                              type="number"
                              className="form-control-modern"
                              id="age"
                              name="age"
                              value={formData.age}
                              onChange={handleChange}
                              placeholder="25"
                            />
                            <div className="input-focus-line"></div>
                          </div>
                        </div>

                        <div className="form-group-modern">
                          <label htmlFor="weight" className="form-label-modern">
                            <i className="bi bi-speedometer2"></i>
                            Weight (kg)
                          </label>
                          <div className="input-wrapper">
                            <input
                              type="number"
                              className="form-control-modern"
                              id="weight"
                              name="weight"
                              value={formData.weight}
                              onChange={handleChange}
                              placeholder="70"
                            />
                            <div className="input-focus-line"></div>
                          </div>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group-modern">
                          <label htmlFor="height" className="form-label-modern">
                            <i className="bi bi-rulers"></i>
                            Height (cm)
                          </label>
                          <div className="input-wrapper">
                            <input
                              type="number"
                              className="form-control-modern"
                              id="height"
                              name="height"
                              value={formData.height}
                              onChange={handleChange}
                              placeholder="175"
                            />
                            <div className="input-focus-line"></div>
                          </div>
                        </div>

                        <div className="form-group-modern">
                          <label htmlFor="goal" className="form-label-modern">
                            <i className="bi bi-target"></i>
                            Fitness Goal
                          </label>
                          <div className="input-wrapper">
                            <select
                              className="form-control-modern"
                              id="goal"
                              name="goal"
                              value={formData.goal}
                              onChange={handleChange}
                            >
                              <option value="weight loss">Weight Loss</option>
                              <option value="muscle gain">Muscle Gain</option>
                              <option value="maintain fitness">Maintain Fitness</option>
                              <option value="improve endurance">Improve Endurance</option>
                            </select>
                            <div className="input-focus-line"></div>
                          </div>
                        </div>
                      </div>

                      <div className="form-actions">
                        <button
                          type="button"
                          className="btn-auth-secondary"
                          onClick={prevStep}
                        >
                          <i className="bi bi-arrow-left"></i>
                          <span>Back</span>
                        </button>
                        <button
                          type="submit"
                          className="btn-auth-primary"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <div className="loading-spinner"></div>
                              <span>Creating Account...</span>
                            </>
                          ) : (
                            <>
                              <span>Create Account</span>
                              <i className="bi bi-check"></i>
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  )}
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
                  Already have an account?{' '}
                  <Link to="/login" className="auth-link">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-6 d-none d-lg-block">
            <div className="auth-illustration">
              <div className="illustration-content">
                <div className="fitness-mockup">
                  <div className="mockup-card card-1">
                    <div className="mockup-icon">
                      <i className="bi bi-graph-up-arrow"></i>
                    </div>
                    <div className="mockup-content">
                      <h4>Progress</h4>
                      <p>+25% this week</p>
                    </div>
                  </div>
                  <div className="mockup-card card-2">
                    <div className="mockup-icon">
                      <i className="bi bi-award"></i>
                    </div>
                    <div className="mockup-content">
                      <h4>Achievement</h4>
                      <p>10 Workouts completed!</p>
                    </div>
                  </div>
                  <div className="mockup-card card-3">
                    <div className="mockup-icon">
                      <i className="bi bi-lightning-charge"></i>
                    </div>
                    <div className="mockup-content">
                      <h4>Energy</h4>
                      <p>High energy day</p>
                    </div>
                  </div>
                  <div className="mockup-avatar">
                    <i className="bi bi-person-circle"></i>
                  </div>
                </div>
                <div className="illustration-text">
                  <h2>Transform Your Life</h2>
                  <p>Join thousands of users who have achieved their fitness goals with our AI-powered platform.</p>
                  <div className="benefits-list">
                    <div className="benefit-item">
                      <i className="bi bi-check-circle-fill"></i>
                      <span>Personalized workout plans</span>
                    </div>
                    <div className="benefit-item">
                      <i className="bi bi-check-circle-fill"></i>
                      <span>Progress tracking & analytics</span>
                    </div>
                    <div className="benefit-item">
                      <i className="bi bi-check-circle-fill"></i>
                      <span>AI-powered recommendations</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

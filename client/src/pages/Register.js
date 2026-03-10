import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

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
    <>
      <div className="auth-page">
        <div className="auth-card-modern">
          <div className="auth-card-header">
            <div className="auth-logo">
              <i className="bi bi-activity"></i>
              <span>iFitness</span>
            </div>
            <h1 className="auth-title">Join iFitness</h1>
            <p className="auth-subtitle">Start your transformation today</p>

            <div className="progress-steps">
              <div className={`step ${step >= 1 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <span>Account</span>
              </div>
              <div className={`step ${step >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <span>Profile</span>
              </div>
            </div>
          </div>

          <div className="auth-card-body">
            {error && (
              <div className="auth-error">
                <i className="bi bi-exclamation-circle-fill"></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {step === 1 && (
                <>
                  <div className="form-group-modern">
                    <label htmlFor="name" className="form-label-modern">
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
                        placeholder="Alex Johnson"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group-modern">
                    <label htmlFor="email" className="form-label-modern">
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
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
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
                    <div className="password-strength">
                      <div className="strength-bar">
                        <div className="strength-fill" style={{
                          width: `${(passwordStrength / 4) * 100}%`,
                          backgroundColor: passwordStrength === 0 ? '#e5e7eb' : passwordStrength === 1 ? '#ef4444' : passwordStrength === 2 ? '#f59e0b' : passwordStrength === 3 ? '#10b981' : '#3b82f6'
                        }}></div>
                      </div>
                      <span className="strength-text">
                        {passwordStrength === 0 && 'Minimum 8 characters'}
                        {passwordStrength === 1 && 'Weak'}
                        {passwordStrength === 2 && 'Fair'}
                        {passwordStrength === 3 && 'Good'}
                        {passwordStrength === 4 && 'Strong'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-auth-primary"
                    onClick={nextStep}
                  >
                    <span>Continue</span>
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="form-row">
                    <div className="form-group-modern">
                      <label htmlFor="age" className="form-label-modern">
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
                      </div>
                    </div>

                    <div className="form-group-modern">
                      <label htmlFor="weight" className="form-label-modern">
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
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group-modern">
                      <label htmlFor="height" className="form-label-modern">
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
                      </div>
                    </div>

                    <div className="form-group-modern">
                      <label htmlFor="goal" className="form-label-modern">
                        Goal
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
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-auth-secondary"
                      onClick={prevStep}
                    >
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      className="btn-auth-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="loading-spinner"></div>
                      ) : (
                        <span>Create Account</span>
                      )}
                    </button>
                  </div>
                </>
              )}
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
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

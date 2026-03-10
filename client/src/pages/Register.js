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
    <div className="crimson-auth-wrapper">
      <div className="ambient-particles"></div>
      <div className="hero-noise-overlay"></div>
      
      <div className="auth-container reveal-active">
        <div className="auth-card-creative glass-morphism">
          <div className="auth-card-header">
            <div className="protocol-status mb-4">
              <span className="status-dot pulse"></span>
              <span className="status-label">NEW OPERATOR RECRUITMENT</span>
            </div>
            
            <h1 className="creative-title mb-2">
              INITIATE <span className="title-outline">EVOLUTION</span><br/>
              <span className="title-bold">PROTOCOL</span>
            </h1>

            <div className="creative-steps-indicator mb-4">
              <div className={`creative-step ${step >= 1 ? 'active' : ''}`}>
                <span className="step-label">CORE_ID</span>
                <div className="step-bar"></div>
              </div>
              <div className={`creative-step ${step >= 2 ? 'active' : ''}`}>
                <span className="step-label">BIOMETRICS</span>
                <div className="step-bar"></div>
              </div>
            </div>
          </div>

          <div className="auth-card-body">
            {error && (
              <div className="auth-error-glitch mb-4">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <span>{error.toUpperCase()}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="creative-form">
              {step === 1 && (
                <>
                  <div className="form-group-creative mb-4">
                    <label className="creative-label">OPERATOR_NAME</label>
                    <div className="input-frame">
                      <input
                        type="text"
                        className="creative-input"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="ALEX JOHNSON"
                        required
                      />
                      <div className="input-focus-line"></div>
                    </div>
                  </div>

                  <div className="form-group-creative mb-4">
                    <label className="creative-label">OPERATOR_EMAIL</label>
                    <div className="input-frame">
                      <input
                        type="email"
                        className="creative-input"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
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
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
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
                    {formData.password && (
                      <div className="password-strength-creative mt-2">
                        <div className="strength-bars">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={`s-bar ${passwordStrength >= i ? 'active' : ''}`}></div>
                          ))}
                        </div>
                        <span className="strength-label">
                          {passwordStrength === 1 && 'WEAK_ENCRYPTION'}
                          {passwordStrength === 2 && 'MODERATE_ENCRYPTION'}
                          {passwordStrength === 3 && 'STRONG_ENCRYPTION'}
                          {passwordStrength === 4 && 'MAXIMUM_ENCRYPTION'}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="btn-glitch w-100 border-0 mt-4"
                    onClick={nextStep}
                  >
                    <span className="glitch-text" data-text="CONTINUE_SYNC">CONTINUE_SYNC</span>
                    <div className="glitch-line"></div>
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="row g-3 mb-4">
                    <div className="col-6">
                      <div className="form-group-creative">
                        <label className="creative-label">AGE_YRS</label>
                        <div className="input-frame">
                          <input
                            type="number"
                            className="creative-input"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            placeholder="25"
                          />
                          <div className="input-focus-line"></div>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group-creative">
                        <label className="creative-label">WEIGHT_KG</label>
                        <div className="input-frame">
                          <input
                            type="number"
                            className="creative-input"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            placeholder="70"
                          />
                          <div className="input-focus-line"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-6">
                      <div className="form-group-creative">
                        <label className="creative-label">HEIGHT_CM</label>
                        <div className="input-frame">
                          <input
                            type="number"
                            className="creative-input"
                            name="height"
                            value={formData.height}
                            onChange={handleChange}
                            placeholder="175"
                          />
                          <div className="input-focus-line"></div>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group-creative">
                        <label className="creative-label">CORE_GOAL</label>
                        <div className="input-frame">
                          <select
                            className="creative-input"
                            name="goal"
                            value={formData.goal}
                            onChange={handleChange}
                          >
                            <option value="weight loss">WEIGHT_LOSS</option>
                            <option value="muscle gain">MUSCLE_GAIN</option>
                            <option value="maintain fitness">MAINTAIN_SYNC</option>
                            <option value="improve endurance">ENDUR_OPT</option>
                          </select>
                          <div className="input-focus-line"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex gap-3 mt-5">
                    <button
                      type="button"
                      className="admin-btn-secondary flex-1"
                      onClick={prevStep}
                    >
                      PREVIOUS_STG
                    </button>
                    <button
                      type="submit"
                      className="btn-glitch flex-2 border-0"
                      disabled={loading}
                    >
                      <span className="glitch-text" data-text={loading ? "INITIATING..." : "COMMENCE"}>
                        {loading ? "INITIATING..." : "COMMENCE"}
                      </span>
                      <div className="glitch-line"></div>
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>

          <div className="auth-card-footer mt-5 text-center">
            <p className="text-muted small">
              ALREADY REGISTERED?{' '}
              <Link to="/login" className="text-crimson fw-bold text-decoration-none">
                RETURN_TO_STATION
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

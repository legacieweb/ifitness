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
    <div className="immersive-auth-layout">
      {/* Background elements */}
      <div className="cyber-grid-overlay"></div>
      <div className="scanning-line"></div>
      <div className="status-ring"></div>
      <div className="status-ring ring-2"></div>
      <div className="data-stream ds-1">INITIATE_RECRUITMENT_V2 // SYNCING_BIOMETRICS // PROTOCOL_LEVEL_1</div>
      <div className="data-stream ds-2">ENCRYPTION_ACTIVE // BIOMETRIC_CAPTURE_READY // CORE_ID_INITIATED</div>

      <div className="cyber-content-v2">
        <div className="cyber-header-v2">
          <div className="creative-steps-indicator mb-4 justify-content-center">
            <div className={`creative-step ${step >= 1 ? 'active' : ''}`} style={{ maxWidth: '100px' }}>
              <span className="step-label">CORE_ID</span>
              <div className="step-bar"></div>
            </div>
            <div className={`creative-step ${step >= 2 ? 'active' : ''}`} style={{ maxWidth: '100px' }}>
              <span className="step-label">BIOMETRICS</span>
              <div className="step-bar"></div>
            </div>
          </div>
          
          <h1 className="cyber-title-v2">
            <span className="outline-text">INITIATE</span>
            <span className="glow-text">EVOLUTION</span>
          </h1>
          <p className="cyber-subtitle-v2">Operator Recruitment Protocol Phase {step}</p>
        </div>

        {error && (
          <div className="auth-error-glitch mb-5">
            <i className="bi bi-exclamation-triangle-fill"></i>
            <span>{error.toUpperCase()}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="cyber-form-v2">
          {step === 1 && (
            <div className="animate-in">
              <div className="cyber-field-v2">
                <input
                  type="text"
                  className="cyber-input-v2"
                  name="name"
                  placeholder=" "
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <label className="cyber-label-v2">OPERATOR_NAME</label>
                <div className="cyber-focus-bar"></div>
              </div>

              <div className="cyber-field-v2">
                <input
                  type="email"
                  className="cyber-input-v2"
                  name="email"
                  placeholder=" "
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <label className="cyber-label-v2">OPERATOR_EMAIL</label>
                <div className="cyber-focus-bar"></div>
              </div>

              <div className="cyber-field-v2">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="cyber-input-v2"
                  name="password"
                  placeholder=" "
                  value={formData.password}
                  onChange={handleChange}
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
                {formData.password && (
                  <div className="password-strength-creative mt-2">
                    <div className="strength-bars">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`s-bar ${passwordStrength >= i ? 'active' : ''}`}></div>
                      ))}
                    </div>
                    <span className="strength-label">
                      {passwordStrength === 1 && 'WEAK'}
                      {passwordStrength === 2 && 'MODERATE'}
                      {passwordStrength === 3 && 'STRONG'}
                      {passwordStrength === 4 && 'MAXIMUM'}
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="cyber-btn-v2 mt-4"
                onClick={nextStep}
              >
                CONTINUE_SYNC
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in">
              <div className="row g-4">
                <div className="col-6">
                  <div className="cyber-field-v2">
                    <input
                      type="number"
                      className="cyber-input-v2"
                      name="age"
                      placeholder=" "
                      value={formData.age}
                      onChange={handleChange}
                    />
                    <label className="cyber-label-v2">AGE_YRS</label>
                    <div className="cyber-focus-bar"></div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="cyber-field-v2">
                    <input
                      type="number"
                      className="cyber-input-v2"
                      name="weight"
                      placeholder=" "
                      value={formData.weight}
                      onChange={handleChange}
                    />
                    <label className="cyber-label-v2">WEIGHT_KG</label>
                    <div className="cyber-focus-bar"></div>
                  </div>
                </div>
              </div>

              <div className="row g-4">
                <div className="col-6">
                  <div className="cyber-field-v2">
                    <input
                      type="number"
                      className="cyber-input-v2"
                      name="height"
                      placeholder=" "
                      value={formData.height}
                      onChange={handleChange}
                    />
                    <label className="cyber-label-v2">HEIGHT_CM</label>
                    <div className="cyber-focus-bar"></div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="cyber-field-v2">
                    <select
                      className="cyber-input-v2"
                      name="goal"
                      value={formData.goal}
                      onChange={handleChange}
                      style={{ fontSize: '1rem' }}
                    >
                      <option value="weight loss">WEIGHT_LOSS</option>
                      <option value="muscle gain">MUSCLE_GAIN</option>
                      <option value="maintain fitness">MAINTAIN_SYNC</option>
                      <option value="improve endurance">ENDUR_OPT</option>
                    </select>
                    <label className="cyber-label-v2">CORE_GOAL</label>
                    <div className="cyber-focus-bar"></div>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-3 mt-5">
                <button
                  type="button"
                  className="cyber-btn-v2 back-btn"
                  style={{ flex: 1 }}
                  onClick={prevStep}
                >
                  BACK
                </button>
                <button
                  type="submit"
                  className="cyber-btn-v2"
                  style={{ flex: 2 }}
                  disabled={loading}
                >
                  {loading ? "INITIATING..." : "COMMENCE_EVOLUTION"}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="cyber-footer-v2">
          <Link to="/login" className="footer-link-v2">
            ALREADY_REGISTERED? <span>RETURN_TO_STATION</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

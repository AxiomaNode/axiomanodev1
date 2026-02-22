import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../firebase/auth";

const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const GradeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const LANGUAGES = [
  { value: "ru", label: "Русский" },
  { value: "uz", label: "O'zbek" },
  { value: "en", label: "English" },
];

const GRADES = Array.from({ length: 5 }, (_, i) => i + 7);

const RegisterForm = ({ onSwitch }) => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [language, setLanguage] = useState("ru");
  const [grade, setGrade] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!grade) {
      setError("Please select your grade");
      return;
    }

    setLoading(true);
    try {
      await registerUser(email, password, displayName, language, Number(grade));
      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <div className="auth-form__header">
        <div className="auth-form__icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <h1 className="auth-form__title">Create account</h1>
        <p className="auth-form__subtitle">Map your mathematical thinking</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form__body">
        <div className="auth-field">
          <label className="auth-field__label">Full Name</label>
          <div className="auth-field__input-wrap">
            <span className="auth-field__icon"><UserIcon /></span>
            <input
              type="text"
              className="auth-field__input"
              placeholder="Your name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>
        </div>

        <div className="auth-field">
          <label className="auth-field__label">Email</label>
          <div className="auth-field__input-wrap">
            <span className="auth-field__icon"><MailIcon /></span>
            <input
              type="email"
              className="auth-field__input"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
        </div>

        <div className="auth-fields-row">
          <div className="auth-field">
            <label className="auth-field__label">Language</label>
            <div className="auth-field__input-wrap">
              <span className="auth-field__icon"><GlobeIcon /></span>
              <select
                className="auth-field__input auth-field__input--select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                required
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-field__label">Grade</label>
            <div className="auth-field__input-wrap">
              <span className="auth-field__icon"><GradeIcon /></span>
              <select
                className="auth-field__input auth-field__input--select"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                required
              >
                <option value="" disabled>Select grade</option>
                {GRADES.map((g) => (
                  <option key={g} value={g}>{g} grade</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="auth-fields-row">
          <div className="auth-field">
            <label className="auth-field__label">Password</label>
            <div className="auth-field__input-wrap">
              <span className="auth-field__icon"><LockIcon /></span>
              <input
                type={showPassword ? "text" : "password"}
                className="auth-field__input auth-field__input--password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-field__eye"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-field__label">Confirm Password</label>
            <div className="auth-field__input-wrap">
              <span className="auth-field__icon"><LockIcon /></span>
              <input
                type={showPassword ? "text" : "password"}
                className="auth-field__input auth-field__input--password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="auth-error">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? <span className="auth-btn__spinner" /> : "Create Account"}
        </button>
      </form>

      <p className="auth-form__switch">
        Already have an account?{" "}
        <button className="auth-form__switch-btn" onClick={onSwitch}>
          Sign in
        </button>
      </p>
    </div>
  );
};

export default RegisterForm;
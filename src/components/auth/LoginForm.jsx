import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, signInWithGoogle } from "../../firebase/auth"; // CHANGED: added signInWithGoogle
import LogoDark from "../../Logo-Dark.png";
import LogoLight from "../../Logo-Light.png";
import { useTheme } from "../../context/ThemeContext";

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

// CHANGED: Google logo SVG
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const LoginForm = ({ onSwitch }) => {
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false); // CHANGED
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginUser(email, password);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // CHANGED: Google handler
  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user) navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <div className="auth-form__header">
        <div className="auth-form__icon">
          {theme === "light"
            ? <img src={LogoDark} alt="Axioma" className="axioma-logo" />
            : <img src={LogoLight} alt="Axioma" className="axioma-logo" />
          }
        </div>
        <h1 className="auth-form__title">Welcome back</h1>
        <p className="auth-form__subtitle">Continue your reasoning journey</p>
      </div>

      {/* CHANGED: Google button above form */}
      <button
        type="button"
        className="auth-google-btn"
        onClick={handleGoogle}
        disabled={googleLoading || loading}
      >
        {googleLoading
          ? <span className="auth-btn__spinner" />
          : <><GoogleIcon /> Continue with Google</>
        }
      </button>

      {/* CHANGED: divider */}
      <div className="auth-divider">
        <span>or sign in with email</span>
      </div>

      <form onSubmit={handleSubmit} className="auth-form__body">
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

        <div className="auth-field">
          <label className="auth-field__label">Password</label>
          <div className="auth-field__input-wrap">
            <span className="auth-field__icon"><LockIcon /></span>
            <input
              type={showPassword ? "text" : "password"}
              className="auth-field__input auth-field__input--password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
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

        <button type="submit" className="auth-btn" disabled={loading || googleLoading}>
          {loading ? <span className="auth-btn__spinner" /> : "Sign In"}
        </button>
      </form>

      <p className="auth-form__switch">
        Don't have an account?{" "}
        <button className="auth-form__switch-btn" onClick={onSwitch}>
          Create one
        </button>
      </p>
    </div>
  );
};

export default LoginForm;
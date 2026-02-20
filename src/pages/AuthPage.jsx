import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import "../styles/auth.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading__spinner" />
      </div>
    );
  }

  // Already logged in → go home
  if (user) return <Navigate to="/home" replace />;

  return (
    <div className="auth-page">
      {/* Left panel — branding */}
      <div className="auth-panel auth-panel--left">
        <div className="auth-panel__bg-math" aria-hidden="true">
          {/* SVG math background pattern */}
          <svg className="auth-math-svg" viewBox="0 0 600 700" xmlns="http://www.w3.org/2000/svg">
            {/* Network nodes */}
            <circle cx="80"  cy="120" r="4" fill="rgba(255,255,255,0.25)" />
            <circle cx="200" cy="60"  r="3" fill="rgba(255,255,255,0.2)" />
            <circle cx="340" cy="140" r="5" fill="rgba(255,255,255,0.3)" />
            <circle cx="500" cy="80"  r="3" fill="rgba(255,255,255,0.2)" />
            <circle cx="150" cy="250" r="4" fill="rgba(255,255,255,0.2)" />
            <circle cx="420" cy="280" r="3" fill="rgba(255,255,255,0.15)" />
            <circle cx="60"  cy="380" r="5" fill="rgba(255,255,255,0.2)" />
            <circle cx="300" cy="400" r="4" fill="rgba(255,255,255,0.25)" />
            <circle cx="520" cy="350" r="3" fill="rgba(255,255,255,0.2)" />
            <circle cx="240" cy="520" r="5" fill="rgba(255,255,255,0.2)" />
            <circle cx="460" cy="500" r="3" fill="rgba(255,255,255,0.15)" />
            <circle cx="100" cy="580" r="4" fill="rgba(255,255,255,0.2)" />
            <circle cx="380" cy="620" r="3" fill="rgba(255,255,255,0.2)" />

            {/* Network lines */}
            <line x1="80"  y1="120" x2="200" y2="60"  stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <line x1="200" y1="60"  x2="340" y2="140" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <line x1="340" y1="140" x2="500" y2="80"  stroke="rgba(255,255,255,0.1)"  strokeWidth="1" />
            <line x1="80"  y1="120" x2="150" y2="250" stroke="rgba(255,255,255,0.1)"  strokeWidth="1" />
            <line x1="340" y1="140" x2="420" y2="280" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <line x1="150" y1="250" x2="60"  y2="380" stroke="rgba(255,255,255,0.1)"  strokeWidth="1" />
            <line x1="150" y1="250" x2="300" y2="400" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <line x1="420" y1="280" x2="520" y2="350" stroke="rgba(255,255,255,0.1)"  strokeWidth="1" />
            <line x1="420" y1="280" x2="300" y2="400" stroke="rgba(255,255,255,0.1)"  strokeWidth="1" />
            <line x1="60"  y1="380" x2="240" y2="520" stroke="rgba(255,255,255,0.1)"  strokeWidth="1" />
            <line x1="300" y1="400" x2="240" y2="520" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <line x1="520" y1="350" x2="460" y2="500" stroke="rgba(255,255,255,0.1)"  strokeWidth="1" />
            <line x1="240" y1="520" x2="100" y2="580" stroke="rgba(255,255,255,0.1)"  strokeWidth="1" />
            <line x1="240" y1="520" x2="380" y2="620" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <line x1="460" y1="500" x2="380" y2="620" stroke="rgba(255,255,255,0.1)"  strokeWidth="1" />

            {/* Math symbols */}
            <text x="480" y="200" fill="rgba(255,255,255,0.12)" fontSize="48" fontFamily="Georgia, serif">∑</text>
            <text x="30"  y="310" fill="rgba(255,255,255,0.1)"  fontSize="36" fontFamily="Georgia, serif">∫</text>
            <text x="380" y="460" fill="rgba(255,255,255,0.1)"  fontSize="32" fontFamily="Georgia, serif">Δ</text>
            <text x="130" y="460" fill="rgba(255,255,255,0.1)"  fontSize="28" fontFamily="Georgia, serif">π</text>
            <text x="50"  y="170" fill="rgba(255,255,255,0.1)"  fontSize="24" fontFamily="Georgia, serif">f(x)</text>
            <text x="430" y="580" fill="rgba(255,255,255,0.1)"  fontSize="24" fontFamily="Georgia, serif">√n</text>
          </svg>
        </div>

        <div className="auth-panel__content">
          <div className="auth-brand">
            <svg className="auth-brand__logo" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span className="auth-brand__name">AxiomaNode</span>
          </div>

          <div className="auth-panel__tagline">
            <h2>Stop guessing.<br />Start reasoning.</h2>
            <p>
              Most math errors aren't calculation mistakes — they're gaps between stages of thinking.
              Axiomano maps exactly where your logic breaks.
            </p>
          </div>

          <div className="auth-panel__pillars">
            <div className="auth-pillar">
              <div className="auth-pillar__icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <span>Conceptual Clarity</span>
            </div>
            <div className="auth-pillar">
              <div className="auth-pillar__icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <span>Strategic Choice</span>
            </div>
            <div className="auth-pillar">
              <div className="auth-pillar__icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <span>Visual Connection</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="auth-panel auth-panel--right">
        {/* Tab switcher */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${isLogin ? "auth-tab--active" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${!isLogin ? "auth-tab--active" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <div className="auth-form-container">
          {isLogin
            ? <LoginForm onSwitch={() => setIsLogin(false)} />
            : <RegisterForm onSwitch={() => setIsLogin(true)} />
          }
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
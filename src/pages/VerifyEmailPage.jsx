import { useState } from "react";
import { logoutUser, resendVerificationEmail } from "../firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";

const VerifyEmailPage = () => {
  const [resent, setResent] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleResend = async () => {
    setError("");
    try {
      await resendVerificationEmail();
      setResent(true);
      setTimeout(() => setResent(false), 4000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCheckVerified = async () => {
    setChecking(true);
    setError("");
    try {
      await auth.currentUser?.reload();
      if (auth.currentUser?.emailVerified) {
        navigate("/home");
      } else {
        setError("Email not verified yet. Check your inbox and click the link.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setChecking(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/auth");
  };

  return (
    <div className="verify-page">

      <div className="verify-panel--left">
        <div className="verify-panel__grid" />

        <div className="verify-panel__content">
          <div className="verify-brand">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="verify-brand__logo">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span className="verify-brand__name">Axioma</span>
          </div>

          <div className="verify-panel__center">
            <div className="verify-panel__envelope">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>

            <div className="verify-panel__math-lines">
              <span>x² + bx + c = 0</span>
              <span>f(x) → ℝ</span>
              <span>D = b² − 4ac</span>
              <span>∀x ∈ ℝ</span>
            </div>
          </div>

          <div className="verify-panel__tagline">
            <h2>Almost there.</h2>
            <p>One confirmation away from mapping your mathematical thinking.</p>
          </div>
        </div>
      </div>

      <div className="verify-panel--right">
        <div className="verify-card">
          <div className="verify-card__header">
            <p className="verify-card__eyebrow">Step 3 of 3</p>
            <h1 className="verify-card__title">Verify your email</h1>
            <p className="verify-card__desc">
              We sent a confirmation link to{" "}
              <strong>{auth.currentUser?.email}</strong>.
              Open it to activate your account.
            </p>
            
            <div className="verify-card__spam-hint">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Can't find it? Check your <strong>Spam</strong> or <strong>Junk</strong> folder.
            </div>
          </div>

          <div className="verify-card__steps">
            <div className="verify-step">
              <div className="verify-step__num">1</div>
              <div className="verify-step__text">
                <span>Open your inbox</span>
                <strong>{auth.currentUser?.email}</strong>
              </div>
            </div>
            <div className="verify-step__connector" />
            <div className="verify-step">
              <div className="verify-step__num">2</div>
              <div className="verify-step__text">
                <span>Click the link</span>
                <strong>in the email from Axioma</strong>
              </div>
            </div>
            <div className="verify-step__connector" />
            <div className="verify-step">
              <div className="verify-step__num">3</div>
              <div className="verify-step__text">
                <span>Return here and press</span>
                <strong>the button below</strong>
              </div>
            </div>
          </div>

          {error && (
            <div className="verify-card__error">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {resent && (
            <div className="verify-card__success">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Verification email resent successfully!
            </div>
          )}

          <div className="verify-card__actions">
            <button className="verify-btn verify-btn--primary" onClick={handleCheckVerified} disabled={checking}>
              {checking
                ? <span className="auth-btn__spinner" />
                : <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    I've verified my email
                  </>
              }
            </button>

            <button className="verify-btn verify-btn--ghost" onClick={handleResend}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 .49-3.5" />
              </svg>
              Resend email
            </button>
          </div>

          <button className="verify-card__logout" onClick={handleLogout}>
            Use a different account
          </button>
        </div>
      </div>

    </div>
  );
};

export default VerifyEmailPage;
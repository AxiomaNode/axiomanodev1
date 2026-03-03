import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { applyActionCode } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

const EmailActionPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();

  useEffect(() => {
    const oobCode = searchParams.get("oobCode");
    if (!oobCode) { setStatus("invalid"); return; }

    applyActionCode(auth, oobCode)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className="action-page">
      <div className="action-panel--left">
        <div className="action-panel__grid" />
        <div className="action-panel__content">
          <div className="verify-brand">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="verify-brand__logo">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span className="verify-brand__name">Axioma</span>
          </div>

          <div className="action-panel__center">
            <div className="action-panel__math-lines">
              <span>x² + bx + c = 0</span>
              <span>f(x) → ℝ</span>
              <span>D = b² − 4ac</span>
              <span>∀x ∈ ℝ</span>
            </div>
          </div>

          <div className="verify-panel__tagline">
            <h2>{status === "success" ? "You're in." : "Something went wrong."}</h2>
            <p>
              {status === "success"
                ? "Your identity is confirmed. Begin your reasoning journey."
                : "The verification link may have expired."}
            </p>
          </div>
        </div>
      </div>

      <div className="action-panel--right">
        {status === "loading" && <LoadingState />}
        {status === "success" && <SuccessState navigate={navigate} />}
        {status === "error"   && <ErrorState navigate={navigate} />}
        {status === "invalid" && <ErrorState navigate={navigate} />}
      </div>
    </div>
  );
};

const LoadingState = () => (
  <div className="action-card">
    <div className="action-card__icon action-card__icon--loading">
      <span className="auth-btn__spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
    </div>
    <div className="action-card__body">
      <p className="verify-card__eyebrow">Please wait</p>
      <h2 className="action-card__title">Verifying your email...</h2>
      <p className="action-card__desc">This will only take a moment.</p>
    </div>
  </div>
);

const SuccessState = ({ navigate }) => (
  <div className="action-card">
    <div className="action-card__icon action-card__icon--success">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
    <div className="action-card__body">
      <p className="verify-card__eyebrow">Confirmed</p>
      <h2 className="action-card__title">Email verified</h2>
      <p className="action-card__desc">
        Your account is now active. You can sign in and start working on your mathematical reasoning.
      </p>
    </div>
    <div className="action-card__pillars">
      <div className="action-pillar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Identity confirmed
      </div>
      <div className="action-pillar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Account activated
      </div>
      <div className="action-pillar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Ready to start
      </div>
    </div>
    <button className="verify-btn verify-btn--primary" onClick={() => navigate("/auth")}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        <polyline points="10 17 15 12 10 7" />
        <line x1="15" y1="12" x2="3" y2="12" />
      </svg>
      Sign in to Axioma
    </button>
  </div>
);

const ErrorState = ({ navigate }) => (
  <div className="action-card">
    <div className="action-card__icon action-card__icon--error">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
    <div className="action-card__body">
      <p className="verify-card__eyebrow" style={{ color: "var(--error-text)" }}>Failed</p>
      <h2 className="action-card__title">Link expired</h2>
      <p className="action-card__desc">
        This verification link has expired or already been used. Request a new one from the verification screen.
      </p>
    </div>
    <button className="verify-btn verify-btn--primary" onClick={() => navigate("/verify-email")}>
      Request a new link
    </button>
    <button className="verify-btn verify-btn--ghost" style={{ marginTop: 9 }} onClick={() => navigate("/auth")}>
      Back to sign in
    </button>
  </div>
);

export default EmailActionPage;
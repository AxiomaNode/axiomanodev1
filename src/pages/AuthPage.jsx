import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import "../styles/auth.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-hero-content">
          <div className="auth-logo">Axioma</div>
          <h1 className="auth-tagline">
            We don't measure your answers.
            <br />
            We reveal <strong>how you think</strong>.
          </h1>
          <p className="auth-description">
            Axioma is a diagnostic platform that identifies the real gaps in
            mathematical thinking — not just wrong answers, but the reasoning
            patterns behind them. Built to guide, not to grade.
          </p>
        </div>
        <div className="auth-grid-decoration">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="auth-grid-dot" />
          ))}
        </div>
      </div>

      <div className="auth-form-side">
        {isLogin ? (
          <LoginForm onSwitch={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onSwitch={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
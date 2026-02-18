import { useState } from "react";
import { loginUser } from "../../firebase/auth";

const LoginForm = ({ onSwitch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginUser(email, password);
    } catch (err) {
      setError(
        err.code === "auth/invalid-credential"
          ? "Invalid email or password"
          : "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-header">
        <h2 className="auth-form-title">Welcome back</h2>
        <p className="auth-form-subtitle">Sign in to continue your journey</p>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-input-group">
          <label className="auth-input-label">Email</label>
          <input
            className="auth-input"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="auth-input-group">
          <label className="auth-input-label">Password</label>
          <input
            className="auth-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          className="auth-submit-btn"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="auth-toggle">
        Don't have an account?{" "}
        <span className="auth-toggle-link" onClick={onSwitch}>
          Create one
        </span>
      </p>
    </div>
  );
};

export default LoginForm;
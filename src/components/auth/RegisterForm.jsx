import { useState } from "react";
import { registerUser } from "../../firebase/auth";

const RegisterForm = ({ onSwitch }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await registerUser(email, password, name);
    } catch (err) {
      setError(
        err.code === "auth/email-already-in-use"
          ? "This email is already registered"
          : "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-header">
        <h2 className="auth-form-title">Get started</h2>
        <p className="auth-form-subtitle">Create your Axioma account</p>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-input-group">
          <label className="auth-input-label">Name</label>
          <input
            className="auth-input"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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
            placeholder="Min. 6 characters"
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
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="auth-toggle">
        Already have an account?{" "}
        <span className="auth-toggle-link" onClick={onSwitch}>
          Sign in
        </span>
      </p>
    </div>
  );
};

export default RegisterForm;
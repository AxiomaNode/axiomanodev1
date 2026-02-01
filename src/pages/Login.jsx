import LoginForm from "../components/auth/LoginForm";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="page">
      <div className="card">
        <h1>Login</h1>
        <LoginForm />
        <p>
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

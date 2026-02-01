import RegisterForm from "../components/auth/RegisterForm";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="page">
      <div className="card">
        <h1>Register</h1>
        <RegisterForm />
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

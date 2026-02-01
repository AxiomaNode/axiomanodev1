import { logoutUser } from "../firebase/auth";

export default function Home() {
  return (
    <div className="page">
      <div className="card">
        <h1>AxiomaNode</h1>
        <p>Welcome. v1 is live.</p>
        <button onClick={logoutUser}>Logout</button>
      </div>
    </div>
  );
}

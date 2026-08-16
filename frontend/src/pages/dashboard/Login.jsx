import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(username, password);
      navigate("/dashboard/projects");
    } catch {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="container" style={{ maxWidth: "380px", padding: "6rem 0" }}>
      <span className="eyebrow">Dashboard</span>
      <h1 style={{ fontSize: "var(--text-h1)", margin: "0.5rem 0 2rem" }}>Sign in</h1>
      <form onSubmit={onSubmit}>
        <div className="form-field">
          <label htmlFor="username">Username</label>
          <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p style={{ color: "#a33", marginBottom: "1rem" }}>{error}</p>}
        <button type="submit" className="btn btn-accent">Sign in</button>
      </form>
    </div>
  );
}

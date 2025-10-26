import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        throw new Error("Invalid credentials");
      }
      const data = await res.json();
      if (!data.token) throw new Error("Token not returned by server");

      localStorage.setItem("token", data.token);
      // Reflect username; this may be overwritten by register flow with full name
      localStorage.setItem("username", username);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "32px auto", padding: 24, background: "#fff", borderRadius: 8, boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
      <h2 style={{ marginBottom: 16 }}>Sign in</h2>
      {error && (
        <div style={{ color: "#b00020", marginBottom: 12 }}>{error}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 6 }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: 10, paddingRight: 36, border: "1px solid #ccc", borderRadius: 6 }}
            />
            <button type="button" onClick={() => setShowPwd(s => !s)} style={{ position: "absolute", right: 8, top: 6, background: "transparent", border: 0, cursor: "pointer" }}>
              {showPwd ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: 10, background: "#232f3e", color: "#fff", border: 0, borderRadius: 6, cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div style={{ marginTop: 16, fontSize: 14 }}>
        New here? <Link to="/register">Create an account</Link>
      </div>
    </div>
  );
};

export default Login;

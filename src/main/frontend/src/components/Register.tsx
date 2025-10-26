import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!userId.trim()) {
      setError("User ID is required");
      return;
    }
    setLoading(true);
    try {
      // Register (backend expects username + password; extra fields are ignored)
      const regRes = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: userId, password })
      });
      if (!regRes.ok) {
        const txt = await regRes.text();
        throw new Error(txt || "Registration failed");
      }

      // Auto-login
      const loginRes = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: userId, password })
      });
      if (!loginRes.ok) throw new Error("Login after register failed");
      const loginData = await loginRes.json();
      if (!loginData.token) throw new Error("Token missing");

      localStorage.setItem("token", loginData.token);
      // Reflect username in account name in navbar
      localStorage.setItem("username", `${firstName || ""} ${lastName || ""}`.trim() || userId);

      navigate("/");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 6 };
  const labelStyle: React.CSSProperties = { display: "block", marginBottom: 6 };
  const field: React.CSSProperties = { marginBottom: 12 };
  const btn: React.CSSProperties = { width: "100%", padding: 10, background: "#232f3e", color: "#fff", border: 0, borderRadius: 6, cursor: loading ? "not-allowed" : "pointer" };

  return (
    <div style={{ maxWidth: 480, margin: "32px auto", padding: 24, background: "#fff", borderRadius: 8, boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
      <h2 style={{ marginBottom: 16 }}>Create account</h2>
      {error && <div style={{ color: "#b00020", marginBottom: 12 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={field}>
          <label style={labelStyle}>First name</label>
          <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} style={inputStyle} />
        </div>
        <div style={field}>
          <label style={labelStyle}>Last name</label>
          <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} style={inputStyle} />
        </div>
        <div style={field}>
          <label style={labelStyle}>User ID</label>
          <input type="text" value={userId} onChange={e => setUserId(e.target.value)} required style={inputStyle} />
        </div>
        <div style={field}>
          <label style={labelStyle}>Password</label>
          <div style={{ position: "relative" }}>
            <input type={showPwd ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required style={{ ...inputStyle, paddingRight: 36 }} />
            <button type="button" onClick={() => setShowPwd(s => !s)} style={{ position: "absolute", right: 8, top: 6, background: "transparent", border: 0, cursor: "pointer" }}>
              {showPwd ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <div style={field}>
          <label style={labelStyle}>Confirm Password</label>
          <div style={{ position: "relative" }}>
            <input type={showConfirmPwd ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={{ ...inputStyle, paddingRight: 36 }} />
            <button type="button" onClick={() => setShowConfirmPwd(s => !s)} style={{ position: "absolute", right: 8, top: 6, background: "transparent", border: 0, cursor: "pointer" }}>
              {showConfirmPwd ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading} style={btn}>{loading ? "Creating..." : "Create account"}</button>
      </form>
      <div style={{ marginTop: 16, fontSize: 14 }}>
        Already have an account? <Link to="/login">Sign in</Link>
      </div>
    </div>
  );
};

export default Register;

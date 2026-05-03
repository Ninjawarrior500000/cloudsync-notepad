import { useState } from "react";
import axios from "axios";

const API = "https://cloudsync-notepad-backend.onrender.com/api";

interface AuthProps {
  onLogin: (token: string, name: string) => void;
}

function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) return alert("Please fill in all fields!");
    if (!isLogin && !name) return alert("Please enter your name!");

    try {
      setLoading(true);
      const endpoint = isLogin ? "login" : "signup";
      const payload = isLogin
        ? { email, password }
        : { name, email, password };

      const res = await axios.post(`${API}/auth/${endpoint}`, payload);
      const { token, name: userName } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("name", userName);
      onLogin(token, userName);
    } catch (error: any) {
      alert(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-icon">📓</div>
          <h1>CloudSync <span>Notepad</span></h1>
          <p>Online. Synced. Always with you.</p>
        </div>
        <div className="auth-features">
          <div className="auth-feature-item">☁️ Cloud Sync</div>
          <div className="auth-feature-item">🔍 Search Notes</div>
          <div className="auth-feature-item">🏷️ Tags & Categories</div>
          <div className="auth-feature-item">🌙 Dark Mode</div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <h2>Welcome Back 👋</h2>
          <p className="auth-subtitle">
            {isLogin ? "Login to continue to your account" : "Create your free account"}
          </p>

          {!isLogin && (
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="auth-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </button>

          <p className="auth-switch">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? " Sign Up" : " Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;
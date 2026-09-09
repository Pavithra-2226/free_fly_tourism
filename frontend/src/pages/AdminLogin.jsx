import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../api/auth.js";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await loginAdmin(username, password);

    setLoading(false);

    if (result.success) {
      navigate("/admin", { replace: true });
    } else {
      setError(result.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 w-full max-w-sm px-6 sm:px-8 py-8">
        <h1 className="font-display font-bold text-xl text-brand-navy text-center">
          Admin Login
        </h1>

        <p className="text-sm text-slate-500 text-center mt-1 mb-6">
          Free Fly &amp; Tourism
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-brand-navy">
              Username
            </span>

            <input
              type="text"
              name="admin-login-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              autoComplete="off"
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-brand-navy">
              Password
            </span>

            <input
              type="password"
              name="admin-login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue"
            />
          </label>

          {error && (
            <p className="text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg py-2.5 px-3.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-blue hover:bg-brand-sky disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
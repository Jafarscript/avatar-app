import React, { useState } from "react";
import type { LoginForm } from "../type";
import axios from "axios";
import { useNavigate, Link } from "react-router";

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginForm>({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(`${API}/auth/login`, formData)
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        setLoading(false);
        navigate("/profile");
      })
      .catch((error) => {
        setError(error.response?.data?.message || "Something went wrong");
        setLoading(false);
      });
  };

  return (
    <div
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="min-h-screen bg-[#0e0e10] flex items-center justify-center p-6"
    >
      <div className="w-full max-w-sm bg-[#17171a] border border-[#2e2e33] rounded-2xl p-10">

        {/* Logo */}
        <div style={{ fontFamily: "'Syne', sans-serif" }} className="flex items-center gap-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#c8f5a0] inline-block"></span>
          <span className="text-[#c8f5a0] text-xl font-bold tracking-tight">ProfileSpace</span>
        </div>

        <h1 style={{ fontFamily: "'Syne', sans-serif" }} className="text-2xl font-semibold text-[#f0f0f2] mb-1">
          Welcome back
        </h1>
        <p className="text-sm text-[#6b6b75] mb-8">Sign in with your email or username</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-[11px] font-medium text-[#8a8a96] uppercase tracking-widest mb-1.5">
              Email or Username
            </label>
            <input
              onChange={handleChange}
              type="text"
              name="identifier"
              value={formData.identifier}
              placeholder="you@example.com"
              required
              className="w-full bg-[#1e1e22] border border-[#2e2e36] rounded-xl px-4 py-3 text-sm text-[#f0f0f2] placeholder-[#44444e] outline-none focus:border-[#c8f5a0] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#8a8a96] uppercase tracking-widest mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                placeholder="••••••••"
                required
                className="w-full bg-[#1e1e22] border border-[#2e2e36] rounded-xl px-4 py-3 pr-11 text-sm text-[#f0f0f2] placeholder-[#44444e] outline-none focus:border-[#c8f5a0] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b75] hover:text-[#c8f5a0] transition-colors bg-transparent border-none cursor-pointer p-1"
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm -mt-2 flex items-center gap-1.5">
              <span>⚠</span> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ fontFamily: "'Syne', sans-serif" }}
            className="w-full bg-[#c8f5a0] hover:bg-[#b5ef88] disabled:opacity-50 disabled:cursor-not-allowed text-[#0e0e10] font-medium text-sm rounded-xl py-3 mt-1 cursor-pointer transition-colors"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-[#6b6b75] mt-6">
          No account?{" "}
          <Link to="/register" className="text-[#c8f5a0] hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
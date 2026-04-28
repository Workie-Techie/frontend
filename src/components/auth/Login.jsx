import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import logoImage from "../../assets/logo2.png";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="shell-card bg-gradient-to-br from-[#12354b] via-workie-blue to-workie-blue-light p-8 text-white sm:p-10">
          <img src={logoImage} alt="WorkieTechie" className="h-14 w-auto" />
          <span className="status-pill mt-10 bg-white/10 text-white">Managed client and talent operations</span>
          <h1 className="shell-title mt-6 text-4xl font-bold">
            Sign in to your operations hub.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-100">
            Professionals can track assignments, update their portfolios, and manage payout details. Clients can follow project requests, payments, approvals, and conversations with the WorkieTechie team.
          </p>
        </div>

        <div className="shell-card p-8 sm:p-10">
          <h2 className="shell-title text-3xl font-bold text-slate-900">Welcome back</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Use the email and password linked to your WorkieTechie account.
          </p>

          {error ? (
            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-slate-700">
              Email address
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-workie-gold focus:bg-white"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-workie-gold focus:bg-white"
              />
            </label>

            <div className="flex items-center justify-between text-sm">
              <Link to="/forgot-password" className="font-semibold text-workie-blue">
                Forgot password?
              </Link>
              <Link to="/register" className="font-semibold text-workie-gold">
                Create account
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-workie-gold px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

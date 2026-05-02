import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const { forgotPassword, loading, error } = useAuth();
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setMessage('Check your email for a password reset link.');
    } catch (err) {
      setMessage('');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-28">
      <div className="shell-card w-full max-w-md p-8">
        <h2 className="shell-title block text-center text-3xl font-bold text-slate-900 mb-4">
          Reset Password
        </h2>
        {message ? (
          <div className="text-emerald-600 text-center mt-4">
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-slate-700 text-sm font-semibold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-workie-gold"
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="rounded-2xl bg-workie-gold px-4 py-3 font-semibold text-white"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <Link className="inline-block align-baseline font-bold text-sm text-workie-blue" to="/login">
                Back to Login
              </Link>
            </div>
            {error && (
              <div className="text-red-500 text-center mt-4">
                {error}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

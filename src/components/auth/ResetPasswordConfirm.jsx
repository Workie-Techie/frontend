import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ResetPasswordConfirm = () => {
  const { uid, token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [reNewPassword, setReNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { resetPasswordConfirm, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== reNewPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await resetPasswordConfirm(uid, token, newPassword, reNewPassword);
      setSuccess(true);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
      setSuccess(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 pt-28">
        <div className="shell-card w-full max-w-md p-8 text-center">
          <p className="text-emerald-600 text-center mt-4">Password reset successfully!</p>
          <Link to="/login" className="mt-5 inline-block font-bold text-sm text-workie-blue">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-28">
      <div className="shell-card w-full max-w-md p-8">
        <h2 className="shell-title block text-slate-900 text-center text-3xl font-bold mb-4">
          Reset Password Confirmation
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-slate-700 text-sm font-semibold mb-2" htmlFor="newPassword">
              New Password
            </label>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-workie-gold"
              id="newPassword"
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-slate-700 text-sm font-semibold mb-2" htmlFor="reNewPassword">
              Confirm New Password
            </label>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-workie-gold"
              id="reNewPassword"
              type="password"
              placeholder="Confirm New Password"
              value={reNewPassword}
              onChange={(e) => setReNewPassword(e.target.value)}
            />
          </div>
          {error && (
            <div className="text-rose-600 text-center mt-4">
              {error}
            </div>
          )}
          <div className="flex items-center justify-between">
            <button
              className="rounded-2xl bg-workie-gold px-4 py-3 font-semibold text-white"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordConfirm;

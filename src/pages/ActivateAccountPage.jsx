import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ActivateAccountPage() {
  const { uid, token } = useParams();
  const { activateAccount, loading, error } = useAuth();
  const [activationSuccess, setActivationSuccess] = useState(false);
  const [alreadyActivated, setAlreadyActivated] = useState(false);
  const activationAttempted = useRef(false);

  useEffect(() => {
    if (activationAttempted.current) return;
    activationAttempted.current = true;
    const activate = async () => {
      const response = await activateAccount(uid, token);
      if (response.success) {
        setActivationSuccess(true);
        setAlreadyActivated(Boolean(response.alreadyActivated));
      }
    };

    activate();
  }, [uid, token, activateAccount]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-28">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="shell-card p-8">
          {loading ? (
            <p className="text-slate-600">Activating your account...</p>
          ) : activationSuccess ? (
            <>
              <h2 className="shell-title text-3xl font-bold text-emerald-600 mb-4">
                {alreadyActivated ? "Account Already Activated" : "Account Activated!"}
              </h2>
              <p className="text-slate-600 mb-6 leading-7">
                {alreadyActivated
                  ? "This activation link has already been used, so your account should be ready. You can log in now."
                  : "Your account has been successfully activated. You can now log in."}
              </p>
              <Link to="/login" className="font-semibold text-workie-blue">
                Go to Login
              </Link>
            </>
          ) : (
            <>
              <h2 className="shell-title text-3xl font-bold text-rose-600 mb-4">Activation Failed</h2>
              <p className="text-slate-600 mb-6 leading-7">
                {error || 'Something went wrong while activating your account.'}
              </p>
              <Link to="/" className="font-semibold text-workie-blue">
                Go Home
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

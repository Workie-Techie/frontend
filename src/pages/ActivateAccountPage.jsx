import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ActivateAccountPage() {
  const { uid, token } = useParams();
  const { activateAccount, loading, error } = useAuth();
  const [activationSuccess, setActivationSuccess] = useState(false);

  useEffect(() => {
    const activate = async () => {
      const response = await activateAccount(uid, token);
      if (response.success) {
        setActivationSuccess(true);
      }
    };

    activate();
  }, [uid, token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          {loading ? (
            <p className="text-gray-600">Activating your account...</p>
          ) : activationSuccess ? (
            <>
              <h2 className="text-2xl font-bold text-green-600 mb-4">Account Activated!</h2>
              <p className="text-gray-600 mb-6">
                Your account has been successfully activated. You can now log in.
              </p>
              <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Go to Login
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-red-600 mb-4">Activation Failed</h2>
              <p className="text-gray-600 mb-6">
                {error || 'Something went wrong while activating your account.'}
              </p>
              <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Go Home
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Almost there!</h2>
          <p className="text-gray-600 mb-6">
            We've sent you an email with a link to activate your account. Please check your inbox and follow the instructions.
          </p>
          <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-28">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="shell-card p-8">
          <h2 className="shell-title text-3xl font-bold text-slate-900 mb-4">Almost there!</h2>
          <p className="text-slate-600 mb-6 leading-7">
            We've sent you an email with a link to activate your account. Please check your inbox and follow the instructions.
          </p>
          <Link to="/login" className="font-semibold text-workie-blue">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

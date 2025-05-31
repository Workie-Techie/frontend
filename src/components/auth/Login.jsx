import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import logoImage from '../../assets/logo2.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!email.trim() || !password.trim()) {
      setFormError('Email and password are required');
      return;
    }
    
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white"
         style={{ 
           backgroundImage: `radial-gradient(circle, #f0f0f0 1px, transparent 1px)`, 
           backgroundSize: '25px 25px' 
         }}>
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          {/* Replace with your actual logo */}
          <img src={logoImage} alt="WorkieTechie Logo" className="h-18 mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">Login to your account</h2>
          <p className="text-workie-gold mt-2">Gain access to your account</p>
        </div>
        
        {(error || formError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{formError || error}</span>
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none relative block w-full px-3 py-3 bg-[#EAF0F7] rounded-md focus:outline-none focus:ring-workie-gold focus:border-workie-gold focus:z-10 sm:text-sm"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none relative block w-full px-3 py-3 bg-[#EAF0F7] rounded-md focus:outline-none focus:ring-workie-gold focus:border-workie-gold focus:z-10 sm:text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-workie-gold focus:ring-workie-gold border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Keep me logged in
              </label>
            </div>
            
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-workie-gold hover:text-amber-600">
                Forgot password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-workie-gold hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-workie-gold"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </div>
          
          <div className="text-sm text-center mt-4">
            <p className="text-gray-600">
              Don't have an account?&nbsp;
              <Link to="/register" className="font-medium text-workie-gold hover:text-amber-600">
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

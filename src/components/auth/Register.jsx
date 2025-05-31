import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import logoImage from '../../assets/logo2.png'; // You'll need to add a logo image

const Register = () => {
  const [formData, setFormData] = useState({
    // username: '',
    email: '',
    password: '',
    re_password: '',
    is_client: false,
    is_freelancer: false
  });
  
  const [formError, setFormError] = useState('');
  const { register, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleUserTypeChange = (type) => {
    if (type === 'client') {
      setFormData({
        ...formData,
        is_client: true,
        is_freelancer: false
      });
    } else {
      setFormData({
        ...formData,
        is_client: false,
        is_freelancer: true
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Validation
    if ( !formData.email.trim() || !formData.password.trim()) {
      setFormError('All fields are required');
      return;
    }
    
    if (formData.password !== formData.re_password) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (!formData.is_client && !formData.is_freelancer) {
      setFormError('Please select your account type');
      return;
    }
    
    const success = await register(formData);
    if (success) {
      navigate('/check-email');
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
          <h2 className="text-2xl font-bold text-gray-800">Create your account</h2>
          <p className="text-workie-gold mt-2">Join our platform today</p>
        </div>
        
        {(error || formError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{formError || error}</span>
          </div>
        )}
        
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="appearance-none relative block w-full px-3 py-3 bg-[#EAF0F7] rounded-md focus:outline-none focus:ring-workie-gold focus:border-workie-gold focus:z-10 sm:text-sm"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
          </div> */}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none relative block w-full px-3 py-3 bg-[#EAF0F7] rounded-md focus:outline-none focus:ring-workie-gold focus:border-workie-gold focus:z-10 sm:text-sm"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="appearance-none relative block w-full px-3 py-3 bg-[#EAF0F7] rounded-md focus:outline-none focus:ring-workie-gold focus:border-workie-gold focus:z-10 sm:text-sm"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="re_password" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="re_password"
              name="re_password"
              type="password"
              autoComplete="new-password"
              required
              className="appearance-none relative block w-full px-3 py-3 bg-[#EAF0F7] rounded-md focus:outline-none focus:ring-workie-gold focus:border-workie-gold focus:z-10 sm:text-sm"
              placeholder="Confirm Password"
              value={formData.re_password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
            <div className="grid grid-cols-2 gap-4">
              <div 
                className={`border rounded-md p-3 flex items-center justify-center cursor-pointer ${formData.is_client ? 'bg-amber-100 border-workie-gold text-amber-700' : 'border-gray-300 text-gray-700'}`}
                onClick={() => handleUserTypeChange('client')}
              >
                <span className="text-sm font-medium">Client</span>
              </div>
              <div 
                className={`border rounded-md p-3 flex items-center justify-center cursor-pointer ${formData.is_freelancer ? 'bg-amber-100 border-workie-gold text-amber-700' : 'border-gray-300 text-gray-700'}`}
                onClick={() => handleUserTypeChange('freelancer')}
              >
                <span className="text-sm font-medium">Freelancer</span>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-workie-gold hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-workie-gold"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
          
          <div className="text-sm text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-workie-gold hover:text-amber-600">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
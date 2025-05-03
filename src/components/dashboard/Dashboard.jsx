import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { logout, fetchCurrentUser } = useAuth();
  const user = useSelector((state) => state.auth.user);

  // useEffect(() => {
  //   fetchCurrentUser();
  // }, [fetchCurrentUser]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Link to="/edit-profile" className="text-indigo-600 hover:text-indigo-800 font-medium">Edit Profile</Link>
          <button
            onClick={logout}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            Logout
          </button>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {user && (
            <div className="px-4 py-6 bg-white shadow rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800">User Information</h2>
              <div className="mt-4">
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Status:</strong> {user?.is_client ? 'Client' : user?.is_freelancer ? 'Freelancer' : 'Unknown'}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

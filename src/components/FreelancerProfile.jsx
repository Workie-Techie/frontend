import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import profileService from '../services/profileService';

// Icons
import { FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa';
import { MdLocationOn, MdAccessTime } from 'react-icons/md';
import { IoMdMail } from 'react-icons/io';

const FreelancerProfile = () => {
  const { profileSlug } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await profileService.getPublicProfile(profileSlug);
        setProfile(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load freelancer profile. It may not exist or has been removed.');
      } finally {
        setLoading(false);
      }
    };

    if (profileSlug) {
      loadProfile();
    }
  }, [profileSlug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-bold text-red-700 mb-2">Profile Not Found</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="bg-gray-50 min-h-screen pt-16 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32"></div>
          <div className="relative px-6 pt-16 pb-8 sm:px-8">
            <div className="absolute -top-12 left-6 sm:left-8">
              <div className="h-24 w-24 rounded-full ring-4 ring-white bg-gray-100 flex items-center justify-center overflow-hidden">
                {profile.profile_image ? (
                  <img 
                    src={profile.profile_image} 
                    alt={profile.name} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-blue-100 flex items-center justify-center">
                    <span className="text-3xl font-bold text-blue-500">
                      {profile.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-end">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                <p className="text-gray-600 font-medium">{profile.title}</p>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <MdAccessTime className="mr-1" />
                  <span>Member since {profile.joined_date}</span>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0">
                {profile.hourly_rate && (
                  <div className="text-xl font-bold text-blue-600">
                    ${profile.hourly_rate}/hr
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - About & Skills */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
              <div className="prose max-w-none text-gray-600">
                {profile.bio ? (
                  <p>{profile.bio}</p>
                ) : (
                  <p className="text-gray-400 italic">No bio available</p>
                )}
              </div>
            </div>
            
            {/* Portfolio Section */}
            {profile.portfolio && profile.portfolio.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Portfolio</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile.portfolio.map((item) => (
                    <div key={item.id} className="group relative rounded-md overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.description.substring(0, 20)} 
                        className="w-full h-48 object-cover transform transition group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end">
                        <p className="text-white p-3 text-sm line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Right Sidebar */}
          <div className="space-y-8">
            
            {/* Skills Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
              {profile.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span 
                      key={skill.id}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">No skills listed</p>
              )}
            </div>
            
            {/* Certifications Section */}
            {profile.certifications && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Certifications</h2>
                <div className="prose max-w-none text-gray-600">
                  {profile.certifications ? (
                    <p>{profile.certifications}</p>
                  ) : (
                    <p className="text-gray-400 italic">No certifications listed</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Contact Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact</h2>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition">
                Contact Freelancer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfile;
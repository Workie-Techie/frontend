import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FaEdit, FaUser, FaLanguage, FaClock, FaMoneyBillWave, FaTags } from 'react-icons/fa';

const EditProfile = () => {
  const { fetchUserProfile } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setProfile(data);
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };
    loadProfile();
  }, []);

  if (!profile) return <div className="text-center p-4">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 bg-white rounded-2xl shadow-md space-y-10">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="text-xl font-semibold">Edit Profile</div>
        <FaEdit className="text-neutral-500" />
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <div className="flex items-center gap-2 mt-1">
            <FaUser className="text-neutral-400" />
            <input
              type="text"
              defaultValue={profile.title}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-300"
            />
          </div>
        </div>

        {/* Hourly Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Hourly Rate</label>
          <div className="flex items-center gap-2 mt-1">
            <FaMoneyBillWave className="text-neutral-400" />
            <input
              type="number"
              defaultValue={profile.hourly_rate}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-300"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            defaultValue={profile.bio}
            rows={4}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-300"
          />
        </div>

        {/* Languages */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Languages</label>
          <div className="flex items-center gap-2 mt-1">
            <FaLanguage className="text-neutral-400" />
            <input
              type="text"
              defaultValue={profile.languages?.join(', ')}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-300"
            />
          </div>
        </div>

        {/* Availability */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Hours per Week</label>
          <div className="flex items-center gap-2 mt-1">
            <FaClock className="text-neutral-400" />
            <input
              type="text"
              defaultValue={profile.hours_per_week || 'As Needed - Open to Offers'}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-300"
            />
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Skills</label>
          <div className="flex items-center gap-2 mt-1">
            <FaTags className="text-neutral-400" />
            <input
              type="text"
              defaultValue={profile.skills?.join(', ')}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-300"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button className="bg-neutral-800 text-white px-6 py-2 rounded-lg hover:bg-neutral-700 transition">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

// Icon Library Used: react-icons/fa (Font Awesome subset)

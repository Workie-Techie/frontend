import axios from 'axios';

const API_URL = 'http://localhost:8000';

const profileService = {
  // Fetch a public profile by slug
  getPublicProfile: async (profileSlug) => {
    try {
      const response = await axios.get(`${API_URL}/api/profile/freelancer/${profileSlug}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching public profile:', error);
      throw error;
    }
  },
  
  // Get list of freelancers (optional, for a freelancer directory)
  getFreelancers: async (page = 1, filters = {}) => {
    try {
      const response = await axios.get(`${API_URL}/api/profile/freelancers/`, {
        params: { page, ...filters }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching freelancers:', error);
      throw error;
    }
  }
};

export default profileService;
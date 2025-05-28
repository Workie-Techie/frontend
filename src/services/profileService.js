import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Create a separate axios instance for public requests (without auth headers)
const publicAxios = axios.create({
  baseURL: API_URL
});

const privateAxios = axios.create({
  baseURL: API_URL
});

export const setAuthToken = (token) => {
  if (token) {
    privateAxios.defaults.headers.common['Authorization'] = `JWT ${token}`;
  } else {
    delete privateAxios.defaults.headers.common['Authorization'];
  }
};

// Initialize with token from localStorage if it exists
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
  // console.log(token)
}


const profileService = {
  // Fetch a public profile by slug - explicitly sends request without auth headers
  getPublicProfile: async (profileSlug) => {
    try {
      const response = await publicAxios.get(`${API_URL}/api/profile/freelancer/${profileSlug}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching public profile:', error);
      throw error;
    }
  },
 
  // Get list of freelancers (optional, for a freelancer directory)
  getFreelancers: async (page = 1, filters = {}) => {
    try {
      // Explicitly create request config WITHOUT authorization headers
      const config = {
        params: { page, ...filters }
      };
      
      const response = await publicAxios.get(`${API_URL}/api/profile/freelancers/`, config);
      return response.data;
    } catch (error) {
      console.error('Error fetching freelancers:', error);
      throw error;
    }
  },

  // Get available skills - uses the privateAxios instance with auth headers
  getSkills: async () => {
    try {
      const response = await privateAxios.get('/api/profile/skills/');
      return response.data;
    } catch (error) {
      console.error('Error fetching skills:', error);
      throw error;
    }
  },
  createJob: async (jobData) => {
    try {
      const response = await privateAxios.post('/api/profile/jobs/', jobData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateJob: async (jobId, jobData) => {
    try {
      const response = await privateAxios.put(`/api/profile/jobs/${jobId}/`, jobData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteJob: async (jobId) => {
    try {
      await privateAxios.delete(`/api/profile/jobs/${jobId}/`);
    } catch (error) {
      throw error;
    }
  },
  getJob: async (jobId) => {
     try {
      const response = await privateAxios.get(`/api/profile/jobs/${jobId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default profileService;

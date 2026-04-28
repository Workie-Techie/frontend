import { privateApi, publicApi } from "./authService";

const unwrapList = (data) => {
  if (Array.isArray(data)) {
    return data;
  }
  if (Array.isArray(data?.results)) {
    return data.results;
  }
  return [];
};

const profileService = {
  getLandingContent: async () => {
    const response = await publicApi.get("/api/profile/landing-content/");
    return unwrapList(response.data);
  },

  getExpertiseCategories: async () => {
    const response = await publicApi.get("/api/profile/expertise-categories/");
    return unwrapList(response.data);
  },

  getBanks: async () => {
    const response = await privateApi.get("/api/profile/banks/");
    return unwrapList(response.data);
  },

  getQuestionSets: async (audience, categoryId) => {
    const response = await publicApi.get("/api/profile/question-sets/", {
      params: {
        audience,
        ...(categoryId ? { category_id: categoryId } : {}),
      },
    });
    return unwrapList(response.data);
  },

  getProfile: async () => {
    const response = await privateApi.get("/api/profile/");
    return response.data;
  },

  updateProfile: async (payload, isMultipart = false) => {
    const response = await privateApi.patch("/api/profile/", payload, {
      headers: isMultipart ? { "Content-Type": "multipart/form-data" } : undefined,
    });
    return response.data;
  },

  saveProfessionalAnswers: async (answers) => {
    const response = await privateApi.post("/api/profile/professional-answers/", { answers });
    return response.data;
  },

  getSkills: async () => {
    const response = await privateApi.get("/api/profile/skills/");
    return unwrapList(response.data);
  },

  getClientRequests: async () => {
    const response = await privateApi.get("/api/profile/client-requests/");
    return unwrapList(response.data);
  },

  getClientRequestDetail: async (requestId) => {
    const response = await privateApi.get(`/api/profile/client-requests/${requestId}/`);
    return response.data;
  },

  createClientRequest: async (payload) => {
    const response = await privateApi.post("/api/profile/client-requests/", payload);
    return response.data;
  },

  getAssignments: async () => {
    const response = await privateApi.get("/api/profile/assignments/");
    return unwrapList(response.data);
  },

  actOnAssignment: async (assignmentId, action, responseText) => {
    const response = await privateApi.post(`/api/profile/assignments/${assignmentId}/action/`, {
      action,
      response: responseText,
    });
    return response.data;
  },

  getThreads: async () => {
    const response = await privateApi.get("/api/profile/threads/");
    return unwrapList(response.data);
  },

  createThread: async (payload) => {
    const response = await privateApi.post("/api/profile/threads/", payload);
    return response.data;
  },

  sendMessage: async (threadId, body) => {
    const response = await privateApi.post(`/api/profile/threads/${threadId}/messages/`, { body });
    return response.data;
  },

  getBankAccounts: async () => {
    const response = await privateApi.get("/api/profile/bank-accounts/");
    return unwrapList(response.data);
  },

  createBankAccount: async (payload) => {
    const response = await privateApi.post("/api/profile/bank-accounts/", payload);
    return response.data;
  },

  getPayments: async () => {
    const response = await privateApi.get("/api/profile/payments/");
    return unwrapList(response.data);
  },

  createPayment: async (payload) => {
    const response = await privateApi.post("/api/profile/payments/", payload, {
      headers: payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
    });
    return response.data;
  },

  getShareLinks: async () => {
    const response = await privateApi.get("/api/profile/share-links/");
    return unwrapList(response.data);
  },

  getPortfolioItems: async () => {
    const response = await privateApi.get("/api/profile/portfolio-items/");
    return unwrapList(response.data);
  },

  createPortfolioItem: async (payload) => {
    const response = await privateApi.post("/api/profile/portfolio-items/", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deletePortfolioItem: async (itemId) => {
    await privateApi.delete(`/api/profile/portfolio-items/${itemId}/`);
  },

  createShareLink: async (payload = {}) => {
    const response = await privateApi.post("/api/profile/share-links/", payload);
    return response.data;
  },

  getSharedProfile: async (token) => {
    const response = await publicApi.get(`/api/profile/portfolio/${token}/`);
    return response.data;
  },
};

export default profileService;

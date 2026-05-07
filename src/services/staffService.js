import { privateApi } from "./authService";

const unwrapList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

const staffService = {
  getOverview: async () => (await privateApi.get("/api/staff/overview/")).data,

  getRequests: async (params = {}) => unwrapList((await privateApi.get("/api/staff/requests/", { params })).data),
  getRequest: async (id) => (await privateApi.get(`/api/staff/requests/${id}/`)).data,
  updateRequest: async (id, payload) => (await privateApi.patch(`/api/staff/requests/${id}/`, payload)).data,
  updateRequestStatus: async (id, payload) => (await privateApi.post(`/api/staff/requests/${id}/status/`, payload)).data,
  ensureRequestThread: async (id) => (await privateApi.post(`/api/staff/requests/${id}/ensure-thread/`)).data,

  getProfiles: async (params = {}) => unwrapList((await privateApi.get("/api/staff/profiles/", { params })).data),
  getProfile: async (id) => (await privateApi.get(`/api/staff/profiles/${id}/`)).data,
  updateProfile: async (id, payload) => (await privateApi.patch(`/api/staff/profiles/${id}/`, payload)).data,
  updateProfileBrowse: async (id, payload) => (await privateApi.post(`/api/staff/profiles/${id}/browse-visibility/`, payload)).data,

  getClients: async (params = {}) => unwrapList((await privateApi.get("/api/staff/clients/", { params })).data),

  getAssignments: async () => unwrapList((await privateApi.get("/api/staff/assignments/")).data),
  createAssignment: async (payload) => (await privateApi.post("/api/staff/assignments/", payload)).data,
  updateAssignment: async (id, payload) => (await privateApi.patch(`/api/staff/assignments/${id}/`, payload)).data,
  updateAssignmentStatus: async (id, payload) => (await privateApi.post(`/api/staff/assignments/${id}/status/`, payload)).data,

  getThreads: async (params = {}) => unwrapList((await privateApi.get("/api/staff/threads/", { params })).data),
  replyThread: async (id, body) => (await privateApi.post(`/api/staff/threads/${id}/reply/`, { body })).data,
  closeThread: async (id) => (await privateApi.post(`/api/staff/threads/${id}/close/`)).data,
  reopenThread: async (id) => (await privateApi.post(`/api/staff/threads/${id}/reopen/`)).data,

  getPayments: async () => unwrapList((await privateApi.get("/api/staff/payments/")).data),
  verifyPayment: async (id, payload) => (await privateApi.post(`/api/staff/payments/${id}/verify/`, payload)).data,
  declinePayment: async (id, payload) => (await privateApi.post(`/api/staff/payments/${id}/decline/`, payload)).data,

  getPayouts: async () => unwrapList((await privateApi.get("/api/staff/payouts/")).data),
  createPayout: async (payload) => (await privateApi.post("/api/staff/payouts/", payload)).data,

  getCategories: async () => unwrapList((await privateApi.get("/api/staff/categories/")).data),
  createCategory: async (payload) => (await privateApi.post("/api/staff/categories/", payload)).data,
  updateCategory: async (id, payload) => (await privateApi.patch(`/api/staff/categories/${id}/`, payload)).data,

  getSpecializations: async () => unwrapList((await privateApi.get("/api/staff/specializations/")).data),
  createSpecialization: async (payload) => (await privateApi.post("/api/staff/specializations/", payload)).data,
  updateSpecialization: async (id, payload) => (await privateApi.patch(`/api/staff/specializations/${id}/`, payload)).data,

  getQuestionSets: async () => unwrapList((await privateApi.get("/api/staff/question-sets/")).data),
  createQuestionSet: async (payload) => (await privateApi.post("/api/staff/question-sets/", payload)).data,
  updateQuestionSet: async (id, payload) => (await privateApi.patch(`/api/staff/question-sets/${id}/`, payload)).data,

  getQuestions: async () => unwrapList((await privateApi.get("/api/staff/questions/")).data),
  createQuestion: async (payload) => (await privateApi.post("/api/staff/questions/", payload)).data,
  updateQuestion: async (id, payload) => (await privateApi.patch(`/api/staff/questions/${id}/`, payload)).data,

  getSiteContent: async () => unwrapList((await privateApi.get("/api/staff/site-content/")).data),
  updateSiteContent: async (id, payload) => (await privateApi.patch(`/api/staff/site-content/${id}/`, payload)).data,

  getSettings: async () => unwrapList((await privateApi.get("/api/staff/settings/")).data),
  updateSetting: async (id, payload) => (await privateApi.patch(`/api/staff/settings/${id}/`, payload)).data,

  getResources: async () => unwrapList((await privateApi.get("/api/staff/resources/")).data),
  createResource: async (payload) => (await privateApi.post("/api/staff/resources/", payload)).data,
  updateResource: async (id, payload) => (await privateApi.patch(`/api/staff/resources/${id}/`, payload)).data,

  getAuditLogs: async () => unwrapList((await privateApi.get("/api/staff/audit-logs/")).data),
  getDisputes: async () => unwrapList((await privateApi.get("/api/staff/disputes/")).data),
  updateDispute: async (id, payload) => (await privateApi.patch(`/api/staff/disputes/${id}/`, payload)).data,
  getSubmissions: async () => unwrapList((await privateApi.get("/api/staff/submissions/")).data),
  getPortfolioItems: async () => unwrapList((await privateApi.get("/api/staff/portfolio-items/")).data),
  updatePortfolioItem: async (id, payload) => (await privateApi.patch(`/api/staff/portfolio-items/${id}/`, payload)).data,
};

export default staffService;

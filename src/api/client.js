const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://studioapi.winterknights.com.na/api";
//const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8686/api";

function getToken() {
  return localStorage.getItem("fm_token");
}

async function parseResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && getToken()) {
      clearAuth();
      window.dispatchEvent(new Event("fm-auth-expired"));
    }
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}

/** Public endpoints — never sends Authorization (avoids stale admin tokens breaking public forms). */
async function publicRequest(path, options = {}) {
  const headers = { "Content-Type": "application/json", Accept: "application/json", ...options.headers };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  return parseResponse(res);
}

/** Authenticated admin endpoints — always sends Bearer token. */
async function request(path, options = {}) {
  const token = getToken();
  if (!token) {
    throw new Error("Not authenticated");
  }
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  return parseResponse(res);
}

/** Auth login — no token required. */
async function authRequest(path, options = {}) {
  const headers = { "Content-Type": "application/json", Accept: "application/json", ...options.headers };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  return parseResponse(res);
}

export const api = {
  // Public
  getPackages: () => publicRequest("/packages"),
  getAvailableSlots: (from, to) => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const qs = params.toString();
    return publicRequest(`/slots/available${qs ? `?${qs}` : ""}`);
  },
  createBooking: (body) => publicRequest("/bookings", { method: "POST", body: JSON.stringify(body) }),

  getVideoProductionOptions: () => publicRequest("/video-production/options"),
  createVideoProductionRequest: (body) =>
    publicRequest("/video-production/requests", { method: "POST", body: JSON.stringify(body) }),

  getSets: () => publicRequest("/sets"),

  // Auth
  login: (email, password) =>
    authRequest("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  // Admin
  getDashboard: () => request("/admin/dashboard"),
  getAllPackages: () => request("/admin/packages"),
  createPackage: (body) => request("/admin/packages", { method: "POST", body: JSON.stringify(body) }),
  updatePackage: (id, body) => request(`/admin/packages/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deletePackage: (id) => request(`/admin/packages/${id}`, { method: "DELETE" }),
  getAllSlots: () => request("/admin/slots"),
  createSlot: (body) => request("/admin/slots", { method: "POST", body: JSON.stringify(body) }),
  deleteSlot: (id) => request(`/admin/slots/${id}`, { method: "DELETE" }),
  getAllBookings: () => request("/admin/bookings"),
  downloadInvoice: async (id) => {
    const token = getToken();
    if (!token) throw new Error("Not authenticated");
    const res = await fetch(`${API_BASE}/admin/bookings/${id}/invoice`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to download invoice");
    return res.blob();
  },
  approveBooking: (id) => request(`/admin/bookings/${id}/approve`, { method: "PATCH" }),
  rejectBooking: (id) => request(`/admin/bookings/${id}/reject`, { method: "PATCH" }),
  deleteBooking: (id) => request(`/admin/bookings/${id}`, { method: "DELETE" }),
  getAdmins: () => request("/admin/admins"),
  createAdmin: (body) => request("/admin/admins", { method: "POST", body: JSON.stringify(body) }),
  deleteAdmin: (id) => request(`/admin/admins/${id}`, { method: "DELETE" }),
  getMe: () => request("/admin/me"),

  // Video production requests
  getAllVideoProductionRequests: () => request("/admin/video-production/requests"),
  getVideoProductionRequest: (id) => request(`/admin/video-production/requests/${id}`),
  approveVideoProductionRequest: (id) =>
    request(`/admin/video-production/requests/${id}/approve`, { method: "PATCH" }),
  rejectVideoProductionRequest: (id) =>
    request(`/admin/video-production/requests/${id}/reject`, { method: "PATCH" }),
  updateVideoProductionRequest: (id, body) =>
    request(`/admin/video-production/requests/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteVideoProductionRequest: (id) =>
    request(`/admin/video-production/requests/${id}`, { method: "DELETE" }),

  // Lookup: Accountants
  getAccountants: () => request("/admin/accountants"),
  createAccountant: (body) => request("/admin/accountants", { method: "POST", body: JSON.stringify(body) }),
  updateAccountant: (id, body) => request(`/admin/accountants/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteAccountant: (id) => request(`/admin/accountants/${id}`, { method: "DELETE" }),

  // Lookup: Job types
  getJobTypes: () => request("/admin/job-types"),
  createJobType: (body) => request("/admin/job-types", { method: "POST", body: JSON.stringify(body) }),
  updateJobType: (id, body) => request(`/admin/job-types/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteJobType: (id) => request(`/admin/job-types/${id}`, { method: "DELETE" }),

  // Lookup: Script lengths
  getScriptLengths: () => request("/admin/script-lengths"),
  createScriptLength: (body) => request("/admin/script-lengths", { method: "POST", body: JSON.stringify(body) }),
  updateScriptLength: (id, body) => request(`/admin/script-lengths/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteScriptLength: (id) => request(`/admin/script-lengths/${id}`, { method: "DELETE" }),

  // Lookup: Voice actors
  getVoiceActors: () => request("/admin/voice-actors"),
  createVoiceActor: (body) => request("/admin/voice-actors", { method: "POST", body: JSON.stringify(body) }),
  updateVoiceActor: (id, body) => request(`/admin/voice-actors/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteVoiceActor: (id) => request(`/admin/voice-actors/${id}`, { method: "DELETE" }),

  // Lookup: Music types
  getMusicTypes: () => request("/admin/music-types"),
  createMusicType: (body) => request("/admin/music-types", { method: "POST", body: JSON.stringify(body) }),
  updateMusicType: (id, body) => request(`/admin/music-types/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteMusicType: (id) => request(`/admin/music-types/${id}`, { method: "DELETE" }),

  // Studio sets
  getAllSets: () => request("/admin/sets"),
  createSet: (body) => request("/admin/sets", { method: "POST", body: JSON.stringify(body) }),
  updateSet: (id, body) => request(`/admin/sets/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteSet: (id) => request(`/admin/sets/${id}`, { method: "DELETE" }),
};

export function saveAuth(data) {
  localStorage.setItem("fm_token", data.token);
  localStorage.setItem("fm_admin", JSON.stringify(data));
}

export function clearAuth() {
  localStorage.removeItem("fm_token");
  localStorage.removeItem("fm_admin");
}

export function getAdmin() {
  try {
    return JSON.parse(localStorage.getItem("fm_admin"));
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getToken());
}

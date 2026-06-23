//const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8686/api";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://studioapi.winterknights.com.na/api";


function getToken() {
  return localStorage.getItem("fm_token");
}

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  // Public
  getPackages: () => request("/packages"),
  getAvailableSlots: (from, to) => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const qs = params.toString();
    return request(`/slots/available${qs ? `?${qs}` : ""}`);
  },
  createBooking: (body) => request("/bookings", { method: "POST", body: JSON.stringify(body) }),

  // Auth
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

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
    const res = await fetch(`${API_BASE}/admin/bookings/${id}/invoice`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
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

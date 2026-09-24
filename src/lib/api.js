// API utility with environment-aware base URL
const API_BASE = import.meta.env.VITE_API_URL || ""; // Empty = same origin (dev/proxy)

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const defaultHeaders = {
    "Content-Type": "application/json",
  };
  
  const response = await fetch(url, {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
    credentials: "include", // Include cookies for CORS
  });

  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    const error = new Error(data.message || data.errors?.join(", ") || `HTTP ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  return data;
}

async function uploadRequest(path, formData) {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    const error = new Error(data.message || data.errors?.join(", ") || data.error || `HTTP ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  return data;
}

export const api = {
  // Auth endpoints
  register: (userData) => request("/api/auth/register", { method: "POST", body: JSON.stringify(userData) }),
  login: (credentials) => request("/api/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  forgotPassword: (email) => request("/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
  verifyResetToken: (token) => request("/api/auth/verify-reset-token", { method: "POST", body: JSON.stringify({ token }) }),
  resetPassword: (token, newPassword) => request("/api/auth/reset-password", { method: "POST", body: JSON.stringify({ token, newPassword }) }),
  
  // Legacy register endpoint (for two-step flow)
  registerComplete: (userData) => request("/register", { method: "POST", body: JSON.stringify(userData) }),

  // File uploads
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return uploadRequest("/upload", formData);
  },
  
  uploadVerification: (idFront, idBack) => {
    const formData = new FormData();
    formData.append("idFront", idFront);
    formData.append("idBack", idBack);
    return uploadRequest("/verify", formData);
  },
};

export default api;
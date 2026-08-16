import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api";

export const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- Public endpoints ---
export const getProjects = (params = {}) => api.get("/projects/", { params });
export const getProject = (slug) => api.get(`/projects/${slug}/`);
export const getCategories = () => api.get("/categories/");
export const getProfile = () => api.get("/profile/");
export const sendContactMessage = (payload) => api.post("/contact/", payload);

// --- Auth ---
export const login = (username, password) =>
  api.post("/auth/login/", { username, password });

// --- Dashboard (authenticated) ---
export const getDashboardProjects = () => api.get("/dashboard/projects/");
export const createProject = (formData) =>
  api.post("/dashboard/projects/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateProject = (slug, formData) =>
  api.patch(`/dashboard/projects/${slug}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteProject = (slug) => api.delete(`/dashboard/projects/${slug}/`);
export const getInbox = () => api.get("/dashboard/messages/");

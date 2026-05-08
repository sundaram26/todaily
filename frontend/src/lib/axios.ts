import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to include credentials for requests that need them
api.interceptors.request.use((config) => {
  // For mutations that require credentials (like login), set withCredentials
  if (config.withCredentials) {
    config.withCredentials = true;
  }
  return config;
});

export default api;

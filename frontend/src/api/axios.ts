import axios from "axios";
import { STORAGE_KEYS } from "../constants/storageKeys";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    // Do NOT attach token for login endpoint
    if (token && config.url && !config.url.includes("/auth/login")) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired or unauthorized
    if (error.response?.status === 401) {
      localStorage.clear();

      // Prevent infinite redirect loop
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
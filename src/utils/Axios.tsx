// utils/axios.ts
import axios from "axios";

export const baseURL = "https://api.africarisque.com";

const Axios = axios.create({
  baseURL,
  withCredentials: false, // Django JWT → généralement false
});

// Attach access token
Axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle refresh token
Axios.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh_token");

      if (!refresh) return Promise.reject(error);

      try {
        const res = await axios.post(`${baseURL}/api/auth/refresh/`, {
          refresh_token: refresh,
        });

        const newAccess = res.data.access_token;

        localStorage.setItem("access_token", newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return Axios(originalRequest);

      } catch (err) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default Axios;
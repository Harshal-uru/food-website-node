import axios from "axios";
const redirectToLogin = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "/api" // ✅ Relative path for production, works with Nginx reverse proxy
      : "http://localhost:5001/api", // Local dev backend
  headers: { "Content-Type": "application/json" },
  timeout: 10000, // Optional: 10s timeout
});

// Request interceptor to add token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

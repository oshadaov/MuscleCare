import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL:apiUrl || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token in the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

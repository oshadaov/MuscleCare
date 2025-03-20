import { createContext, useState, useContext, useEffect } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/admin/auth/check");
      setCurrentUser(response.data.admin);
    } catch (err) {
      console.error("Auth check error:", err);
      localStorage.removeItem("adminToken");
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await api.post("/admin/auth/login", credentials);
      localStorage.setItem("adminToken", response.data.token);
      setCurrentUser(response.data.admin);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await api.post("/admin/auth/register", userData);
      toast.success("Registration successful! You can now log in.");
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setCurrentUser(null);
    toast.success("Logged out successfully");
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

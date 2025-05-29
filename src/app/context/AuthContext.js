"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useCallback
} from "react";
import axios from "axios";

import { API_URL } from "@/configs/url";
import { jwtDecode } from 'jwt-decode';



export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const logout = () => {
    console.log("logout")
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    console.log("susseccfully logout")
  };

  const fetchUser = useCallback(async (authToken) => {
    try {
      const decoded = jwtDecode(authToken);
      console.log("decoded user", decoded);

      const userId = decoded?.userId;

      console.log("userId", decoded);

      if (!userId) {
        throw new Error("User ID not found in token");
      }

      const response = await axios.get(`${API_URL}/api/auth/users/${userId}`);

      console.log("response", response.data);

      const fetchedUser = response?.data?.user;

      if (!fetchedUser) {
        throw new Error("Invalid user data structure in response");
      }

      if (fetchedUser.role !== "admin") {
        return false;
      }

      setUser(fetchedUser);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to load user data"
      );
      logout();
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await fetchUser(storedToken);
      }
      setLoading(false);
    };

    initializeAuth();
  }, [fetchUser]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  

  const login = (userData, authToken) => {
    console.log("AuthContext login called", userData);
    console.log("AuthContext login called", authToken);
    
    setUser(userData);
    setToken(authToken);
    
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

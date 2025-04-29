// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Cargar usuario al iniciar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Token inválido", error);
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
      }
    }
  }, []);

  // ESCUCHA DE CAMBIOS EN OTRAS PESTAÑAS
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token" && e.newValue === null) {
        // El token fue eliminado (logout en otra pestaña)
        setUser(null);
        navigate("/login");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

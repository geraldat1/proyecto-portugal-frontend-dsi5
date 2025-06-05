import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { obtenerUsuarioPorId } from "../services/usuarioService"; // importa tu servicio

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser ] = useState(null);
  const navigate = useNavigate();

  // Función para verificar si el token ha caducado
  const checkTokenExpiration = (token) => {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Obtener el tiempo actual en segundos
    return decoded.exp < currentTime; // Si la fecha de expiración es menor que el tiempo actual, ha caducado
  };

  // Cargar usuario al iniciar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        if (checkTokenExpiration(token)) {
          localStorage.removeItem("token");
          setUser(null);
          navigate("/login");
        } else {
          const decoded = jwtDecode(token);
          // Aquí: obtener datos actualizados del usuario
          obtenerUsuarioPorId(decoded.id).then(usuarioActualizado => {
            if (usuarioActualizado) {
              setUser({
                ...decoded,
                ...usuarioActualizado,
                name: usuarioActualizado.nombre,
                role: usuarioActualizado.rol,
              });
            } else {
              setUser(decoded);
            }
          }).catch(() => {
            setUser(decoded);
          });
        }
      } catch (error) {
        console.error("Token inválido", error);
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
      }
    } else {
      setUser(null);
      navigate("/login");
    }
  }, [navigate]); // Se incluye navigate como dependencia

  // Escucha de cambios en otras pestañas
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        if (e.newValue) {
          // Si hay un nuevo token, decodificar y establecer el usuario
          const decoded = jwtDecode(e.newValue);
          setUser (decoded);
        } else {
          // El token fue eliminado (logout en otra pestaña)
          setUser (null);
          navigate("/login");
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]); // Se incluye navigate como dependencia

  // Función para iniciar sesión
  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUser (decoded);
    navigate("/"); // Redirigir a la página principal o donde desees
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem("token");
    setUser (null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser , login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

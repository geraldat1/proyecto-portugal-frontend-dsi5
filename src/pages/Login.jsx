import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Form } from "react-bootstrap";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaShieldAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const [correo, setEmail] = useState("");
  const [clave, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.background = "#000000";
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.background = "";
    };
  }, []);

  useEffect(() => {
    if (message) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
        setMessage("");
        setMessageType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!correo || !clave) {
      setMessage("Por favor, completa todos los campos.");
      setMessageType("error");
      setIsLoading(false);
      return;
    }

    if (!validateEmail(correo)) {
      setMessage("Por favor, ingresa un correo electrónico válido.");
      setMessageType("error");
      setIsLoading(false);
      return;
    }

    if (clave.length < 6) {
      setMessage("La contraseña debe tener al menos 6 caracteres.");
      setMessageType("error");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/api/v1/login", {
        correo,
        clave,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      setUser(decoded);

      const nombreUsuario = res.data.user.nombre; // <-- Extraemos el nombre del usuario desde el backend

      setMessage(`¡Bienvenido, ${nombreUsuario}!`);
      setMessageType("success");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Credenciales incorrectas";

      if (errorMsg.toLowerCase().includes("deshabilitado")) {
        setMessage("Tu cuenta está deshabilitada. Contacta con soporte.");
      } else {
        setMessage(errorMsg);
      }
      setMessageType("error");
    }
    finally {
          setIsLoading(false);
        }
      };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="login-container"
    >
      <div className="login-background">
        <div className="particles-container">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                width: `${Math.random() * 5 + 1}px`,
                height: `${Math.random() * 5 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${Math.random() * 20 + 10}s`,
                opacity: Math.random() * 0.5 + 0.2,
              }}
            />
          ))}
        </div>
      </div>

      <div className="login-content">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="login-card"
        >
          <div className="login-image-section">
            <div className="image-overlay"></div>
            <div className="image-content">
              <FaShieldAlt className="security-icon" />
              <h3>Seguridad Garantizada</h3>
              <p>Tus datos están protegidos con encriptación de última generación</p>
            </div>
          </div>

          <div className="login-form-section">
            <div className="login-header">
              <div className="logo-container">
                <img src="../imagenes/img-toro.png" alt="Logo" className="logo" />
              </div>
              <h2>INICIAR SESIÓN</h2>
              <p>Ingresa tus credenciales para acceder al sistema</p>
            </div>

            {showAlert && (
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`alert-message ${messageType}`}
              >
                {message}
              </motion.div>
            )}

            <Form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={correo}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={clave}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                />
                <div
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setShowPassword(!showPassword);
                    }
                  }}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="spinner"></span>
                ) : (
                  "INGRESAR"
                )}
              </motion.button>
            </Form>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        :root {
          --primary-color: #000000;
          --secondary-color: #1a1a1a;
          --accent-color: #ffd700;
          --dark-color: #0f0c29;
          --light-color: #f8f9fa;
          --success-color: #00c851;
          --error-color: #ff4444;
          --gold-color: #ffd700;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Montserrat', sans-serif;
        }

        body {
          overflow: hidden;
          background-color: #000000;
        }

        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background-color: #000000;
        }

        .login-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #000000;
          z-index: -2;
        }

        .particles-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: -1;
        }

        .particle {
          position: absolute;
          background: rgba(255, 215, 0, 0.5);
          border-radius: 50%;
          animation: float 15s infinite linear;
        }

        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-1000px) rotate(720deg);
            opacity: 0;
          }
        }

        .login-content {
          width: 100%;
          max-width: 900px;
          padding: 0 20px;
        }

        .login-card {
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 215, 0, 0.3);
          color: var(--light-color);
          display: flex;
          height: 550px;
          width: 100%;
        }

        .login-image-section {
          width: 50%;
          background: url('../imagenes/fondo-log2.jpg') center/cover no-repeat;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 30px;
          filter: brightness(0.9);
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
          z-index: 0;
        }

        .image-content {
          position: relative;
          z-index: 1;
          color: white;
        }

        .security-icon {
          font-size: 40px;
          color: var(--gold-color);
          margin-bottom: 15px;
        }

        .login-image-section h3 {
          font-size: 22px;
          margin-bottom: 10px;
          color: var(--gold-color);
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
        }

        .login-image-section p {
          font-size: 14px;
          opacity: 0.9;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
        }

        .login-form-section {
          width: 50%;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: rgba(0, 0, 0, 0.7);
        }

        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .logo-container {
          margin-bottom: 20px;
        }

        .logo {
          width: 120px;
          height: auto;
          filter: drop-shadow(0 0 3px var(--gold-color));
        }

        .login-header h2 {
          font-size: 26px;
          margin-bottom: 8px;
          color: var(--gold-color);
        }

        .login-header p {
          font-size: 14px;
          opacity: 0.7;
          color: var(--light-color);
        }

        .alert-message {
          padding: 12px 20px;
          border-radius: 8px;
          margin-bottom: 15px;
          text-align: center;
          font-weight: 600;
          font-size: 14px;
          user-select: none;
        }

        .alert-message.success {
          background-color: var(--success-color);
          color: white;
        }

        .alert-message.error {
          background-color: var(--error-color);
          color: white;
        }

        .login-form {
          display: flex;
          flex-direction: column;
        }

        .form-group {
          position: relative;
          margin-bottom: 25px;
        }

        .form-input {
          width: 100%;
          padding: 12px 40px 12px 40px;
          font-size: 16px;
          border-radius: 10px;
          border: none;
          outline: none;
          background: rgba(255, 255, 255, 0.1);
          color: var(--light-color);
          transition: background 0.3s;
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .form-input:focus {
          background: rgba(255, 255, 255, 0.2);
        }

        .input-icon {
          position: absolute;
          top: 50%;
          left: 12px;
          transform: translateY(-50%);
          font-size: 18px;
          color: var(--gold-color);
        }

        .eye-icon {
          position: absolute;
          top: 50%;
          right: 12px;
          transform: translateY(-50%);
          font-size: 18px;
          color: var(--gold-color);
          cursor: pointer;
          user-select: none;
        }

        .eye-icon:focus {
          outline: 2px solid var(--gold-color);
          outline-offset: 2px;
          border-radius: 4px;
        }

        .login-button {
          background-color: var(--gold-color);
          border: none;
          padding: 12px 0;
          border-radius: 10px;
          font-weight: 700;
          font-size: 16px;
          color: #000;
          cursor: pointer;
          transition: background-color 0.3s ease;
          user-select: none;
        }

        .login-button:hover:enabled {
          background-color: #e6c200;
        }

        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 3px solid rgba(0, 0, 0, 0.1);
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .login-card {
            flex-direction: column;
            height: auto;
          }
          .login-image-section {
            display: none; /* Esto ocultará la sección de la imagen en pantallas pequeñas */
          }
          .login-form-section {
            width: 100%;
            padding: 30px 20px; /* Ajustamos el padding para móviles */
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Login;

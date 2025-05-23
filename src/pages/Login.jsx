import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Form, Button, Alert } from "react-bootstrap";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const styles = {
  background: {
    backgroundColor: "rgba(10, 10, 10, 0.99)",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    zIndex: -1,
  },
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Montserrat', sans-serif",
  },
  box: {
    background: "rgba(20, 20, 20, 0.7)",
    padding: "0",
    borderRadius: "8px",
    color: "#FFFFFF",
    width: "90%",
    maxWidth: "700px",
    display: "flex",
    overflow: "hidden",
    boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(8px)",
  },
  leftImageSection: {
    width: "50%",
    backgroundImage: "url(../imagenes/fondo-log2.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
  },
  formSection: {
    width: "50%",
    padding: "30px 25px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  inputIconWrapper: {
    position: "absolute",
    left: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "0.9rem",
    color: "#FFD700",
  },
  input: {
    paddingLeft: "35px",
    border: "1px solid rgba(255, 215, 0, 0.5)",
    color: "#FFFFFF",
    fontWeight: 400,
    borderRadius: "5px",
    background: "rgba(0, 0, 0, 0.3)",
    fontSize: "0.9rem",
    height: "45px",
    marginBottom: "15px",
    transition: "all 0.3s ease",
  },
  button: {
    backgroundColor: "rgba(255, 215, 0, 0.9)",
    color: "#000000",
    fontWeight: 600,
    border: "none",
    padding: "10px",
    fontSize: "0.95rem",
    borderRadius: "5px",
    transition: "all 0.3s ease",
    marginTop: "10px",
    height: "45px",
    width: "100%",
    letterSpacing: "0.8px",
  },
  eyeIcon: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: "0.9rem",
    color: "#FFD700",
  },
  logo: {
    width: "80px",
    height: "auto",
    marginBottom: "20px",
    filter: "drop-shadow(0 0 4px rgba(255, 215, 0, 0.4))",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 600,
    marginBottom: "20px",
    color: "#FFD700",
    textAlign: "center",
    letterSpacing: "0.8px",
  },
  alert: {
    width: "100%",
    marginBottom: "15px",
    fontWeight: 500,
    fontSize: "0.85rem",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    padding: "8px 12px",
    color: "#FFFFFF",
    borderRadius: "4px",
  },
};

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const [correo, setEmail] = useState("");
  const [clave, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
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

    // Validación de campos vacíos
    if (!correo || !clave) {
      setMessage("Por favor, completa todos los campos.");
      setMessageType("error");
      return;
    }

    // Validación de formato de correo electrónico
    if (!validateEmail(correo)) {
      setMessage("Por favor, ingresa un correo electrónico válido.");
      setMessageType("error");
      return;
    }

    // Validación de longitud de la contraseña
    if (clave.length < 6) {
      setMessage("La contraseña debe tener al menos 6 caracteres.");
      setMessageType("error");
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

      // Mostrar mensaje de bienvenida
      setMessage("¡Bienvenido al sistema!");
      setMessageType("success");

      // Redirigir después de un breve retraso
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      setMessage("Credenciales incorrectas");
      setMessageType("error");
    }
  };

  // Función para validar el formato del correo electrónico
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  return (
    <>
      <div style={styles.background}></div>
      <div style={styles.container}>
        <div style={styles.box}>
          <div style={styles.leftImageSection}></div>
          <div style={styles.formSection}>
            <img
              src="../imagenes/img-toro.png"
              alt="Logo"
              style={styles.logo}
            />
            <h2 style={styles.title}>INICIAR SESIÓN</h2>

            {showAlert && (
              <Alert
                variant={messageType === "error" ? "danger" : "success"}
                style={{
                  ...styles.alert,
                  backgroundColor: messageType === "error" 
                    ? "rgba(217, 83, 79, 0.9)" 
                    : "rgba(92, 184, 92, 0.9)"
                }}
              >
                {message}
              </Alert>
            )}

            <Form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <Form.Group style={{ position: "relative", marginBottom: "15px" }}>
                <div style={styles.inputIconWrapper}>
                  <FaEnvelope />
                </div>
                <Form.Control
                  type="email"
                  placeholder="Correo electrónico"
                  value={correo}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  className="custom-placeholder"
                />
              </Form.Group>

              <Form.Group style={{ position: "relative", marginBottom: "20px" }}>
                <div style={styles.inputIconWrapper}>
                  <FaLock />
                </div>
                <div
                  style={styles.eyeIcon}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </div>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={clave}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  className="custom-placeholder"
                />
              </Form.Group>

              <Button type="submit" className="login-button" style={styles.button}>
                INGRESAR
              </Button>
            </Form>
          </div>
        </div>
      </div>

      <style>
        {`
          .custom-placeholder::placeholder {
            color: rgba(255, 255, 255, 0.6) !important;
            font-size: 0.85rem;
          }

          .login-button:hover {
            background-color: #FFFFFF !important;
            color: #000000 !important;
            transform: translateY(-1px);
          }

          body {
            font-family: 'Montserrat', sans-serif;
          }
        `}
      </style>
    </>
  );
};

export default Login;
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Form, Button, Alert } from "react-bootstrap";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

// Estilos en un solo lugar
const styles = {
  background: {
    backgroundImage: "url(../imagenes/fondo.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
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
  },
  box: {
    background: "rgba(0, 0, 0, 0.6)", // Semitransparente
    padding: "0",
    borderRadius: "20px",
    color: "#FFD700",
    width: "100%",
    maxWidth: "800px",
    display: "flex",
    overflow: "hidden",
    boxShadow: "0 0 30px rgba(255, 215, 0, 0.3)",
    border: "2px solid #FFD700",
  },
  leftImageSection: {
    width: "50%",
    backgroundImage: "url(../imagenes/fondo-log2.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  formSection: {
    width: "50%",
    padding: "50px 30px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    color: "#FFD700",
  },
  icon: {
    fontSize: "1.2rem",
    color: "#FFD700",
    marginRight: "10px",
  },
  title: {
    fontSize: "1.8rem", // Tamaño de la fuente más pequeño
    fontWeight: "bold",
    letterSpacing: "2px",
    marginBottom: "25px",
    color: "#FFF", // Cambié el color del título a blanco
  },
  inputIconWrapper: {
    position: "absolute",
    left: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "1.2rem",
    color: "#FFD700",
  },
  input: {
    paddingLeft: "35px",
    paddingRight: "35px",
    border: "2px solid #FFD700",
    color: "#FFF", // Texto de entrada en blanco
    fontWeight: "bold",
    borderRadius: "8px",
    background: "rgba(26, 25, 25, 0)", // Transparente claro
  },
  button: {
    backgroundColor: "#FFD700",
    color: "#000",
    fontWeight: "bold",
    border: "2px solid #FFD700",
    padding: "12px 20px",
    fontSize: "1rem",
    borderRadius: "8px",
    transition: "0.3s",
    marginTop: "10px",
  },
  eyeIcon: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: "1.2rem",
    color: "#FFD700",
  },
  logo: {
    width: "100px",
    height: "auto",
    objectFit: "cover",
    marginBottom: "20px",
  },
};

// Estilo para cambiar el color del placeholder
const placeholderStyle = {
  color: "#FFF", // Blanco para el texto del placeholder
};

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const [correo, setEmail] = useState("");
  const [clave, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3001/api/v1/login", {
        correo,
        clave,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      setUser(decoded);
      setMessage("¡Bienvenido al sistema!");
      setMessageType("success");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setMessage("Credenciales incorrectas");
      setMessageType("error");
    }
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
              alt="Logo del gimnasio"
              style={styles.logo}
            />
            <h2 style={styles.title}>INICIAR SESIÓN</h2> {/* Título ahora más pequeño */}

            {message && (
              <Alert
                variant={messageType === "error" ? "danger" : "success"}
                style={{ fontWeight: "bold" }}
              >
                {message}
              </Alert>
            )}

            <Form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <Form.Group className="mb-3" style={{ position: "relative" }}>
                <div style={styles.inputIconWrapper}>
                  <FaEnvelope style={styles.icon} />
                </div>
                <Form.Control
                  type="email"
                  placeholder="Correo electrónico"
                  value={correo}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={styles.input}
                  // Establecer color blanco al placeholder
                  className="custom-placeholder"
                />
              </Form.Group>

              <Form.Group className="mb-4" style={{ position: "relative" }}>
                <div style={styles.inputIconWrapper}>
                  <FaLock style={styles.icon} />
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
                  required
                  style={styles.input}
                  // Establecer color blanco al placeholder
                  className="custom-placeholder"
                />
              </Form.Group>

              <Button
                type="submit"
                className="w-100"
                style={styles.button}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#e6c200")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#FFD700")
                }
              >
                Ingresar
              </Button>
            </Form>
          </div>
        </div>
      </div>

      {/* Agregar estilo global para los placeholders */}
      <style>
        {`
          .custom-placeholder::placeholder {
            color: #FFF !important;
          }
        `}
      </style>
    </>
  );
};

export default Login;
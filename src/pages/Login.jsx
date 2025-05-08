import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Form, Button, Alert } from "react-bootstrap";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"; // Importar los iconos de ojo y ojo tachado

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
    background: "rgba(0, 0, 0, 0.7)",
    padding: "50px 30px",
    borderRadius: "20px",
    color: "#FFD700",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
    boxShadow: "0 0 30px rgba(255, 215, 0, 0.3)",
    backdropFilter: "blur(6px)",
    border: "2px solid #FFD700", // Añadir borde amarillo
  },
  icon: {
    fontSize: "1.2rem", // Ajuste el tamaño de los íconos
    color: "#FFD700",
    marginRight: "10px", // Espacio entre el ícono y el campo
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    letterSpacing: "2px",
    marginBottom: "25px",
    color: "#FFD700",
  },
  inputIconWrapper: {
    position: "absolute",
    left: "10px", // Mover íconos a la izquierda
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "1.2rem",
    color: "#FFD700",
  },
  input: {
    paddingLeft: "35px", // Añadir espacio para los íconos a la izquierda
    paddingRight: "35px",
    border: "2px solid #FFD700", // Borde amarillo para los campos de entrada
    color: "#FFF", // Texto blanco en los campos de entrada
    fontWeight: "bold",
    borderRadius: "8px",
    background: "rgba(0, 0, 0, 0.07)", // Fondo oscuro ligeramente transparente
  },
  button: {
    backgroundColor: "#FFD700",
    color: "#FFF", // Texto blanco en el botón
    fontWeight: "bold",
    border: "2px solid #FFD700", // Borde amarillo en el botón
    padding: "12px 20px",
    fontSize: "1rem",
    borderRadius: "8px",
    transition: "0.3s",
    marginTop: "10px",
  },
  eyeIcon: {
    position: "absolute",
    right: "10px", // Ajustado para que esté justo al lado del ícono de candado
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
    marginBottom: "20px", // Espacio entre el logo y el título
  }
};

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const [correo, setEmail] = useState("");
  const [clave, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden"; // Desactiva scroll
    return () => {
      document.body.style.overflow = "auto"; // Lo vuelve a activar al salir
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
      setMessageType("success"); // Definir el tipo de mensaje como éxito
  
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setMessage("Credenciales incorrectas");
      setMessageType("error"); // Definir el tipo de mensaje como error
    }
  };
  
  
  return (
    <>
      <div style={styles.background}></div>
      <div style={styles.container}>
        <div style={styles.box}>
          <img
            src="../imagenes/img-toro.png"
            alt="Logo del gimnasio"
            style={styles.logo} // Usando el estilo para el logo
          />
          <h2 style={styles.title}>LOGIN</h2>

          {message && (
            <Alert
              variant={messageType === "error" ? "danger" : "success"} // Establece el tipo de variante según el tipo de mensaje
              style={{
                fontWeight: "bold",
              }}
            >
              {message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
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
                type={showPassword ? "text" : "password"} // Cambiar el tipo según el estado
                placeholder="Contraseña"
                value={clave}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </Form.Group>
            <Button
              type="submit"
              className="w-100"
              style={styles.button}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#e6c200"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#FFD700"}
            >
              Ingresar
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
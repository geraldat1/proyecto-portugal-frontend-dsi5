import React, { useState, useContext } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Form, Button, Alert } from "react-bootstrap";
import { FaEnvelope, FaLock } from "react-icons/fa";

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
  },
  icon: {
    fontSize: "5rem",
    color: "#FFD700",
    marginBottom: "15px",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    letterSpacing: "2px",
    marginBottom: "25px",
    color: "#FFD700",
  },
  inputIcon: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "1.2rem",
    color: "#FFD700",
  },
  input: {
    paddingRight: "35px",
    border: "2px solid #FFD700",
    color: "#000",
    fontWeight: "bold",
    borderRadius: "8px",
  },
  button: {
    backgroundColor: "#FFD700",
    color: "#000",
    fontWeight: "bold",
    border: "none",
    padding: "12px 20px",
    fontSize: "1rem",
    borderRadius: "8px",
    transition: "0.3s",
    marginTop: "10px",
  },
};

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const [correo, setEmail] = useState("");
  const [clave, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' o 'error'
  const navigate = useNavigate();

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
          <h2 style={styles.title}>LOGIN</h2>
          <img
          src="../imagenes/img-toro.png"
          alt="Logo del gimnasio"
          style={{
            width: "100px",
            height: "auto",
            objectFit: "cover",
            marginBottom: "40px",
          }}
        />
          {message && (
            <Alert
              style={{ color: messageType === "error" ? "red" : "green", fontWeight: "bold" }}
              variant="light"
            >
              {message}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" style={{ position: "relative" }}>
              <FaEnvelope style={styles.inputIcon} />
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
              <FaLock style={styles.inputIcon} />
              <Form.Control
                type="password"
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

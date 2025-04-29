import React, { useState, useContext } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Form, Button, Alert, Card } from "react-bootstrap";

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const [correo, setEmail] = useState("");
  const [clave, setPassword] = useState("");
  const [message, setMessage] = useState("");
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

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setMessage("Credenciales incorrectas");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
      <Card style={{ width: "25rem" }}>
        <Card.Body>
          <Card.Title className="mb-4">Iniciar Sesión</Card.Title>
          {message && <Alert variant="info">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Correo:</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu email"
                value={correo}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingresa tu contraseña"
                value={clave}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Ingresar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;

import React from "react";
import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="text-dark py-3" style={{ background: "transparent" }}>
      <Container className="text-center">
        <small>
          &copy; {new Date().getFullYear()} Mi App - Todos los derechos reservados | Desarrollado por Alumnos DSI 5 - TEC
        </small>
      </Container>
    </footer>
  );
};

export default Footer;

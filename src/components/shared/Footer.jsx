import React from "react";
import { Container } from "react-bootstrap";
import "../shared/css/Footer.css"; // Asegúrate de que esta ruta sea correcta

const Footer = () => {
  return (
    <footer>
      <Container className="text-center">
        <small>&copy; {new Date().getFullYear()} App ToretoGym</small>
      </Container>
    </footer>
  );
};

export default Footer;

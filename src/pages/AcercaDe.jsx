import React from "react";
import { Carousel } from "react-bootstrap";

const AcercaDe = () => {
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Acerca de mis alumnos</h2>
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/imagenes/dsi5pucallpa.jpg"
            alt="Pucallpa"
            style={{ height: "400px", objectFit: "cover" }}
          />
          <Carousel.Caption>
            <div style={captionStyle}>
              <h3>Desarrollo de Sistemas de Información</h3>
              <p>Alumnos del 5to Periodo de Pucallpa</p>
            </div>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/imagenes/dsi5aguaytia.jpg"
            alt="Aguaytia"
            style={{ height: "400px", objectFit: "cover" }}
          />
          <Carousel.Caption>
            <div style={captionStyle}>
              <h3>Desarrollo de Sistemas de Información</h3>
              <p>Alumnos del 5to Periodo de Aguaytia</p>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

const captionStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.6)", // Fondo negro con transparencia
  padding: "10px 20px",
  borderRadius: "10px",
  display: "inline-block",
};

export default AcercaDe;

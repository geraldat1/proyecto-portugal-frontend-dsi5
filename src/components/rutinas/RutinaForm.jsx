import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2"; // opcional para mostrar errores visualmente

const RutinaForm = ({ show, handleClose, agregar, actualizar, rutinaSeleccionada }) => {

const [dia, setDia] = useState("");
const [descripcion, setDescripcion] = useState("");
const [id_user, setIdUser] = useState("");
const [estado, setEstado] = useState("");

const [errores, setErrores] = useState({});

  useEffect(() => {
    if (rutinaSeleccionada) {
      setDia(rutinaSeleccionada.dia);  
      setDescripcion(rutinaSeleccionada.descripcion);
      setIdUser(rutinaSeleccionada.id_user);
      setEstado(rutinaSeleccionada.estado);
    
    } else {
      setDia("");
      setDescripcion("");
      setIdUser("");
      setEstado("");

    }
    setErrores({});
  }, [rutinaSeleccionada]);

//   validacion de campos
const validar = () => {
    const nuevosErrores = {};
  
    const diasValidos = ["lunes", "martes", "miércoles", "miercoles", "jueves", "viernes", "sábado", "sabado", "domingo"];
  
    if (!dia.trim()) {
      nuevosErrores.dia = "El día es obligatorio";
    } else if (!diasValidos.includes(dia.toLowerCase())) {
      nuevosErrores.dia = "El día debe ser válido (ej: Lunes, Martes, etc.)";
    }
  
    if (!descripcion.trim()) {
      nuevosErrores.descripcion = "La descripción es obligatoria";
    }
  
    if (!id_user && id_user !== 0) {
      nuevosErrores.id_user = "El ID del usuario es obligatorio";
    } else if (isNaN(id_user)) {
      nuevosErrores.id_user = "El ID del usuario debe ser un número";
    }
  
    if (!String(estado).trim()) {
      nuevosErrores.estado = "El estado es obligatorio";
    }
    
  
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };
  
// termina la validacion

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (!validar()) {
      // Opcional: mostrar alerta si hay errores
      Swal.fire("Campos inválidos", "Por favor revisa los datos ingresados", "error");
      return;
    }

    const nuevaRutina= { dia, descripcion, id_user: parseInt(id_user), estado: parseInt(estado) };

    if (rutinaSeleccionada) {
      actualizar(rutinaSeleccionada.id, nuevaRutina);
    } else {
      agregar(nuevaRutina);
    }

    setDia("");
    setDescripcion("");
    setIdUser("");
    setEstado("");
    setErrores({});
    handleClose(); // cerrar modal luego de enviar
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{rutinaSeleccionada ? "Editar Rutina" : "Agregar Rutina"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={manejarEnvio}>

        <Form.Group className="mb-3">
            <Form.Label>Dia</Form.Label>
            <Form.Control
              type="text"
              value={dia}
              onChange={(e) => setDia(e.target.value)}
              isInvalid={!!errores.dia}
            />
            <Form.Control.Feedback type="invalid">{errores.dia}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripcion</Form.Label>
            <Form.Control
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              isInvalid={!!errores.descripcion}
            />
            <Form.Control.Feedback type="invalid">{errores.descripcion}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Id del Usuario</Form.Label>
            <Form.Control
              type="number"
              value={id_user}
              onChange={(e) => setIdUser(e.target.value)}
              isInvalid={!!errores.id_user}
            />
            <Form.Control.Feedback type="invalid">{errores.id_user}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Control
              type="number"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              isInvalid={!!errores.estado}
            />
            <Form.Control.Feedback type="invalid">{errores.estado}</Form.Control.Feedback>
          </Form.Group>


          <Button variant="primary" type="submit">
            {rutinaSeleccionada ? "Actualizar" : "Agregar"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RutinaForm;

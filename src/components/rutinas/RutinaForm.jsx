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

  const diaRegex = /^DIA\s(0[1-9]|[12][0-9]|30)$/; // DIA 01 hasta DIA 30

  if (!dia.trim()) {
    nuevosErrores.dia = "El día es obligatorio";
  } else if (!diaRegex.test(dia.trim().toUpperCase())) {
    nuevosErrores.dia = "El día debe estar en formato 'DIA 01' hasta 'DIA 30'";
  }

  if (!descripcion.trim()) {
    nuevosErrores.descripcion = "La descripción es obligatoria";
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

    const nuevaRutina= { dia, descripcion};

    if (rutinaSeleccionada) {
      actualizar(rutinaSeleccionada.id, {
        ...nuevaRutina,
        estado: parseInt(estado),
        id_user: parseInt(id_user)
      });
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
          <Form.Label>Día</Form.Label>
          <Form.Select
            value={dia}
            onChange={(e) => setDia(e.target.value)}
            isInvalid={!!errores.dia}
          >
            <option value="">Seleccione un día</option>
            {[...Array(30)].map((_, i) => {
              const diaTexto = `DIA ${String(i + 1).padStart(2, '0')}`;
              return (
                <option key={diaTexto} value={diaTexto}>
                  {diaTexto}
                </option>
              );
            })}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errores.dia}</Form.Control.Feedback>
        </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripcion</Form.Label>
            <Form.Control
              type="text"
              value={descripcion}
              onChange={(e) => {
                const valor = e.target.value;
                if (/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]*$/.test(valor)) {
                  setDescripcion(valor);
                }
              }}
              isInvalid={!!errores.descripcion}
              placeholder="Solo letras y espacios"
            />
            <Form.Control.Feedback type="invalid">
              {errores.descripcion}
            </Form.Control.Feedback>
          </Form.Group>

          {rutinaSeleccionada &&(
            <>
              <Form.Group className="mb-3">
                <Form.Label>ID User</Form.Label>
                <Form.Control type="text" value={id_user} disabled />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Control type="text" value={estado} disabled />
              </Form.Group>
            </>
          )}

          <Button variant="primary" type="submit">
            {rutinaSeleccionada ? "Actualizar" : "Agregar"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RutinaForm;

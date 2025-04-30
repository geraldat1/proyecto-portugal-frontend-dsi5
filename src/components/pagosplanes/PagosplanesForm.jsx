import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2"; // opcional para mostrar errores visualmente

const PagosplanesForm = ({ show, handleClose, agregar, actualizar, pagosplanSeleccionada }) => {
  const [id_detalle, setIdDetalle] = useState("");
  const [id_cliente, setCliente] = useState("");
  const [id_plan, setIdPlan] = useState("");
  const [precio, setPrecio] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [id_user, setIdUser] = useState("");
  const [estado, setEstado] = useState("");

  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (pagosplanSeleccionada) {
      setIdDetalle(pagosplanSeleccionada.id_detalle);
      setCliente(pagosplanSeleccionada.id_cliente);
      setIdPlan(pagosplanSeleccionada.id_plan);
      setPrecio(pagosplanSeleccionada.precio);
      setFecha(pagosplanSeleccionada.fecha);
      setHora(pagosplanSeleccionada.hora);
      setIdUser(pagosplanSeleccionada.id_user);
      setEstado(pagosplanSeleccionada.estado);
    } else {
      setIdDetalle("");
      setCliente("");
      setIdPlan("");
      setPrecio("");
      setFecha("");
      setHora("");
      setIdUser("");
      setEstado("");
    }
    setErrores({});
  }, [pagosplanSeleccionada]);

  const validar = () => {
    const nuevosErrores = {};
    if (!nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    if (!edad || isNaN(edad) || edad <= 0) nuevosErrores.edad = "La edad debe ser un número válido";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (!validar()) {
      // Opcional: mostrar alerta si hay errores
      Swal.fire("Campos inválidos", "Por favor revisa los datos ingresados", "error");
      return;
    }

    const nuevaPagosplan = { nombre, edad: Number(edad) };

    if (pagosplanSeleccionada) {
      actualizar(pagosplanSeleccionada.id, nuevaPagosplan);
    } else {
      agregar(nuevaPagosplan);
    }

    setNombre("");
    setEdad("");
    setErrores({});
    handleClose(); // cerrar modal luego de enviar
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{personaSeleccionada ? "Editar Persona" : "Agregar Persona"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={manejarEnvio}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              isInvalid={!!errores.nombre}
            />
            <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Edad</Form.Label>
            <Form.Control
              type="number"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
              isInvalid={!!errores.edad}
            />
            <Form.Control.Feedback type="invalid">{errores.edad}</Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit">
            {personaSeleccionada ? "Actualizar" : "Agregar"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PersonaForm;

import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2"; // opcional para mostrar errores visualmente

const EntrenadorForm = ({ show, handleClose, agregar, actualizar, entrenadorSeleccionado }) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [estado, setEstado] = useState("");

  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (entrenadorSeleccionado) {
      setNombre(entrenadorSeleccionado.nombre);
      setApellido(entrenadorSeleccionado.apellido);
      setTelefono(entrenadorSeleccionado.telefono);
      setCorreo(entrenadorSeleccionado.correo);
      setDireccion(entrenadorSeleccionado.direccion);
      setEstado(entrenadorSeleccionado.estado);
    } else {
      setNombre("");
      setApellido("");
      setTelefono("");
      setCorreo("");
      setDireccion("");
      setEstado("");
    }
    setErrores({});
  }, [entrenadorSeleccionado]);

  const validar = () => {
    const nuevosErrores = {};

    // Validación de nombre
    if (!nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    
    // Validación de apellido
    if (!apellido.trim()) nuevosErrores.apellido = "El apellido es obligatorio";
    
    // Validación de teléfono
    const telefonoRegex = /^[0-9]{9}$/;  // Se asume que el teléfono tiene 9 dígitos
    if (!telefono.trim()) {
      nuevosErrores.telefono = "El teléfono es obligatorio";
    } else if (!telefonoRegex.test(telefono)) {
      nuevosErrores.telefono = "El teléfono debe ser un número de 9 dígitos";
    }

    // Validación de correo
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correo.trim()) {
      nuevosErrores.correo = "El correo es obligatorio";
    } else if (!correoRegex.test(correo)) {
      nuevosErrores.correo = "El correo no tiene un formato válido";
    }

    // Validación de dirección
    if (!direccion.trim()) nuevosErrores.direccion = "La dirección es obligatoria";
    
    // Validación de estado
    if (!estado.toString().trim()) {
      nuevosErrores.estado = "El estado es obligatorio";
    } else if (isNaN(estado) || (estado !== "0" && estado !== "1" && estado !== 0 && estado !== 1)) {
      nuevosErrores.estado = "El estado debe ser 0 (inactivo) o 1 (activo)";
    }

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

    const nuevoEntrenador = { nombre, apellido, telefono, correo, direccion, estado: parseInt(estado) };

    if (entrenadorSeleccionado) {
      actualizar(entrenadorSeleccionado.id, nuevoEntrenador);
    } else {
      agregar(nuevoEntrenador);
    }

    setNombre("");
    setApellido("");
    setTelefono("");
    setCorreo("");
    setDireccion("");
    setEstado("");

    setErrores({});
    handleClose(); // cerrar modal luego de enviar
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{entrenadorSeleccionado ? "Editar Entrenador" : "Agregar Entrenador"}</Modal.Title>
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
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              isInvalid={!!errores.apellido}
            />
            <Form.Control.Feedback type="invalid">{errores.apellido}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Telefono</Form.Label>
            <Form.Control
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              isInvalid={!!errores.telefono}
            />
            <Form.Control.Feedback type="invalid">{errores.telefono}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Correo</Form.Label>
            <Form.Control
              type="text"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              isInvalid={!!errores.correo}
            />
            <Form.Control.Feedback type="invalid">{errores.correo}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Direccion</Form.Label>
            <Form.Control
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              isInvalid={!!errores.direccion}
            />
            <Form.Control.Feedback type="invalid">{errores.direccion}</Form.Control.Feedback>
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
            {entrenadorSeleccionado ? "Actualizar" : "Agregar"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EntrenadorForm;

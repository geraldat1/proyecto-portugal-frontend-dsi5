import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";

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

    if (!nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    } else if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre)) {
      nuevosErrores.nombre = "El nombre solo debe contener letras y espacios";
    }

    if (!apellido.trim()) {
      nuevosErrores.apellido = "El apellido es obligatorio";
    } else if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/.test(apellido)) {
      nuevosErrores.apellido = "El apellido solo debe contener letras y espacios";
    }

    if (!telefono.trim()) {
      nuevosErrores.telefono = "El teléfono es obligatorio";
    } else if (!/^\d{9}$/.test(telefono)) {
      nuevosErrores.telefono = "El teléfono debe tener exactamente 9 dígitos numéricos";
    }

    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correo.trim()) {
      nuevosErrores.correo = "El correo es obligatorio";
    } else if (!correoRegex.test(correo)) {
      nuevosErrores.correo = "El correo no tiene un formato válido";
    }

    if (!direccion.trim()) nuevosErrores.direccion = "La dirección es obligatoria";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (!validar()) {
      Swal.fire("Campos inválidos", "Por favor revisa los datos ingresados", "error");
      return;
    }

    const nuevoEntrenador = { nombre, apellido, telefono, correo, direccion};

    if (entrenadorSeleccionado) {
      actualizar(entrenadorSeleccionado.id,{
        ...nuevoEntrenador,
        estado: parseInt(estado) 
      });
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
    handleClose();
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
              onChange={(e) => setNombre(e.target.value.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñ\s]/g, ""))}
              isInvalid={!!errores.nombre}
            />
            <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñ\s]/g, ""))}
              isInvalid={!!errores.apellido}
            />
            <Form.Control.Feedback type="invalid">{errores.apellido}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value.replace(/\D/g, "").slice(0, 9))}
              isInvalid={!!errores.telefono}
            />
            <Form.Control.Feedback type="invalid">{errores.telefono}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Correo</Form.Label>
            <Form.Control
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              isInvalid={!!errores.correo}
            />
            <Form.Control.Feedback type="invalid">{errores.correo}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              isInvalid={!!errores.direccion}
            />
            <Form.Control.Feedback type="invalid">{errores.direccion}</Form.Control.Feedback>
          </Form.Group>

          {entrenadorSeleccionado && (
            <>
          <Form.Group className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Control type="text" value={estado} disabled />
          </Form.Group>
          </>
            )}

          <Button variant="primary" type="submit">
            {entrenadorSeleccionado ? "Actualizar" : "Agregar"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EntrenadorForm;

import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2"; // opcional para mostrar errores visualmente

const ClienteForm = ({ show, handleClose, agregar, actualizar, clienteSeleccionado }) => {
  const [dni, setDni] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [fecha, setFecha] = useState("");
  const [estado, setEstado] = useState("");
  const [id_user, setIdUser] = useState("");
  
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (clienteSeleccionado) {
      setDni(clienteSeleccionado.dni);
      setNombre(clienteSeleccionado.nombre);
      setTelefono(clienteSeleccionado.telefono);
      setDireccion(clienteSeleccionado.direccion);
      setFecha(clienteSeleccionado.fecha);
      setEstado(clienteSeleccionado.estado);
      setIdUser(clienteSeleccionado.id_user);
    } else {
      setDni("");
      setNombre("");
      setTelefono("");
      setDireccion("");
      setFecha("");
      setEstado("");
      setIdUser("");
    }
    setErrores({});
  }, [clienteSeleccionado]);

  const validar = () => {
    const nuevosErrores = {};

    if (!dni.trim()) {
      nuevosErrores.dni = "El DNI es obligatorio";
    } else if (!/^\d{8}$/.test(dni)) {
      nuevosErrores.dni = "El DNI debe tener 8 dígitos";
    }

    if (!nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    }

    if (!telefono.trim()) {
      nuevosErrores.telefono = "El teléfono es obligatorio";
    } else if (!/^\d{9}$/.test(telefono)) {
      nuevosErrores.telefono = "El teléfono debe tener 9 dígitos";
    }

    if (!direccion.trim()) {
      nuevosErrores.direccion = "La dirección es obligatoria";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (!validar()) {
      Swal.fire("Campos inválidos", "Por favor revisa los datos ingresados", "error");
      return;
    }

    const nuevoCliente = { dni, nombre, telefono, direccion };

  if (clienteSeleccionado) {
    actualizar(clienteSeleccionado.id, {
      ...nuevoCliente,
      fecha,
      estado: parseInt(estado),
      id_user: parseInt(id_user),
    });

    Swal.fire({
      icon: "info",
      title: "Registro actualizado",
      text: "El cliente fue actualizado correctamente.",
      timer: 2000,
      showConfirmButton: false,
    });
  } else {
    agregar({
      ...nuevoCliente,
      fecha,
      estado: parseInt(estado),
      id_user: parseInt(id_user),
    });

    Swal.fire({
      icon: "success",
      title: "Cliente agregado",
      text: "El cliente fue registrado exitosamente.",
      timer: 2000,
      showConfirmButton: false,
    });
  }

    setDni("");
    setNombre("");
    setTelefono("");
    setDireccion("");
    setFecha("");
    setEstado("");
    setIdUser("");

    setErrores({});
    handleClose(); // cerrar modal luego de enviar
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{clienteSeleccionado ? "Editar Cliente" : "Agregar Cliente"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={manejarEnvio}>
          <Form.Group className="mb-3">
            <Form.Label>Dni</Form.Label>
            <Form.Control
              type="text"
              value={dni}
              onChange={(e) => {
                const valor = e.target.value;
                if (/^\d{0,8}$/.test(valor)) setDni(valor);
              }}
              isInvalid={!!errores.dni}
            />
            <Form.Control.Feedback type="invalid">{errores.dni}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={nombre}
              onChange={(e) => {
                const valor = e.target.value;
                if (/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/.test(valor)) setNombre(valor);
              }}
              isInvalid={!!errores.nombre}
            />
            <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Telefono</Form.Label>
            <Form.Control
              type="text"
              value={telefono}
              onChange={(e) => {
                const valor = e.target.value;
                if (/^\d{0,9}$/.test(valor)) setTelefono(valor);
              }}
              isInvalid={!!errores.telefono}
            />
            <Form.Control.Feedback type="invalid">{errores.telefono}</Form.Control.Feedback>
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

          <Button variant="primary" type="submit">
            {clienteSeleccionado ? "Actualizar" : "Agregar"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ClienteForm;

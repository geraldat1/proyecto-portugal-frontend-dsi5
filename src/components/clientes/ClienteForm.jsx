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

//   validacion de campos
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
  
    if (!fecha.trim()) {
      nuevosErrores.fecha = "La fecha es obligatoria";
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      nuevosErrores.fecha = "La fecha debe tener el formato AAAA-MM-DD";
    }
  
    if (!estado.trim()) {
      nuevosErrores.estado = "El estado es obligatorio";
    }

    if (!id_user.trim()) {
      nuevosErrores.estado = "El id del user es obligatorio";
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

    const nuevoCliente= { dni, nombre, telefono, direccion, fecha, estado };

    if (clienteSeleccionado) {
      actualizar(clienteSeleccionado.id, nuevoCliente);
    } else {
      agregar(nuevoCliente);
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
              onChange={(e) => setDni(e.target.value)}
              isInvalid={!!errores.dni}
            />
            <Form.Control.Feedback type="invalid">{errores.dni}</Form.Control.Feedback>
          </Form.Group>

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
            <Form.Label>Telefono</Form.Label>
            <Form.Control
              type="number"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              isInvalid={!!errores.telefono}
            />
            <Form.Control.Feedback type="invalid">{errores.telefono}</Form.Control.Feedback>
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
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="text"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              isInvalid={!!errores.fecha}
            />
            <Form.Control.Feedback type="invalid">{errores.fecha}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Control
              type="text"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              isInvalid={!!errores.estado}
            />
            <Form.Control.Feedback type="invalid">{errores.estado}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Id del Usuario</Form.Label>
            <Form.Control
              type="text"
              value={id_user}
              onChange={(e) => setIdUser(e.target.value)}
              isInvalid={!!errores.id_user}
            />
            <Form.Control.Feedback type="invalid">{errores.id_user}</Form.Control.Feedback>
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

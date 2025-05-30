import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2"; // opcional para mostrar errores visualmente

const ClienteForm = ({ show, handleClose, agregar, actualizar, clienteSeleccionado, clientes }) => {
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

  // Validación de duplicado
  const dniDuplicado = clientes.some(
    (c) => c.dni === dni && (!clienteSeleccionado || c.id !== clienteSeleccionado.id)
  );

  if (dniDuplicado) {
    Swal.fire("DNI duplicado", "Ya existe un cliente con este DNI", "warning");
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

  // Limpiar
  setDni("");
  setNombre("");
  setTelefono("");
  setDireccion("");
  setFecha("");
  setEstado("");
  setIdUser("");
  setErrores({});
  handleClose();
};


  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size="lg"
      centered
    >
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="fw-bold">
          {clienteSeleccionado ? (
            <><i className="bi bi-pencil-square me-2"></i>Editar Cliente</>
          ) : (
            <><i className="bi bi-person-plus me-2"></i>Agregar Nuevo Cliente</>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={manejarEnvio}>
          <div className="row">
            {/* DNI */}
            <Form.Group className="mb-3 col-md-6">
              <Form.Label className="fw-bold">DNI <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese DNI (8 dígitos)"
                value={dni}
                onChange={(e) => {
                  const valor = e.target.value;
                  if (/^\d{0,8}$/.test(valor)) setDni(valor);
                }}
                isInvalid={!!errores.dni}
                maxLength={8}
              />
              <Form.Text className="text-muted">Solo números, sin puntos ni guiones</Form.Text>
              <Form.Control.Feedback type="invalid">
                {errores.dni}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Teléfono */}
            <Form.Group className="mb-3 col-md-6">
              <Form.Label className="fw-bold">Teléfono <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese teléfono"
                value={telefono}
                onChange={(e) => {
                  const valor = e.target.value;
                  if (/^\d{0,9}$/.test(valor)) setTelefono(valor);
                }}
                isInvalid={!!errores.telefono}
                maxLength={9}
              />
              <Form.Text className="text-muted">Ejemplo: 987654321</Form.Text>
              <Form.Control.Feedback type="invalid">
                {errores.telefono}
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          {/* Nombre */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Nombre Completo <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese nombre completo"
              value={nombre}
              onChange={(e) => {
                const valor = e.target.value;
                if (/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/.test(valor)) setNombre(valor);
              }}
              isInvalid={!!errores.nombre}
            />
            <Form.Text className="text-muted">Solo letras y espacios</Form.Text>
            <Form.Control.Feedback type="invalid">
              {errores.nombre}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Dirección */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">Dirección</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese dirección completa"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              isInvalid={!!errores.direccion}
            />
            <Form.Control.Feedback type="invalid">
              {errores.direccion}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-end gap-3 mt-4">
            <Button 
              variant="outline-secondary" 
              onClick={handleClose}
              className="px-4"
            >
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              className="px-4 fw-bold"
            >
              {clienteSeleccionado ? (
                <><i className="bi bi-check-circle me-2"></i>Guardar Cambios</>
              ) : (
                <><i className="bi bi-save me-2"></i>Registrar Cliente</>
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ClienteForm;

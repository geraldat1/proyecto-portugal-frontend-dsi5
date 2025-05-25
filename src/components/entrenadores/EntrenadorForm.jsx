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
      {entrenadorSeleccionado ? (
        <><i className="bi bi-pencil-square me-2"></i>Editar Entrenador</>
      ) : (
        <><i className="bi bi-person-plus me-2"></i>Agregar Nuevo Entrenador</>
      )}
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form onSubmit={manejarEnvio}>
      <div className="row">
        {/* Nombre */}
        <Form.Group className="mb-3 col-md-6">
          <Form.Label className="fw-bold">Nombre <span className="text-danger">*</span></Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese nombre(s)"
            value={nombre}
            onChange={(e) => setNombre(e.target.value.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñ\s]/g, ""))}
            isInvalid={!!errores.nombre}
          />
          <Form.Text className="text-muted">Solo letras y espacios</Form.Text>
          <Form.Control.Feedback type="invalid">
            {errores.nombre}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Apellido */}
        <Form.Group className="mb-3 col-md-6">
          <Form.Label className="fw-bold">Apellido <span className="text-danger">*</span></Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese apellido(s)"
            value={apellido}
            onChange={(e) => setApellido(e.target.value.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñ\s]/g, ""))}
            isInvalid={!!errores.apellido}
          />
          <Form.Text className="text-muted">Solo letras y espacios</Form.Text>
          <Form.Control.Feedback type="invalid">
            {errores.apellido}
          </Form.Control.Feedback>
        </Form.Group>
      </div>

      <div className="row">
        {/* Teléfono */}
        <Form.Group className="mb-3 col-md-6">
          <Form.Label className="fw-bold">Teléfono <span className="text-danger">*</span></Form.Label>
          <Form.Control
            type="text"
            placeholder="Ejemplo: 987654321"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value.replace(/\D/g, "").slice(0, 9))}
            isInvalid={!!errores.telefono}
            maxLength={9}
          />
          <Form.Text className="text-muted">9 dígitos, solo números</Form.Text>
          <Form.Control.Feedback type="invalid">
            {errores.telefono}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Correo */}
        <Form.Group className="mb-3 col-md-6">
          <Form.Label className="fw-bold">Correo Electrónico</Form.Label>
          <Form.Control
            type="email"
            placeholder="ejemplo@dominio.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            isInvalid={!!errores.correo}
          />
          <Form.Control.Feedback type="invalid">
            {errores.correo}
          </Form.Control.Feedback>
        </Form.Group>
      </div>

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

      {/* Estado (solo para edición) */}
      {entrenadorSeleccionado && (
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Estado</Form.Label>
          <Form.Control 
            type="text" 
            value={estado === 1 ? "Activo" : "Inactivo"} 
            disabled 
            className={estado === 1 ? "text-success fw-bold" : "text-secondary fw-bold"}
          />
        </Form.Group>
      )}

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
          {entrenadorSeleccionado ? (
            <><i className="bi bi-check-circle me-2"></i>Guardar Cambios</>
          ) : (
            <><i className="bi bi-save me-2"></i>Registrar Entrenador</>
          )}
        </Button>
      </div>
    </Form>
  </Modal.Body>
</Modal>
  );
};

export default EntrenadorForm;

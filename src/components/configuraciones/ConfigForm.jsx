import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";

const ConfigForm = ({ show, handleClose, agregar, actualizar, configuracionSeleccionada }) => {
  const [formData, setFormData] = useState({
    ruc: "",
    nombre: "",
    correo: "",
    telefono: "",
    direccion: "",
    mensaje: "",
    logo: "",
    limite: ""
  });

  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (configuracionSeleccionada) {
      setFormData({
        ruc: configuracionSeleccionada.ruc || "",
        nombre: configuracionSeleccionada.nombre || "",
        correo: configuracionSeleccionada.correo || "",
        telefono: configuracionSeleccionada.telefono || "",
        direccion: configuracionSeleccionada.direccion || "",
        mensaje: configuracionSeleccionada.mensaje || "",
        logo: configuracionSeleccionada.logo || "",
        limite: configuracionSeleccionada.limite ? String(configuracionSeleccionada.limite) : ""
      });
    } else {
      setFormData({
        ruc: "",
        nombre: "",
        correo: "",
        telefono: "",
        direccion: "",
        mensaje: "",
        logo: "",
        limite: ""
      });
    }
    setErrores({});
  }, [configuracionSeleccionada]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validar = () => {
    const nuevosErrores = {};

    // Validación de RUC
    if (!formData.ruc.trim()) {
      nuevosErrores.ruc = "El RUC es obligatorio";
    } else if (!/^\d{11}$/.test(formData.ruc)) {
      nuevosErrores.ruc = "El RUC debe tener 11 dígitos numéricos";
    }

    // Validación de Nombre
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    }

    // Validación de Correo
    if (!formData.correo.trim()) {
      nuevosErrores.correo = "El correo es obligatorio";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.correo)) {
      nuevosErrores.correo = "Formato de correo inválido";
    }

    // Validación de Teléfono
    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = "El teléfono es obligatorio";
    } else if (!/^\d{9}$/.test(formData.telefono)) {
      nuevosErrores.telefono = "El teléfono debe tener 9 dígitos";
    }

    // Validación de Dirección
    if (!formData.direccion.trim()) {
      nuevosErrores.direccion = "La dirección es obligatoria";
    }

    // Validación de Mensaje
    if (!formData.mensaje.trim()) {
      nuevosErrores.mensaje = "El mensaje es obligatorio";
    }

    // Validación de Logo
    if (!formData.logo.trim()) {
      nuevosErrores.logo = "El logo es obligatorio";
    } else if (!/^(https?:\/\/.+\.(jpg|jpeg|png|gif|svg)|[\w,\s-]+\.(jpg|jpeg|png|gif|svg))$/i.test(formData.logo)) {
      nuevosErrores.logo = "Debe ser una URL o archivo válido de imagen (.jpg, .png, .gif...)";
    }

    // Validación de Límite
    if (!formData.limite.trim()) {
      nuevosErrores.limite = "El límite es obligatorio";
    } else if (isNaN(Number(formData.limite)) || Number(formData.limite) <= 0) {
      nuevosErrores.limite = "El límite debe ser un número mayor a 0";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (!validar()) {
      Swal.fire({
        icon: "error",
        title: "Campos inválidos",
        text: "Por favor revisa los datos ingresados",
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    const nuevaConfiguracion = {
      ...formData,
      limite: Number(formData.limite)
    };

    if (configuracionSeleccionada) {
      actualizar(configuracionSeleccionada.id, nuevaConfiguracion);
      Swal.fire({
        icon: "info",
        title: "Configuración actualizada",
        text: "Los datos de configuración fueron actualizados correctamente.",
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      agregar(nuevaConfiguracion);
      Swal.fire({
        icon: "success",
        title: "Configuración guardada",
        text: "Los datos de configuración fueron registrados exitosamente.",
        timer: 2000,
        showConfirmButton: false
      });
    }

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
          {configuracionSeleccionada ? (
            <><i className="bi bi-gear me-2"></i>Editar Configuración</>
          ) : (
            <><i className="bi bi-gear-wide-connected me-2"></i>Configuración del Sistema</>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={manejarEnvio}>
          <div className="row">
            {/* RUC */}
            <Form.Group className="mb-3 col-md-6">
              <Form.Label className="fw-bold">RUC <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="ruc"
                placeholder="Ingrese RUC (11 dígitos)"
                value={formData.ruc}
                onChange={handleChange}
                isInvalid={!!errores.ruc}
                maxLength={11}
              />
              <Form.Text className="text-muted">Solo números, sin puntos ni guiones</Form.Text>
              <Form.Control.Feedback type="invalid">
                {errores.ruc}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Teléfono */}
            <Form.Group className="mb-3 col-md-6">
              <Form.Label className="fw-bold">Teléfono <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="telefono"
                placeholder="Ingrese teléfono (9 dígitos)"
                value={formData.telefono}
                onChange={handleChange}
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
            <Form.Label className="fw-bold">Nombre <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              placeholder="Ingrese nombre de la empresa"
              value={formData.nombre}
              onChange={handleChange}
              isInvalid={!!errores.nombre}
            />
            <Form.Control.Feedback type="invalid">
              {errores.nombre}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Correo */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Correo Electrónico <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="email"
              name="correo"
              placeholder="Ingrese correo electrónico"
              value={formData.correo}
              onChange={handleChange}
              isInvalid={!!errores.correo}
            />
            <Form.Text className="text-muted">Ejemplo: contacto@empresa.com</Form.Text>
            <Form.Control.Feedback type="invalid">
              {errores.correo}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Dirección */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Dirección <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              name="direccion"
              placeholder="Ingrese dirección completa"
              value={formData.direccion}
              onChange={handleChange}
              isInvalid={!!errores.direccion}
            />
            <Form.Control.Feedback type="invalid">
              {errores.direccion}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Mensaje */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Mensaje <span className="text-danger">*</span></Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="mensaje"
              placeholder="Ingrese mensaje para los documentos"
              value={formData.mensaje}
              onChange={handleChange}
              isInvalid={!!errores.mensaje}
            />
            <Form.Control.Feedback type="invalid">
              {errores.mensaje}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="row">
            {/* Logo */}
            <Form.Group className="mb-3 col-md-8">
              <Form.Label className="fw-bold">Logo <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="logo"
                placeholder="URL o nombre del archivo de logo"
                value={formData.logo}
                onChange={handleChange}
                isInvalid={!!errores.logo}
              />
              <Form.Text className="text-muted">
                Puede ser una URL (https://...) o el nombre de un archivo de imagen (logo.png)
              </Form.Text>
              <Form.Control.Feedback type="invalid">
                {errores.logo}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Límite */}
            <Form.Group className="mb-3 col-md-4">
              <Form.Label className="fw-bold">Límite <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="number"
                name="limite"
                placeholder="Ingrese límite"
                value={formData.limite}
                onChange={handleChange}
                isInvalid={!!errores.limite}
                min="1"
              />
              <Form.Text className="text-muted">Número mayor a 0</Form.Text>
              <Form.Control.Feedback type="invalid">
                {errores.limite}
              </Form.Control.Feedback>
            </Form.Group>
          </div>

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
              {configuracionSeleccionada ? (
                <><i className="bi bi-check-circle me-2"></i>Guardar Cambios</>
              ) : (
                <><i className="bi bi-save me-2"></i>Guardar Configuración</>
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ConfigForm;
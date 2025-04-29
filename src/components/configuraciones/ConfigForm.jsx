import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2"; // opcional para mostrar errores visualmente

const ConfigForm = ({ show, handleClose, agregar, actualizar, configuracionSeleccionada }) => {
  const [ruc, setRuc] = useState("");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [logo, setLogo] = useState("");
  const [limite, setLimite] = useState("");


  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (configuracionSeleccionada) {
      setRuc(configuracionSeleccionada.ruc);
      setNombre(configuracionSeleccionada.nombre);
      setCorreo(configuracionSeleccionada.correo);
      setTelefono(configuracionSeleccionada.telefono);
      setDireccion(configuracionSeleccionada.direccion);
      setMensaje(configuracionSeleccionada.mensaje);
      setLogo(configuracionSeleccionada.logo);
      setLimite(configuracionSeleccionada.limite);

    } else {
      setRuc("");
      setNombre("");
      setCorreo("");
      setTelefono("");
      setDireccion("");
      setMensaje("");
      setLogo("");
      setLimite("");
    }
    setErrores({});
  }, [configuracionSeleccionada]);

  const validar = () => {
    const nuevosErrores = {};
  
    if (!ruc.trim()) nuevosErrores.ruc = "El RUC es obligatorio";
    else if (!/^\d{11}$/.test(ruc)) nuevosErrores.ruc = "El RUC debe tener 11 dígitos numéricos";
  
    if (!nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
  
    if (!correo.trim()) nuevosErrores.correo = "El correo es obligatorio";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(correo)) {
      nuevosErrores.correo = "Formato de correo inválido";
    }
  
    if (!telefono.trim()) nuevosErrores.telefono = "El teléfono es obligatorio";
    else if (!/^\d{9}$/.test(telefono)) nuevosErrores.telefono = "El teléfono debe tener 9 dígitos";
  
    if (!direccion.trim()) nuevosErrores.direccion = "La dirección es obligatoria";
  
    if (!mensaje.trim()) nuevosErrores.mensaje = "El mensaje es obligatorio";
  
    if (!logo.trim()) {
      nuevosErrores.logo = "El logo es obligatorio";
    } else if (!/^(https?:\/\/.+\.(jpg|jpeg|png|gif|svg)|[\w,\s-]+\.(jpg|jpeg|png|gif|svg))$/i.test(logo)) {
      nuevosErrores.logo = "Debe ser una URL o archivo válido de imagen (.jpg, .png, .gif...)";
    }
    
  
    if (!limite.trim()) nuevosErrores.limite = "El límite es obligatorio";
    else if (isNaN(limite) || parseInt(limite) <= 0) {
      nuevosErrores.limite = "El límite debe ser un número mayor a 0";
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

    const nuevaConfiguracion = { ruc, nombre, correo, telefono, direccion, mensaje, logo, limite };

    if (configuracionSeleccionada) {
      actualizar(configuracionSeleccionada.id, nuevaConfiguracion);
    } else {
      agregar(nuevaConfiguracion);
    }

    setRuc("");
    setNombre("");
    setCorreo("");
    setTelefono("");
    setDireccion("");
    setMensaje("");
    setLogo("");
    setLimite("");

    setErrores({});
    handleClose(); // cerrar modal luego de enviar
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{configuracionSeleccionada ? "Editar Configuracion" : "Agregar Configuracion"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={manejarEnvio}>

          <Form.Group className="mb-3">
            <Form.Label>Ruc</Form.Label>
            <Form.Control
              type="text"
              value={ruc}
              onChange={(e) => setRuc(e.target.value)}
              isInvalid={!!errores.ruc}
            />
            <Form.Control.Feedback type="invalid">{errores.ruc}</Form.Control.Feedback>
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
            <Form.Label>Mensaje</Form.Label>
            <Form.Control
              type="text"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              isInvalid={!!errores.mensaje}
            />
            <Form.Control.Feedback type="invalid">{errores.mensaje}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Logo</Form.Label>
            <Form.Control
              type="text"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              isInvalid={!!errores.logo}
            />
            <Form.Control.Feedback type="invalid">{errores.logo}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Limite</Form.Label>
            <Form.Control
              type="text"
              value={limite}
              onChange={(e) => setLimite(e.target.value)}
              isInvalid={!!errores.limite}
            />
            <Form.Control.Feedback type="invalid">{errores.limite}</Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit">
            {configuracionSeleccionada ? "Actualizar" : "Agregar"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ConfigForm;

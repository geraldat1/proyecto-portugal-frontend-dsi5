import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2"; // opcional para mostrar errores visualmente

const UsuarioForm = ({ show, handleClose, agregar, actualizar, usuarioSeleccionado }) => {
  const [usuario, setUsuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [telefono, setTelefono] = useState("");
  const [foto, setFoto] = useState("");
  const [rol, setRol] = useState("");
  const [fecha, setFecha] = useState("");
  const [estado, setEstado] = useState("");

  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (usuarioSeleccionado) {
      setUsuario(usuarioSeleccionado.usuario);  
      setNombre(usuarioSeleccionado.nombre);
      setCorreo(usuarioSeleccionado.correo);
      setClave(usuarioSeleccionado.clave);
      setTelefono(usuarioSeleccionado.telefono);
      setFoto(usuarioSeleccionado.foto);
      setRol(usuarioSeleccionado.rol);
      setFecha(usuarioSeleccionado.fecha);
      setEstado(usuarioSeleccionado.estado);
    } else {
      setUsuario("");
      setNombre("");
      setCorreo("");
      setClave("");
      setTelefono("");
      setFoto("");
      setRol("");
      setFecha("");
      setEstado("");
    }
    setErrores({});
  }, [usuarioSeleccionado]);

  const validar = () => {
    const nuevosErrores = {};
  
    if (!usuario.trim()) nuevosErrores.usuario = "El usuario es obligatorio";
    if (!nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    if (!correo.trim()) {
      nuevosErrores.correo = "El correo es obligatorio";
    } else if (!/^\S+@\S+\.\S+$/.test(correo)) {
      nuevosErrores.correo = "El correo no es válido";
    }
    if (!clave.trim()) nuevosErrores.clave = "La clave es obligatoria";
    if (!telefono.trim()) {
      nuevosErrores.telefono = "El teléfono es obligatorio";
    } else if (!/^\d{7,15}$/.test(telefono)) {
      nuevosErrores.telefono = "El teléfono debe contener entre 7 y 15 dígitos";
    }
    if (!foto.trim()) nuevosErrores.foto = "La foto es obligatoria";
    if (!rol.trim()) nuevosErrores.rol = "El rol es obligatorio";
    if (!fecha.trim()) {
      nuevosErrores.fecha = "La fecha es obligatoria";
    } else if (isNaN(Date.parse(fecha))) {
      nuevosErrores.fecha = "La fecha no es válida";
    }
    if (estado === "") {
      nuevosErrores.estado = "El estado es obligatorio";
    } else if (isNaN(estado)) {
      nuevosErrores.estado = "El estado debe ser un número";
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

    const nuevoUsuario = { usuario, nombre, correo, clave, telefono, foto, rol, fecha, estado};

    if (usuarioSeleccionado) {
      actualizar(usuarioSeleccionado.id, nuevoUsuario);
    } else {
      agregar(nuevoUsuario);
    }

    setUsuario("");
    setNombre("");
    setCorreo("");
    setClave("");
    setTelefono("");
    setFoto("");
    setRol("");
    setFecha("");
    setEstado("");

    setErrores({});
    handleClose(); // cerrar modal luego de enviar
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{usuarioSeleccionado ? "Editar Usuario" : "Agregar Usuario"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={manejarEnvio}>

        <Form.Group className="mb-3">
            <Form.Label>Usuario</Form.Label>
            <Form.Control
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              isInvalid={!!errores.usuario}
            />
            <Form.Control.Feedback type="invalid">{errores.usuario}</Form.Control.Feedback>
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
            <Form.Label>Clave</Form.Label>
            <Form.Control
              type="password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              isInvalid={!!errores.clave}
            />
            <Form.Control.Feedback type="invalid">{errores.clave}</Form.Control.Feedback>
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
            <Form.Label>Foto</Form.Label>
            <Form.Control
              type="text"
              value={foto}
              onChange={(e) => setFoto(e.target.value)}
              isInvalid={!!errores.foto}
            />
            <Form.Control.Feedback type="invalid">{errores.foto}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Rol</Form.Label>
            <Form.Control
              type="text"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              isInvalid={!!errores.rol}
            />
            <Form.Control.Feedback type="invalid">{errores.rol}</Form.Control.Feedback>
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
              type="number"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              isInvalid={!!errores.estado}
            />
            <Form.Control.Feedback type="invalid">{errores.estado}</Form.Control.Feedback>
          </Form.Group>
          
          <Button variant="primary" type="submit">
            {usuarioSeleccionado ? "Actualizar" : "Agregar"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UsuarioForm;

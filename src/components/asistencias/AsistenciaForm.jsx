import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2"; // opcional para mostrar errores visualmente

const AsistenciaForm = ({ show, handleClose, agregar, actualizar, asistenciaSeleccionada }) => {
  const [fecha, setFecha] = useState("");
  const [hora_entrada, setHoraEnt] = useState("");
  const [hora_salida, setHoraSal] = useState("");
  const [id_cliente, setIdCliente] = useState("");
  const [id_entrenador, setIdEntrenador] = useState("");
  const [id_usuario, setIdUsuario] = useState("");
  const [id_rutina, setIdRutina] = useState("");
  const [estado, setEstado] = useState("");

  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (asistenciaSeleccionada) {
      setFecha(asistenciaSeleccionada.fecha);
      setHoraEnt(asistenciaSeleccionada.hora_entrada);
      setHoraSal(asistenciaSeleccionada.hora_salida);
      setIdCliente(asistenciaSeleccionada.id_cliente);
      setIdEntrenador(asistenciaSeleccionada.id_entrenador);
      setIdUsuario(asistenciaSeleccionada.id_usuario);
      setIdRutina(asistenciaSeleccionada.id_rutina);
      setEstado(asistenciaSeleccionada.estado);
    } else {
      setFecha("");
      setHoraEnt("");
      setHoraSal("");
      setIdCliente("");
      setIdEntrenador("");
      setIdUsuario("");
      setIdRutina("");
      setEstado("");
    }
    setErrores({});
  }, [asistenciaSeleccionada]);

  const validar = () => {
    const nuevosErrores = {};
  
    if (!fecha.trim()) {
      nuevosErrores.fecha = "La fecha es obligatoria";
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      nuevosErrores.fecha = "La fecha debe estar en formato AAAA-MM-DD";
    }
  
    if (!hora_entrada.trim()) {
      nuevosErrores.hora_entrada = "La hora de entrada es obligatoria";
    }
  
    if (!hora_salida.trim()) {
      nuevosErrores.hora_salida = "La hora de salida es obligatoria";
    }
  
    if (!id_cliente.trim()) {
      nuevosErrores.id_cliente = "El ID del cliente es obligatorio";
    }
  
    if (!id_entrenador.trim()) {
      nuevosErrores.id_entrenador = "El ID del entrenador es obligatorio";
    }
  
    if (!id_usuario.toString().trim()) {
      nuevosErrores.id_usuario = "El ID del usuario es obligatorio";
    }
  
    if (!id_rutina.trim()) {
      nuevosErrores.id_rutina = "El ID de la rutina es obligatorio";
    }
  
    if (estado !== "0" && estado !== "1") {
      nuevosErrores.estado = "El estado debe ser 0 o 1";
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

    const nuevaAsistencia = { fecha, hora_entrada, hora_salida, id_cliente, id_entrenador, id_usuario, id_rutina, estado: parseInt(estado)};

    if (asistenciaSeleccionada) {
        actualizar(asistenciaSeleccionada.id_asistencia, nuevaAsistencia);
    } else {
        agregar(nuevaAsistencia);
    }
    

    setFecha("");
    setHoraEnt("");
    setHoraSal("");
    setIdCliente("");
    setIdEntrenador("");
    setIdUsuario("");
    setIdRutina("");
    setEstado("");

    setErrores({});
    handleClose(); // cerrar modal luego de enviar
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{asistenciaSeleccionada ? "Editar Asistencia" : "Agregar Asistencia"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={manejarEnvio}>
          <Form.Group className="mb-3">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              isInvalid={!!errores.fecha}
            />
            <Form.Control.Feedback type="invalid">{errores.fecha}</Form.Control.Feedback>
          </Form.Group>
  
          <Form.Group className="mb-3">
            <Form.Label>Hora de Entrada</Form.Label>
            <Form.Control
              type="time"
              value={hora_entrada}
              onChange={(e) => setHoraEnt(e.target.value)}
              isInvalid={!!errores.hora_entrada}
            />
            <Form.Control.Feedback type="invalid">{errores.hora_entrada}</Form.Control.Feedback>
          </Form.Group>
  
          <Form.Group className="mb-3">
            <Form.Label>Hora de Salida</Form.Label>
            <Form.Control
              type="time"
              value={hora_salida}
              onChange={(e) => setHoraSal(e.target.value)}
              isInvalid={!!errores.hora_salida}
            />
            <Form.Control.Feedback type="invalid">{errores.hora_salida}</Form.Control.Feedback>
          </Form.Group>
  
          <Form.Group className="mb-3">
            <Form.Label>ID Cliente</Form.Label>
            <Form.Control
              type="text"
              value={id_cliente}
              onChange={(e) => setIdCliente(e.target.value)}
              isInvalid={!!errores.id_cliente}
            />
            <Form.Control.Feedback type="invalid">{errores.id_cliente}</Form.Control.Feedback>
          </Form.Group>
  
          <Form.Group className="mb-3">
            <Form.Label>ID Entrenador</Form.Label>
            <Form.Control
              type="text"
              value={id_entrenador}
              onChange={(e) => setIdEntrenador(e.target.value)}
              isInvalid={!!errores.id_entrenador}
            />
            <Form.Control.Feedback type="invalid">{errores.id_entrenador}</Form.Control.Feedback>
          </Form.Group>
  
          <Form.Group className="mb-3">
            <Form.Label>ID Usuario</Form.Label>
            <Form.Control
              type="number"
              value={id_usuario}
              onChange={(e) => setIdUsuario(e.target.value)}
              isInvalid={!!errores.id_usuario}
            />
            <Form.Control.Feedback type="invalid">{errores.id_usuario}</Form.Control.Feedback>
          </Form.Group>
  
          <Form.Group className="mb-3">
            <Form.Label>ID Rutina</Form.Label>
            <Form.Control
              type="text"
              value={id_rutina}
              onChange={(e) => setIdRutina(e.target.value)}
              isInvalid={!!errores.id_rutina}
            />
            <Form.Control.Feedback type="invalid">{errores.id_rutina}</Form.Control.Feedback>
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
            {asistenciaSeleccionada ? "Actualizar" : "Agregar"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );  
};

export default AsistenciaForm;

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

    if (!id_cliente || String(id_cliente).trim() === "") {
      nuevosErrores.id_cliente = "El ID del cliente es obligatorio";
    }

    if (!id_entrenador || String(id_entrenador).trim() === "") {
      nuevosErrores.id_entrenador = "El ID del entrenador es obligatorio";
    }

    if (!id_rutina || String(id_rutina).trim() === "") {
      nuevosErrores.id_rutina = "El ID de la rutina es obligatorio";
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
  
    const nuevaAsistencia = { id_cliente, id_entrenador, id_rutina };
  
    if (asistenciaSeleccionada) {
      actualizar(asistenciaSeleccionada.id_asistencia, {
        ...nuevaAsistencia,
        fecha,
        hora_entrada,
        hora_salida: hora_salida && hora_salida.trim() === "" ? null : hora_salida, // Evitar trim() en null
        id_usuario: parseInt(id_usuario),
        estado: parseInt(estado),
      });
    } else {
      agregar(nuevaAsistencia);
    }
  
    // Limpiar formulario después de enviar
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
            <Form.Label>ID Rutina</Form.Label>
            <Form.Control
              type="text"
              value={id_rutina}
              onChange={(e) => setIdRutina(e.target.value)}
              isInvalid={!!errores.id_rutina}
            />
            <Form.Control.Feedback type="invalid">{errores.id_rutina}</Form.Control.Feedback>
          </Form.Group>

          {asistenciaSeleccionada && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Fecha</Form.Label>
                <Form.Control type="text" value={fecha|| ""} disabled />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Hora de Entrada</Form.Label>
                <Form.Control type="text" value={hora_entrada|| ""} disabled />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Hora de Salida</Form.Label>
                <Form.Control type="text" value={hora_salida|| ""} disabled />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>ID Usuario</Form.Label>
                <Form.Control type="text" value={id_usuario|| ""} disabled />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Control type="text" value={estado|| ""} disabled />
              </Form.Group>

            </>
          )}

          <Button variant="primary" type="submit">
            {asistenciaSeleccionada ? "Actualizar" : "Agregar"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AsistenciaForm;

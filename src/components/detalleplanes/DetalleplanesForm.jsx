import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2"; // opcional para mostrar errores visualmente

const DetalleplanesForm = ({ show, handleClose, agregar, actualizar, detalleplanSeleccionada }) => {
  const [id_cliente, setIdCliente] = useState("");
  const [id_plan, setIdPlan] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [fecha_venc, setFechaVenc] = useState("");
  const [fecha_limite, setFechaLimite] = useState("");
  const [id_user, setIdUser] = useState("");
  const [estado, setEstado] = useState("");
const[errores, setErrores] = useState({});


  useEffect(() => {
    if (detalleplanSeleccionada) {
      setIdCliente(detalleplanSeleccionada.id_cliente);
      setIdPlan(detalleplanSeleccionada.id_plan);
      setFecha(detalleplanSeleccionada.fecha);
      setHora(detalleplanSeleccionada.hora);
      setFechaVenc(detalleplanSeleccionada.fecha_venc);
      setFechaLimite(detalleplanSeleccionada.fecha_limite);
      setIdUser(detalleplanSeleccionada.id_user);
      setEstado(detalleplanSeleccionada.estado);
      
    } else {
      setIdCliente("");
      setIdPlan("");
      setFecha("");
      setHora("");
      setFechaVenc("");
      setFechaLimite("");
      setIdUser("");
      setEstado("");
    }
    setErrores({});
  }, [detalleplanSeleccionada]);

  const validar = () => {
    const nuevosErrores = {};
    if (!id_cliente.trim()) nuevosErrores.id_cliente = "El ID de cliente es obligatorio";
    if (!id_plan.trim()) nuevosErrores.id_plan = "El ID de plan es obligatorio";
    if (!fecha.trim() || isNaN(Date.parse(fecha))) nuevosErrores.fecha = "La fecha es obligatoria y debe ser válida";
    if (!hora.trim()) nuevosErrores.hora = "La hora es obligatoria";
    if (!fecha_venc.trim() || isNaN(Date.parse(fecha_venc))) nuevosErrores.fecha_venc = "Fecha de vencimiento inválida";
    if (!fecha_limite.trim() || isNaN(Date.parse(fecha_limite))) nuevosErrores.fecha_limite = "Fecha límite inválida";
    if (!id_user.trim()) nuevosErrores.id_user = "El ID de usuario es obligatorio";
    if (estado === "" || isNaN(estado)) nuevosErrores.estado = "El estado es obligatorio y debe ser numérico";

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

    const nuevaDetalleplan = { id_cliente, id_plan, fecha, hora, fecha_venc, fecha_limite, id_user, estado };

    if (detalleplanSeleccionada) {
      actualizar(detalleplanSeleccionada.id, nuevaDetalleplan);
    } else {
      agregar(nuevaDetalleplan);
    }

    setIdCliente("");
    setIdPlan("");
    setFecha("");
    setHora("");
    setFechaVenc("");
    setFechaLimite("");
    setIdUser("");
    setEstado("");

    setErrores({});
    handleClose(); // cerrar modal luego de enviar
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{detalleplanSeleccionada ? "Editar Detalle Plan" : "Agregar Detalle Plan"}</Modal.Title>
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
            <Form.Label>ID Plan</Form.Label>
            <Form.Control
              type="text"
              value={id_plan}
              onChange={(e) => setIdPlan(e.target.value)}
              isInvalid={!!errores.id_plan}
            />
            <Form.Control.Feedback type="invalid">{errores.id_plan}</Form.Control.Feedback>
          </Form.Group>

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
            <Form.Label>Hora</Form.Label>
            <Form.Control
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              isInvalid={!!errores.hora}
            />
            <Form.Control.Feedback type="invalid">{errores.hora}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fecha Vencimiento</Form.Label>
            <Form.Control
              type="date"
              value={fecha_venc}
              onChange={(e) => setFechaVenc(e.target.value)}
              isInvalid={!!errores.fecha_venc}
            />
            <Form.Control.Feedback type="invalid">{errores.fecha_venc}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fecha Límite</Form.Label>
            <Form.Control
              type="date"
              value={fecha_limite}
              onChange={(e) => setFechaLimite(e.target.value)}
              isInvalid={!!errores.fecha_limite}
            />
            <Form.Control.Feedback type="invalid">{errores.fecha_limite}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>ID Usuario</Form.Label>
            <Form.Control
              type="text"
              value={id_user}
              onChange={(e) => setIdUser(e.target.value)}
              isInvalid={!!errores.id_user}
            />
            <Form.Control.Feedback type="invalid">{errores.id_user}</Form.Control.Feedback>
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
            {detalleplanSeleccionada ? "Actualizar" : "Agregar"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default DetalleplanesForm;
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2"; // opcional para mostrar errores visualmente

const DetalleplanesForm = ({
  show,
  handleClose,
  agregar,
  actualizar,
  detalleplanSeleccionada,
  clientes,
  planes,
}) => {
  const [id_cliente, setIdCliente] = useState("");
  const [id_plan, setIdPlan] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [fecha_venc, setFechaVenc] = useState("");
  const [fecha_limite, setFechaLimite] = useState("");
  const [id_user, setIdUser] = useState("");
  const [estado, setEstado] = useState("");

  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (detalleplanSeleccionada) {
      setIdCliente(detalleplanSeleccionada.id_cliente);
      setIdPlan(detalleplanSeleccionada.id_plan);
      setFecha(detalleplanSeleccionada.fecha);
      setHora(detalleplanSeleccionada.hora);
      setFechaVenc(detalleplanSeleccionada.fecha_venc?.substring(0, 10));
      setFechaLimite(detalleplanSeleccionada.fecha_limite?.substring(0, 10));
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
    if (!id_cliente || String(id_cliente).trim() === "") nuevosErrores.id_cliente = "El ID de cliente es obligatorio";
    if (!id_plan || String(id_plan).trim() === "") nuevosErrores.id_plan = "El ID de plan es obligatorio";
    if (!fecha_venc.trim() || isNaN(Date.parse(fecha_venc))) nuevosErrores.fecha_venc = "Fecha de vencimiento inválida";
    if (!fecha_limite.trim() || isNaN(Date.parse(fecha_limite))) nuevosErrores.fecha_limite = "Fecha límite inválida";

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

    const nuevaDetalleplan = { id_cliente, id_plan, fecha_venc, fecha_limite };

    if (detalleplanSeleccionada) {
      actualizar(detalleplanSeleccionada.id, {
        ...nuevaDetalleplan,
        fecha,
        hora,
        id_user: parseInt(id_user),
        estado: parseInt(estado),
      });
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
          {/* Select Cliente */}
          <Form.Group className="mb-3">
            <Form.Label>Cliente</Form.Label>
            <Form.Control
              as="select"
              value={id_cliente}
              onChange={(e) => setIdCliente(e.target.value)}
              isInvalid={!!errores.id_cliente}
            >
              <option value="">Selecciona un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre} {/* Asumiendo que 'nombre' es el campo del cliente */}
                </option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">{errores.id_cliente}</Form.Control.Feedback>
          </Form.Group>

          {/* Select Plan */}
          <Form.Group className="mb-3">
            <Form.Label>Plan</Form.Label>
            <Form.Control
              as="select"
              value={id_plan}
              onChange={(e) => setIdPlan(e.target.value)}
              isInvalid={!!errores.id_plan}
            >
              <option value="">Selecciona un plan</option>
              {planes.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.plan} 
                </option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">{errores.id_plan}</Form.Control.Feedback>
          </Form.Group>

          {/* Fecha Vencimiento */}
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

          {/* Fecha Límite */}
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

          {/* Información de Detalleplan */}
          {detalleplanSeleccionada && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Fecha</Form.Label>
                <Form.Control type="text" value={fecha} disabled />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Hora</Form.Label>
                <Form.Control type="text" value={hora} disabled />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>ID User</Form.Label>
                <Form.Control type="text" value={id_user} disabled />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Control type="text" value={estado} disabled />
              </Form.Group>
            </>
          )}

          <Button variant="primary" type="submit">
            {detalleplanSeleccionada ? "Actualizar" : "Agregar"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default DetalleplanesForm;

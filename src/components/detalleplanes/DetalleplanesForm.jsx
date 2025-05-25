import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";

// Funciones auxiliares para manejo de fechas con zona horaria
const formatDateForInput = (date) => {
  if (!date) return '';
  
  // Si es string (viene del servidor), convertimos a Date
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  
  // Ajustamos la fecha según la zona horaria local
  const offset = d.getTimezoneOffset();
  d.setMinutes(d.getMinutes() - offset);
  
  return d.toISOString().split('T')[0];
};

const parseInputDate = (dateString) => {
  if (!dateString) return null;
  
  // Creamos la fecha en la zona horaria local
  const [year, month, day] = dateString.split('-');
  const localDate = new Date(year, month - 1, day);
  
  return localDate;
};

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
  const [fecha_venc, setFechaVenc] = useState(null);
  const [fecha_limite, setFechaLimite] = useState(null);
  const [id_user, setIdUser] = useState("");
  const [estado, setEstado] = useState("");

  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (detalleplanSeleccionada) {
      setIdCliente(detalleplanSeleccionada.id_cliente);
      setIdPlan(detalleplanSeleccionada.id_plan);
      setFecha(detalleplanSeleccionada.fecha);
      setHora(detalleplanSeleccionada.hora);
      
      // Usamos las funciones de formato para las fechas
      setFechaVenc(detalleplanSeleccionada.fecha_venc ? new Date(detalleplanSeleccionada.fecha_venc) : null);
      setFechaLimite(detalleplanSeleccionada.fecha_limite ? new Date(detalleplanSeleccionada.fecha_limite) : null);
      
      setIdUser(detalleplanSeleccionada.id_user);
      setEstado(detalleplanSeleccionada.estado);
    } else {
      setIdCliente("");
      setIdPlan("");
      setFecha("");
      setHora("");
      setFechaVenc(null);
      setFechaLimite(null);
      setIdUser("");
      setEstado("");
    }
    setErrores({});
  }, [detalleplanSeleccionada]);

  const validar = () => {
    const nuevosErrores = {};
    if (!id_cliente || String(id_cliente).trim() === "") nuevosErrores.id_cliente = "El ID de cliente es obligatorio";
    if (!id_plan || String(id_plan).trim() === "") nuevosErrores.id_plan = "El ID de plan es obligatorio";
    if (!fecha_venc || isNaN(fecha_venc.getTime())) nuevosErrores.fecha_venc = "Fecha de vencimiento inválida";
    if (!fecha_limite || isNaN(fecha_limite.getTime())) nuevosErrores.fecha_limite = "Fecha límite inválida";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (!validar()) {
      Swal.fire("Campos inválidos", "Por favor revisa los datos ingresados", "error");
      return;
    }

    const nuevaDetalleplan = { 
      id_cliente, 
      id_plan, 
      fecha_venc: fecha_venc.toISOString(), // Convertimos a ISO string
      fecha_limite: fecha_limite.toISOString() // Convertimos a ISO string
    };

    if (detalleplanSeleccionada) {
      actualizar(detalleplanSeleccionada.id, {
        ...nuevaDetalleplan,
        fecha,
        hora,
        id_user: parseInt(id_user),
        estado: parseInt(estado),
      });

      Swal.fire({
        icon: "info",
        title: "Registro actualizado",
        text: "El acuerdo fue actualizado correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      agregar({
        ...nuevaDetalleplan,
        fecha,
        hora,
        id_user: parseInt(id_user),
        estado: parseInt(estado),
      });

      Swal.fire({
        icon: "success",
        title: "Cliente agregado",
        text: "El acuerdo fue registrado exitosamente.",
        timer: 2000,
        showConfirmButton: false,
      });
    }

    // Resetear el formulario
    setIdCliente("");
    setIdPlan("");
    setFecha("");
    setHora("");
    setFechaVenc(null);
    setFechaLimite(null);
    setIdUser("");
    setEstado("");

    setErrores({});
    document.activeElement?.blur();
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size="lg">
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="fw-bold">
          {detalleplanSeleccionada ? (
            <><i className="bi bi-pencil-square me-2"></i>Editar Detalle Plan</>
          ) : (
            <><i className="bi bi-plus-circle me-2"></i>Agregar Detalle Plan</>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={manejarEnvio}>
          {/* Select Cliente */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Cliente <span className="text-danger">*</span></Form.Label>
            <Form.Select
              value={id_cliente}
              onChange={(e) => setIdCliente(e.target.value)}
              isInvalid={!!errores.id_cliente}
              className={id_cliente ? "" : "text-muted"}
            >
              <option value="" disabled>Selecciona un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errores.id_cliente}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Select Plan */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Plan <span className="text-danger">*</span></Form.Label>
            <Form.Select
              value={id_plan}
              onChange={(e) => setIdPlan(e.target.value)}
              isInvalid={!!errores.id_plan}
              className={id_plan ? "" : "text-muted"}
            >
              <option value="" disabled>Selecciona un plan</option>
              {planes.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.plan} - {plan.descripcion && `${plan.descripcion.substring(0, 30)}...`}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errores.id_plan}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="row">
            {/* Fecha Vencimiento */}
            <Form.Group className="mb-3 col-md-6">
              <Form.Label className="fw-bold">Fecha Vencimiento <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="date"
                value={formatDateForInput(fecha_venc)}
                onChange={(e) => setFechaVenc(parseInputDate(e.target.value))}
                isInvalid={!!errores.fecha_venc}
                min={formatDateForInput(new Date())}
              />
              <Form.Text className="text-muted">
                Fecha cuando expira el plan
              </Form.Text>
              <Form.Control.Feedback type="invalid">
                {errores.fecha_venc}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Fecha Límite */}
            <Form.Group className="mb-3 col-md-6">
              <Form.Label className="fw-bold">Fecha Límite <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="date"
                value={formatDateForInput(fecha_limite)}
                onChange={(e) => setFechaLimite(parseInputDate(e.target.value))}
                isInvalid={!!errores.fecha_limite}
                min={formatDateForInput(fecha_venc || new Date())}
              />
              <Form.Text className="text-muted">
                Fecha límite para renovación
              </Form.Text>
              <Form.Control.Feedback type="invalid">
                {errores.fecha_limite}
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="outline-secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" className="px-4">
              {detalleplanSeleccionada ? (
                <><i className="bi bi-check-circle me-2"></i>Actualizar</>
              ) : (
                <><i className="bi bi-save me-2"></i>Realizar Acuerdo</>
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default DetalleplanesForm;
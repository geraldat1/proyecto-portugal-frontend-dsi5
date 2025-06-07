import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Select from 'react-select';

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

const DetalleplanesForm = ({
  show,
  handleClose,
  agregar,
  actualizar,
  detalleplanSeleccionada,
  clientes,
  planes,
  detallePlanesExistentes = [], // nuevos registros existentes

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

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const addMonths = (date, months) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  };

  const addYears = (date, years) => {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
  };

  const calcularFechaVencimiento = (planId) => {
    const planSeleccionado = planes.find(plan => plan.id === planId);
    if (!planSeleccionado) return null;

    const hoy = new Date();
    
    switch(planSeleccionado.condicion) {
      case 1: // 1 día
        return addDays(hoy, 1);
      case 2: // 1 mes
        return addMonths(hoy, 1);
      case 3: // 3 meses
        return addMonths(hoy, 3);
      case 4: // 1 año
        return addYears(hoy, 1);
      case 5: // 1 mes
        return addMonths(hoy, 1);
      default:
        return null;
    }
  };

  const handlePlanChange = (selectedOption) => {
    const planId = selectedOption ? selectedOption.value : "";
    setIdPlan(planId);
    
    if (planId) {
      const nuevaFechaVenc = calcularFechaVencimiento(planId);
      setFechaVenc(nuevaFechaVenc);
      
      if (nuevaFechaVenc) {
        setFechaLimite(addDays(nuevaFechaVenc, 2));
      } else {
        setFechaLimite(null);
      }
    } else {
      setFechaVenc(null);
      setFechaLimite(null);
    }
  };

  const validarDuplicado = () => {
    // Buscamos si ya existe un registro activo o en proceso para el mismo cliente
    return detallePlanesExistentes.some((dp) => {
      if (detalleplanSeleccionada && dp.id === detalleplanSeleccionada.id) return false;
      return (
        dp.id_cliente === id_cliente &&
        (dp.estado === 1 || dp.estado === 2)
      );
    });
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (!validar()) {
      Swal.fire("Campos inválidos", "Por favor revisa los datos ingresados", "error");
      return;
    }

    if (validarDuplicado()) {
      Swal.fire("Registro duplicado", "Ya existe un registro activo o en proceso para este cliente y plan.", "warning");
      return;
    }

    const nuevaDetalleplan = { 
      id_cliente, 
      id_plan, 
      fecha_venc: fecha_venc.toISOString(),
      fecha_limite: fecha_limite.toISOString()
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

    // Resetear formulario y cerrar modal
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
            <><i className="bi bi-pencil-square me-2"></i>Editar Suscripción del Cliente</>
          ) : (
            <><i className="bi bi-plus-circle me-2"></i>Registrar Nueva Suscripción</>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={manejarEnvio}>

          {/* Select Cliente con búsqueda por nombre o DNI */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">
              Seleccionar Cliente  <span className="text-danger">*</span>
            </Form.Label>
            <Select
              options={clientes
                .filter((cliente) => cliente.estado !== 0)
                .map((cliente) => ({
                  value: cliente.id,
                  label: `${cliente.nombre} ${cliente.apellido || ''} • DNI: ${cliente.dni}`.trim(),
                }))
              }
              onChange={(selectedOption) => setIdCliente(selectedOption ? selectedOption.value : "")}
              value={clientes
                .filter((cliente) => cliente.estado !== 0)
                .map((cliente) => ({
                  value: cliente.id,
                  label: `${cliente.nombre} ${cliente.apellido || ''} • DNI: ${cliente.dni}`.trim(),
                }))
                .find(option => option.value === id_cliente) || null
              }
              placeholder="Selecciona un cliente"
              classNamePrefix={!!errores.id_cliente ? "is-invalid" : ""}
              isDisabled={!!detalleplanSeleccionada}  // <-- Aquí
            />
            {errores.id_cliente && (
              <div className="invalid-feedback d-block">{errores.id_cliente}</div>
            )}
          </Form.Group>

          {/* Select Plan con búsqueda por nombre, precio y condición */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">
              Seleccionar Plan <span className="text-danger">*</span>
            </Form.Label>
            <Select
              options={planes
                .filter((plan) => plan.estado !== 0)
                .map((plan) => ({
                  value: plan.id,
                  label: `${plan.plan} • S/ ${plan.precio_plan} • ${plan.condicion_nombre}`,
                }))
              }
              onChange={handlePlanChange}
              value={
                planes
                  .filter((plan) => plan.estado !== 0)
                  .map((plan) => ({
                    value: plan.id,
                    label: `${plan.plan} • S/ ${plan.precio_plan} • ${plan.condicion_nombre}`,
                  }))
                  .find((option) => option.value === id_plan) || null
              }
              placeholder="Buscar plan por nombre, precio o condición..."
              classNamePrefix={!!errores.id_plan ? "is-invalid" : ""}
            />
            {errores.id_plan && (
              <div className="invalid-feedback d-block">{errores.id_plan}</div>
            )}
          </Form.Group>

       <div className="row">
  {/* Fecha Vencimiento - Ahora no editable */}
  <Form.Group className="mb-3 col-md-6">
    <Form.Label className="fw-bold">Fecha de Fin del Plan<span className="text-danger">*</span></Form.Label>
    <Form.Control
      type="date"
      value={formatDateForInput(fecha_venc)}
      readOnly
      disabled
      isInvalid={!!errores.fecha_venc}
    />
    <Form.Text className="text-muted">
      Día en que termina la vigencia de la suscripción (calculado automáticamente)
    </Form.Text>
    <Form.Control.Feedback type="invalid">
      {errores.fecha_venc}
    </Form.Control.Feedback>
  </Form.Group>

            {/* Fecha Límite */}
            <Form.Group className="mb-3 col-md-6">
              <Form.Label className="fw-bold">Fecha Límite de Renovación<span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="date"
                value={formatDateForInput(fecha_limite)}
                readOnly
                disabled
                isInvalid={!!errores.fecha_limite}
              />

              <Form.Text className="text-muted">
                Fecha máxima para que el cliente renueve antes de suspensión
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
                <><i className="bi bi-check-circle me-2"></i>Actualizar Suscripción</>
              ) : (
                <><i className="bi bi-save me-2"></i>Guardar Suscripción</>
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default DetalleplanesForm;
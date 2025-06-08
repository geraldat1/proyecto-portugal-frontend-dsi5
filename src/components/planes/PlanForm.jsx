import React, { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import Swal from "sweetalert2";

const PlanForm = ({ show, handleClose, agregar, actualizar, planSeleccionado, planes = [] }) => {
  const [plan, setPlan] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio_plan, setPrecioPlan] = useState("");
  const [condicion, setCondicion] = useState("");
  const [imagen, setImagen] = useState("");
  const [estado, setEstado] = useState("");
  const [id_user, setIdUser] = useState("");
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (planSeleccionado) {
      setPlan(planSeleccionado.plan);
      setDescripcion(planSeleccionado.descripcion);
      setPrecioPlan(planSeleccionado.precio_plan);
      setCondicion(planSeleccionado.condicion);
      setImagen(planSeleccionado.imagen);
      setEstado(planSeleccionado.estado);
      setIdUser(planSeleccionado.id_user);
    } else {
      setPlan("");
      setDescripcion("");
      setPrecioPlan("");
      setCondicion("");
      setImagen("");
      setEstado("");
      setIdUser("");
    }
    setErrores({});
  }, [planSeleccionado]);

  const validar = () => {
    const nuevosErrores = {};
    
    if (!plan.trim()) nuevosErrores.plan = "El nombre del plan es obligatorio";
    if (!descripcion.trim()) nuevosErrores.descripcion = "La descripción es obligatoria";
    if (!precio_plan || isNaN(precio_plan) || parseFloat(precio_plan) <= 0) {
      nuevosErrores.precio_plan = "El precio debe ser un número válido y mayor a 0";
    }
    if (!String(condicion).trim()) {
      nuevosErrores.condicion = "La condición es obligatoria";
    }
    if (!imagen.trim()) nuevosErrores.imagen = "La URL de la imagen es obligatoria";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const validarNombreUnico = () => {
    if (!plan.trim()) return true;
    
    const nombreNormalizado = plan.trim().toLowerCase();
    
    if (planSeleccionado) {
      // Para edición: excluir el plan actual
      return !planes.some(p => 
        p.id !== planSeleccionado.id && 
        p.plan.toLowerCase() === nombreNormalizado
      );
    }
    
    // Para creación: verificar contra todos los planes
    return !planes.some(p => p.plan.toLowerCase() === nombreNormalizado);
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    
    if (!validar()) {
      Swal.fire("Campos inválidos", "Por favor revisa los datos ingresados", "error");
      return;
    }

    if (!validarNombreUnico()) {
      await Swal.fire({
        icon: 'error',
        title: 'Nombre duplicado',
        text: 'Ya existe un plan con este nombre. Por favor elige otro nombre.',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    try {
      const nuevoPlan = { plan, descripcion, precio_plan, condicion, imagen };

      if (planSeleccionado) {
        await actualizar(planSeleccionado.id, {
          ...nuevoPlan,
          estado: parseInt(estado),
          id_user: parseInt(id_user),
        });
        await mostrarExito("Plan actualizado");
      } else {
        await agregar(nuevoPlan);
        await mostrarExito("Plan registrado");
      }

      limpiarFormulario();
      handleClose();
    } catch (error) {
      console.error("Error al guardar el plan:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al guardar el plan. Por favor intente nuevamente.",
      });
    }
  };

  const mostrarExito = (titulo) => {
    return Swal.fire({
      icon: "success",
      title: titulo,
      text: `El plan fue ${titulo.toLowerCase()} correctamente.`,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const limpiarFormulario = () => {
    setPlan("");
    setDescripcion("");
    setPrecioPlan("");
    setCondicion("");
    setImagen("");
    setEstado("");
    setIdUser("");
    setErrores({});
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
          {planSeleccionado ? (
            <><i className="bi bi-pencil-square me-2"></i>Editar Plan</>
          ) : (
            <><i className="bi bi-plus-circle me-2"></i>Agregar Nuevo Plan</>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={manejarEnvio}>
          <div className="row">
            <Form.Group className="mb-3 col-md-6">
              <Form.Label className="fw-bold">Nombre del Plan <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Plan Básico"
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                isInvalid={!!errores.plan}
              />
              <Form.Control.Feedback type="invalid">
                {errores.plan}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3 col-md-6">
              <Form.Label className="fw-bold">Precio <span className="text-danger">*</span></Form.Label>
              <InputGroup>
                <InputGroup.Text>S/</InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="0.00"
                  inputMode="decimal"
                  pattern="^\d+(\.\d{0,2})?$"
                  value={precio_plan}
                  onChange={(e) => {
                    const valor = e.target.value;
                    if (/^\d*\.?\d{0,2}$/.test(valor) || valor === "") {
                      setPrecioPlan(valor);
                    }
                  }}
                  isInvalid={!!errores.precio_plan}
                />
              </InputGroup>
              <Form.Control.Feedback type="invalid">
                {errores.precio_plan}
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Descripción <span className="text-danger">*</span></Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Describe las características del plan"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              isInvalid={!!errores.descripcion}
            />
            <Form.Control.Feedback type="invalid">
              {errores.descripcion}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="row">
            <Form.Group className="mb-3 col-md-6">
              <Form.Label className="fw-bold">Periodicidad <span className="text-danger">*</span></Form.Label>
              <Form.Select
                value={condicion}
                onChange={(e) => setCondicion(e.target.value)}
                isInvalid={!!errores.condicion}
              >
                <option value="">Seleccione una opción</option>
                <option value="1">Diario</option>
                <option value="2">Mensual</option>
                <option value="3">Trimestral</option>
                <option value="4">Anual</option>
                <option value="5">Promoción</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errores.condicion}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3 col-md-6">
              <Form.Label className="fw-bold">Imagen del Plan</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const rutaArchivo = `/imagenes/plan/${file.name}`;
                    setImagen(rutaArchivo);
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      document.getElementById('vista-previa-plan').src = event.target.result;
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <div className="mt-2 text-center">
                <img
                  id="vista-previa-plan"
                  src={imagen || "/placeholder-plan.png"}
                  alt="Vista previa"
                  className="img-thumbnail"
                  style={{
                    maxWidth: '150px',
                    maxHeight: '100px',
                    objectFit: 'cover'
                  }}
                />
              </div>
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
              {planSeleccionado ? (
                <><i className="bi bi-check-circle me-2"></i>Guardar Cambios</>
              ) : (
                <><i className="bi bi-save me-2"></i>Registrar Plan</>
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PlanForm;
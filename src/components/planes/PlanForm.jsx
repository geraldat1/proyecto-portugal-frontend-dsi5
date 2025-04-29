import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2"; // opcional para mostrar errores visualmente

const PlanForm = ({ show, handleClose, agregar, actualizar, planSeleccionado }) => {
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
      setEstado(planSeleccionado.estado?.toString() || "");
      setIdUser(planSeleccionado.id_user?.toString() || "");

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
    if (!condicion.trim()) nuevosErrores.condicion = "La condición es obligatoria";
    if (!imagen.trim()) nuevosErrores.imagen = "La URL de la imagen es obligatoria";
    if (!String(estado).trim()) nuevosErrores.estado = "El estado es obligatorio";
    if (!id_user.trim()) nuevosErrores.id_user = "El ID del usuario es obligatorio";
  
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

    const nuevoPlan = { plan, descripcion, precio_plan, condicion, imagen, estado, id_user};

    if (planSeleccionado) {
      actualizar(planSeleccionado.id, nuevoPlan);
    } else {
      agregar(nuevoPlan);
    }

    setPlan("");
    setDescripcion("");
    setPrecioPlan("");
    setCondicion("");
    setImagen("");
    setEstado("");
    setIdUser("");

    setErrores({});
    handleClose(); // cerrar modal luego de enviar
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{planSeleccionado ? "Editar Plan" : "Agregar Plan"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={manejarEnvio}>

          <Form.Group className="mb-3">
            <Form.Label>Plan</Form.Label>
            <Form.Control
              type="text"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              isInvalid={!!errores.plan}
            />
            <Form.Control.Feedback type="invalid">{errores.plan}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripcion</Form.Label>
            <Form.Control
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              isInvalid={!!errores.descripcion}
            />
            <Form.Control.Feedback type="invalid">{errores.descripcion}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio del Plan</Form.Label>
            <Form.Control
              type="number"
              value={precio_plan}
              onChange={(e) => setPrecioPlan(e.target.value)}
              isInvalid={!!errores.precio_plan}
            />
            <Form.Control.Feedback type="invalid">{errores.precio_plan}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Condicion</Form.Label>
            <Form.Control
              type="text"
              value={condicion}
              onChange={(e) => setCondicion(e.target.value)}
              isInvalid={!!errores.condicion}
            />
            <Form.Control.Feedback type="invalid">{errores.condicion}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Imagen</Form.Label>
            <Form.Control
              type="text"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
              isInvalid={!!errores.imagen}
            />
            <Form.Control.Feedback type="invalid">{errores.imagen}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Control
              type="text"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              isInvalid={!!errores.estado}
            />
            <Form.Control.Feedback type="invalid">{errores.estado}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>ID User</Form.Label>
            <Form.Control
              type="text"
              value={id_user}
              onChange={(e) => setIdUser(e.target.value)}
              isInvalid={!!errores.id_user}
            />
            <Form.Control.Feedback type="invalid">{errores.id_user}</Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit">
            {planSeleccionado ? "Actualizar" : "Agregar"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PlanForm;

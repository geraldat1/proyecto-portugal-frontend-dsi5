import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";

const PagosplanesForm = ({ show, handleClose, agregar, actualizar, pagosplanSeleccionada }) => {
  const [id_detalle, setIdDetalle] = useState("");
  const [id_cliente, setIdCliente] = useState("");
  const [id_plan, setIdPlan] = useState("");
  const [precio, setPrecio] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [id_user, setIdUser] = useState("");
  const [estado, setEstado] = useState("");

  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (pagosplanSeleccionada) {
      setIdDetalle(pagosplanSeleccionada.id_detalle || "");
      setIdCliente(pagosplanSeleccionada.id_cliente || "");
      setIdPlan(pagosplanSeleccionada.id_plan || "");
      setPrecio(pagosplanSeleccionada.precio || "");
      setFecha(pagosplanSeleccionada.fecha || "");
      setHora(pagosplanSeleccionada.hora || "");
      setIdUser(pagosplanSeleccionada.id_user || "");
      setEstado(pagosplanSeleccionada.estado || "");
    } else {
      setIdDetalle("");
      setIdCliente("");
      setIdPlan("");
      setPrecio("");
      setFecha("");
      setHora("");
      setIdUser("");
      setEstado("");
    }
    setErrores({});
  }, [pagosplanSeleccionada]);

  const validar = () => {
    const nuevosErrores = {};

    if (!String(id_detalle).trim())  nuevosErrores.id_detalle = "El ID de detalle es obligatorio";
    if (!String(id_cliente).trim()) nuevosErrores.id_cliente = "El ID del cliente es obligatorio";
    if (!String(id_plan).trim()) nuevosErrores.id_plan = "El ID del plan es obligatorio";
    if (!precio || isNaN(precio) || parseFloat(precio) <= 0) {
      nuevosErrores.precio = "El precio debe ser un número válido y mayor a 0";
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (!validar()) {
      Swal.fire("Campos inválidos", "Por favor revisa los datos ingresados", "error");
      return;
    }

    const nuevaPagosplan = {
      id_detalle: parseInt(id_detalle),
      id_cliente: parseInt(id_cliente) ,
      id_plan: parseInt(id_plan),
      precio: parseFloat(precio)
    };

    if (pagosplanSeleccionada) {
      actualizar(pagosplanSeleccionada.id, {
        ...nuevaPagosplan,
        fecha,
        hora,
        id_user: parseInt(id_user),
        estado: parseInt(estado),
      });
    } else {
      agregar(nuevaPagosplan);
    }

    setIdDetalle("");
    setIdCliente("");
    setIdPlan("");
    setPrecio("");
    setFecha("");
    setHora("");
    setIdUser("");
    setEstado("");

    setErrores({});
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{pagosplanSeleccionada ? "Editar Pago de Plan" : "Agregar Pago de Plan"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={manejarEnvio}>
          <Form.Group className="mb-3">
            <Form.Label>ID Detalle</Form.Label>
            <Form.Control
              type="text"
              value={id_detalle}
              onChange={(e) => setIdDetalle(e.target.value)}
              isInvalid={!!errores.id_detalle}
            />
            <Form.Control.Feedback type="invalid">{errores.id_detalle}</Form.Control.Feedback>
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
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              isInvalid={!!errores.precio}
            />
            <Form.Control.Feedback type="invalid">{errores.precio}</Form.Control.Feedback>
          </Form.Group>

          {pagosplanSeleccionada &&(
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
            {pagosplanSeleccionada ? "Actualizar" : "Agregar"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PagosplanesForm;

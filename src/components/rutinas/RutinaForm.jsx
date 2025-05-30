import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";

const RutinaForm = ({ show, handleClose, agregar, actualizar, rutinaSeleccionada }) => {
  const [dia, setDia] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [id_user, setIdUser] = useState("");
  const [estado, setEstado] = useState("");
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (rutinaSeleccionada) {
      setDia(rutinaSeleccionada.dia);
      setDescripcion(rutinaSeleccionada.descripcion);
      setIdUser(rutinaSeleccionada.id_user?.toString() || "");
      setEstado(rutinaSeleccionada.estado?.toString() || "");
    } else {
      setDia("");
      setDescripcion("");
      setIdUser("");
      setEstado("");
    }
    setErrores({});
  }, [rutinaSeleccionada]);

  const validar = () => {
    const nuevosErrores = {};
    const diaRegex = /^DIA\s(0[1-9]|[12][0-9]|30)$/;

    if (!dia.trim()) {
      nuevosErrores.dia = "El día es obligatorio";
    } else if (!diaRegex.test(dia.trim().toUpperCase())) {
      nuevosErrores.dia = "El día debe estar en formato 'DIA 01' hasta 'DIA 30'";
    }

    if (!descripcion.trim()) {
      nuevosErrores.descripcion = "La descripción es obligatoria";
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]*$/.test(descripcion)) {
      nuevosErrores.descripcion = "Solo se permiten letras y espacios";
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

    const nuevaRutina = { dia, descripcion };

    if (rutinaSeleccionada) {
      actualizar(rutinaSeleccionada.id, {
        ...nuevaRutina,
        estado: parseInt(estado),
        id_user: parseInt(id_user),
      });
      Swal.fire({
        icon: "info",
        title: "Rutina actualizada",
        text: "La rutina fue actualizada correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      agregar(nuevaRutina);
      Swal.fire({
        icon: "success",
        title: "Rutina agregada",
        text: "La rutina fue registrada exitosamente.",
        timer: 2000,
        showConfirmButton: false,
      });
    }

    // Limpiar formulario
    setDia("");
    setDescripcion("");
    setIdUser("");
    setEstado("");
    setErrores({});
    handleClose();
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
          {rutinaSeleccionada ? (
            <>
              <i className="bi bi-pencil-square me-2"></i>Editar Rutina
            </>
          ) : (
            <>
              <i className="bi bi-plus-circle me-2"></i>Agregar Nueva Rutina
            </>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={manejarEnvio}>
          <div className="row">
            {/* Día */}
            <Form.Group className="mb-3 col-md-6">
              <Form.Label className="fw-bold">
                Día <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                value={dia}
                onChange={(e) => setDia(e.target.value)}
                isInvalid={!!errores.dia}
              >
                <option value="">Seleccione un día</option>
                {[...Array(30)].map((_, i) => {
                  const diaTexto = `DIA ${String(i + 1).padStart(2, "0")}`;
                  return (
                    <option key={diaTexto} value={diaTexto}>
                      {diaTexto}
                    </option>
                  );
                })}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errores.dia}</Form.Control.Feedback>
            </Form.Group>

            {/* Descripción */}
            <Form.Group className="mb-3 col-md-6">
              <Form.Label className="fw-bold">
                Descripción <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese descripción"
                value={descripcion}
                onChange={(e) => {
                  const valor = e.target.value;
                  if (/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]*$/.test(valor) || valor === "") {
                    setDescripcion(valor);
                  }
                }}
                isInvalid={!!errores.descripcion}
              />
              <Form.Text className="text-muted">Solo letras y espacios</Form.Text>
              <Form.Control.Feedback type="invalid">
                {errores.descripcion}
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          {/* Mostrar campos solo al editar */}
          {rutinaSeleccionada && (
            <div className="row">
              <Form.Group className="mb-3 col-md-6">
                <Form.Label className="fw-bold">ID Usuario</Form.Label>
                <Form.Control type="text" value={id_user} disabled />
              </Form.Group>
              <Form.Group className="mb-3 col-md-6">
                <Form.Label className="fw-bold">Estado</Form.Label>
                <Form.Control type="text" value={estado} disabled />
              </Form.Group>
            </div>
          )}

          <div className="d-flex justify-content-end gap-3 mt-4">
            <Button variant="outline-secondary" onClick={handleClose} className="px-4">
              Cancelar
            </Button>
            <Button variant="primary" type="submit" className="px-4 fw-bold">
              {rutinaSeleccionada ? (
                <>
                  <i className="bi bi-check-circle me-2"></i>Guardar Cambios
                </>
              ) : (
                <>
                  <i className="bi bi-save me-2"></i>Registrar Rutina
                </>
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RutinaForm;

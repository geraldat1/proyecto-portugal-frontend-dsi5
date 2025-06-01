import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import Select from "react-select";


const AsistenciaForm = ({ show, handleClose, agregar, actualizar, asistenciaSeleccionada, entrenadores, detallesPlanes, clientes, planes, asistencias   }) => {
  const [fecha, setFecha] = useState("");
  const [hora_entrada, setHoraEnt] = useState("");
  const [hora_salida, setHoraSal] = useState("");
  const [id_detalle, setIdDetalle] = useState("");
  const [id_entrenador, setIdEntrenador] = useState("");
  const [id_usuario, setIdUsuario] = useState("");
  const [estado, setEstado] = useState("");

  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (asistenciaSeleccionada) {
      setFecha(asistenciaSeleccionada.fecha);
      setHoraEnt(asistenciaSeleccionada.hora_entrada);
      setHoraSal(asistenciaSeleccionada.hora_salida);
      setIdDetalle(asistenciaSeleccionada.id_detalle);
      setIdEntrenador(asistenciaSeleccionada.id_entrenador);
      setIdUsuario(asistenciaSeleccionada.id_usuario);
      setEstado(asistenciaSeleccionada.estado);
    } else {
      setFecha("");
      setHoraEnt("");
      setHoraSal("");
      setIdDetalle("");
      setIdEntrenador("");
      setIdUsuario("");
      setEstado("");
    }
    setErrores({});
  }, [asistenciaSeleccionada]);

  const validar = () => {
    const nuevosErrores = {};

    if (!id_detalle || String(id_detalle).trim() === "") {
      nuevosErrores.id_detalle = "El ID del detalle es obligatorio";
    }

    if (!id_entrenador || String(id_entrenador).trim() === "") {
      nuevosErrores.id_entrenador = "El ID del entrenador es obligatorio";
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

    // Verificación de duplicado
    const hoy = new Date().toISOString().split("T")[0];
    const asistenciaExistente = asistencias.find(
      (asis) =>
        asis.id_detalle === id_detalle &&
        new Date(asis.fecha).toISOString().split("T")[0] === hoy
    );

    if (asistenciaExistente && !asistenciaSeleccionada) {
      Swal.fire({
        icon: "warning",
        title: "Registro duplicado",
        text: "Este cliente ya tiene una asistencia registrada para hoy.",
        confirmButtonText: "Entendido",
      });
      return;
    }

    const nuevaAsistencia = { id_detalle, id_entrenador };

    if (asistenciaSeleccionada) {
      actualizar(asistenciaSeleccionada.id_asistencia, {
        ...nuevaAsistencia,
        fecha,
        hora_entrada,
        hora_salida: hora_salida?.trim() || null,
        id_usuario: parseInt(id_usuario),
        estado: parseInt(estado),
      });

      Swal.fire({
        icon: "info",
        title: "Registro actualizado",
        text: "La asistencia fue actualizada correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });

    } else {
      agregar(nuevaAsistencia);
      Swal.fire({
        icon: "success",
        title: "Asistencia registrada",
        text: "La asistencia fue registrada exitosamente.",
        timer: 2000,
        showConfirmButton: false,
      });
    }

    // Reset
    setFecha("");
    setHoraEnt("");
    setHoraSal("");
    setIdDetalle("");
    setIdEntrenador("");
    setIdUsuario("");
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
      {asistenciaSeleccionada ? (
        <><i className="bi bi-pencil-square me-2"></i>Editar Asistencia</>
      ) : (
        <><i className="bi bi-calendar-plus me-2"></i>Registrar Nueva Asistencia</>
      )}
    </Modal.Title>
  </Modal.Header>
  
  <Modal.Body>
    <Form onSubmit={manejarEnvio}>
      <div className="row">

        {/* Select Cliente (Plan) con búsqueda por nombre o DNI */}
        <Form.Group className="mb-3 col-md-6">
          <Form.Label className="fw-bold">
            Cliente (Plan) <span className="text-danger">*</span>
          </Form.Label>
          <Select
  options={detallesPlanes
    .filter((detalle) => detalle.estado === 2)  // SOLO estado 2
    .map((detalle) => {
      const cliente = clientes.find((c) => c.id === detalle.id_cliente);
      const plan = planes.find((p) => p.id === detalle.id_plan);
      return {
        value: detalle.id,
        label: `${cliente?.nombre || "Cliente"} - DNI: ${cliente?.dni || "N/D"} (${plan?.plan || "Plan"})`,
      };
    })}
  onChange={(selectedOption) =>
    setIdDetalle(selectedOption ? selectedOption.value : "")
  }
  value={
    detallesPlanes
      .filter((detalle) => detalle.estado === 2)  // SOLO estado 2 aquí también
      .map((detalle) => {
        const cliente = clientes.find((c) => c.id === detalle.id_cliente);
        const plan = planes.find((p) => p.id === detalle.id_plan);
        return {
          value: detalle.id,
          label: `${cliente?.nombre || "Cliente"} - DNI: ${cliente?.dni || "N/D"} (${plan?.plan || "Plan"})`,
        };
      })
      .find((option) => option.value === id_detalle) || null
  }
  placeholder="Buscar por nombre o DNI..."
  classNamePrefix={!!errores.id_detalle ? "is-invalid" : ""}
  isDisabled={!!asistenciaSeleccionada}
/>

          {errores.id_detalle && (
            <div className="invalid-feedback d-block">{errores.id_detalle}</div>
          )}
          <Form.Text className="text-muted">
            Escriba nombre o DNI para buscar al cliente
          </Form.Text>
        </Form.Group>

      {/* Select Entrenador con búsqueda solo por nombre */}
      <Form.Group className="mb-3 col-md-6">
        <Form.Label className="fw-bold">
          Entrenador <span className="text-danger">*</span>
        </Form.Label>
        <Select
          options={entrenadores
            .filter((entrenador) => entrenador.estado !== 0)
            .map((entrenador) => ({
              value: entrenador.id,
              label: entrenador.nombre,
            }))
          }
          onChange={(selectedOption) =>
            setIdEntrenador(selectedOption ? selectedOption.value : "")
          }
          value={
            entrenadores
              .filter((entrenador) => entrenador.estado !== 0)
              .map((entrenador) => ({
                value: entrenador.id,
                label: entrenador.nombre,
              }))
              .find((option) => option.value === id_entrenador) || null
          }
          placeholder="Buscar entrenador por nombre..."
          classNamePrefix={!!errores.id_entrenador ? "is-invalid" : ""}
          isDisabled={!!asistenciaSeleccionada}
        />
        {errores.id_entrenador && (
          <div className="invalid-feedback d-block">{errores.id_entrenador}</div>
        )}
      </Form.Group>



      </div>

      {/* Campos de solo lectura para edición */}
      {asistenciaSeleccionada && (
        <div className="row">
          <Form.Group className="mb-3 col-md-6">
            <Form.Label className="fw-bold">F.Registro</Form.Label>
            <Form.Control 
              type="text" 
              value={fecha ? new Date(fecha).toLocaleDateString('es-PE') : "No registrada"} 
              disabled 
              plaintext 
              className="form-control-plaintext ps-2 border-bottom"
            />
          </Form.Group>


          <Form.Group className="mb-3 col-md-6">
            <Form.Label className="fw-bold">Hora de Entrada</Form.Label>
            <Form.Control 
              type="text" 
              value={hora_entrada || "No registrada"} 
              disabled 
              plaintext 
              className="form-control-plaintext ps-2 border-bottom"
            />
          </Form.Group>
        </div>
      )}

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
          {asistenciaSeleccionada ? (
            <><i className="bi bi-check-circle me-2"></i>Registrar Salida</>
          ) : (
            <><i className="bi bi-save me-2"></i>Registrar Asistencia</>
          )}
        </Button>
      </div>
    </Form>
  </Modal.Body>
</Modal>
  );
};

export default AsistenciaForm;

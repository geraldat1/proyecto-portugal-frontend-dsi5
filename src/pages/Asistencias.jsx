import React, { useEffect, useState } from "react";
import { obtenerAsistencias, agregarAsistencia, actualizarAsistencia, eliminarAsistencia } from "../services/asistenciaService";
import AsistenciaList from "../components/asistencias/AsistenciaList";
import AsistenciaForm from "../components/asistencias/AsistenciaForm";
import { Button } from "react-bootstrap";

const Asistencias = () => {
  const [asistencias, setAsistencias] = useState([]);
  const [asistenciaSeleccionada, setAsistenciaSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Cargar las asistencias al cargar el componente
  useEffect(() => {
    cargarAsistencias();
  }, []);

  // Cargar las asistencias desde la API
  const cargarAsistencias = async () => {
    try {
      const datos = await obtenerAsistencias();
      setAsistencias(datos);
    } catch (error) {
      console.error("Error al cargar las asistencias:", error);
      // Aquí podrías agregar un mensaje de error si es necesario
    }
  };

  // Agregar una nueva asistencia
  const agregar = async (asistencia) => {
    try {
      await agregarAsistencia(asistencia);
      cargarAsistencias();
      setMostrarModal(false);
    } catch (error) {
      console.error("Error al agregar asistencia:", error);
      // Aquí podrías agregar un mensaje de error si es necesario
    }
  };

  // Actualizar una asistencia existente
  const actualizar = async (id_asistencia, asistencia) => {
    try {
      await actualizarAsistencia(id_asistencia, asistencia);
      cargarAsistencias();
      setAsistenciaSeleccionada(null);
      setMostrarModal(false);
    } catch (error) {
      console.error("Error al actualizar asistencia:", error);
      // Aquí podrías agregar un mensaje de error si es necesario
    }
  };

  // Eliminar una asistencia
  const eliminar = async (id_asistencia) => {
    try {
      await eliminarAsistencia(id_asistencia);
      cargarAsistencias();
    } catch (error) {
      console.error("Error al eliminar asistencia:", error);
      // Aquí podrías agregar un mensaje de error si es necesario
    }
  };

  // Seleccionar una asistencia para editar
  const seleccionarAsistencia = (asistencia) => {
    setAsistenciaSeleccionada(asistencia);
    setMostrarModal(true);
  };

  return (
    <div>
      <h2>Administración de Asistencia</h2>
      <Button
        className="mb-3"
        variant="primary"
        onClick={() => {
          setAsistenciaSeleccionada(null);
          setMostrarModal(true);
        }}
      >
        Agregar Asistencia
      </Button>

      <AsistenciaList
        asistencias={asistencias}
        seleccionar={seleccionarAsistencia}
        eliminar={eliminar}
      />
      <AsistenciaForm
        show={mostrarModal}
        handleClose={() => setMostrarModal(false)}
        agregar={agregar}
        actualizar={actualizar}
        asistenciaSeleccionada={asistenciaSeleccionada}
      />
    </div>
  );
};

export default Asistencias;

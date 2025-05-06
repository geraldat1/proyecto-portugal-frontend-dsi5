import React, { useEffect, useState } from "react";
import { obtenerAsistencias, agregarAsistencia, actualizarAsistencia, eliminarAsistencia } from "../services/asistenciaService";
import AsistenciaList from "../components/asistencias/AsistenciaList";
import AsistenciaForm from "../components/asistencias/AsistenciaForm";
import { Button } from "react-bootstrap";

const Asistencias = () => {
  const [asistencias, setAsistencias] = useState([]);
  const [asistenciaSeleccionado, setAsistenciaSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    cargarAsistencias();
  }, []);

  const cargarAsistencias= async () => {
    const datos = await obtenerAsistencias();
    setAsistencias(datos);
  };

  const agregar = async (asistencia) => {
    await agregarAsistencia(asistencia);
    cargarAsistencias();
    setMostrarModal(false);
  };

  const actualizar = async (id, asistencia) => {
    await actualizarAsistencia(id, asistencia);
    cargarAsistencias();
    setAsistenciaSeleccionada(null);
    setMostrarModal(false);
  };

  const eliminar = async (id) => {
    await eliminarAsistencia(id);
    cargarAsistencias();
  };

  // Cuando seleccionamos una asistencia, mostramos el modal con los datos
  const seleccionarAsistencia = (asistencia) => {
    setAsistenciaSeleccionada(asistencia);
    setMostrarModal(true);
  };

  return (
    <div>
      <h2>Gestión de Asistencia</h2>
      <Button 
      className="mb-3" 
      variant="primary"
       onClick={() => {
       setAsistenciaSeleccionada(null);
       setMostrarModal(true);
      }
      }
       >Agregar Asistencia</Button>

      <AsistenciaList asistencias={asistencias} seleccionar={seleccionarAsistencia} eliminar={eliminar} />
      <AsistenciaForm
        show={mostrarModal}
        handleClose={() => setMostrarModal(false)}
        agregar={agregar}
        actualizar={actualizar}
        asistenciaSeleccionada={asistenciaSeleccionado}
      />
    </div>
  );
};

export default Asistencias;

import React, { useEffect, useState } from "react";
import { obtenerAsistencias, agregarAsistencia, actualizarAsistencia, eliminarAsistencia } from "../services/asistenciaService";
import AsistenciaList from "../components/asistencias/AsistenciaList";
import AsistenciaForm from "../components/asistencias/AsistenciaForm";
import { Button } from "react-bootstrap";

import { FaPlus } from "react-icons/fa";


import { obtenerEntrenadores } from "../services/entrenadorService"; // asegúrate de tener esto
import { obtenerDetalleplanes } from "../services/detalleplanesService"; // importa el servicio
import { obtenerClientes } from "../services/clienteService";
import { obtenerPlanes } from "../services/planService"; // importar el servicio


const Asistencias = () => {
  const [asistencias, setAsistencias] = useState([]);
  const [asistenciaSeleccionada, setAsistenciaSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const [entrenadores, setEntrenadores] = useState([]);
  const [detallesPlanes, setDetallesPlanes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [planes, setPlanes] = useState([]);

  // Cargar las asistencias al cargar el componente
  useEffect(() => {
    cargarAsistencias();
    cargarEntrenadores();
    cargarDetallesPlanes();
    cargarClientes(); 
    cargarPlanes(); 

  }, []);

  const cargarEntrenadores = async () => {
  try {
    const datos = await obtenerEntrenadores();
    setEntrenadores(datos);
  } catch (error) {
    console.error("Error al cargar entrenadores:", error);
  }
  };

    const cargarDetallesPlanes = async () => {
    try {
      const datos = await obtenerDetalleplanes();
      setDetallesPlanes(datos);
    } catch (error) {
      console.error("Error al cargar detalles de planes:", error);
    }
  };

  const cargarClientes = async () => {
  try {
    const datos = await obtenerClientes();
    setClientes(datos);
  } catch (error) {
    console.error("Error al cargar clientes:", error);
  }
};

const cargarPlanes = async () => {
  try {
    const datos = await obtenerPlanes();
    setPlanes(datos);
  } catch (error) {
    console.error("Error al cargar planes:", error);
  }
};



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
      <h2>Registro de Asistencia</h2>
      <Button
        className="mb-3 d-flex align-items-center gap-2"
        variant="primary"
        onClick={() => {
          setAsistenciaSeleccionada(null);
          setMostrarModal(true);
        }}
      >
        <FaPlus />
        Agregar Asistencia
      </Button>


      <AsistenciaList
        asistencias={asistencias}
        seleccionar={seleccionarAsistencia}
        eliminar={eliminar}
        entrenadores={entrenadores}
        detallesPlanes={detallesPlanes}
        clientes={clientes} 
        planes={planes}

      />


      <AsistenciaForm
        show={mostrarModal}
        handleClose={() => setMostrarModal(false)}
        agregar={agregar}
        actualizar={actualizar}
        asistenciaSeleccionada={asistenciaSeleccionada}
        entrenadores={entrenadores}
        detallesPlanes={detallesPlanes} 
        clientes={clientes} 
        planes={planes} 
      />

    </div>
  );
};

export default Asistencias;

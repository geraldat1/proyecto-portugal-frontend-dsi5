import React, { useEffect, useState } from "react";
import {
  obtenerDetalleplanes,
  agregarDetalleplan,
  actualizarDetalleplan,
  eliminarDetalleplan,
} from "../services/detalleplanesService";
import { obtenerClientes } from "../services/clienteService";
import { obtenerPlanes } from "../services/planService";
import DetalleplanesList from "../components/detalleplanes/DetalleplanesList";
import DetalleplanesForm from "../components/detalleplanes/DetalleplanesForm";
import { Button } from "react-bootstrap";

import { FaPlus } from "react-icons/fa";


const Detalleplanes = () => {
  const [detalleplanes, setDetalleplanes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [detalleplanSeleccionada, setDetalleplanSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
  const [datosDetalleplanes, datosClientes, datosPlanes] = await Promise.all([
    obtenerDetalleplanes(),
    obtenerClientes(),
    obtenerPlanes(),
  ]);

  // Deshabilitar automáticamente los registros cuya fecha límite ya pasó
  const hoy = new Date().setHours(0, 0, 0, 0);
  for (const detalle of datosDetalleplanes) {
    const fechaLimite = new Date(detalle.fecha_limite).setHours(0, 0, 0, 0);
    if (fechaLimite < hoy && detalle.estado !== 0) {
      await actualizarDetalleplan(detalle.id, { ...detalle, estado: 0 });
    }
  }

  setDetalleplanes(datosDetalleplanes);
  setClientes(datosClientes);
  setPlanes(datosPlanes);
};


  const agregar = async (detalleplan) => {
    await agregarDetalleplan(detalleplan);
    cargarDatos();
    setMostrarModal(false);
  };

  const actualizar = async (id, detalleplan) => {
    await actualizarDetalleplan(id, detalleplan);
    cargarDatos();
    setDetalleplanSeleccionada(null);
    setMostrarModal(false);
  };

  const eliminar = async (id) => {
    await eliminarDetalleplan(id);
    cargarDatos();
  };

  const seleccionarDetalleplan = (detalleplan) => {
    setDetalleplanSeleccionada(detalleplan);
    setMostrarModal(true);
  };

  
  return (
    <div>
      <h2>Registro de Suscripción de Cliente</h2>
      <Button
        className="mb-3 d-flex align-items-center"
        variant="primary"
        onClick={() => {
          setDetalleplanSeleccionada(null);
          setMostrarModal(true);
        }}
      >
        <FaPlus className="me-2" />
        Agregar Suscripción para Cliente
      </Button>


      <DetalleplanesList
        detalleplanes={detalleplanes}
        seleccionar={seleccionarDetalleplan}
        eliminar={eliminar}
        clientes={clientes}
        planes={planes}
        recargarDatos={cargarDatos} 

      />

      <DetalleplanesForm
        show={mostrarModal}
        handleClose={() => setMostrarModal(false)}
        agregar={agregar}
        actualizar={actualizar}
        detalleplanSeleccionada={detalleplanSeleccionada}
        clientes={clientes}
        planes={planes}
        detallePlanesExistentes={detalleplanes}  // <-- Aquí agregas esta prop

      />
    </div>
  );
};

export default Detalleplanes;

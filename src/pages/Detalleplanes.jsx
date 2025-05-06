import React, { useEffect, useState } from "react";
import { obtenerDetalleplanes, agregarDetalleplan, actualizarDetalleplan, eliminarDetalleplan } from "../services/detalleplanesService";
import DetalleplanesList from "../components/detalleplanes/DetalleplanesList";
import DetalleplanesForm from "../components/detalleplanes/DetalleplanesForm";
import { Button } from "react-bootstrap";

const Detalleplanes = () => {
  const [detalleplanes, setDetallesplanes] = useState([]);
  const [detalleplanesSeleccionada, setDetalleplanesSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    cargarDetalleplanes();
  }, []);

  const cargarDetalleplanes= async () => {
    const datos = await obtenerDetalleplanes();
    setDetallesplanes(datos);
  };

  const agregar = async (detalleplan) => {
    await agregarDetalleplan(detalleplan);
    cargarDetalleplanes();
    setMostrarModal(false);
  };

  const actualizar = async (id, detalleplan) => {
    await actualizarDetalleplan(id, detalleplan);
    cargarDetalleplanes();
    setDetalleplanesSeleccionada(null);
    setMostrarModal(false);
  };

  const eliminar = async (id) => {
    await eliminarDetalleplan(id);
    cargarDetalleplanes();
  };

  // Cuando seleccionamos una detalleplan, mostramos el modal con los datos
  const seleccionarDetalleplan = (detalleplan) => {
    setDetalleplanesSeleccionada(detalleplan);
    setMostrarModal(true);
  };

  return (
    <div>
      <h2>Gestión Detallada de los planes</h2>
      <Button 
      className="mb-3" 
      variant="primary"
       onClick={() => {
       setDetalleplanesSeleccionada(null);
       setMostrarModal(true);
      }
      }
       >Agregar Detalle del plan</Button>

      <DetalleplanesList detalleplanes={detalleplanes} seleccionar={seleccionarDetalleplan} eliminar={eliminar} />
      <DetalleplanesForm
        show={mostrarModal}
        handleClose={() => setMostrarModal(false)}
        agregar={agregar}
        actualizar={actualizar}
        detalleplanesSeleccionada={detalleplanesSeleccionada}
      />
    </div>
  );
};

export default Detalleplanes;

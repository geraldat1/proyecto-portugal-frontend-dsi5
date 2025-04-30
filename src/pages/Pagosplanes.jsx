import React, { useEffect, useState } from "react";
import { obtenerPagoplanes, agregarPagosplan, actualizarPagosplan, eliminarPagosplan } from "../services/pagosplanesService";
import PagosplanesList from "../components/pagosplanes/PagosplanesList";
import PagosplanesForm from "../components/pagosplanes/PagosplanesForm";
import { Button } from "react-bootstrap";

const Pagosplanes = () => {
  const [pagosplanes, setPagosplanes] = useState([]);
  const [pagosplanSeleccionada, setPagosplanSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    cargarPagosplanes();
  }, []);

  const cargarPagosplanes = async () => {
    const datos = await obtenerPagoplanes();
    setPagosplanes(datos);
  };

  const agregar = async (pagosplan) => {
    await agregarPagosplan(pagosplan);
    cargarPagosplanes();
    setMostrarModal(false);
  };

  const actualizar = async (id, pagosplan) => {
    await actualizarPagosplan(id, pagosplan);
    cargarPagosplanes();
    setPagosplanSeleccionada(null);
    setMostrarModal(false);
  };

  const eliminar = async (id) => {
    await eliminarPagosplan(id);
    cargarPagosplanes();
  };

  // Cuando seleccionamos una pagosplan, mostramos el modal con los datos
  const seleccionarPagosplan = (pagosplan) => {
    setPagosplanSeleccionada(pagosplan);
    setMostrarModal(true);
  };

  return (
    <div>
      <h2>Gestión de los Planes Pagados</h2>
      <Button 
      className="mb-3" 
      variant="primary"
       onClick={() => {
       setPagosplanSeleccionada(null);
       setMostrarModal(true);
      }
      }
       >Agregar Pago del Plan</Button>

      <PagosplanesList pagosplanes={pagosplanes} seleccionar={seleccionarPagosplan} eliminar={eliminar} />
      <PagosplanesForm
        show={mostrarModal}
        handleClose={() => setMostrarModal(false)}
        agregar={agregar}
        actualizar={actualizar}
        pagosplanSeleccionada={pagosplanSeleccionada}
      />
    </div>
  );
};

export default Pagosplanes;

import React, { useEffect, useState } from "react";
import { obtenerConfiguraciones, agregarConfiguracion, actualizarConfiguracion, eliminarConfiguracion } from "../services/configuracionService";
import ConfigList from "../components/configuraciones/ConfigList";
import ConfigForm from "../components/configuraciones/ConfigForm";
import { Button } from "react-bootstrap";

const Configuraciones = () => {
  const [configuraciones, setConfiguraciones] = useState([]);
  const [configuaracionSeleccionada, setConfiguracionSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    cargarConfiguraciones();
  }, []);

  const cargarConfiguraciones = async () => {
    const datos = await obtenerConfiguraciones();
    setConfiguraciones(datos);
  };

  const agregar = async (configuracion) => {
    await agregarConfiguracion (configuracion);
    cargarConfiguraciones();
    setMostrarModal(false);
  };

  const actualizar = async (id, configuracion) => {
    await actualizarConfiguracion(id, configuracion);
    cargarConfiguraciones();
    setConfiguracionSeleccionada(null);
    setMostrarModal(false);
  };

  const eliminar = async (id) => {
    await eliminarConfiguracion(id);
    cargarConfiguraciones();
  };

  // Cuando seleccionamos una configuracion, mostramos el modal con los datos
  const seleccionarConfiguracion = (configuracion) => {
    setConfiguracionSeleccionada(configuracion);
    setMostrarModal(true);
  };

  return (
    <div>
      <h2>Datos de la Empresa</h2>
      <Button 
      className="mb-3" 
      variant="dark"
       onClick={() => {
       setConfiguracionSeleccionada(null);
       setMostrarModal(true);
      }
      }
       >Agregar Configuracion</Button>

      <ConfigList configuraciones={configuraciones} seleccionar={seleccionarConfiguracion} eliminar={eliminar} />
      <ConfigForm
        show={mostrarModal}
        handleClose={() => setMostrarModal(false)}
        agregar={agregar}
        actualizar={actualizar}
        configuracionSeleccionada={configuaracionSeleccionada}
      />
    </div>
  );
};

export default Configuraciones;

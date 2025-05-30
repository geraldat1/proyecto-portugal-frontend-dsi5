import React, { useEffect, useState } from "react";
import { obtenerRutinas, agregarRutina, actualizarRutina, eliminarRutina } from "../services/rutinaService";
import RutinaList from "../components/rutinas/RutinaLIst";
import RutinaForm from "../components/rutinas/RutinaForm";
import { Button } from "react-bootstrap";

import { FaPlus } from "react-icons/fa";


const Rutinas = () => {
  const [rutinas, setRutinas] = useState([]);
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    cargarRutinas();
  }, []);

  const cargarRutinas = async () => {
    const datos = await obtenerRutinas();
    setRutinas(datos);
  };

  const agregar = async (rutina) => {
    await agregarRutina(rutina);
    cargarRutinas();
    setMostrarModal(false);
  };

  const actualizar = async (id, rutina) => {
    await actualizarRutina(id, rutina);
    cargarRutinas();
    setRutinaSeleccionada(null);
    setMostrarModal(false);
  };

  const eliminar = async (id) => {
    await eliminarRutina(id);
    cargarRutinas();
  };

  // Cuando seleccionamos una persona, mostramos el modal con los datos
  const seleccionarRutina = (rutina) => {
    setRutinaSeleccionada(rutina);
    setMostrarModal(true);
  };

  return (
    <div>
      <h2>Lista de Rutinas</h2>
      <Button
        className="mb-3"
        variant="primary"
        onClick={() => {
          setRutinaSeleccionada(null);
          setMostrarModal(true);
        }}
      >
        <FaPlus className="me-2" />
        Agregar Rutina
      </Button>

      <RutinaList rutinas={rutinas} seleccionar={seleccionarRutina} eliminar={eliminar} />
      <RutinaForm
        show={mostrarModal}
        handleClose={() => setMostrarModal(false)}
        agregar={agregar}
        actualizar={actualizar}
        rutinaSeleccionada={rutinaSeleccionada}
      />
    </div>
  );
};

export default Rutinas;

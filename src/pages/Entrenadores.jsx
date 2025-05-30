import React, { useEffect, useState } from "react";
import { obtenerEntrenadores, agregarEntrenador, actualizarEntrenador, eliminarEntrenador } from "../services/entrenadorService";
import EntrenadorList from "../components/entrenadores/EntrenadorList";
import EntrenadorForm from "../components/entrenadores/EntrenadorForm";
import { Button } from "react-bootstrap";

import { FaPlus } from "react-icons/fa";

const Entrenadores = () => {
  const [entrenadores, setEntrenadores] = useState([]);
  const [entrenadorSeleccionado, setEntrenadorSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    cargarEntrenadores();
  }, []);

  const cargarEntrenadores = async () => {
    const datos = await obtenerEntrenadores();
    setEntrenadores(datos);
  };

  const agregar = async (entrenador) => {
    await agregarEntrenador(entrenador);
    cargarEntrenadores();
    setMostrarModal(false);
  };

  const actualizar = async (id, entrenador) => {
    await actualizarEntrenador(id, entrenador);
    cargarEntrenadores();
    setEntrenadorSeleccionado(null);
    setMostrarModal(false);
  };

  const eliminar = async (id) => {
    await eliminarEntrenador(id);
    cargarEntrenadores();
  };

  // Cuando seleccionamos una entrenadores, mostramos el modal con los datos
  const seleccionarEntrenador = (entrenador) => {
    setEntrenadorSeleccionado(entrenador);
    setMostrarModal(true);
  };

  return (
    <div>
      <h2>Registro de Entrenadores</h2>
      <Button
      className="mb-3 d-flex align-items-center"
      variant="primary"
      onClick={() => {
        setEntrenadorSeleccionado(null);
        setMostrarModal(true);
      }}
    >
      <FaPlus className="me-2"  />
      Agregar Entrenador
    </Button>


      <EntrenadorList entrenadores={entrenadores} seleccionar={seleccionarEntrenador} eliminar={eliminar} />
      <EntrenadorForm
        show={mostrarModal}
        handleClose={() => setMostrarModal(false)}
        agregar={agregar}
        actualizar={actualizar}
        entrenadorSeleccionado={entrenadorSeleccionado}
      />
    </div>
  );
};

export default Entrenadores;

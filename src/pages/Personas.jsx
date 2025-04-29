import React, { useEffect, useState } from "react";
import { obtenerPersonas, agregarPersona, actualizarPersona, eliminarPersona } from "../services/personaService";
import PersonaList from "../components/personas/PersonaList";
import PersonaForm from "../components/personas/PersonaForm";
import { Button } from "react-bootstrap";

const Personas = () => {
  const [personas, setPersonas] = useState([]);
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    cargarPersonas();
  }, []);

  const cargarPersonas = async () => {
    const datos = await obtenerPersonas();
    setPersonas(datos);
  };

  const agregar = async (persona) => {
    await agregarPersona(persona);
    cargarPersonas();
    setMostrarModal(false);
  };

  const actualizar = async (id, persona) => {
    await actualizarPersona(id, persona);
    cargarPersonas();
    setPersonaSeleccionada(null);
    setMostrarModal(false);
  };

  const eliminar = async (id) => {
    await eliminarPersona(id);
    cargarPersonas();
  };

  // Cuando seleccionamos una persona, mostramos el modal con los datos
  const seleccionarPersona = (persona) => {
    setPersonaSeleccionada(persona);
    setMostrarModal(true);
  };

  return (
    <div>
      <h2>Gestión de Personas</h2>
      <Button 
      className="mb-3" 
      variant="primary"
       onClick={() => {
       setPersonaSeleccionada(null);
       setMostrarModal(true);
      }
      }
       >Agregar Persona</Button>

      <PersonaList personas={personas} seleccionar={seleccionarPersona} eliminar={eliminar} />
      <PersonaForm
        show={mostrarModal}
        handleClose={() => setMostrarModal(false)}
        agregar={agregar}
        actualizar={actualizar}
        personaSeleccionada={personaSeleccionada}
      />
    </div>
  );
};

export default Personas;

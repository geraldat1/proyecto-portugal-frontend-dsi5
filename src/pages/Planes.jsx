import React, { useEffect, useState, useContext } from "react";
import { obtenerPlanes, agregarPlan, actualizarPlan, eliminarPlan } from "../services/planService";
import PlanList from "../components/planes/PlanList";
import PlanForm from "../components/planes/PlanForm";
import { Button } from "react-bootstrap";

import { FaPlus } from "react-icons/fa"; // Asegúrate de importar el ícono
import { AuthContext } from "../context/AuthContext"; // Importar el AuthContext


const Planes = () => {
  const [planes, setPlanes] = useState([]);
  const [planSeleccionado, setPlanSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const { user } = useContext(AuthContext); // Obtener el usuario del contexto

   const isRole2 = user?.role === '2' || user?.rol === '2';

  useEffect(() => {
    cargarPlanes();
  }, []);

  const cargarPlanes = async () => {
    const datos = await obtenerPlanes();
    setPlanes(datos);
  };

  const agregar = async (plan) => {
    await agregarPlan(plan);
    cargarPlanes();
    setMostrarModal(false);
  };

  const actualizar = async (id, plan) => {
    await actualizarPlan(id, plan);
    cargarPlanes();
    setPlanSeleccionado(null);
    setMostrarModal(false);
  };

  const eliminar = async (id) => {
    await eliminarPlan(id);
    cargarPlanes();
  };

  // Cuando seleccionamos una plan, mostramos el modal con los datos
  const seleccionarPlan = (plan) => {
    setPlanSeleccionado(plan);
    setMostrarModal(true);
  };

  return (
    <div>
      <h2>Lista de Planes</h2>
      {!isRole2 && (
        <Button
          className="mb-3 d-flex align-items-center gap-2 fw-semibold shadow-sm"
          variant="dark"
          onClick={() => {
            setPlanSeleccionado(null);
            setMostrarModal(true);
          }}
          style={{ borderRadius: '8px' }}
        >
          <FaPlus />
          Agregar Plan
        </Button>
      )}

      <PlanList planes={planes} seleccionar={seleccionarPlan} eliminar={eliminar}  />
      <PlanForm
        show={mostrarModal}
        handleClose={() => setMostrarModal(false)}
        agregar={agregar}
        actualizar={actualizar}
        planSeleccionado={planSeleccionado}
        planes={planes}
      />
    </div>
  );
};

export default Planes;

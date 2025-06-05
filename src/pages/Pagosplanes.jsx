import React, { useEffect, useState } from "react";
import { obtenerPagoplanes } from "../services/pagosplanesService";
import PagosplanesList from "../components/pagosplanes/PagosplanesList";

const Pagosplanes = () => {
  const [pagosplanes, setPagosplanes] = useState([]);

  useEffect(() => {
    cargarPagosplanes();
  }, []);

  const cargarPagosplanes = async () => {
    const datos = await obtenerPagoplanes();
    setPagosplanes(datos);
  };

  return (
  <div>
    <h2>Suscripciones Pagadas</h2>
    <p className="text-muted">Aquí puedes ver todas las suscripciones que han sido pagadas correctamente.</p>
    <PagosplanesList pagosplanes={pagosplanes} />
  </div>
  );
};

export default Pagosplanes;
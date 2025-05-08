import React, { useState } from "react"; 
import { Table, Button, Pagination } from "react-bootstrap";
import Swal from "sweetalert2";
import { BiEdit, BiTrash } from "react-icons/bi";

const DetalleplanesList = ({ detalleplanes, seleccionar, eliminar, clientes, planes }) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  const totalPaginas = Math.ceil(detalleplanes.length / elementosPorPagina);
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFinal = indiceInicio + elementosPorPagina;
  const detalleplanesPaginadas = detalleplanes.slice(indiceInicio, indiceFinal);

  const confirmarEliminacion = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminar(id);
        Swal.fire("¡Eliminado!", "El registro ha sido eliminado.", "success");
      }
    });
  };

  const irPrimeraPagina = () => setPaginaActual(1);
  const irUltimaPagina = () => setPaginaActual(totalPaginas);
  const irAnterior = () => setPaginaActual((prev) => Math.max(prev - 1, 1));
  const irSiguiente = () => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas));

  // Calcular el rango de páginas a mostrar
  const obtenerItemsPaginacion = () => {
    const paginas = [];

    let inicio = Math.max(paginaActual - 2, 1);
    let fin = Math.min(paginaActual + 2, totalPaginas);

    if (paginaActual <= 2) {
      fin = Math.min(5, totalPaginas);
    } else if (paginaActual >= totalPaginas - 1) {
      inicio = Math.max(totalPaginas - 4, 1);
    }

    for (let i = inicio; i <= fin; i++) {
      paginas.push(
        <Pagination.Item
          key={i}
          active={i === paginaActual}
          onClick={() => setPaginaActual(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    return paginas;
  };

  const obtenerClienteNombre = (id) => {
    const cliente = clientes.find((cliente) => cliente.id === id);
    return cliente ? cliente.nombre : "Cliente no encontrado";
  };

  const obtenerPlanDescripcion = (id) => {
    const plan = planes.find((plan) => plan.id === id);
    return plan ? plan.plan : "Plan no encontrado";
  };

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Plan</th>
            <th>FECHA</th>
            <th>HORA</th>
            <th>FECHA VENC</th>
            <th>Fecha Limite</th>
            <th>ID User</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {detalleplanesPaginadas.map((detalleplan) => (
            <tr key={detalleplan.id}>
              <td>{detalleplan.id}</td>
              <td>{obtenerClienteNombre(detalleplan.id_cliente)}</td>
              <td>{obtenerPlanDescripcion(detalleplan.id_plan)}</td>
              <td>{new Date(detalleplan.fecha).toLocaleDateString()}</td>
              <td>{detalleplan.hora}</td>
              <td>{new Date(detalleplan.fecha_venc).toLocaleDateString()}</td>
              <td>{new Date(detalleplan.fecha_limite).toLocaleDateString()}</td>
              <td>{detalleplan.id_user}</td>
              <td>{detalleplan.estado}</td>
              <td>
                <Button variant="warning" onClick={() => seleccionar(detalleplan)} title="Editar">
                  <BiEdit size={22} />
                </Button>{" "}
                <Button variant="danger" onClick={() => confirmarEliminacion(detalleplan.id)} title="Eliminar">
                  <BiTrash size={22} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination className="justify-content-center">
        <Pagination.First onClick={irPrimeraPagina} disabled={paginaActual === 1} />
        <Pagination.Prev onClick={irAnterior} disabled={paginaActual === 1} />
        {obtenerItemsPaginacion()}
        <Pagination.Next onClick={irSiguiente} disabled={paginaActual === totalPaginas} />
        <Pagination.Last onClick={irUltimaPagina} disabled={paginaActual === totalPaginas} />
      </Pagination>
    </>
  );
};

export default DetalleplanesList;

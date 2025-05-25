import React, { useState } from "react"; 
import { Table, Button, Pagination, Form, InputGroup } from "react-bootstrap";
import Swal from "sweetalert2";
import { BiEdit, BiTrash, BiDollar } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import { agregarPagosplan } from "../../services/pagosplanesService";

const DetalleplanesList = ({ detalleplanes, seleccionar, eliminar, clientes, planes }) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const elementosPorPagina = 5;

  const obtenerClienteNombre = (id) => {
    const cliente = clientes.find((cliente) => cliente.id === id);
    return cliente ? cliente.nombre : "Cliente no encontrado";
  };

  const obtenerPlanDescripcion = (id) => {
    const plan = planes.find((plan) => plan.id === id);
    return plan ? plan.plan : "Plan no encontrado";
  };

  // Filtrado por cliente o plan
  const detalleplanesFiltrados = detalleplanes.filter((detalle) => {
    const clienteNombre = obtenerClienteNombre(detalle.id_cliente).toLowerCase();
    const planNombre = obtenerPlanDescripcion(detalle.id_plan).toLowerCase();
    const texto = busqueda.toLowerCase();

    return clienteNombre.includes(texto) || planNombre.includes(texto);
  });

  const detalleplanesOrdenados = [...detalleplanesFiltrados].sort((a, b) => b.id - a.id);
  const totalPaginas = Math.ceil(detalleplanesOrdenados.length / elementosPorPagina);
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFinal = indiceInicio + elementosPorPagina;
  const detalleplanesPaginadas = detalleplanesOrdenados.slice(indiceInicio, indiceFinal);

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

  const pagar = async (detalleplan) => {
    const plan = planes.find((plan) => plan.id === detalleplan.id_plan);
    if (!plan) {
      Swal.fire("Error", "Plan no encontrado.", "error");
      return;
    }

    const pagosplan = {
      id_detalle: detalleplan.id,
      id_cliente: detalleplan.id_cliente,
      id_plan: detalleplan.id_plan,
      precio: plan.precio_plan,
    };

    try {
      await agregarPagosplan(pagosplan);
      Swal.fire("¡Pago realizado!", "El registro ha sido enviado a pagos.", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo realizar el pago.", "error");
    }
  };

  const irPrimeraPagina = () => setPaginaActual(1);
  const irUltimaPagina = () => setPaginaActual(totalPaginas);
  const irAnterior = () => setPaginaActual((prev) => Math.max(prev - 1, 1));
  const irSiguiente = () => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas));

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

  return (
    <>
      {/* Buscador */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Group className="mb-0" style={{ maxWidth: "300px" }}>
          <InputGroup size="sm">
            <InputGroup.Text className="bg-white border-end-0">
              <FaSearch className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar"
              className="border-start-0"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1);
              }}
            />
          </InputGroup>
        </Form.Group>

      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Plan</th>
            <th>Precio</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Desde</th>
            <th>Hasta</th>
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
              <td>{planes.find(plan => plan.id === detalleplan.id_plan)?.precio_plan ?? "No disponible"}</td>
              <td>{new Date(detalleplan.fecha).toLocaleDateString()}</td>
              <td>{detalleplan.hora}</td>
              <td>{new Date(detalleplan.fecha_venc).toLocaleDateString()}</td>
              <td>{new Date(detalleplan.fecha_limite).toLocaleDateString()}</td>
              <td>
                <span className={`badge ${
                  detalleplan.estado === 1 
                    ? "bg-warning text-dark" 
                    : detalleplan.estado === 0 
                      ? "bg-danger" 
                      : "bg-secondary"
                }`}>
                  {detalleplan.estado === 1 
                    ? "Proceso" 
                    : detalleplan.estado === 0 
                      ? "Deshabilitado" 
                      : "Desconocido"}
                </span>
              </td>
              <td className="d-flex gap-2">
                <Button variant="success" onClick={() => pagar(detalleplan)} title="Pagar">
                  <BiDollar size={20} />
                </Button>
                <Button variant="warning" onClick={() => seleccionar(detalleplan)} title="Editar">
                  <BiEdit size={22} />
                </Button>
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

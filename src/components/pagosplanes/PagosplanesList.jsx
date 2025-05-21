import React, { useState } from "react";
import { Table, Button, Pagination, InputGroup, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { FaSearch } from "react-icons/fa"; // o BiSearch si prefieres ese


const PagosplanesList = ({ pagosplanes, seleccionar, eliminar }) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState(""); // 👈 STATE DE BÚSQUEDA
  const elementosPorPagina = 5;

  const pagosplanesFiltrados = pagosplanes.filter((p) => {
    const cliente = p.nombre_cliente?.toLowerCase() || "";
    const plan = p.nombre_plan?.toLowerCase() || "";
    return cliente.includes(busqueda.toLowerCase()) || plan.includes(busqueda.toLowerCase());
  });

  const pagosplanesOrdenadas = [...pagosplanesFiltrados].sort((a, b) => b.id - a.id);
  const totalPaginas = Math.ceil(pagosplanesOrdenadas.length / elementosPorPagina);
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const pagosplanesPaginadas = pagosplanesOrdenadas.slice(indiceInicio, indiceInicio + elementosPorPagina);


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

  return (
    <>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Form.Group style={{ maxWidth: "300px", marginBottom: 0 }}>
            <InputGroup size="sm">
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Buscar"
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setPaginaActual(1); // 👈 Reinicia a la primera página al buscar
                }}
              />
            </InputGroup>
      </Form.Group>
       </div>

      <Table striped bordered hover>
      <thead>
      <tr>
        <th>ID</th>
        <th>Detalle</th>
        <th>Cliente</th>
        <th>Plan</th>
        <th>Precio</th>
        <th>Fecha</th>
        <th>Hora</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
  {pagosplanesPaginadas.map((pagosplanes) => (
    <tr key={pagosplanes.id}>
      <td>{pagosplanes.id}</td>
      <td>{pagosplanes.id_detalle}</td>
      <td>{pagosplanes.nombre_cliente}</td>
      <td>{pagosplanes.nombre_plan}</td>
      <td className="text-end">S/ {parseFloat(pagosplanes.precio).toFixed(2)}</td>
      <td>{new Date(pagosplanes.fecha).toLocaleDateString("es-PE")}</td>
      <td>{pagosplanes.hora}</td>
      <td>
        <span className={pagosplanes.estado === 1 || pagosplanes.estado === "1" ? "text-success fw-bold" : "text-warning fw-bold"}>
          {pagosplanes.estado === 1 || pagosplanes.estado === "1" ? "Pagado" : "Pendiente"}
        </span>
      </td>
      <td>
        <Button variant="warning" size="sm" onClick={() => seleccionar(pagosplanes)}>
          Editar
        </Button>{" "}
        <Button variant="danger" size="sm" onClick={() => confirmarEliminacion(pagosplanes.id)}>
          Eliminar
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

export default PagosplanesList;

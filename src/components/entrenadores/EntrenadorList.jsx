import React, { useState } from "react";
import { Table, Button, Pagination, Form, InputGroup } from "react-bootstrap";
import Swal from "sweetalert2";
import { FaUserCheck, FaSearch } from "react-icons/fa";

const EntrenadorList = ({ entrenadores, seleccionar, eliminar }) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const elementosPorPagina = 5;

  const entrenadoresFiltrados = entrenadores.filter((ent) => {
    const texto = busqueda.toLowerCase();
    return (
      ent.nombre.toLowerCase().includes(texto) ||
      ent.apellido.toLowerCase().includes(texto) ||
      ent.telefono.toLowerCase().includes(texto) ||
      ent.correo.toLowerCase().includes(texto) ||
      ent.direccion.toLowerCase().includes(texto)
    );
  });

  const entrenadoresOrdenados = [...entrenadoresFiltrados].sort((a, b) => b.id - a.id);

  const totalPaginas = Math.ceil(entrenadoresOrdenados.length / elementosPorPagina);
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFinal = indiceInicio + elementosPorPagina;
  const entrenadoresPaginados = entrenadoresOrdenados.slice(indiceInicio, indiceFinal);

  const entrenadoresActivos = entrenadores.filter(ent => ent.estado === 1).length;

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
      {/* Buscador + contador activos */}
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
                setPaginaActual(1);
              }}
            />
          </InputGroup>
        </Form.Group>

        <div className="d-flex align-items-center" style={{ fontSize: "1.1rem", fontWeight: "500" }}>
          <FaUserCheck size={20} className="me-2 text-success" />
          Entrenadores activos: {entrenadoresActivos}
        </div>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Telefono</th>
            <th>Correo</th>
            <th>Direccion</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {entrenadoresPaginados.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{p.apellido}</td>
              <td>{p.telefono}</td>
              <td>{p.correo}</td>
              <td>{p.direccion}</td>
              <td>{p.estado === 1 ? "Activo" : "Inactivo"}</td>
              <td>
                <Button variant="warning" onClick={() => seleccionar(p)}>
                  Editar
                </Button>{" "}
                <Button variant="danger" onClick={() => confirmarEliminacion(p.id)}>
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

export default EntrenadorList;

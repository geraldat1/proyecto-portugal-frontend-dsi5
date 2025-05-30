import React, { useState } from "react";
import { Table, Button, Pagination, Form, InputGroup } from "react-bootstrap";
import Swal from "sweetalert2";
import { BiEdit, BiBlock } from "react-icons/bi";
import { FaRunning, FaSearch } from "react-icons/fa";

const RutinaList = ({ rutinas, seleccionar, eliminar }) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const elementosPorPagina = 5;

  // Filtrar por dia, descripcion o id_user (convertido a string)
  const rutinasFiltradas = rutinas.filter((r) => {
    const texto = busqueda.toLowerCase();
    return (
      r.dia.toLowerCase().includes(texto) ||
      r.descripcion.toLowerCase().includes(texto) ||
      r.id_user.toString().includes(texto)
    );
  });

  // Ordenar descendente por id
  const rutinasOrdenadas = [...rutinasFiltradas].sort((a, b) => b.id - a.id);

  const totalPaginas = Math.ceil(rutinasOrdenadas.length / elementosPorPagina);
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFinal = indiceInicio + elementosPorPagina;
  const rutinasPaginadas = rutinasOrdenadas.slice(indiceInicio, indiceFinal);

  const rutinasActivas = rutinas.filter((r) => r.estado === 1).length;

  const confirmarEliminacion = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "La rutina será desactivada.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminar(id);
        Swal.fire("¡Desactivada!", "La rutina ha sido desactivada.", "success");
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
      {/* Buscador y contador */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Group className="mb-0" style={{ maxWidth: 300 }}>
          <InputGroup size="sm">
            <InputGroup.Text className="bg-white border-end-0">
              <FaSearch className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar por día, descripción o ID user"
              className="border-start-0"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1);
              }}
              autoComplete="off"
              spellCheck={false}
            />
          </InputGroup>
        </Form.Group>

        <div style={{ fontSize: "1.1rem", fontWeight: "500" }} className="d-flex align-items-center">
          <FaRunning size={20} className="me-2 text-success" />
          Rutinas activas: {rutinasActivas}
        </div>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Día</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rutinasPaginadas.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.dia}</td>
              <td>{r.descripcion}</td>
              <td>
                <span className={`badge ${r.estado === 1 ? "bg-success" : "bg-secondary"}`}>
                  {r.estado === 1 ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => seleccionar(r)}
                  title="Editar"
                  disabled={r.estado === 0}
                >
                  <BiEdit size={22} />
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => confirmarEliminacion(r.id)}
                  title="Desactivar"
                  disabled={r.estado === 0}
                >
                  <BiBlock size={22} />
                </Button>
              </td>
            </tr>
          ))}
          {rutinasPaginadas.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center">
                No hay rutinas que mostrar.
              </td>
            </tr>
          )}
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

export default RutinaList;

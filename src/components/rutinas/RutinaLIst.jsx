import React, { useState } from "react";
import { Table, Button, Pagination, Form, InputGroup, Card, Badge } from "react-bootstrap";
import Swal from "sweetalert2";
import { BiEdit, BiBlock } from "react-icons/bi";
import { FaRunning, FaSearch } from "react-icons/fa";

const RutinaList = ({ rutinas, seleccionar, eliminar }) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const elementosPorPagina = 5;

  const rutinasFiltradas = rutinas.filter((r) => {
    const texto = busqueda.toLowerCase();
    return (
      r.dia.toLowerCase().includes(texto) ||
      r.descripcion.toLowerCase().includes(texto) ||
      r.id_user.toString().includes(texto)
    );
  });

  const rutinasOrdenadas = [...rutinasFiltradas].sort((a, b) => b.id - a.id);

  const totalPaginas = Math.ceil(rutinasOrdenadas.length / elementosPorPagina);
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const rutinasPaginadas = rutinasOrdenadas.slice(indiceInicio, indiceInicio + elementosPorPagina);

  const rutinasActivas = rutinas.filter((r) => r.estado === 1).length;
  const rutinasInactivas = rutinas.filter((r) => r.estado === 0).length;

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

    if (paginaActual <= 2) fin = Math.min(5, totalPaginas);
    else if (paginaActual >= totalPaginas - 1) inicio = Math.max(totalPaginas - 4, 1);

    for (let i = inicio; i <= fin; i++) {
      paginas.push(
        <Pagination.Item
          key={i}
          active={i === paginaActual}
          onClick={() => setPaginaActual(i)}
          className="mx-1 rounded"
        >
          {i}
        </Pagination.Item>
      );
    }

    return paginas;
  };

  return (
    <div className="p-4 bg-white rounded">
      {/* Estadísticas */}
      <div className="d-flex gap-3 mb-4 flex-wrap">
        <Card className="border-0 bg-primary bg-opacity-10 flex-grow-1">
          <Card.Body className="py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Card.Title className="text-primary fw-bold mb-1">TOTAL</Card.Title>
                <h2 className="mb-0 fw-bold display-6">{rutinas.length}</h2>
              </div>
              <div className="bg-primary text-white rounded-circle p-3">
                <FaRunning size={24} />
              </div>
            </div>
            <small className="text-muted">Rutinas registradas</small>
          </Card.Body>
        </Card>
        
        <Card className="border-0 bg-success bg-opacity-10 flex-grow-1">
          <Card.Body className="py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Card.Title className="text-success fw-bold mb-1">ACTIVAS</Card.Title>
                <h2 className="mb-0 fw-bold display-6">{rutinasActivas}</h2>
              </div>
              <div className="bg-success text-white rounded-circle p-3">
                <FaRunning size={24} />
              </div>
            </div>
            <small className="text-muted">Rutinas activas</small>
          </Card.Body>
        </Card>
        
        <Card className="border-0 bg-secondary bg-opacity-10 flex-grow-1">
          <Card.Body className="py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Card.Title className="text-secondary fw-bold mb-1">INACTIVAS</Card.Title>
                <h2 className="mb-0 fw-bold display-6">{rutinasInactivas}</h2>
              </div>
              <div className="bg-secondary text-white rounded-circle p-3">
                <FaRunning size={24} />
              </div>
            </div>
            <small className="text-muted">Rutinas inactivas</small>
          </Card.Body>
        </Card>
      </div>

      {/* Buscador */}
      <div className="d-flex justify-content-between align-items-center mb-4 bg-light p-3 rounded">
        <div className="d-flex gap-2 flex-wrap w-100">
          <Form.Group className="mb-0 flex-grow-1" style={{ maxWidth: "500px" }}>
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0">
                <FaSearch className="text-primary" />
              </InputGroup.Text>
              <Form.Control
                type="search"
                placeholder="Buscar por día, descripción o ID user..."
                className="border-start-0"
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setPaginaActual(1);
                }}
                autoComplete="off"
              />
            </InputGroup>
          </Form.Group>
          
          <div className="d-flex align-items-center text-success fw-bold">
            <FaRunning size={20} className="me-2" />
            Activas: {rutinasActivas}
          </div>
        </div>
      </div>

      {/* Tabla */}
      <Card className="border-0 shadow-sm mb-4">
        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead className="bg-primary text-white">
              <tr>
                <th className="fw-bold">ID</th>
                <th className="fw-bold">DÍA</th>
                <th className="fw-bold">DESCRIPCIÓN</th>
                <th className="fw-bold">ESTADO</th>
                <th className="fw-bold text-center">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {rutinasPaginadas.length > 0 ? (
                rutinasPaginadas.map((r) => (
                  <tr key={r.id} className={r.estado === 0 ? "text-muted" : ""}>
                    <td className="fw-bold">{r.id}</td>
                    <td className="fw-medium">{r.dia}</td>
                    <td className="fw-medium">{r.descripcion}</td>
                    <td>
                      <Badge 
                        pill 
                        className={r.estado === 1 ? "bg-success" : "bg-secondary"}
                      >
                        {r.estado === 1 ? "ACTIVA" : "INACTIVA"}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          variant={r.estado === 1 ? "primary" : "secondary"}
                          onClick={() => seleccionar(r)}
                          title="Editar"
                          disabled={r.estado === 0}
                          className="d-flex align-items-center"
                        >
                          <BiEdit className="me-1" /> Editar
                        </Button>
                        <Button
                          variant={r.estado === 1 ? "danger" : "secondary"}
                          onClick={() => confirmarEliminacion(r.id)}
                          title="Desactivar"
                          disabled={r.estado === 0}
                          className="d-flex align-items-center"
                        >
                          <BiBlock className="me-1" /> Desactivar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    <div className="bg-light rounded-circle d-inline-block p-3 mb-2">
                      <FaSearch size={30} className="text-primary" />
                    </div>
                    <h5 className="text-primary fw-bold">No se encontraron rutinas</h5>
                    <p className="text-muted">Ajusta tu búsqueda</p>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Paginación */}
      {rutinasFiltradas.length > 0 && (
        <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded">
          <div className="text-muted fw-medium">
            Página <span className="text-primary fw-bold">{paginaActual}</span> de 
            <span className="text-primary fw-bold"> {totalPaginas}</span>
          </div>
          
          <Pagination className="mb-0">
            <Pagination.First 
              onClick={irPrimeraPagina} 
              disabled={paginaActual === 1} 
              className="rounded"
            />
            <Pagination.Prev 
              onClick={irAnterior} 
              disabled={paginaActual === 1} 
              className="rounded mx-1"
            />
            {obtenerItemsPaginacion()}
            <Pagination.Next 
              onClick={irSiguiente} 
              disabled={paginaActual === totalPaginas} 
              className="rounded mx-1"
            />
            <Pagination.Last 
              onClick={irUltimaPagina} 
              disabled={paginaActual === totalPaginas} 
              className="rounded"
            />
          </Pagination>
          
          <div className="text-muted fw-medium">
            Registros: <span className="text-primary fw-bold">{rutinasOrdenadas.length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RutinaList;
import React, { useState } from "react";
import { Table, Button, Form, Badge, Card, Pagination } from "react-bootstrap";
import Swal from "sweetalert2";
import { BiEdit, BiBlock, BiSearch } from "react-icons/bi";
import { FaUserCheck } from "react-icons/fa";

const EntrenadorList = ({ entrenadores, seleccionar, eliminar }) => {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtrar entrenadores según búsqueda y estado
  const entrenadoresFiltrados = entrenadores.filter((entrenador) => {
    const texto = busqueda.toLowerCase();
    const coincideBusqueda = 
      entrenador.nombre.toLowerCase().includes(texto) ||
      entrenador.apellido.toLowerCase().includes(texto) ||
      entrenador.telefono.toLowerCase().includes(texto) ||
      entrenador.correo.toLowerCase().includes(texto) ||
      entrenador.direccion.toLowerCase().includes(texto);
    
    const coincideEstado = filtroEstado === "todos" || 
      (filtroEstado === "activos" && entrenador.estado === 1) ||
      (filtroEstado === "inactivos" && entrenador.estado === 0);
    
    return coincideBusqueda && coincideEstado;
  });

  // Ordenar por ID descendente
  const entrenadoresOrdenados = [...entrenadoresFiltrados].sort((a, b) => b.id - a.id);

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = entrenadoresOrdenados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(entrenadoresOrdenados.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Estadísticas
  const entrenadoresActivos = entrenadores.filter(entrenador => entrenador.estado === 1).length;
  const entrenadoresInactivos = entrenadores.filter(entrenador => entrenador.estado === 0).length;

  // Confirmar deshabilitación
  const confirmarEliminacion = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Esto deshabilitará al entrenador y no podrá revertirse fácilmente!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, deshabilitar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminar(id);
        Swal.fire({
          title: "¡Deshabilitado!",
          text: "El entrenador ha sido deshabilitado.",
          icon: "success",
          confirmButtonColor: "#0d6efd",
        }).then(() => {
          const boton = document.querySelector("button");
          if (boton) boton.focus();
        });
      }
    });
  };

  // Estilos para tarjetas interactivas
  const cardStyle = (cardType) => ({
    transform: hoveredCard === cardType ? 'translateY(-8px)' : 'translateY(0)',
    boxShadow: hoveredCard === cardType ? '0 12px 20px rgba(0,0,0,0.15)' : '0 4px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    border: 'none',
    overflow: 'hidden',
    position: 'relative',
    zIndex: hoveredCard === cardType ? 2 : 1,
  });

  return (
    <div className="p-4 bg-white rounded-3 shadow-sm">
      {/* Tarjetas de estadísticas interactivas */}
      <div className="d-flex gap-3 mb-4 flex-wrap">
        <Card 
          className="border-0 bg-primary bg-opacity-10 flex-grow-1"
          style={cardStyle('total')}
          onMouseEnter={() => setHoveredCard('total')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <Card.Body className="py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Card.Title className="text-primary fw-bold mb-1 fs-5">TOTAL</Card.Title>
                <h2 className="mb-0 fw-bold display-6">{entrenadores.length}</h2>
              </div>
              <div className="bg-primary text-white rounded-circle p-3">
                <FaUserCheck size={24} />
              </div>
            </div>
            <small className="text-muted">Entrenadores registrados</small>
          </Card.Body>
          <div className="position-absolute bottom-0 start-0 end-0 bg-primary bg-opacity-20" style={{ height: '4px' }}></div>
        </Card>
        
        <Card 
          className="border-0 bg-success bg-opacity-10 flex-grow-1"
          style={cardStyle('activos')}
          onMouseEnter={() => setHoveredCard('activos')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <Card.Body className="py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Card.Title className="text-success fw-bold mb-1 fs-5">ACTIVOS</Card.Title>
                <h2 className="mb-0 fw-bold display-6">{entrenadoresActivos}</h2>
              </div>
              <div className="bg-success text-white rounded-circle p-3">
                <FaUserCheck size={24} />
              </div>
            </div>
            <small className="text-muted">Entrenadores activos</small>
          </Card.Body>
          <div className="position-absolute bottom-0 start-0 end-0 bg-success bg-opacity-20" style={{ height: '4px' }}></div>
        </Card>
        
        <Card 
          className="border-0 bg-secondary bg-opacity-10 flex-grow-1"
          style={cardStyle('inactivos')}
          onMouseEnter={() => setHoveredCard('inactivos')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <Card.Body className="py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Card.Title className="text-secondary fw-bold mb-1 fs-5">INACTIVOS</Card.Title>
                <h2 className="mb-0 fw-bold display-6">{entrenadoresInactivos}</h2>
              </div>
              <div className="bg-secondary text-white rounded-circle p-3">
                <FaUserCheck size={24} />
              </div>
            </div>
            <small className="text-muted">Entrenadores inactivos</small>
          </Card.Body>
          <div className="position-absolute bottom-0 start-0 end-0 bg-secondary bg-opacity-20" style={{ height: '4px' }}></div>
        </Card>
      </div>

      {/* Filtros y buscador compacto */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3 bg-light p-3 rounded shadow-sm">
        <div className="d-flex gap-2 flex-wrap align-items-center">
          <div className="position-relative">
            <Form.Control
              type="text"
              placeholder="Buscar entrenadores..."
              className="ps-4 py-2 rounded-pill"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setCurrentPage(1);
              }}
              autoComplete="off"
              spellCheck={false}
              style={{ height: "38px", width: "250px" }}
            />
            <BiSearch 
              className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" 
              size={18} 
              style={{ zIndex: 10 }}
            />
          </div>
          
          <Form.Select 
            value={filtroEstado} 
            onChange={(e) => {
              setFiltroEstado(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white border-1 rounded-pill"
            style={{ height: "38px", width: "180px" }}
          >
            <option value="todos">Todos los estados</option>
            <option value="activos">Solo activos</option>
            <option value="inactivos">Solo inactivos</option>
          </Form.Select>
        </div>
        
        <div className="text-muted fw-medium">
          Mostrando <span className="text-primary fw-bold">{entrenadoresOrdenados.length}</span> de 
          <span className="text-primary fw-bold"> {entrenadores.length}</span> entrenadores
        </div>
      </div>

      {/* Tabla de entrenadores */}
      <Card className="border-0 shadow-sm mb-3">
        <div className="table-responsive" style={{ maxHeight: "600px", overflowY: "auto" }}>
          <Table hover className="mb-0" style={{ fontSize: "0.95rem" }}>
            <thead className="bg-primary text-white" style={{ position: "sticky", top: 0, zIndex: 1 }}>
              <tr>
                <th className="fw-bold">ID</th>
                <th className="fw-bold">NOMBRE</th>
                <th className="fw-bold">APELLIDO</th>
                <th className="fw-bold">TELÉFONO</th>
                <th className="fw-bold">CORREO</th>
                <th className="fw-bold">DIRECCIÓN</th>
                <th className="fw-bold">ESTADO</th>
                <th className="fw-bold text-center">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((entrenador) => (
                  <tr key={entrenador.id} className={entrenador.estado === 0 ? "text-muted bg-light" : ""}>
                    <td className="fw-bold fs-6 align-middle">{entrenador.id}</td>
                    <td className="fw-medium align-middle">{entrenador.nombre}</td>
                    <td className="fw-medium align-middle">{entrenador.apellido}</td>
                    <td className="fw-medium align-middle">{entrenador.telefono}</td>
                    <td className="fw-medium align-middle">{entrenador.correo}</td>
                    <td className="fw-medium align-middle">{entrenador.direccion}</td>
                    <td className="align-middle">
                      <Badge 
                        pill 
                        className={entrenador.estado === 1 ? "bg-success fs-6" : "bg-secondary fs-6"}
                      >
                        {entrenador.estado === 1 ? "ACTIVO" : "INACTIVO"}
                      </Badge>
                    </td>
                    <td className="align-middle text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <Button 
                          variant="outline-primary" 
                          onClick={() => seleccionar(entrenador)} 
                          title="Editar" 
                          disabled={entrenador.estado === 0}
                          className="d-flex align-items-center justify-content-center p-2 rounded-circle"
                          style={{ width: "38px", height: "38px" }}
                        >
                          <BiEdit size={20} />
                        </Button>
                        
                        <Button 
                          variant={entrenador.estado === 1 ? "outline-danger" : "outline-secondary"}
                          onClick={() => entrenador.estado === 1 ? confirmarEliminacion(entrenador.id) : null}
                          title={entrenador.estado === 1 ? "Deshabilitar" : "Ya deshabilitado"}
                          className="d-flex align-items-center justify-content-center p-2 rounded-circle"
                          style={{ width: "38px", height: "38px" }}
                          disabled={entrenador.estado === 0}
                        >
                          <BiBlock size={20} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    <div className="d-flex flex-column align-items-center justify-content-center">
                      <div className="bg-light rounded-circle p-4 mb-3">
                        <BiSearch size={40} className="text-primary" />
                      </div>
                      <h5 className="text-primary fw-bold">No se encontraron entrenadores</h5>
                      <p className="text-muted mb-0">Ajusta tus filtros de búsqueda</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Paginación */}
      {entrenadoresOrdenados.length > 0 && (
        <div className="d-flex justify-content-center">
          <Pagination>
            <Pagination.First 
              onClick={() => paginate(1)} 
              disabled={currentPage === 1} 
            />
            <Pagination.Prev 
              onClick={() => paginate(currentPage - 1)} 
              disabled={currentPage === 1} 
            />
            
            {Array.from({ length: totalPages }, (_, i) => {
              // Mostrar solo algunas páginas alrededor de la actual para no saturar
              if (
                i === 0 || 
                i === totalPages - 1 || 
                (i >= currentPage - 2 && i <= currentPage + 2)
              ) {
                return (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => paginate(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                );
              } else if (i === currentPage - 3 || i === currentPage + 3) {
                return <Pagination.Ellipsis key={i} />;
              }
              return null;
            })}
            
            <Pagination.Next 
              onClick={() => paginate(currentPage + 1)} 
              disabled={currentPage === totalPages} 
            />
            <Pagination.Last 
              onClick={() => paginate(totalPages)} 
              disabled={currentPage === totalPages} 
            />
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default EntrenadorList;
import React, { useState } from "react";
import { Table, Button, Form, Badge, Card, Pagination } from "react-bootstrap";
import Swal from "sweetalert2";
import { BiEdit, BiBlock, BiSearch } from "react-icons/bi";
import { FaUserCheck } from "react-icons/fa";

const UsuarioList = ({ usuarios, seleccionar, eliminar }) => {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroRol, setFiltroRol] = useState("todos");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Filtrar usuarios según búsqueda, estado y rol
  const usuariosFiltrados = usuarios.filter((usuario) => {
    const texto = busqueda.toLowerCase();
    const coincideBusqueda = 
      usuario.id.toString().includes(texto) ||
      usuario.usuario.toLowerCase().includes(texto) ||
      usuario.nombre.toLowerCase().includes(texto) ||
      usuario.correo.toLowerCase().includes(texto) ||
      usuario.telefono.toLowerCase().includes(texto);
    
    const coincideEstado = filtroEstado === "todos" || 
      (filtroEstado === "activos" && usuario.estado === 1) ||
      (filtroEstado === "inactivos" && usuario.estado === 0);
    
const coincideRol = filtroRol === "todos" || 
  (filtroRol === "admin" && String(usuario.rol) === "1") ||
  (filtroRol === "empleado" && String(usuario.rol) === "2");

    
    return coincideBusqueda && coincideEstado && coincideRol;
  });

  // Ordenar por ID descendente
  const usuariosOrdenados = [...usuariosFiltrados].sort((a, b) => b.id - a.id);

  // Paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = usuariosOrdenados.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(usuariosOrdenados.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Estadísticas
  const usuariosActivos = usuarios.filter(usuario => usuario.estado === 1).length;
  const usuariosInactivos = usuarios.filter(usuario => usuario.estado === 0).length;
const admins = usuarios.filter(usuario => Number(usuario.rol) === 1 && Number(usuario.estado) === 1).length;
const empleados = usuarios.filter(usuario => Number(usuario.rol) === 2 && Number(usuario.estado) === 1).length;


  // Confirmar deshabilitación
  const confirmarEliminacion = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡El usuario será deshabilitado y no podrá acceder al sistema!",
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
          text: "El usuario ha sido deshabilitado.",
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
                <h2 className="mb-0 fw-bold display-6">{usuarios.length}</h2>
              </div>
              <div className="bg-primary text-white rounded-circle p-3">
                <FaUserCheck size={24} />
              </div>
            </div>
            <small className="text-muted">Usuarios registrados</small>
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
                <h2 className="mb-0 fw-bold display-6">{usuariosActivos}</h2>
              </div>
              <div className="bg-success text-white rounded-circle p-3">
                <FaUserCheck size={24} />
              </div>
            </div>
            <small className="text-muted">Usuarios activos</small>
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
                <h2 className="mb-0 fw-bold display-6">{usuariosInactivos}</h2>
              </div>
              <div className="bg-secondary text-white rounded-circle p-3">
                <FaUserCheck size={24} />
              </div>
            </div>
            <small className="text-muted">Usuarios inactivos</small>
          </Card.Body>
          <div className="position-absolute bottom-0 start-0 end-0 bg-secondary bg-opacity-20" style={{ height: '4px' }}></div>
        </Card>

        <Card 
          className="border-0 bg-warning bg-opacity-10 flex-grow-1"
          style={cardStyle('roles')}
          onMouseEnter={() => setHoveredCard('roles')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <Card.Body className="py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Card.Title className="text-warning fw-bold mb-1 fs-5">ROLES</Card.Title>
                <div className="d-flex gap-2">
                  <span className="badge bg-danger">{admins} Admin</span>
                  <span className="badge bg-info">{empleados} Empleado</span>
                </div>
              </div>
              <div className="bg-warning text-white rounded-circle p-3">
                <FaUserCheck size={24} />
              </div>
            </div>
            <small className="text-muted">Distribución de roles</small>
          </Card.Body>
          <div className="position-absolute bottom-0 start-0 end-0 bg-warning bg-opacity-20" style={{ height: '4px' }}></div>
        </Card>
      </div>

      {/* Filtros y buscador compacto */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3 bg-light p-3 rounded shadow-sm">
        <div className="d-flex gap-2 flex-wrap align-items-center">
          <div className="position-relative">
            <Form.Control
              type="text"
              placeholder="Buscar usuarios..."
              className="ps-4 py-2 rounded-pill"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
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
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="bg-white border-1 rounded-pill"
            style={{ height: "38px", width: "180px" }}
          >
            <option value="todos">Todos los estados</option>
            <option value="activos">Solo activos</option>
            <option value="inactivos">Solo inactivos</option>
          </Form.Select>

          <Form.Select 
            value={filtroRol} 
            onChange={(e) => setFiltroRol(e.target.value)}
            className="bg-white border-1 rounded-pill"
            style={{ height: "38px", width: "180px" }}
          >
            <option value="todos">Todos los roles</option>
            <option value="admin">Solo administradores</option>
            <option value="empleado">Solo empleados</option>
          </Form.Select>
        </div>
        
        <div className="text-muted fw-medium">
          Mostrando <span className="text-primary fw-bold">{usuariosOrdenados.length}</span> de 
          <span className="text-primary fw-bold"> {usuarios.length}</span> usuarios
        </div>
      </div>

      {/* Tabla de usuarios */}
      <Card className="border-0 shadow-sm mb-3">
        <div className="table-responsive" style={{ maxHeight: "600px", overflowY: "auto" }}>
          <Table hover className="mb-0" style={{ fontSize: "0.95rem" }}>
            <thead className="bg-primary text-white" style={{ position: "sticky", top: 0, zIndex: 1 }}>
              <tr>
                <th className="fw-bold">ID</th>
                <th className="fw-bold">USUARIO</th>
                <th className="fw-bold">NOMBRE</th>
                <th className="fw-bold">CORREO</th>
                <th className="fw-bold">TELÉFONO</th>
                <th className="fw-bold">ROL</th>
                <th className="fw-bold">FECHA REGISTRO</th>
                <th className="fw-bold">ESTADO</th>
                <th className="fw-bold text-center">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((usuario) => (
                  <tr key={usuario.id} className={usuario.estado === 0 ? "text-muted bg-light" : ""}>
                    <td className="fw-bold fs-6 align-middle">{usuario.id}</td>
                    <td className="fw-medium align-middle">{usuario.usuario}</td>
                    <td className="align-middle">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2 d-flex align-items-center justify-content-center">
                          <FaUserCheck className="text-primary" size={16} />
                        </div>
                        <span className="fw-medium">{usuario.nombre}</span>
                      </div>
                    </td>
                    <td className="fw-medium align-middle">{usuario.correo}</td>
                    <td className="fw-medium align-middle">{usuario.telefono}</td>
                    <td className="align-middle">
                      <Badge 
                        pill 
                        className={
                          usuario.rol === 1 || usuario.rol === "1" 
                            ? "bg-danger fs-6" 
                            : usuario.rol === 2 || usuario.rol === "2"
                            ? "bg-info fs-6"
                            : "bg-secondary fs-6" // Para roles no definidos
                        }
                      >
                        {usuario.rol === 1 || usuario.rol === "1" 
                          ? "ADMIN" 
                          : usuario.rol === 2 || usuario.rol === "2"
                          ? "EMPLEADO"
                          : "SIN ROL"}
                      </Badge>
                    </td>
                    <td className="fw-medium align-middle">{new Date(usuario.fecha).toLocaleDateString()}</td>
                    <td className="align-middle">
                      <Badge 
                        pill 
                        className={usuario.estado === 1 ? "bg-success fs-6" : "bg-secondary fs-6"}
                      >
                        {usuario.estado === 1 ? "ACTIVO" : "INACTIVO"}
                      </Badge>
                    </td>
                    <td className="align-middle text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <Button 
                          variant="outline-primary" 
                          onClick={() => seleccionar(usuario)} 
                          title="Editar" 
                          disabled={usuario.estado === 0}
                          className="d-flex align-items-center justify-content-center p-2 rounded-circle"
                          style={{ width: "38px", height: "38px" }}
                        >
                          <BiEdit size={20} />
                        </Button>
                        
                        <Button 
                          variant={usuario.estado === 1 ? "outline-danger" : "outline-secondary"}
                          onClick={() => usuario.estado === 1 ? confirmarEliminacion(usuario.id) : null}
                          title={usuario.estado === 1 ? "Deshabilitar" : "Ya deshabilitado"}
                          className="d-flex align-items-center justify-content-center p-2 rounded-circle"
                          style={{ width: "38px", height: "38px" }}
                          disabled={usuario.estado === 0}
                        >
                          <BiBlock size={20} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-5">
                    <div className="d-flex flex-column align-items-center justify-content-center">
                      <div className="bg-light rounded-circle p-4 mb-3">
                        <BiSearch size={40} className="text-primary" />
                      </div>
                      <h5 className="text-primary fw-bold">No se encontraron usuarios</h5>
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
      {usuariosOrdenados.length > 0 && (
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

export default UsuarioList;
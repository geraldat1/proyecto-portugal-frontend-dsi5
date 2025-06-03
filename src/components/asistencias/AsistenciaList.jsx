import React, { useState } from "react";
import { Table, Button, Pagination, Form, Card } from "react-bootstrap";
import { FaCheck, FaSearch, FaCalendarAlt, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

const AsistenciaList = ({ asistencias, seleccionar, entrenadores, detallesPlanes, clientes }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [fecha, setFecha] = useState("");
  const [asistenciasActualizadas, setAsistenciasActualizadas] = useState(new Set());

  const elementosPorPagina = 5;

const obtenerNombreEntrenador = (id_entrenador) => {
  const entrenador = entrenadores.find(e => e.id === id_entrenador);
  return entrenador ? `${entrenador.nombre} ${entrenador.apellido}` : "Desconocido";
};


  const obtenerNombreClientePorDetalle = (id_detalle) => {
    const detalle = detallesPlanes.find(d => String(d.id) === String(id_detalle));
    if (!detalle) return "Detalle desconocido";
    const cliente = clientes.find(c => String(c.id) === String(detalle.id_cliente));
    return cliente ? cliente.nombre : "Cliente desconocido";
  };

  const manejarSeleccion = async (asistencia) => {
    try {
      const exito = await seleccionar(asistencia);
      if (exito) {
        setAsistenciasActualizadas(prev => new Set(prev).add(asistencia.id_asistencia));
        Swal.fire({
          title: "¡Asistencia registrada!",
          text: "La salida del cliente ha sido registrada correctamente.",
          icon: "success",
          confirmButtonColor: "#0d6efd",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al registrar la asistencia.",
        icon: "error",
        confirmButtonColor: "#dc3545",
      });
      console.error("Error al actualizar asistencia:", error);
    }
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setFecha("");
    setCurrentPage(1);
  };

const asistenciasFiltradas = asistencias.filter((a) => {
  const clienteNombre = obtenerNombreClientePorDetalle(a.id_detalle).toLowerCase();
  const entrenadorNombre = obtenerNombreEntrenador(a.id_entrenador).toLowerCase();
  const filtroBusqueda = busqueda.toLowerCase();

  const coincideBusqueda = clienteNombre.includes(filtroBusqueda) || entrenadorNombre.includes(filtroBusqueda);

  if (!fecha) return coincideBusqueda;

  const fechaAsistencia = new Date(a.fecha);
  const fechaFiltro = new Date(fecha + "T00:00:00");

  // Normalizamos ambas fechas a medianoche local para evitar desfases
  const mismaFecha = fechaAsistencia.toISOString().slice(0, 10) === fechaFiltro.toISOString().slice(0, 10);

  return coincideBusqueda && mismaFecha;
});


  const asistenciasOrdenadas = [...asistenciasFiltradas].sort((a, b) => b.id_asistencia - a.id_asistencia);

  // Paginación
  const indexOfLastItem = currentPage * elementosPorPagina;
  const indexOfFirstItem = indexOfLastItem - elementosPorPagina;
  const currentItems = asistenciasOrdenadas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(asistenciasOrdenadas.length / elementosPorPagina);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4 bg-white rounded-3 shadow-sm">
      {/* Filtros y buscador */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3 bg-light p-3 rounded shadow-sm">
        <div className="d-flex gap-2 flex-wrap align-items-center">
          <div className="position-relative">
            <Form.Control
              type="text"
              placeholder="Buscar por cliente o entrenador..."
              className="ps-4 py-2 rounded-pill"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setCurrentPage(1);
              }}
              autoComplete="off"
              spellCheck={false}
              style={{ height: "38px", width: "300px" }}
            />
            <FaSearch 
              className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" 
              size={16} 
              style={{ zIndex: 10 }}
            />
          </div>
          
          <div className="d-flex align-items-center gap-2 bg-white rounded-pill px-3" style={{ height: "38px" }}>
            <FaCalendarAlt className="text-secondary" />
            <Form.Control
              type="date"
              className="border-0 ps-0"
              value={fecha}
              onChange={(e) => {
                setFecha(e.target.value);
                setCurrentPage(1);
              }}
              style={{ width: "150px" }}
            />
          </div>

          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => {
              const hoy = new Date();
              const fechaLocal = hoy.toLocaleDateString('es-PE', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              });
              const [day, month, year] = fechaLocal.split('/');
              const fechaHoy = `${year}-${month}-${day}`;
              setFecha(fechaHoy);
              setCurrentPage(1);
            }}
            className="rounded-pill"
          >
            Hoy
          </Button>

          {(busqueda || fecha) && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={limpiarFiltros}
              className="rounded-pill d-flex align-items-center gap-1"
            >
              <FaTimes size={12} />
              Limpiar
            </Button>
          )}
        </div>
        
        <div className="text-muted fw-medium">
          Mostrando <span className="text-primary fw-bold">{asistenciasOrdenadas.length}</span> de 
          <span className="text-primary fw-bold"> {asistencias.length}</span> asistencias
        </div>
      </div>

      {/* Tabla de asistencias */}
      <Card className="border-0 shadow-sm mb-3">
        <div className="table-responsive" style={{ maxHeight: "600px", overflowY: "auto" }}>
          <Table hover className="mb-0" style={{ fontSize: "0.95rem" }}>
            <thead className="bg-primary text-white" style={{ position: "sticky", top: 0, zIndex: 1 }}>
              <tr>
                <th className="fw-bold">ID</th>
                <th className="fw-bold">FECHA</th>
                <th className="fw-bold">HORA ENTRADA</th>
                <th className="fw-bold">HORA SALIDA</th>
                <th className="fw-bold">CLIENTE</th>
                <th className="fw-bold">ENTRENADOR</th>
                <th className="fw-bold">ESTADO</th>
                <th className="fw-bold text-center">ACCIÓN</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((asistencia) => (
                  <tr key={asistencia.id_asistencia} className={asistencia.estado === 0 ? "text-muted bg-light" : ""}>
                    <td className="fw-bold fs-6 align-middle">{asistencia.id_asistencia}</td>
                    <td className="fw-medium align-middle">{new Date(asistencia.fecha).toLocaleDateString()}</td>
                    <td className="fw-medium align-middle">{asistencia.hora_entrada}</td>
                    <td className="fw-medium align-middle">{asistencia.hora_salida || "-"}</td>
                    <td className="fw-medium align-middle">{obtenerNombreClientePorDetalle(asistencia.id_detalle)}</td>
                    <td className="fw-medium align-middle">{obtenerNombreEntrenador(asistencia.id_entrenador)}</td>
                    <td className="align-middle">
                      <span className={`badge rounded-pill ${asistencia.estado === 1 ? "bg-success" : "bg-secondary"}`}>
                        {asistencia.estado === 1 ? "EN GIMNASIO" : "SALIDO"}
                      </span>
                    </td>
                    <td className="align-middle text-center">
                      <Button
                        variant={asistencia.estado === 1 ? "success" : "outline-secondary"}
                        onClick={() => asistencia.estado === 1 && manejarSeleccion(asistencia)}
                        disabled={asistenciasActualizadas.has(asistencia.id_asistencia) || asistencia.estado === 0}
                        className="d-flex align-items-center justify-content-center p-2 rounded-circle"
                        style={{ width: "38px", height: "38px" }}
                        title={asistencia.estado === 1 ? "Registrar salida" : "Salida ya registrada"}
                      >
                        <FaCheck size={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    <div className="d-flex flex-column align-items-center justify-content-center">
                      <div className="bg-light rounded-circle p-4 mb-3">
                        <FaSearch size={40} className="text-primary" />
                      </div>
                      <h5 className="text-primary fw-bold">No se encontraron asistencias</h5>
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
      {asistenciasOrdenadas.length > 0 && (
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

export default AsistenciaList;
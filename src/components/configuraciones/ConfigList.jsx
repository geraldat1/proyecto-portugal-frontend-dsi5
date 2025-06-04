import React, { useState } from "react";
import { Button, Pagination, Card, Row, Col, Badge } from "react-bootstrap";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaBuilding, FaEnvelope, FaPhone, FaMapMarkerAlt, FaComment, FaImage, FaChartLine } from "react-icons/fa";

const ConfigList = ({ configuraciones, seleccionar, eliminar }) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  const totalPaginas = Math.ceil(configuraciones.length / elementosPorPagina);
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFinal = indiceInicio + elementosPorPagina;
  const configuracionesPaginadas = configuraciones.slice(indiceInicio, indiceFinal);

  const confirmarEliminacion = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d9534f",
      cancelButtonColor: "#5bc0de",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      backdrop: "rgba(0,0,0,0.4)"
    }).then((result) => {
      if (result.isConfirmed) {
        eliminar(id);
        Swal.fire({
          title: "¡Eliminado!",
          text: "El registro ha sido eliminado.",
          icon: "success",
          confirmButtonColor: "#5cb85c"
        });
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
          className="border-0"
        >
          {i}
        </Pagination.Item>
      );
    }

    return paginas;
  };

  return (
    <div className="p-3">
      {configuraciones.length === 0 ? (
        <Card className="text-center py-5 border-0 shadow-sm">
          <Card.Body>
            <h4 className="text-muted">No hay configuraciones disponibles</h4>
            <p className="text-muted mt-3">Comience agregando una nueva configuración</p>
          </Card.Body>
        </Card>
      ) : (
        <>
          {configuracionesPaginadas.map((p) => (
            <Card key={p.id} className="mb-4 border-0 shadow-sm" style={{ borderRadius: '10px', overflow: 'hidden' }}>
              <Card.Header className="py-3" style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #eaeaea' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-0 d-flex align-items-center">
                      <FaBuilding className="me-2" style={{ color: '#3498db' }} />
                      {p.nombre}
                    </h5>
                    <Badge bg="secondary" className="mt-1">{p.ruc}</Badge>
                  </div>
                  <div>
                    <Button 
                      variant="outline-primary" 
                      className="me-2" 
                      onClick={() => seleccionar(p)}
                      style={{ minWidth: '90px' }}
                    >
                      <FaEdit className="me-1" /> Editar
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      onClick={() => confirmarEliminacion(p.id)}
                      style={{ minWidth: '90px' }}
                    >
                      <FaTrash className="me-1" /> Eliminar
                    </Button>
                  </div>
                </div>
              </Card.Header>
              
              <Card.Body className="py-4">
                <Row className="g-3">
                  <Col md={6}>
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-light rounded-circle p-2 me-3" style={{ width: '40px', height: '40px' }}>
                        <FaEnvelope style={{ color: '#e74c3c' }} />
                      </div>
                      <div>
                        <small className="text-muted">Correo</small>
                        <p className="mb-0">{p.correo}</p>
                      </div>
                    </div>
                  </Col>
                  
                  <Col md={6}>
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-light rounded-circle p-2 me-3" style={{ width: '40px', height: '40px' }}>
                        <FaPhone style={{ color: '#2ecc71' }} />
                      </div>
                      <div>
                        <small className="text-muted">Teléfono</small>
                        <p className="mb-0">{p.telefono}</p>
                      </div>
                    </div>
                  </Col>
                  
                  <Col md={6}>
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-light rounded-circle p-2 me-3" style={{ width: '40px', height: '40px' }}>
                        <FaMapMarkerAlt style={{ color: '#9b59b6' }} />
                      </div>
                      <div>
                        <small className="text-muted">Dirección</small>
                        <p className="mb-0">{p.direccion}</p>
                      </div>
                    </div>
                  </Col>
                  
                  <Col md={6}>
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-light rounded-circle p-2 me-3" style={{ width: '40px', height: '40px' }}>
                        <FaComment style={{ color: '#f39c12' }} />
                      </div>
                      <div>
                        <small className="text-muted">Mensaje</small>
                        <p className="mb-0">{p.mensaje || 'Sin mensaje'}</p>
                      </div>
                    </div>
                  </Col>
                  
                  <Col md={6}>
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-light rounded-circle p-2 me-3" style={{ width: '40px', height: '40px' }}>
                        <FaImage style={{ color: '#1abc9c' }} />
                      </div>
                      <div>
                        <small className="text-muted">Logo</small>
                        <p className="mb-0">{p.logo || 'No especificado'}</p>
                      </div>
                    </div>
                  </Col>
                  
                  <Col md={6}>
                    <div className="d-flex align-items-center">
                      <div className="bg-light rounded-circle p-2 me-3" style={{ width: '40px', height: '40px' }}>
                        <FaChartLine style={{ color: '#d35400' }} />
                      </div>
                      <div>
                        <small className="text-muted">Límite</small>
                        <p className="mb-0">{p.limite}</p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}

          <div className="d-flex justify-content-center mt-4">
            <Pagination className="rounded-pill shadow-sm">
              <Pagination.First 
                onClick={irPrimeraPagina} 
                disabled={paginaActual === 1} 
                className="border-0"
              />
              <Pagination.Prev 
                onClick={irAnterior} 
                disabled={paginaActual === 1} 
                className="border-0"
              />
              {obtenerItemsPaginacion()}
              <Pagination.Next 
                onClick={irSiguiente} 
                disabled={paginaActual === totalPaginas} 
                className="border-0"
              />
              <Pagination.Last 
                onClick={irUltimaPagina} 
                disabled={paginaActual === totalPaginas} 
                className="border-0"
              />
            </Pagination>
          </div>
          
          <div className="text-center mt-3 text-muted">
            Mostrando {configuracionesPaginadas.length} de {configuraciones.length} configuraciones
          </div>
        </>
      )}
    </div>
  );
};

export default ConfigList;
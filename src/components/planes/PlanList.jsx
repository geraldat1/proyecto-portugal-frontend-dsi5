import React, { useState } from "react";
import { Card, Button, Pagination, Row, Col, Badge } from "react-bootstrap";
import Swal from "sweetalert2";

import { FaEdit, FaTrash } from "react-icons/fa";

const PlanList = ({ planes, seleccionar, eliminar }) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  const totalPaginas = Math.ceil(planes.length / elementosPorPagina);
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFinal = indiceInicio + elementosPorPagina;
  const planesPaginadas = planes.slice(indiceInicio, indiceFinal);

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
      <Row xs={1} md={2} lg={3} className="g-4">
        {planesPaginadas.map((plan) => (
          <Col key={plan.id}>
            <Card className="h-100 shadow-sm border-0" style={{ transition: 'transform 0.2s', borderRadius: '12px' }}>
              {plan.imagen && (
                <div style={{ height: '200px', overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
                  <Card.Img 
                    variant="top" 
                    src={plan.imagen} 
                    alt={plan.plan}
                    style={{ 
                      height: '100%', 
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                </div>
              )}
              
              <Card.Body className="d-flex flex-column p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <Card.Title className="mb-0 fw-bold text-dark" style={{ fontSize: '1.25rem' }}>
                    {plan.plan}
                  </Card.Title>
                  <Badge 
                    bg={plan.estado === 1 ? "success" : "secondary"} 
                    className="ms-2"
                    style={{ fontSize: '0.75rem' }}
                  >
                    {plan.estado === 1 ? "Activo" : "Inactivo"}
                  </Badge>
                </div>

                <Card.Text className="text-muted mb-3" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {plan.descripcion}
                </Card.Text>

                <div className="mb-4 mt-auto">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small">Precio</span>
                    <span className="fw-bold text-primary" style={{ fontSize: '1.5rem' }}>
                      S/ {Number(plan.precio_plan).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">Condición</span>
                    <Badge bg="info" style={{ fontSize: '0.75rem' }}>
                      {plan.condicion}
                    </Badge>
                  </div>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={() => seleccionar(plan)}
                  className="d-flex justify-content-center align-items-center fw-semibold"
                  style={{ borderRadius: '8px', width: '38px', height: '38px', padding: 0 }}
                  aria-label="Editar"
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => confirmarEliminacion(plan.id)}
                  className="d-flex justify-content-center align-items-center fw-semibold"
                  style={{ borderRadius: '8px', width: '38px', height: '38px', padding: 0 }}
                  aria-label="Eliminar"
                >
                  <FaTrash />
                </Button>
              </div>

              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {totalPaginas > 1 && (
        <div className="d-flex justify-content-center mt-5">
          <Pagination className="shadow-sm">
            <Pagination.First 
              onClick={irPrimeraPagina} 
              disabled={paginaActual === 1}
              style={{ borderRadius: '8px 0 0 8px' }}
            />
            <Pagination.Prev 
              onClick={irAnterior} 
              disabled={paginaActual === 1}
            />
            {obtenerItemsPaginacion()}
            <Pagination.Next 
              onClick={irSiguiente} 
              disabled={paginaActual === totalPaginas}
            />
            <Pagination.Last 
              onClick={irUltimaPagina} 
              disabled={paginaActual === totalPaginas}
              style={{ borderRadius: '0 8px 8px 0' }}
            />
          </Pagination>
        </div>
      )}

      <style>{`
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        .card-img-top:hover {
          transform: scale(1.05);
        }
      `}</style>
    </>
  );
};

export default PlanList;
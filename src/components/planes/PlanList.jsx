import React, { useState } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import Swal from "sweetalert2";
import { FaEdit, FaBan} from "react-icons/fa";

const PlanList = ({ planes, seleccionar, eliminar }) => {
  const [paginaActual] = useState(1);
  const elementosPorPagina = 8;

  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFinal = indiceInicio + elementosPorPagina;
  const planesPaginados = planes.slice(indiceInicio, indiceFinal);

 const confirmarEliminacion = (id) => {
  Swal.fire({
    title: "¿Desactivar plan?",
    text: "Este plan será desactivado. ¿Deseas continuar?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#f31260",
    cancelButtonColor: "#006FEE",
    confirmButtonText: "Sí, desactivar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      eliminar(id);
      Swal.fire("¡Desactivado!", "El plan ha sido desactivado.", "success");
    }
  });
};

  return (
    <>
      <style>{`
        .plan-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: all 0.3s ease;
        }
        
        .card-img-container {
          position: relative;
          overflow: hidden;
          border-radius: 10px 10px 0 0;
          aspect-ratio: 16/9;
        }
        
        .card-img-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .card-body-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        @media (max-width: 576px) {
          .plan-card {
            min-width: 100%;
          }
        }
        
        @media (min-width: 577px) and (max-width: 768px) {
          .plan-card {
            min-width: 100%;
          }
        }
      `}</style>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {planesPaginados.map((plan) => (
          <div key={plan.id} className="col d-flex">
            <Card 
              className="plan-card h-100 overflow-hidden"
              style={{ 
                border: '1px solid rgba(226, 232, 240, 0.8)',
                borderRadius: '12px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.03)',
                cursor: 'pointer',
              }}
            >
              {plan.imagen && (
                <div className="card-img-container">
                  <div className="position-absolute w-100 h-100"
                    style={{ 
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 60%)',
                      zIndex: 1,
                    }}>
                  </div>
                  <Card.Img 
                    variant="top" 
                    src={plan.imagen} 
                    alt={plan.plan}
                  />
                </div>
              )}
              
              <Card.Body className="p-3 card-body-content">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="card-title mb-0 fw-bold text-truncate">
                    {plan.plan}
                  </h5>
                  <Badge bg={plan.estado === 1 ? "success" : "secondary"} className="ms-2 px-2 py-1">
                    {plan.estado === 1 ? "Activo" : "Inactivo"}
                  </Badge>
                </div>

                <p className="text-muted mb-3" style={{ fontSize: '0.8rem', lineHeight: '1.5' }}>
                  {plan.descripcion}
                </p>

                <div className="mt-auto space-y-2 border-top pt-2" style={{ borderColor: 'rgba(226, 232, 240, 0.7)' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                      Precio
                    </span>
                    <span className="badge bg-primary bg-opacity-10 text-primary fw-bold px-2 py-1 rounded-pill">
                      S/ {Number(plan.precio_plan).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                      Condición
                    </span>
                    <Badge bg="light" text="dark" className="px-2 py-1" style={{ fontSize: '0.7rem', border: '1px solid rgba(203, 213, 224, 0.5)' }}>
                      {plan.condicion}
                    </Badge>
                  </div>
                </div>
              </Card.Body>

              <Card.Footer className="bg-transparent border-top-0 d-flex justify-content-end gap-2 p-3">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => seleccionar(plan)}
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '30px', height: '30px', borderColor: 'rgba(251, 191, 36, 0.4)' }}
                  aria-label="Editar"
                  disabled={plan.estado === 0}  // Aquí
                >
                  <FaEdit size={12} />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => confirmarEliminacion(plan.id)}
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '30px', height: '30px', borderColor: 'rgba(220, 53, 69, 0.4)' }}
                  aria-label="Eliminar"
                  disabled={plan.estado === 0}  // Aquí
                >
                  <FaBan size={12} />
                </Button>
              </Card.Footer>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
};

export default PlanList;
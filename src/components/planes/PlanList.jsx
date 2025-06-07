import React, { useState, useContext  } from "react";
import { Card, Button, Badge, ButtonGroup } from "react-bootstrap";
import Swal from "sweetalert2";
import { FaEdit, FaBan } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext"; // Ajusta la ruta según tu estructura


const PlanList = ({ planes, seleccionar, eliminar }) => {
  const { user } = useContext(AuthContext); // Obtén el usuario del contexto
  const isRole2 = user?.role === '2' || user?.rol === '2';
  const [paginaActual] = useState(1);
  const [filtroCondicion, setFiltroCondicion] = useState(null); // null means no filter
  const elementosPorPagina = 8;

  // Apply condition filter if selected
  const planesFiltrados = filtroCondicion 
    ? planes.filter(plan => plan.condicion === filtroCondicion)
    : planes;

  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFinal = indiceInicio + elementosPorPagina;
  const planesPaginados = planesFiltrados.slice(indiceInicio, indiceFinal);

  // Get unique conditions from plans
  const condicionesUnicas = [...new Set(planes.map(plan => plan.condicion))].sort();

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
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          position: relative;
          overflow: hidden;
        }
        
        .plan-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 12px;
          border: 1px solid transparent;
          background: linear-gradient(135deg, rgba(0, 119, 255, 0.2), rgba(0, 204, 255, 0.1)) border-box;
          -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: destination-out;
          mask-composite: exclude;
          pointer-events: none;
          transition: all 0.3s ease;
        }
        
        .plan-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1), 0 6px 6px rgba(0, 0, 0, 0.05);
        }
        
        .plan-card:hover::before {
          border-color: rgba(0, 119, 255, 0.4);
        }
        
        .card-img-container {
          position: relative;
          overflow: hidden;
          border-radius: 12px 12px 0 0;
          aspect-ratio: 16/9;
        }
        
        .card-img-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .plan-card:hover .card-img-container img {
          transform: scale(1.05);
        }
        
        .card-body-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 1rem;
        }
        
        .card-footer-actions {
          background: linear-gradient(to top, rgba(255,255,255,1) 80%, rgba(255,255,255,0));
          backdrop-filter: blur(5px);
        }
        
        .filter-bar {
          margin-bottom: 1.5rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          overflow-x: auto;
          white-space: nowrap;
        }
        
        .filter-btn {
          margin-right: 0.5rem;
          border-radius: 20px;
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }
        
        .filter-btn.active {
          transform: translateY(-1px);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }
        
        @media (max-width: 576px) {
          .plan-card {
            min-width: 100%;
          }
        }
      `}</style>

      {/* Filter Bar */}
      <div className="d-flex justify-content-center">
        <div className="filter-bar mb-4">
          <div className="d-flex align-items-center">
            <span className="me-2 text-muted" style={{ fontSize: '0.875rem' }}>Planes Registrados</span>
            <ButtonGroup className="flex-wrap">
              <Button
                variant={!filtroCondicion ? "primary" : "outline-secondary"}
                className="filter-btn"
                onClick={() => setFiltroCondicion(null)}
                active={!filtroCondicion}
                style={{
                  backgroundColor: !filtroCondicion ? '#F9E514' : '',
                  borderColor: !filtroCondicion ? '#F9E514' : '',
                  color: !filtroCondicion ? '#000' : '',
                  fontWeight: !filtroCondicion ? '600' : ''
                }}
              >
                Todos
              </Button>
              {condicionesUnicas.map(condicion => {
                const planEjemplo = planes.find(p => p.condicion === condicion);
                return (
                  <Button
                    key={condicion}
                    variant={filtroCondicion === condicion ? "primary" : "outline-secondary"}
                    className={`filter-btn ${filtroCondicion === condicion ? 'active' : ''}`}
                    onClick={() => setFiltroCondicion(condicion)}
                    active={filtroCondicion === condicion}
                    style={{
                      backgroundColor: filtroCondicion === condicion ? '#F9E514' : '',
                      borderColor: filtroCondicion === condicion ? '#F9E514' : '',
                      color: filtroCondicion === condicion ? '#000' : '',
                      fontWeight: filtroCondicion === condicion ? '600' : ''
                    }}
                  >
                    {planEjemplo?.condicion_nombre || `Condición ${condicion}`}
                  </Button>
                );
              })}
            </ButtonGroup>
          </div>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {planesPaginados.length > 0 ? (
          planesPaginados.map((plan) => (
            <div key={plan.id} className="col d-flex">
              <Card 
                className="plan-card h-100 overflow-hidden bg-white"
                style={{ 
                  borderRadius: '12px',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
                  border: 'none',
                }}
              >
                {plan.imagen && (
                  <div className="card-img-container">
                    <div className="position-absolute w-100 h-100"
                      style={{ 
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 60%)',
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
                
                <Card.Body className="card-body-content">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0 fw-bold text-truncate">
                      {plan.plan}
                    </h5>
                    <Badge 
                      bg={plan.estado === 1 ? "success" : "secondary"} 
                      className="ms-2 px-2 py-1"
                      style={{
                        background: plan.estado === 1 
                          ? 'linear-gradient(135deg, #48bb78, #38a169)' 
                          : 'linear-gradient(135deg, #a0aec0, #718096)',
                        border: 'none'
                      }}
                    >
                      {plan.estado === 1 ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>

                  <p className="text-muted mb-3" style={{ 
                    fontSize: '0.8rem', 
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {plan.descripcion}
                  </p>

                  <div className="mt-auto space-y-2 border-top pt-2" style={{ 
                    borderColor: 'rgba(226, 232, 240, 0.5)'
                  }}>
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
                        Duración
                      </span>
                      <Badge 
                        pill
                        className={
                          plan.condicion === 1 ? "bg-primary text-white ms-2 px-2 py-1" :
                          plan.condicion === 2 ? "bg-success text-white ms-2 px-2 py-1" :
                          plan.condicion === 3 ? "bg-info text-white ms-2 px-2 py-1" :    
                          plan.condicion === 4 ? "bg-warning text-dark ms-2 px-2 py-1" :   
                          plan.condicion === 5 ? "bg-danger text-white ms-2 px-2 py-1" :
                          "bg-secondary text-white px-2 py-1 fs-6"
                        }
                      >
                        {plan.condicion_nombre}
                      </Badge>
                    </div>
                  </div>
                </Card.Body>
                {!isRole2 && (
                <Card.Footer className="card-footer-actions border-top-0 d-flex justify-content-end gap-2 p-3">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => seleccionar(plan)}
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderColor: 'rgba(59, 130, 246, 0.3)',
                      transition: 'all 0.2s ease'
                    }}
                    aria-label="Editar"
                    disabled={plan.estado === 0}
                  >
                    <FaEdit size={12} />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => confirmarEliminacion(plan.id)}
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderColor: 'rgba(220, 53, 69, 0.3)',
                      transition: 'all 0.2s ease'
                    }}
                    aria-label="Eliminar"
                    disabled={plan.estado === 0}
                  >
                    <FaBan size={12} />
                  </Button>
                </Card.Footer>
                )}
              </Card>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <p className="text-muted">No se encontraron planes con el filtro seleccionado</p>
          </div>
        )}
      </div>
    </>
  );
};

export default PlanList;
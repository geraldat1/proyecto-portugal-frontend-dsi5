import React, { useState } from "react";
import { Table, Button, Pagination, Form, Card } from "react-bootstrap";
import Swal from "sweetalert2";
import { BiEdit, BiBlock, BiDollar } from "react-icons/bi";
import { FaSearch, FaCalendarAlt, FaTimes } from "react-icons/fa";
import { agregarPagosplan } from "../../services/pagosplanesService";


const DetalleplanesList = ({ detalleplanes, seleccionar, eliminar, clientes, planes, recargarDatos }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [fecha, setFecha] = useState("");
  const elementosPorPagina = 5;

  const obtenerClienteNombre = (id) => {
    const cliente = clientes.find((cliente) => cliente.id === id);
    return cliente ? cliente.nombre : "Cliente no encontrado";
  };

  const obtenerPlanDescripcion = (id) => {
    const plan = planes.find((plan) => plan.id === id);
    return plan ? plan.plan : "Plan no encontrado";
  };

  // Funciones para validación de fechas
  const esFechaMayor = (fechaComparar) => {
    const hoy = new Date().setHours(0, 0, 0, 0);
    const fecha = new Date(fechaComparar).setHours(0, 0, 0, 0);
    return fecha < hoy;  // true si fechaComparar es anterior a hoy
  };

  const estaFueraDeRango = (fechaLimite) => {
    return esFechaMayor(fechaLimite); // true si la fecha límite ya pasó
  };

  // Filtrado por cliente, plan o fecha
  const detalleplanesFiltrados = detalleplanes.filter((detalle) => {
    const clienteNombre = obtenerClienteNombre(detalle.id_cliente).toLowerCase();
    const planNombre = obtenerPlanDescripcion(detalle.id_plan).toLowerCase();
    const texto = busqueda.toLowerCase();

    const coincideBusqueda = clienteNombre.includes(texto) || planNombre.includes(texto);

    if (!fecha) return coincideBusqueda;

    const fechaDetalle = new Date(detalle.fecha);
    const fechaFiltro = new Date(fecha + "T00:00:00");

    // Normalizamos ambas fechas a medianoche local para evitar desfases
    const mismaFecha = fechaDetalle.toISOString().slice(0, 10) === fechaFiltro.toISOString().slice(0, 10);

    return coincideBusqueda && mismaFecha;
  });

  const detalleplanesOrdenados = [...detalleplanesFiltrados].sort((a, b) => b.id - a.id);
  const totalPages = Math.ceil(detalleplanesOrdenados.length / elementosPorPagina);
  const indexOfLastItem = currentPage * elementosPorPagina;
  const indexOfFirstItem = indexOfLastItem - elementosPorPagina;
  const currentItems = detalleplanesOrdenados.slice(indexOfFirstItem, indexOfLastItem);

  const confirmarEliminacion = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Esto deshabilitará el registro!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, deshabilitar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminar(id);
        Swal.fire("¡Deshabilitado!", "El registro ha sido deshabilitado.", "success");
      }
    });
  };

const pagar = async (detalleplan) => {
  // Función helper para formatear precios de forma segura
  const formatPrice = (price) => {
    const num = Number(price);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  // Validaciones frontend con diseño profesional
  if (detalleplan.estado === 2) {
    return Swal.fire({
      title: "<h4 class='fw-bold text-primary'>Plan ya pagado</h4>",
      html: `
        <div class="text-center">
          <i class="bi bi-info-circle text-primary" style="font-size: 3rem;"></i>
          <p class="mt-3">Este plan ya ha sido pagado anteriormente.</p>
        </div>
      `,
      icon: "info",
      confirmButtonText: "Entendido",
      customClass: {
        confirmButton: "btn btn-primary px-4 py-2",
        popup: 'rounded-15'
      },
      buttonsStyling: false
    });
  }

  if (estaFueraDeRango(detalleplan.fecha_limite)) {
    return Swal.fire({
      title: "<h4 class='fw-bold text-danger'>Fecha límite expirada</h4>",
      html: `
        <div class="text-center">
          <i class="bi bi-calendar-x text-danger" style="font-size: 3rem;"></i>
          <p class="mt-3">La fecha límite para este pago ha expirado.</p>
          <p class="text-muted">Por favor contacte al administrador.</p>
        </div>
      `,
      icon: "error",
      confirmButtonText: "Entendido",
      customClass: {
        confirmButton: "btn btn-danger px-4 py-2",
        popup: 'rounded-15'
      },
      buttonsStyling: false
    });
  }

  const plan = planes.find((plan) => plan.id === detalleplan.id_plan);
  if (!plan) {
    return Swal.fire({
      title: "<h4 class='fw-bold text-danger'>Plan no encontrado</h4>",
      html: `
        <div class="text-center">
          <i class="bi bi-exclamation-triangle text-warning" style="font-size: 3rem;"></i>
          <p class="mt-3">No se encontró información del plan asociado.</p>
        </div>
      `,
      icon: "error",
      confirmButtonText: "Entendido",
      customClass: {
        confirmButton: "btn btn-danger px-4 py-2",
        popup: 'rounded-15'
      },
      buttonsStyling: false
    });
  }

  const precio = Number(plan.precio_plan);
  if (isNaN(precio) || precio <= 0) {
    return Swal.fire({
      title: "<h4 class='fw-bold text-danger'>Error en el precio</h4>",
      html: `
        <div class="text-center">
          <i class="bi bi-currency-exchange text-danger" style="font-size: 3rem;"></i>
          <p class="mt-3">El precio del plan no es válido o está mal formateado.</p>
          <p class="text-muted">Precio recibido: ${plan.precio_plan}</p>
        </div>
      `,
      icon: "error",
      confirmButtonText: "Entendido",
      customClass: {
        confirmButton: "btn btn-danger px-4 py-2",
        popup: 'rounded-15'
      },
      buttonsStyling: false
    });
  }

  // Modal de método de pago con datos ordenados profesionalmente
  const { value: metodo_pago, isConfirmed } = await Swal.fire({
    width: 800,
    title: "<h4 class='fw-bold text-dark mb-4'>Verifica los datos del cliente y selecciona el método de pago</h4>",
    html: `
      <div class="row g-4 align-items-stretch">
        <div class="col-md-6">
          <div class="card border-0 shadow-sm h-100" style="background: #f6f8fa;">
            <div class="card-body">
              <h6 class="fw-bold text-primary mb-3">
                <i class="bi bi-person-badge me-2"></i>Datos del cliente
              </h6>
              <ul class="list-group list-group-flush">
                <li class="list-group-item px-0 py-1 border-0">
                  <span class="fw-bold">Cliente:</span> ${obtenerClienteNombre(detalleplan.id_cliente)}
                </li>
                <li class="list-group-item px-0 py-1 border-0">
                  <span class="fw-bold">Plan:</span> ${obtenerPlanDescripcion(detalleplan.id_plan)}
                </li>
                <li class="list-group-item px-0 py-1 border-0">
                  <span class="fw-bold">Precio:</span> <span class="text-success fw-bold">S/ ${formatPrice(precio)}</span>
                </li>
                <li class="list-group-item px-0 py-1 border-0">
                  <span class="fw-bold">Fecha de registro:</span> ${new Date(detalleplan.fecha).toLocaleDateString()}
                </li>
                <li class="list-group-item px-0 py-1 border-0">
                  <span class="fw-bold">Fecha de vencimiento:</span> ${new Date(detalleplan.fecha_venc).toLocaleDateString()}
                </li>
                <li class="list-group-item px-0 py-1 border-0">
                  <span class="fw-bold">Fecha límite de pago:</span> ${new Date(detalleplan.fecha_limite).toLocaleDateString()}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-md-6 d-flex flex-column justify-content-center">
          <div class="card border-0 shadow-sm h-100" style="background: #f6f8fa;">
            <div class="card-body d-flex flex-column justify-content-center">
              <h6 class="fw-bold text-primary mb-4">
                <i class="bi bi-credit-card-2-front me-2"></i>Elige el método de pago
              </h6>
              <div class="d-flex flex-row justify-content-center gap-4 mb-4">
                <div class="form-check text-center" style="min-width: 120px;">
                  <input class="form-check-input" type="radio" name="metodo_pago" id="efectivo" value="1" style="transform: scale(1.5); margin-bottom: 10px;">
                  <label class="form-check-label" for="efectivo" style="cursor:pointer;">
                    <i class="bi bi-cash-coin text-success" style="font-size:2.8rem;"></i>
                    <div class="fw-bold mt-2">Efectivo</div>
                    <div class="text-muted small">Pago presencial</div>
                  </label>
                </div>
                <div class="form-check text-center" style="min-width: 120px;">
                  <input class="form-check-input" type="radio" name="metodo_pago" id="yapeplin" value="2" style="transform: scale(1.5); margin-bottom: 10px;">
                  <label class="form-check-label" for="yapeplin" style="cursor:pointer;">
                    <i class="bi bi-qr-code text-info" style="font-size:2.8rem;"></i>
                    <div class="fw-bold mt-2">Yape/Plin</div>
                    <div class="text-muted small">Pago digital QR</div>
                  </label>
                </div>
              </div>
              <div class="alert alert-info small mb-0 text-center">
                Selecciona el método de pago y continúa con el proceso.
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Continuar",
    cancelButtonText: "Cancelar",
    customClass: {
      confirmButton: "btn btn-primary px-4 py-2 me-2 fw-bold",
      cancelButton: "btn btn-outline-secondary px-4 py-2",
      popup: 'rounded-15'
    },
    buttonsStyling: false,
    focusConfirm: false,
    preConfirm: () => {
      const value = document.querySelector('input[name="metodo_pago"]:checked')?.value;
      if (!value) {
        Swal.showValidationMessage('Por favor selecciona un método de pago');
        return false;
      }
      return value;
    }
  });

  if (!isConfirmed) return;

  // Confirmación para Yape/Plin
  if (metodo_pago === "2") {
    const confirmacionYape = await Swal.fire({
      title: "<h4 class='fw-bold text-dark mb-4'>Confirmación de pago</h4>",
      html: `
        <div class="text-center">
          <img src="/imagenes/yapeplin.png" alt="Yape/Plin" class="img-fluid" style="width: 200px; height: 200px; object-fit: contain;" />
          <div class="alert alert-primary d-flex align-items-center justify-content-center mt-3">
            <i class="bi bi-check-circle-fill me-2"></i>
            <span>Por favor confirma el pago antes de continuar</span>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Pago confirmado <i class='bi bi-check-lg ms-2'></i>",
      cancelButtonText: "Cancelar pago",
      customClass: {
        confirmButton: "btn btn-success px-4 py-2 me-2",
        cancelButton: "btn btn-outline-danger px-4 py-2",
        popup: 'rounded-15'
      },
      buttonsStyling: false,
    });

    if (!confirmacionYape.isConfirmed) return;
  }

  const pagosplan = {
    id_detalle: detalleplan.id,
    id_cliente: detalleplan.id_cliente,
    id_plan: detalleplan.id_plan,
    precio: precio,
    metodo_pago: Number(metodo_pago),
  };

  try {
    await agregarPagosplan(pagosplan);
    await Swal.fire({
      title: "<h4 class='fw-bold text-success mb-4'>¡Pago exitoso!</h4>",
      html: `
        <div class="text-center">
          <div class="success-animation mb-3">
            <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
          </div>
          <h5 class="fw-bold mb-2">Monto pagado: S/ ${formatPrice(precio)}</h5>
          <p class="text-muted">El registro ha sido enviado al sistema de pagos.</p>
        </div>
      `,
      icon: "success",
      confirmButtonText: "Aceptar <i class='bi bi-check-lg ms-2'></i>",
      customClass: {
        confirmButton: "btn btn-success px-4 py-2",
        popup: 'rounded-15'
      },
      buttonsStyling: false
    });
    await recargarDatos();
  } catch (error) {
    console.error("Error al procesar el pago:", error);
    await Swal.fire({
      title: "<h4 class='fw-bold text-danger mb-4'>Error en el pago</h4>",
      html: `
        <div class="text-center">
          <i class="bi bi-x-circle-fill text-danger" style="font-size: 4rem;"></i>
          <p class="mt-3">No se pudo completar el proceso de pago.</p>
          <div class="alert alert-danger mt-3">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            Error: ${error.message || 'Por favor intente nuevamente o contacte al administrador.'}
          </div>
        </div>
      `,
      icon: "error",
      confirmButtonText: "Entendido <i class='bi bi-emoji-frown ms-2'></i>",
      customClass: {
        confirmButton: "btn btn-danger px-4 py-2",
        popup: 'rounded-15'
      },
      buttonsStyling: false
    });
  }
};

  const limpiarFiltros = () => {
    setBusqueda("");
    setFecha("");
    setCurrentPage(1);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4 bg-white rounded-3 shadow-sm">
      {/* Filtros y buscador */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3 bg-light p-3 rounded shadow-sm">
        <div className="d-flex gap-2 flex-wrap align-items-center">
          <div className="position-relative">
            <Form.Control
              type="text"
              placeholder="Buscar por cliente o plan..."
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
          Mostrando <span className="text-primary fw-bold">{detalleplanesOrdenados.length}</span> de 
          <span className="text-primary fw-bold"> {detalleplanes.length}</span> registros
        </div>
      </div>

      {/* Tabla de detalleplanes */}
      <Card className="border-0 shadow-sm mb-3">
        <div className="table-responsive" style={{ maxHeight: "600px", overflowY: "auto" }}>
          <Table hover className="mb-0" style={{ fontSize: "0.95rem" }}>
            <thead className="bg-primary text-white" style={{ position: "sticky", top: 0, zIndex: 1 }}>
              <tr>
                <th className="fw-bold">ID</th>
                <th className="fw-bold">CLIENTE</th>
                <th className="fw-bold">PLAN</th>
                <th className="fw-bold">PRECIO</th>
                <th className="fw-bold">F. REGISTRO</th>
                <th className="fw-bold">HORA</th>
                <th className="fw-bold">F. VENC.</th>
                <th className="fw-bold">F. LÍMITE</th>
                <th className="fw-bold">ESTADO</th>
                <th className="fw-bold text-center">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((detalleplan) => (
                  <tr 
                    key={detalleplan.id}
                    className={
                      esFechaMayor(detalleplan.fecha_venc) && !esFechaMayor(detalleplan.fecha_limite)
                        ? "table-warning"
                        : esFechaMayor(detalleplan.fecha_limite)
                        ? "table-danger"
                        : ""
                    }
                  >
                    <td className="fw-bold fs-6 align-middle">{detalleplan.id}</td>
                    <td className="fw-medium align-middle">{obtenerClienteNombre(detalleplan.id_cliente)}</td>
                    <td className="fw-medium align-middle">{obtenerPlanDescripcion(detalleplan.id_plan)}</td>
                    <td className="fw-medium align-middle">
                      {planes.find(plan => plan.id === detalleplan.id_plan)?.precio_plan ?? "No disponible"}
                    </td>
                    <td className="fw-medium align-middle">{new Date(detalleplan.fecha).toLocaleDateString()}</td>
                    <td className="fw-medium align-middle">{detalleplan.hora}</td>
                    <td className="fw-medium align-middle">{new Date(detalleplan.fecha_venc).toLocaleDateString()}</td>
                    <td className="fw-medium align-middle">{new Date(detalleplan.fecha_limite).toLocaleDateString()}</td>
                    <td className="align-middle">
                      <span className={`badge rounded-pill ${
                        detalleplan.estado === 1 
                          ? "bg-warning text-dark" 
                          : detalleplan.estado === 0 
                            ? "bg-danger" 
                            : detalleplan.estado === 2
                              ? "bg-success"
                              : "bg-secondary"
                      }`}>
                        {detalleplan.estado === 1 
                          ? "Proceso" 
                          : detalleplan.estado === 0 
                            ? "Deshabilitado" 
                            : detalleplan.estado === 2
                              ? "Pagado"
                              : "Desconocido"}
                      </span>
                    </td>
                    <td className="align-middle text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          variant="success"
                          onClick={() => pagar(detalleplan)}
                          title="Pagar"
                          disabled={detalleplan.estado !== 1}
                          className="d-flex align-items-center justify-content-center p-2 rounded-circle"
                          style={{ width: "38px", height: "38px" }}
                        >
                          <BiDollar size={16} />
                        </Button>
                        <Button
                          variant="warning"
                          onClick={() => seleccionar(detalleplan)}
                          title="Editar"
                          disabled={detalleplan.estado === 0}
                          className="d-flex align-items-center justify-content-center p-2 rounded-circle"
                          style={{ width: "38px", height: "38px" }}
                        >
                          <BiEdit size={16} />
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => confirmarEliminacion(detalleplan.id)}
                          title="Bloquear"
                          disabled={detalleplan.estado === 0}
                          className="d-flex align-items-center justify-content-center p-2 rounded-circle"
                          style={{ width: "38px", height: "38px" }}
                        >
                          <BiBlock size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-5">
                    <div className="d-flex flex-column align-items-center justify-content-center">
                      <div className="bg-light rounded-circle p-4 mb-3">
                        <FaSearch size={40} className="text-primary" />
                      </div>
                      <h5 className="text-primary fw-bold">No se encontraron registros</h5>
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
      {detalleplanesOrdenados.length > 0 && (
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
              return <Pagination.Ellipsis key={`ellipsis-${i}`} />;
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

export default DetalleplanesList;
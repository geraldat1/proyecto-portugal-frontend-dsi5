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
  // Validaciones frontend
  if (detalleplan.estado === 2) {
    return Swal.fire({
      title: "Advertencia",
      text: "Este plan ya ha sido pagado.",
      icon: "info",
      confirmButtonText: "Entendido",
      customClass: {
        confirmButton: "btn btn-primary",
      },
    });
  }

  if (estaFueraDeRango(detalleplan.fecha_limite)) {
    return Swal.fire({
      title: "Error",
      text: "La fecha límite ha expirado. No se puede pagar.",
      icon: "error",
      confirmButtonText: "Entendido",
      customClass: {
        confirmButton: "btn btn-danger",
      },
    });
  }

  const plan = planes.find((plan) => plan.id === detalleplan.id_plan);
  if (!plan) {
    return Swal.fire({
      title: "Error",
      text: "Plan no encontrado.",
      icon: "error",
      confirmButtonText: "Entendido",
      customClass: {
        confirmButton: "btn btn-danger",
      },
    });
  }

  // Método de pago modal
  const { value: metodo_pago, isConfirmed } = await Swal.fire({
    title: "<h4 class='fw-bold'>Selecciona el método de pago</h4>",
    html: `
      <div class="text-start">
        <div class="form-check">
          <input class="form-check-input" type="radio" name="metodo_pago" id="efectivo" value="1">
          <label class="form-check-label" for="efectivo">
            Efectivo
          </label>
        </div>
        <div class="form-check mt-2">
          <input class="form-check-input" type="radio" name="metodo_pago" id="yapeplin" value="2">
          <label class="form-check-label" for="yapeplin">
            Yape/Plin
          </label>
        </div>
      </div>
    `,
    inputValidator: (value) => !value && "Debes seleccionar un método de pago",
    showCancelButton: true,
    confirmButtonText: "Continuar",
    cancelButtonText: "Cancelar",
    customClass: {
      confirmButton: "btn btn-primary me-2",
      cancelButton: "btn btn-outline-secondary",
    },
    buttonsStyling: false,
    focusConfirm: false,
    preConfirm: () => {
      return document.querySelector('input[name="metodo_pago"]:checked')?.value;
    },
  });

  if (!isConfirmed) return;

  // Confirmación para Yape/Plin
  if (metodo_pago === "2") {
    const confirmacionYape = await Swal.fire({
      title: "<h4 class='fw-bold'>Pago con Yape/Plin</h4>",
      html: `
        <div class="text-center">
          <p class="mb-3">Escanea el siguiente código QR para realizar el pago:</p>
          <img src="/imagenes/yapeplin.png" alt="Yape/Plin" class="img-fluid rounded border" style="max-width: 250px;" />
          <div class="mt-3 alert alert-info">
            <i class="bi bi-info-circle me-2"></i>
            Confirma el pago antes de continuar
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Pago confirmado",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "btn btn-success me-2",
        cancelButton: "btn btn-outline-secondary",
      },
      buttonsStyling: false,
    });

    if (!confirmacionYape.isConfirmed) return;
  }

  const pagosplan = {
    id_detalle: detalleplan.id,
    id_cliente: detalleplan.id_cliente,
    id_plan: detalleplan.id_plan,
    precio: plan.precio_plan,
    metodo_pago: Number(metodo_pago),
  };

  try {
    await agregarPagosplan(pagosplan);
    await Swal.fire({
      title: "<h4 class='fw-bold'>¡Pago realizado!</h4>",
      html: `
        <div class="alert alert-success">
          <i class="bi bi-check-circle-fill me-2"></i>
          El registro ha sido enviado a pagos.
        </div>
      `,
      icon: "success",
      confirmButtonText: "Aceptar",
      customClass: {
        confirmButton: "btn btn-success",
      },
    });
    await recargarDatos();
  } catch (error) {
    await Swal.fire({
      title: "<h4 class='fw-bold'>Error</h4>",
      html: `
        <div class="alert alert-danger">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          No se pudo realizar el pago.
        </div>
      `,
      icon: "error",
      confirmButtonText: "Entendido",
      customClass: {
        confirmButton: "btn btn-danger",
      },
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
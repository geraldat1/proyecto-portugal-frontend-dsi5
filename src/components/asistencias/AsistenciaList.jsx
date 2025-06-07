import React, { useState, useContext } from "react";
import { Table, Button, Pagination, Form, Card } from "react-bootstrap";
import { FaCheck, FaSearch, FaCalendarAlt, FaTimes, FaFilePdf } from "react-icons/fa";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AuthContext } from "../../context/AuthContext";

const AsistenciaList = ({ asistencias, seleccionar, entrenadores, detallesPlanes, clientes }) => {
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [fecha, setFecha] = useState("");
  const [asistenciasActualizadas, setAsistenciasActualizadas] = useState(new Set());

  const elementosPorPagina = 5;

const obtenerNombreEntrenador = (id_entrenador) => {
  const entrenador = entrenadores.find(e => e.id === id_entrenador);
  return entrenador ? `${entrenador.nombre} ${entrenador.apellido}` : "Sin Entrenador";
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

  // Generar reporte general de asistencias
const generarReporteGeneral = () => {
    const doc = new jsPDF();
    const logo = new Image();
    logo.src = "/imagenes/logo-toreto.png";

    logo.onload = () => {
      try {
        const fechaHoraActual = new Date();
        const fechaStr = fechaHoraActual.toLocaleDateString("es-PE", {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
        const horaStr = fechaHoraActual.toLocaleTimeString("es-PE", {
          hour: '2-digit',
          minute: '2-digit',
        });
        const idUsuario = `${user?.id || "N/A"} - ${user?.name || "Nombre no disponible"}`;

        const colores = {
          fondo: [0, 0, 0],
          texto: [255, 255, 255],
          borde: [200, 200, 200]
        };

        // Encabezado negro con texto blanco
        doc.setFillColor(...colores.fondo);
        doc.rect(0, 0, doc.internal.pageSize.getWidth(), 20, 'F');

        // Logo
        doc.addImage(logo, "PNG", 8, 1.5, 20, 18);

        // Título del reporte
        doc.setTextColor(...colores.texto);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.text(
          "REPORTE DE ASISTENCIAS",
          doc.internal.pageSize.getWidth() / 2,
          13,
          { align: "center" }
        );

        // Información de generación
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(`Generado: ${fechaStr}`, doc.internal.pageSize.width - 4, 8, { align: "right" });
        doc.text(`Hora: ${horaStr}`, doc.internal.pageSize.width - 4, 12, { align: "right" });
        doc.text(`Usuario: ${idUsuario}`, doc.internal.pageSize.width - 4, 16, { align: "right" });

        let yPosition = 28;
        
        // Filtros aplicados
        if (fecha) {
          doc.setFillColor(245, 245, 245);
          doc.rect(10, yPosition, 190, 10, 'F');

          doc.setTextColor(0, 0, 0);
          doc.setFontSize(10);

          const fechaFiltro = new Date(fecha).toLocaleDateString("es-PE", {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          });
          
          doc.text(`Filtrado por fecha: ${fechaFiltro}`, 15, yPosition + 7);
          yPosition += 12;
        }

        // Estadísticas
        const calcularEstadisticas = () => {
          const total = asistenciasOrdenadas.length;
          const enGimnasio = asistenciasOrdenadas.filter(a => a.estado === 1).length;
          const salidos = asistenciasOrdenadas.filter(a => a.estado === 0).length;
          return { total, enGimnasio, salidos };
        };

        const stats = calcularEstadisticas();

        // Cuadro de estadísticas
        doc.setFillColor(0, 0, 0);
        doc.rect(10, yPosition, 190, 15, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        
        doc.text("TOTAL REGISTROS", 55, yPosition + 7, { align: "center" });
        doc.text("EN GIMNASIO", 120, yPosition + 7, { align: "center" });
        doc.text("SALIDOS", 185, yPosition + 7, { align: "center" });
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(stats.total.toString(), 55, yPosition + 13, { align: "center" });
        doc.text(stats.enGimnasio.toString(), 120, yPosition + 13, { align: "center" });
        doc.text(stats.salidos.toString(), 185, yPosition + 13, { align: "center" });
        
        yPosition += 20;

        // Tabla de asistencias
        autoTable(doc, {
          startY: yPosition,
          head: [[
            "ID",
            "Fecha",
            "H. Entrada", 
            "H. Salida",
            "Cliente",
            "Entrenador",
            "Estado"
          ]],
          body: asistenciasOrdenadas.map((a) => [
            a.id_asistencia || "N/A",
            a.fecha ? new Date(a.fecha).toLocaleDateString("es-PE") : "Sin fecha",
            a.hora_entrada || "-",
            a.hora_salida || "-",
            obtenerNombreClientePorDetalle(a.id_detalle),
            obtenerNombreEntrenador(a.id_entrenador),
            a.estado === 1 ? "EN GIMNASIO" : "SALIDO"
          ]),
          theme: 'grid',
          headStyles: {
            fillColor: colores.fondo,
            textColor: colores.texto,
            fontStyle: 'bold',
            fontSize: 8,
            halign: 'center',
            valign: 'middle',
            lineColor: [150, 150, 150],
            lineWidth: 0.3
          },
          bodyStyles: {
            fontSize: 8,
            cellPadding: 2,
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            halign: 'center',
            valign: 'middle',
            fontStyle: 'normal',
            lineColor: [200, 200, 200],
            lineWidth: 0.1
          },
          alternateRowStyles: {
            fillColor: [255, 255, 255]
          },
          columnStyles: {
            0: { cellWidth: 15, halign: 'center' },
            1: { cellWidth: 20, halign: 'center' },
            2: { cellWidth: 20, halign: 'center' },
            3: { cellWidth: 20, halign: 'center' },
            4: { cellWidth: 45, halign: 'left' },
            5: { cellWidth: 45, halign: 'left' },
            6: { cellWidth: 25, halign: 'center' }
          },
          didParseCell: (data) => {
            if (data.section === 'body' && data.column.index === 6) {
              const estado = data.cell.raw;
              if (estado === 'EN GIMNASIO') {
                data.cell.styles.textColor = [0, 100, 0];
                data.cell.styles.fontStyle = 'bold';
              } else if (estado === 'SALIDO') {
                data.cell.styles.textColor = [150, 0, 0];
                data.cell.styles.fontStyle = 'bold';
              }
            }
          },
          margin: { top: 15, bottom: 30, left: 10, right: 10 }
        });

        // Pie de página
        doc.setDrawColor(...colores.borde);
        doc.setLineWidth(0.3);
        doc.line(10, doc.internal.pageSize.height - 25, 200, doc.internal.pageSize.height - 25);

        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");

        doc.text(
          `Generado el ${fechaStr} a las ${horaStr}`,
          15,
          doc.internal.pageSize.height - 15
        );

        const pageNumber = doc.internal.getNumberOfPages();
        doc.text(
          `Página ${pageNumber} de ${pageNumber}`,
          doc.internal.pageSize.width - 40,
          doc.internal.pageSize.height - 15
        );

        doc.text(
          "ToretoGym - Sistema de Gestión",
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 15,
          { align: 'center' }
        );

        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);

        window.open(pdfUrl, "_blank");
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);

      } catch (error) {
        console.error("Error al generar el reporte:", error);
        alert("Error al generar el reporte. Por favor, inténtalo nuevamente.");
      }
    };

    logo.onerror = () => {
      console.error("Error al cargar el logo");
      alert("No se pudo cargar el logo de la empresa. El reporte se generará sin logo.");
    };
  };

  const hoy = new Date();
  const fechaLocal = hoy.toLocaleDateString('es-PE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const [day, month, year] = fechaLocal.split('/');
  const fechaHoy = `${year}-${month}-${day}`;

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
        
        {/* BOTÓN DE REPORTE GENERAL */}
        <Button
          variant="dark" 
          onClick={generarReporteGeneral}
          className="d-flex align-items-center gap-2 px-3 py-2 shadow-sm rounded"
        >
          <FaFilePdf size={18} />
          <span>Reporte General</span>
        </Button>

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

export default AsistenciaList;
import React, { useState } from "react";
import { Table, Button, Pagination, Form, Card } from "react-bootstrap";
import { FaSearch, FaFilePdf, FaCalendarAlt, FaTimes } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const PagosplanesList = ({ pagosplanes }) => {
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [fecha, setFecha] = useState("");
  const elementosPorPagina = 5;

  const pagosplanesFiltrados = pagosplanes.filter((p) => {
    const cliente = p.nombre_cliente?.toLowerCase() || "";
    const plan = p.nombre_plan?.toLowerCase() || "";
    const dni = p.dni_cliente?.toLowerCase() || "";
    const cumpleBusqueda = cliente.includes(busqueda.toLowerCase()) || 
                          plan.includes(busqueda.toLowerCase()) || 
                          dni.includes(busqueda.toLowerCase());
    
    if (!fecha) return cumpleBusqueda;
  
    const fechaPagoStr = new Date(p.fecha).toISOString().split("T")[0];
    const fechaFiltroStr = fecha;

    return cumpleBusqueda && fechaPagoStr === fechaFiltroStr;
  });

  const pagosplanesOrdenados = [...pagosplanesFiltrados].sort((a, b) => b.id - a.id);
  const totalPages = Math.ceil(pagosplanesOrdenados.length / elementosPorPagina);
  const indexOfLastItem = currentPage * elementosPorPagina;
  const indexOfFirstItem = indexOfLastItem - elementosPorPagina;
  const currentItems = pagosplanesOrdenados.slice(indexOfFirstItem, indexOfLastItem);

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

      let tituloReporte = "REPORTE DE MEMBRESÍAS";
      let subtituloReporte = "";

      if (fecha) {
        const fechaFiltro = new Date(fecha).toLocaleDateString("es-PE", {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });
        subtituloReporte = `Filtrado por fecha: ${fechaFiltro}`;
      }

      // Colores más sobrios para documento formal
      const colores = {
        primario: [0, 0, 0],        // Negro para texto principal
        secundario: [64, 64, 64],   // Gris oscuro para bordes
        texto: [0, 0, 0],           // Negro para texto
        borde: [128, 128, 128]      // Gris medio para bordes suaves
      };

      let encabezadoDibujado = false;

      const dibujarEncabezado = () => {
        // Marco del encabezado sin fondo
        doc.setDrawColor(...colores.borde);
        doc.setLineWidth(0.5);
        doc.rect(10, 10, 190, 35);

        // Líneas divisorias
        doc.setDrawColor(...colores.borde);
        doc.setLineWidth(0.3);
        doc.line(55, 12, 55, 43);
        doc.line(135, 12, 135, 43);

        // Logo
        doc.addImage(logo, "PNG", 15, 15, 35, 25);

        // Título principal centrado y justificado
        doc.setTextColor(...colores.primario);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");

        const tituloWidth = doc.getTextWidth(tituloReporte);
        const tituloX = 60 + (70 - tituloWidth) / 2;
        doc.text(tituloReporte, tituloX, 30);

        // Subtítulo centrado
        if (subtituloReporte) {
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          const subtituloWidth = doc.getTextWidth(subtituloReporte);
          const subtituloX = 60 + (70 - subtituloWidth) / 2;
          doc.text(subtituloReporte, subtituloX, 32);
        }

        // Información del reporte justificada a la derecha
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        const infoTextos = [
          `Generado: ${fechaStr}`,
          `Hora: ${horaStr}`,
          `Usuario: ${idUsuario}`,
          `Total registros: ${pagosplanesOrdenados.length}`
        ];

        infoTextos.forEach((texto, index) => {
          doc.text(texto, 140, 17 + (index * 4));
        });
      };

      const calcularEstadisticas = () => {
        const total = pagosplanesOrdenados.length;
        const montoTotal = pagosplanesOrdenados.reduce((sum, p) => sum + parseFloat(p.precio || 0), 0);
        return { total, montoTotal };
      };

      const stats = calcularEstadisticas();

      // Sección de estadísticas sin fondo de color, solo con bordes
      doc.setDrawColor(...colores.borde);
      doc.setLineWidth(0.3);
      doc.rect(10, 50, 190, 20);

      // Línea divisoria central para separar estadísticas
      doc.line(100, 52, 100, 68);

      doc.setTextColor(...colores.primario);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");

      // Estadísticas centradas y justificadas en sus respectivas secciones
      const estadisticas = [
        { label: "TOTAL DE REGISTROS", valor: stats.total, x: 55 },
        { label: "MONTO TOTAL RECAUDADO", valor: `S/ ${stats.montoTotal.toFixed(2)}`, x: 145 }
      ];

      estadisticas.forEach(stat => {
        // Centrar el texto en cada sección
        const labelWidth = doc.getTextWidth(stat.label);
        const valorWidth = doc.getTextWidth(stat.valor.toString());
        
        doc.text(stat.label, stat.x - (labelWidth / 2), 57);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(stat.valor.toString(), stat.x - (valorWidth / 2), 65);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
      });

      // Tabla principal con estilo formal
autoTable(doc, {
  startY: 80,
  head: [["ID", "Det", "Cliente", "DNI", "Plan", "Precio", "M. Pago", "F. Rp.", "Hr. Rp.", "F. Reg.", "F. Venc.", "Estado"]],
  body: pagosplanesOrdenados.map((p) => [
    p.id || "N/A",
    p.id_detalle || "N/A",
    p.nombre_cliente || "Sin nombre",
    p.dni_cliente || "Sin DNI",
    p.nombre_plan || "Sin plan",
    `S/ ${parseFloat(p.precio || 0).toFixed(2)}`,
 (p.metodo_pago === 1 || p.metodo_pago === "1")
      ? "Efectivo"
      : (p.metodo_pago === 2 || p.metodo_pago === "2")
      ? "Yape/Plin"
      : "Desconocido",
    p.fecha ? new Date(p.fecha).toLocaleDateString("es-PE") : "Sin fecha",
    p.hora || "Sin hora",
    p.fecha_reg ? new Date(p.fecha_reg).toLocaleDateString("es-PE") : "Sin fecha",
    p.fecha_venc ? new Date(p.fecha_venc).toLocaleDateString("es-PE") : "Sin fecha",
    (p.estado === 1 || p.estado === "1") ? "Pagado" : "Pendiente"
  ]),
        theme: 'grid',
        headStyles: {
          fillColor: [255, 255, 255],  // Fondo blanco para encabezados
          textColor: [0, 0, 0],        // Texto negro
          fontStyle: 'bold',
          fontSize: 9,
          halign: 'center',
          lineColor: [128, 128, 128],  // Bordes grises
          lineWidth: 0.3
        },
        bodyStyles: {
          fontSize: 8,
          cellPadding: 4,
          fillColor: [255, 255, 255],  // Fondo blanco para todas las celdas
          textColor: [0, 0, 0],        // Texto negro
          lineColor: [128, 128, 128],  // Bordes grises
          lineWidth: 0.1
        },
        alternateRowStyles: {
          fillColor: [255, 255, 255]   // Sin filas alternadas de color
        },
        columnStyles: {
          0: { halign: 'center' },
          1: { halign: 'center' },
          2: { halign: 'left' },
          3: { halign: 'center' },
          4: { halign: 'left' },
          5: { halign: 'right' },
          6: { halign: 'center' },
          7: { halign: 'center' },
          8: { halign: 'center' },
          9: { halign: 'center' },
          10: { halign: 'center' },
          11: { halign: 'center' }

        },
        didParseCell: (data) => {
          // Mantener colores diferenciados solo para el estado, pero más sutiles
          if (data.section === 'body' && data.column.index === 8) {
            const estado = data.cell.raw;
            if (estado === 'Pagado') {
              data.cell.styles.textColor = [0, 100, 0];      // Verde oscuro
              data.cell.styles.fontStyle = 'bold';
            } else if (estado === 'Pendiente') {
              data.cell.styles.textColor = [150, 0, 0];      // Rojo oscuro
              data.cell.styles.fontStyle = 'bold';
            }
          }
          
          // Justificación específica por tipo de contenido
          if (data.section === 'body') {
            // Montos alineados a la derecha
            if (data.column.index === 5) {
              data.cell.styles.halign = 'right';
            }
            // Nombres alineados a la izquierda
            if (data.column.index === 2 || data.column.index === 4) {
              data.cell.styles.halign = 'left';
            }
            // IDs y códigos centrados
            if (data.column.index === 0 || data.column.index === 1 || data.column.index === 3) {
              data.cell.styles.halign = 'center';
            }
          }
        },
        didDrawPage: (data) => {
          const pageInfo = doc.internal.getCurrentPageInfo();
          const pageNumber = pageInfo.pageNumber;
          const totalPages = doc.internal.getNumberOfPages();

          // Dibujar encabezado solo en la primera página
          if (pageNumber === 1 && !encabezadoDibujado) {
            dibujarEncabezado();
            encabezadoDibujado = true;
          }

          // Pie de página formal con línea separadora
          doc.setDrawColor(...colores.borde);
          doc.setLineWidth(0.3);
          doc.line(10, doc.internal.pageSize.height - 25, 200, doc.internal.pageSize.height - 25);

          doc.setFontSize(8);
          doc.setTextColor(...colores.texto);
          doc.setFont("helvetica", "normal");

          // Información justificada en el pie de página
          doc.text(
            `Generado el ${fechaStr} a las ${horaStr}`,
            15,
            doc.internal.pageSize.height - 15
          );

          doc.text(
            `Página ${pageNumber} de ${totalPages}`,
            doc.internal.pageSize.width - 40,
            doc.internal.pageSize.height - 15
          );

          doc.text(
            "ToretoGym - Sistema de Gestión",
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 15,
            { align: 'center' }
          );
        },
        margin: { top: 15, bottom: 30, left: 10, right: 10 }
      });

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




  const generarBoleta = (p) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 200],
      putOnlyUsedFonts: true,
      floatPrecision: 16,
    });

    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    
    const fechaActual = new Date();
    const fechaStr = fechaActual.toLocaleDateString("es-PE", {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const horaStr = fechaActual.toLocaleTimeString("es-PE", {
      hour: '2-digit',
      minute: '2-digit'
    });
    const idUsuario = user?.id || "Desconocido";
    const numeroCompleto = `B00${p.numero_boleta || '000'}${p.id}`;

    const logo = new Image();
    logo.src = "/imagenes/logo-toreto-original.jpg";

    logo.onload = () => {
      try {
        const logoWidth = 20;
        const logoHeight = 15;
        const logoX = (doc.internal.pageSize.getWidth() - logoWidth) / 2;
        doc.addImage(logo, "PNG", logoX, 5, logoWidth, logoHeight);

        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        const textTitle = "BOLETA DE PAGO";
        const titleX = (doc.internal.pageSize.getWidth() - doc.getStringUnitWidth(textTitle) * doc.internal.getFontSize() / doc.internal.scaleFactor) / 2;
        doc.text(textTitle, titleX, 28);
        
        doc.setFontSize(12);
        const numX = (doc.internal.pageSize.getWidth() - doc.getStringUnitWidth(numeroCompleto) * doc.internal.getFontSize() / doc.internal.scaleFactor) / 2;
        doc.text(numeroCompleto, numX, 35);
        doc.setFont("helvetica", "normal");
        
        doc.setFontSize(8);
        doc.text(`Emitido el: ${fechaStr} - ${horaStr}`, 5, 43);
        doc.text(`Usuario ID: ${idUsuario}`, 5, 48);
        doc.text(`Fecha del Pago: ${new Date(p.fecha).toLocaleDateString("es-PE")}`, 5, 53);
        doc.text(`Hora del Pago: ${p.hora}`, 5, 58);
        doc.text(`ID Detalle: ${p.id_detalle}`, 5, 63);

        doc.setDrawColor(100, 100, 100);
        doc.setLineWidth(0.5);
        doc.line(5, 66, 75, 66);  // Nueva posición corregida

        let y = 74;

        doc.setFont("helvetica", "bold");
        doc.text("DATOS DEL CLIENTE", 5, y);
        doc.setFont("helvetica", "normal");
        y += 5;
        doc.text(`Nombre: ${p.nombre_cliente}`, 5, y);
        y += 5;
        doc.text(`DNI: ${p.dni_cliente?.trim() ? p.dni_cliente : "Sin DNI"}`, 5, y);
        y += 6;

        doc.setDrawColor(150, 150, 150);
        doc.setLineWidth(0.4);
        doc.line(5, y, 75, y);
        y += 5;

        doc.setFont("helvetica", "bold");
        doc.text("DETALLE DEL PAGO", 5, y);
        doc.setFont("helvetica", "normal");
        y += 5; // Menor espacio

        // Encabezado de columnas (ajuste más compacto)
        doc.setFont("helvetica", "bold");
        doc.text("PLAN", 5, y);
        doc.text("MONTO", 30, y);
        doc.text("F.REG", 48, y);
        doc.text("F.VENC", 66, y);
        doc.setFont("helvetica", "normal");
        y += 4; // Menor salto de línea

        // Datos en columnas
        const planLines = doc.splitTextToSize(p.nombre_plan, 25); // 25 mm de ancho máximo para "PLAN"
        planLines.forEach((line, index) => {
          doc.text(line, 5, y + index * 4); // 4 mm de salto entre líneas
        });

      const linesUsed = planLines.length;
      doc.text(`S/ ${parseFloat(p.precio).toFixed(2)}`, 30, y);
      doc.text(new Date(p.fecha_reg).toLocaleDateString("es-PE"), 48, y);
      doc.text(new Date(p.fecha_venc).toLocaleDateString("es-PE"), 66, y);

      y += 4 * linesUsed; // Ajustar Y solo según la altura real del nombre del plan


        // Línea separadora
        doc.setDrawColor(150, 150, 150);
        doc.setLineWidth(0.4);
        doc.line(5, y, 75, y);
        y += 4;

        // Estado de pago
        doc.setFont("helvetica", "bold");
        doc.text(`Estado: ${p.estado === 1 || p.estado === "1" ? "PAGADO" : "PENDIENTE"}`, 5, y);
        y += 5;

        // Línea final
        doc.setDrawColor(100, 100, 100);
        doc.setLineWidth(0.6);
        doc.line(5, y, 75, y);

        doc.setFontSize(7);
        doc.text("Gracias por su preferencia", 5, y + 5);
        doc.text("Este documento es válido como comprobante de pago", 5, y + 9);

        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, "_blank");
        
      } catch (error) {
        console.error("Error al generar boleta:", error);
      }
    };

    logo.onerror = () => {
      console.error("No se pudo cargar el logo");
    };
  };


  const limpiarFiltros = () => {
    setFecha("");
    setBusqueda("");
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
              placeholder="Buscar por cliente, plan o DNI..."
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
        
        <Button 
          variant="success" 
          onClick={generarReporteGeneral} 
          className="d-flex align-items-center gap-2 px-3 py-2 shadow-sm rounded"
        >
          <FaFilePdf size={18} />
          <span>Reporte General</span>
        </Button>
      </div>

      {/* Tabla de pagosplanes */}
      <Card className="border-0 shadow-sm mb-3">
        <div className="table-responsive" style={{ maxHeight: "600px", overflowY: "auto" }}>
          <Table hover className="mb-0" style={{ fontSize: "0.95rem" }}>
            <thead className="bg-primary text-white" style={{ position: "sticky", top: 0, zIndex: 1 }}>
              <tr>
                <th className="fw-bold">N°</th>
                <th className="fw-bold">DETALLE</th>
                <th className="fw-bold">CLIENTE</th>
                <th className="fw-bold">DNI</th>
                <th className="fw-bold">PLAN</th>
                <th className="fw-bold">PRECIO</th>
                <th className="fw-bold">M. PAGO</th>
                <th className="fw-bold">FECHA RP.</th>
                <th className="fw-bold">HORA RP.</th>
                <th className="fw-bold">FECHA REG.</th>
                <th className="fw-bold">FECHA VENC.</th>
                <th className="fw-bold">ESTADO</th>
                <th className="fw-bold text-center">ACCIÓN</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((p) => (
                  <tr key={p.id}>
                    <td className="fw-bold fs-6 align-middle">{p.id}</td>
                    <td className="fw-medium align-middle">{p.id_detalle}</td>
                    <td className="fw-medium align-middle">{p.nombre_cliente}</td>
                    <td className="fw-medium align-middle">{p.dni_cliente?.trim() ? p.dni_cliente : "Sin DNI"}</td>
                    <td className="fw-medium align-middle">{p.nombre_plan}</td>
                    <td className="fw-medium align-middle text-end">S/ {parseFloat(p.precio).toFixed(2)}</td>
                    <td className="fw-medium align-middle">
                      {p.metodo_pago === 1 || p.metodo_pago === "1"
                        ? "Efectivo"
                        : p.metodo_pago === 2 || p.metodo_pago === "2"
                        ? "Yape/Plin"
                        : "Desconocido"}
                    </td>
                    <td className="fw-medium align-middle">{new Date(p.fecha).toLocaleDateString("es-PE")}</td>
                    <td className="fw-medium align-middle">{p.hora}</td>
                    <td className="fw-medium align-middle">{new Date(p.fecha_reg).toLocaleDateString("es-PE")}</td>
                    <td className="fw-medium align-middle">{new Date(p.fecha_venc).toLocaleDateString("es-PE")}</td>
                    <td className="align-middle">
                      <span className={`badge rounded-pill ${p.estado === 1 || p.estado === "1" ? 'bg-success' : 'bg-warning'}`}>
                        {p.estado === 1 || p.estado === "1" ? "Pagado" : "Pendiente"}
                      </span>
                    </td>
                    <td className="align-middle text-center">
                      <Button 
                        variant="danger" 
                        onClick={() => generarBoleta(p)} 
                        className="d-flex align-items-center justify-content-center p-2 rounded-circle"
                        style={{ width: "38px", height: "38px" }}
                        title="Generar boleta PDF"
                      >
                        <FaFilePdf size={16} />
                      </Button>
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
      {pagosplanesOrdenados.length > 0 && (
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

export default PagosplanesList;
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
  
  // Convertir fechas a strings para búsqueda
  const fechaPagoStr = p.fecha ? new Date(p.fecha).toLocaleDateString("es-PE") : "";
  const fechaRegStr = p.fecha_reg ? new Date(p.fecha_reg).toLocaleDateString("es-PE") : "";
  const fechaVencStr = p.fecha_venc ? new Date(p.fecha_venc).toLocaleDateString("es-PE") : "";
  
  const cumpleBusqueda =
    cliente.includes(busqueda.toLowerCase()) ||
    plan.includes(busqueda.toLowerCase()) ||
    dni.includes(busqueda.toLowerCase()) ||
    fechaPagoStr.includes(busqueda) ||  // Búsqueda en fecha pago
    fechaRegStr.includes(busqueda) ||   // Búsqueda en fecha registro
    fechaVencStr.includes(busqueda);    // Búsqueda en fecha vencimiento

  // Filtro de fecha (solo aplica a fecha de pago)
  if (!fecha) return cumpleBusqueda;

  const fechaPagoISO = p.fecha ? new Date(p.fecha).toISOString().split("T")[0] : "";
  return cumpleBusqueda && fechaPagoISO === fecha;
});

  const pagosplanesOrdenados = [...pagosplanesFiltrados].sort((a, b) => b.id - a.id);
  const totalPages = Math.ceil(pagosplanesOrdenados.length / elementosPorPagina);
  const indexOfLastItem = currentPage * elementosPorPagina;
  const indexOfFirstItem = indexOfLastItem - elementosPorPagina;
  const currentItems = pagosplanesOrdenados.slice(indexOfFirstItem, indexOfLastItem);

  const generarReporteGeneral = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4"
    });

    const logo = new window.Image();
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
          texto: [255, 255, 255]
        };

        doc.setFillColor(...colores.fondo);
        doc.rect(0, 0, doc.internal.pageSize.getWidth(), 20, 'F');

        doc.addImage(logo, "PNG", 8, 1.5, 20, 18);

        doc.setTextColor(...colores.texto);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.text(
          "REPORTE DE SUSCRIPCIONES",
          doc.internal.pageSize.getWidth() / 2,
          13,
          { align: "center" }
        );

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(`Generado: ${fechaStr}`, doc.internal.pageSize.width - 4, 8, { align: "right" });
        doc.text(`Hora: ${horaStr}`, doc.internal.pageSize.width - 4, 12, { align: "right" });
        doc.text(`Usuario: ${idUsuario}`, doc.internal.pageSize.width - 4, 16, { align: "right" });

        let yPosition = 28;
        if (fecha || busqueda) {
          doc.setFillColor(245, 245, 245);
          doc.rect(10, yPosition, 190, 10, 'F');

          doc.setTextColor(0, 0, 0);
          doc.setFontSize(10);

          let filtroTexto = "Filtros aplicados: ";
          if (fecha) filtroTexto += `Fecha: ${fecha} `;
          if (busqueda) filtroTexto += `Busqueda: "${busqueda}"`;

          doc.text(filtroTexto, 15, yPosition + 7);
          yPosition += 12;
        }

        autoTable(doc, {
  startY: yPosition,
  head: [[
    "N°\npago",
    "Cliente",
    "DNI",
    "Plan",
    "Precio",
    "Duración",
    "M. Pago",
    "F. Pago.",
    "Hr. Pago.",
    "F. Registro",
    "F. Venc.",
    "Estado"
  ]],
  body: pagosplanesOrdenados.map((p) => [
    p.id || "N/A",
    p.nombre_cliente || "Sin nombre",
    p.dni_cliente || "Sin DNI",
    p.nombre_plan || "Sin plan",
    `S/ ${parseFloat(p.precio || 0).toFixed(2)}`,
    p.nombre_condicion || "Sin condición",
    (p.metodo_pago === 1 || p.metodo_pago === "1") ? "Efectivo" :
    (p.metodo_pago === 2 || p.metodo_pago === "2") ? "Yape/Plin" : "Desconocido",
    p.fecha ? new Date(p.fecha).toLocaleDateString("es-PE") : "Sin fecha",
    p.hora || "Sin hora",
    p.fecha_reg ? new Date(p.fecha_reg).toLocaleDateString("es-PE") : "Sin fecha",
    p.fecha_venc ? new Date(p.fecha_venc).toLocaleDateString("es-PE") : "Sin fecha",
    (p.estado === 1 || p.estado === "1") ? "Pagado" : "Pendiente"
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
    cellPadding: 3,
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
  margin: { top: 15, bottom: 30, left: 15, right: 15 }, // más pequeño para más espacio
  tableWidth: 'auto', // más ancho
  styles: {
    minCellWidth: 15, // un poco más ancho cada celda
    overflow: 'linebreak'
  }
});


        const totalRegistros = pagosplanesOrdenados.length;
        const montoTotal = pagosplanesOrdenados.reduce((acc, p) => acc + parseFloat(p.precio || 0), 0);

        let totalY = doc.lastAutoTable.finalY ? doc.lastAutoTable.finalY + 10 : yPosition + 20;
        const cuadroAncho = 130;
        const cuadroAlto = 13;
        const pageWidth = doc.internal.pageSize.getWidth();
        const cuadroX = (pageWidth - cuadroAncho) / 2;

        doc.setFillColor(0, 0, 0);
        doc.rect(cuadroX, totalY, cuadroAncho, cuadroAlto, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text("TOTAL DE REGISTROS", cuadroX + cuadroAncho / 4, totalY + 5.5, { align: "center" });
        doc.text("MONTO TOTAL RECAUDADO", cuadroX + (3 * cuadroAncho) / 4, totalY + 5.5, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`${totalRegistros}`, cuadroX + cuadroAncho / 4, totalY + 11, { align: "center" });
        doc.text(`S/ ${montoTotal.toFixed(2)}`, cuadroX + (3 * cuadroAncho) / 4, totalY + 11, { align: "center" });

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

  const logo = new window.Image();
  logo.src = "/imagenes/logo-toreto.png";

  logo.onload = () => {
    try {
      const logoWidth = 20;
      const logoHeight = 15;
      const logoX = (doc.internal.pageSize.getWidth() - logoWidth) / 2;
      let y = 5;

      // Logo
      doc.addImage(logo, "PNG", logoX, y, logoWidth, logoHeight);
      y += logoHeight + 2;

      // Nombre de empresa (centrado)
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      const empresa = "ToretoGym S.A.C";
      const empresaX = (doc.internal.pageSize.getWidth() - doc.getStringUnitWidth(empresa) * doc.internal.getFontSize() / doc.internal.scaleFactor) / 2;
      doc.text(empresa, empresaX, y);
      y += 4;

      // RUC (centrado)
      doc.setFont("helvetica", "normal");
      const rucText = `RUC: 10708424906`;
      const rucX = (doc.internal.pageSize.getWidth() - doc.getStringUnitWidth(rucText) * doc.internal.getFontSize() / doc.internal.scaleFactor) / 2;
      doc.text(rucText, rucX, y);
      y += 4;

      // Teléfono (centrado)
      const telText = `Tel: 976664659`;
      const telX = (doc.internal.pageSize.getWidth() - doc.getStringUnitWidth(telText) * doc.internal.getFontSize() / doc.internal.scaleFactor) / 2;
      doc.text(telText, telX, y);
      y += 4;

      // Dirección (alineado a la izquierda como en el original)
      doc.text(`Dirección: Av 9 de Octubre Jr. Manco Capac`, 5, y);
      y += 4;

      // Línea separadora
      doc.setDrawColor(150, 150, 150);
      doc.setLineWidth(0.4);
      doc.line(5, y, 75, y);
      y += 5;

      // Título de la boleta
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      const textTitle = "BOLETA ELECTRONICA";
      const titleX = (doc.internal.pageSize.getWidth() - doc.getStringUnitWidth(textTitle) * doc.internal.getFontSize() / doc.internal.scaleFactor) / 2;
      doc.text(textTitle, titleX, y);
      y += 6;

      doc.setFontSize(12);

      const numBoleta = Number(p.numero_boleta || p.id || 0);
      const serieNumero = Math.floor(numBoleta / 1000) + 1;
      const serie = `B${serieNumero.toString().padStart(3, '0')}`;
      const correlativo = numBoleta % 1000;
      const correlativoStr = correlativo.toString().padStart(6, '0');
      const numeroCompleto = `${serie}-${correlativoStr}`;

      const numX = (doc.internal.pageSize.getWidth() - doc.getStringUnitWidth(numeroCompleto) * doc.internal.getFontSize() / doc.internal.scaleFactor) / 2;
      doc.text(numeroCompleto, numX, y);
      y += 4;

      doc.setDrawColor(150, 150, 150);
      doc.setLineWidth(0.4);
      doc.line(5, y, 75, y);
      y += 5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
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
      doc.text(`Emitido el: ${fechaStr}`, 5, y);

      // Mostrar hora un poco más hacia la izquierda (desde el borde derecho)
      const horaTexto = `Hora: ${horaStr}`;
      const pageWidth = doc.internal.pageSize.getWidth();
      const horaX = pageWidth - doc.getStringUnitWidth(horaTexto) * doc.internal.getFontSize() / doc.internal.scaleFactor - 5;

      doc.text(horaTexto, horaX, y);
      doc.text(`Usuario: ${idUsuario}`, 5, y + 5);
      doc.text(`Fecha del Pago: ${new Date(p.fecha).toLocaleDateString("es-PE")}`, 5, y + 10);
      doc.text(`Hora del Pago: ${p.hora}`, 5, y + 15);
      //doc.text(`ID Detalle: ${p.id_detalle}`, 5, y + 20);

      y += 20;

      // Línea separadora añadida antes de DATOS DEL CLIENTE
      doc.setDrawColor(150, 150, 150);
      doc.setLineWidth(0.4);
      doc.line(5, y, 75, y);
      y += 5;

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
      doc.text("DETALLE DEL PAGO DE SUSCRIPCION", 5, y);
      doc.setFont("helvetica", "normal");
      y += 5;

      // Agregar método de pago aquí
      const metodoPago = p.metodo_pago === 1 || p.metodo_pago === "1" 
        ? "Efectivo" 
        : p.metodo_pago === 2 || p.metodo_pago === "2" 
          ? "Yape/Plin" 
          : "Desconocido";
      
      doc.setFont("helvetica", "bold");
      doc.text(`METODO DE PAGO: ${metodoPago}`, 5, y);
      doc.setFont("helvetica", "normal");
      y += 5;

      doc.setFont("helvetica", "bold");
      doc.text("PLAN", 5, y);
      doc.text("MONTO", 30, y);
      doc.text("F.REG", 48, y);
      doc.text("F.VENC", 66, y);
      doc.setFont("helvetica", "normal");
      y += 4;

      const planLines = doc.splitTextToSize(p.nombre_plan, 25);
      planLines.forEach((line, index) => {
        doc.text(line, 5, y + index * 4);
      });

      const linesUsed = planLines.length;
      doc.text(`S/ ${parseFloat(p.precio).toFixed(2)}`, 30, y);
      doc.text(new Date(p.fecha_reg).toLocaleDateString("es-PE"), 48, y);
      doc.text(new Date(p.fecha_venc).toLocaleDateString("es-PE"), 66, y);

      y += 4 * linesUsed;

      doc.setDrawColor(150, 150, 150);
      doc.setLineWidth(0.4);
      doc.line(5, y, 75, y);
      y += 4;

      doc.setFont("helvetica", "bold");
      doc.text(`Estado: ${p.estado === 1 || p.estado === "1" ? "PAGADO" : "PENDIENTE"}`, 5, y);
      y += 5;

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
          variant="dark" 
          onClick={generarReporteGeneral} 
          className="d-flex align-items-center gap-2 px-3 py-2 shadow-sm rounded"
        >
          <FaFilePdf size={18} />
          <span>Reporte General</span>
        </Button>
      </div>

      <Card className="border-0 shadow-sm mb-3">
        <div className="table-responsive" style={{ maxHeight: "600px", overflowY: "auto" }}>
          <Table hover className="mb-0" style={{ fontSize: "0.95rem" }}>
            <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
              <tr>
                <th className="fw-bold" style={{ background: "#FFD700", color: "#111", borderTop: "1px solid #dee2e6", borderBottom: "1px solid #dee2e6", borderLeft: "none", borderRight: "none" }}>N° PAGO</th>
                <th className="fw-bold" style={{ background: "#FFD700", color: "#111", borderTop: "1px solid #dee2e6", borderBottom: "1px solid #dee2e6", borderLeft: "none", borderRight: "none" }}>CLIENTE</th>
                <th className="fw-bold" style={{ background: "#FFD700", color: "#111", borderTop: "1px solid #dee2e6", borderBottom: "1px solid #dee2e6", borderLeft: "none", borderRight: "none" }}>DNI</th>
                <th className="fw-bold" style={{ background: "#FFD700", color: "#111", borderTop: "1px solid #dee2e6", borderBottom: "1px solid #dee2e6", borderLeft: "none", borderRight: "none" }}>PLAN</th>
                <th className="fw-bold" style={{ background: "#FFD700", color: "#111", borderTop: "1px solid #dee2e6", borderBottom: "1px solid #dee2e6", borderLeft: "none", borderRight: "none" }}>PRECIO</th>
                <th className="fw-bold" style={{ background: "#FFD700", color: "#111", borderTop: "1px solid #dee2e6", borderBottom: "1px solid #dee2e6", borderLeft: "none", borderRight: "none" }}>DURACIÓN</th>
                <th className="fw-bold" style={{ background: "#FFD700", color: "#111", borderTop: "1px solid #dee2e6", borderBottom: "1px solid #dee2e6", borderLeft: "none", borderRight: "none" }}>M. PAGO</th>
                <th className="fw-bold" style={{ background: "#FFD700", color: "#111", borderTop: "1px solid #dee2e6", borderBottom: "1px solid #dee2e6", borderLeft: "none", borderRight: "none" }}>FECHA PAGO</th>
                <th className="fw-bold" style={{ background: "#FFD700", color: "#111", borderTop: "1px solid #dee2e6", borderBottom: "1px solid #dee2e6", borderLeft: "none", borderRight: "none" }}>HORA PAGO</th>
                <th className="fw-bold" style={{ background: "#FFD700", color: "#111", borderTop: "1px solid #dee2e6", borderBottom: "1px solid #dee2e6", borderLeft: "none", borderRight: "none" }}>FECHA REGISTRO</th>
                <th className="fw-bold" style={{ background: "#FFD700", color: "#111", borderTop: "1px solid #dee2e6", borderBottom: "1px solid #dee2e6", borderLeft: "none", borderRight: "none" }}>FECHA VENC.</th>
                <th className="fw-bold" style={{ background: "#FFD700", color: "#111", borderTop: "1px solid #dee2e6", borderBottom: "1px solid #dee2e6", borderLeft: "none", borderRight: "none" }}>ESTADO</th>
                <th className="fw-bold text-center" style={{ background: "#FFD700", color: "#111", borderTop: "1px solid #dee2e6", borderBottom: "1px solid #dee2e6", borderLeft: "none", borderRight: "none" }}>ACCIÓN</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((p) => (
                  <tr key={p.id}>
                    <td className="fw-bold fs-6 align-middle">{p.id}</td>
                    <td className="fw-medium align-middle">{p.nombre_cliente}</td>
                    <td className="fw-medium align-middle">{p.dni_cliente?.trim() ? p.dni_cliente : "Sin DNI"}</td>
                    <td className="fw-medium align-middle">{p.nombre_plan}</td>
                    <td className="fw-medium align-middle text-end">S/ {parseFloat(p.precio).toFixed(2)}</td>
                    <td className="align-middle">
                      <span className={`badge rounded-pill ${
                        (() => {
                          switch (p.id_condicion) {
                            case 1: return "bg-primary text-white";
                            case 2: return "bg-success text-white";
                            case 3: return "bg-info text-white";
                            case 4: return "bg-warning text-dark";
                            case 5: return "bg-danger text-white";
                            default: return "bg-secondary text-white";
                          }
                        })()
                      }`}>
                        {p.nombre_condicion ?? "No disponible"}
                      </span>
                    </td>
                    <td className="align-middle">
                      <span className={`badge rounded-pill ${
                        p.metodo_pago === 1 || p.metodo_pago === "1" 
                          ? "bg-primary" 
                          : p.metodo_pago === 2 || p.metodo_pago === "2" 
                            ? "bg-info" 
                            : "bg-secondary"
                      }`}>
                        {p.metodo_pago === 1 || p.metodo_pago === "1"
                          ? "Efectivo"
                          : p.metodo_pago === 2 || p.metodo_pago === "2"
                          ? "Yape/Plin"
                          : "Desconocido"}
                      </span>
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
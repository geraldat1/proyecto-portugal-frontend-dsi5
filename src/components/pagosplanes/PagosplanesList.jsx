import React, { useState } from "react";
import { Table, Button, Pagination, InputGroup, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { FaSearch, FaFilePdf } from "react-icons/fa";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";


const PagosplanesList = ({ pagosplanes, seleccionar, eliminar }) => {
  const { user } = useContext(AuthContext);
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const elementosPorPagina = 5;

  const pagosplanesFiltrados = pagosplanes.filter((p) => {
    const cliente = p.nombre_cliente?.toLowerCase() || "";
    const plan = p.nombre_plan?.toLowerCase() || "";
    const dni = p.dni_cliente?.toLowerCase() || "";
    return cliente.includes(busqueda.toLowerCase()) || plan.includes(busqueda.toLowerCase()) ||dni.includes(busqueda.toLowerCase());
  });

  const pagosplanesOrdenadas = [...pagosplanesFiltrados].sort((a, b) => b.id - a.id);
  const totalPaginas = Math.ceil(pagosplanesOrdenadas.length / elementosPorPagina);
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const pagosplanesPaginadas = pagosplanesOrdenadas.slice(indiceInicio, indiceInicio + elementosPorPagina);

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

  // BOLERA GENERAL
    const generarReporteGeneral = () => {
  const doc = new jsPDF();
  const logo = new Image();
  logo.src = "/imagenes/logo-toreto-original.jpg";

  logo.onload = () => {
    // Datos de fecha, hora y usuario
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
    const idUsuario = user?.id || "Desconocido";

    // Logo y encabezado
    doc.addImage(logo, "PNG", 14, 10, 30, 15);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Reporte General de Pagos de Planes", 50, 20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Fecha: ${fechaStr} - Hora: ${horaStr}`, 50, 25);
    doc.text(`Usuario ID: ${idUsuario}`, 50, 30);

    // Tabla de datos
    autoTable(doc, {
      startY: 35,
      head: [["ID", "Detalle", "Cliente", "DNI", "Plan", "Precio", "Fecha", "Hora", "Estado"]],
      body: pagosplanesOrdenadas.map((p) => [
        p.id,
        p.id_detalle,
        p.nombre_cliente,
        p.dni_cliente || "Sin DNI",
        p.nombre_plan,
        `S/ ${parseFloat(p.precio).toFixed(2)}`,
        new Date(p.fecha).toLocaleDateString("es-PE"),
        p.hora,
        p.estado === 1 || p.estado === "1" ? "Pagado" : "Pendiente"
      ]),
      didDrawPage: (data) => {
        // Número de página
        const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
        const totalPages = doc.internal.getNumberOfPages();
        doc.setFontSize(9);
        doc.text(
          `Página ${pageNumber} de ${totalPages}`,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      },
    });

    // Mostrar el PDF
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  };

  logo.onerror = () => {
    alert("No se pudo cargar el logo de la empresa. Verifica la ruta.");
  };
};

// BOLETA DE LOS REGISTROS
    const generarBoleta = (p) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [80, 200],
    putOnlyUsedFonts: true,
    floatPrecision: 16,
  });

  // Configuración inicial
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  
  // Datos básicos
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
  const numeroCompleto = `B00${p.numero_boleta || '000'}${p.id}`; // Formato B00 + N° Boleta + ID

  // Carga del logo
  const logo = new Image();
  logo.src = "/imagenes/logo-toreto-original.jpg";

  logo.onload = () => {
    try {
      // 1. Encabezado con logo
      const logoWidth = 20;
      const logoHeight = 15;
      const logoX = (doc.internal.pageSize.getWidth() - logoWidth) / 2;
      doc.addImage(logo, "PNG", logoX, 5, logoWidth, logoHeight);

      // 2. Título del documento y número completo de boleta
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      const textTitle = "BOLETA DE PAGO";
      const titleX = (doc.internal.pageSize.getWidth() - doc.getStringUnitWidth(textTitle) * doc.internal.getFontSize() / doc.internal.scaleFactor) / 2;
      doc.text(textTitle, titleX, 28);
      
      // Número completo de boleta (B00 + N° + ID)
      doc.setFontSize(12);
      const numX = (doc.internal.pageSize.getWidth() - doc.getStringUnitWidth(numeroCompleto) * doc.internal.getFontSize() / doc.internal.scaleFactor) / 2;
      doc.text(numeroCompleto, numX, 35);
      doc.setFont("helvetica", "normal");
      
      // 3. Información de emisión
      doc.setFontSize(8);
      doc.text(`Emitido el: ${fechaStr} - ${horaStr}`, 5, 43);  // Fecha y hora en la misma línea
      doc.text(`Usuario ID: ${idUsuario}`, 5, 48);
      doc.text(`ID Detalle: ${p.id_detalle}`, 5, 53);
      
      // Línea divisoria PRINCIPAL
      doc.setDrawColor(100, 100, 100);
      doc.setLineWidth(0.5);
      doc.line(5, 58, 75, 58);

      let y = 64;

      // --- DATOS DEL CLIENTE ---
      doc.setFont("helvetica", "bold");
      doc.text("DATOS DEL CLIENTE", 5, y);
      doc.setFont("helvetica", "normal");
      y += 5;
      doc.text(`Nombre: ${p.nombre_cliente}`, 5, y);
      y += 5;
      doc.text(`DNI: ${p.dni_cliente?.trim() ? p.dni_cliente : "Sin DNI"}`, 5, y);
      y += 6; // más espacio antes de la línea

      // Línea divisoria
      doc.setDrawColor(150, 150, 150);
      doc.setLineWidth(0.4);
      doc.line(5, y, 75, y);
      y += 5;

      // --- DETALLE DEL PAGO ---
      doc.setFont("helvetica", "bold");
      doc.text("DETALLE DEL PAGO", 5, y);
      doc.setFont("helvetica", "normal");
      y += 5;
      const planText = `Plan: ${p.nombre_plan}`;
      const splitPlan = doc.splitTextToSize(planText, 70);
      splitPlan.forEach(line => {
        doc.text(line, 5, y);
        y += 4;
      });
      doc.text(`Precio: S/ ${parseFloat(p.precio).toFixed(2)}`, 5, y);
      y += 5;
      doc.text(`Fecha servicio: ${new Date(p.fecha).toLocaleDateString("es-PE")}`, 5, y);
      y += 5;
      doc.text(`Hora servicio: ${p.hora}`, 5, y);
      y += 6; // espacio antes de la línea

      // Línea divisoria
      doc.setDrawColor(150, 150, 150);
      doc.setLineWidth(0.4);
      doc.line(5, y, 75, y);
      y += 5;

      // --- ESTADO ---
      doc.setFont("helvetica", "bold");
      doc.text(`Estado: ${p.estado === 1 || p.estado === "1" ? "PAGADO" : "PENDIENTE"}`, 5, y);
      y += 6;

      // Línea final
      doc.setDrawColor(100, 100, 100);
      doc.setLineWidth(0.6);
      doc.line(5, y, 75, y);

      // --- Pie de página ---
      doc.setFontSize(7);
      doc.text("Gracias por su preferencia", 5, y + 5);
      doc.text("Este documento es válido como comprobante de pago", 5, y + 9);

      // Generar y abrir PDF
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
      
    } catch (error) {
      console.error("Error al generar boleta:", error);
      Swal.fire("Error", "Ocurrió un problema al generar la boleta", "error");
    }
  };

  logo.onerror = () => {
    Swal.fire("Error", "No se pudo cargar el logo. Verifica la ruta.", "error");
  };
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
        <Pagination.Item key={i} active={i === paginaActual} onClick={() => setPaginaActual(i)}>
          {i}
        </Pagination.Item>
      );
    }

    return paginas;
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Group style={{ maxWidth: "300px", marginBottom: 0 }}>
          <InputGroup size="sm">
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1);
              }}
            />
          </InputGroup>
        </Form.Group>
        <Button variant="success" size="sm" onClick={generarReporteGeneral}>
          Generar Reporte General
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>N°</th>
            <th>Detalle</th>
            <th>Cliente</th>
            <th>Dni</th>
            <th>Plan</th>
            <th>Precio</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pagosplanesPaginadas.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.id_detalle}</td>
              <td>{p.nombre_cliente}</td>
              <td>{p.dni_cliente?.trim() ? p.dni_cliente : "Sin DNI"}</td>
              <td>{p.nombre_plan}</td>
              <td className="text-end">S/ {parseFloat(p.precio).toFixed(2)}</td>
              <td>{new Date(p.fecha).toLocaleDateString("es-PE")}</td>
              <td>{p.hora}</td>
              <td>
                <span className={p.estado === 1 || p.estado === "1" ? "text-success fw-bold" : "text-warning fw-bold"}>
                  {p.estado === 1 || p.estado === "1" ? "Pagado" : "Pendiente"}
                </span>
              </td>
              <td>
                <Button variant="warning" size="sm" onClick={() => seleccionar(p)}>
                  Editar
                </Button>{" "}
                <Button variant="danger" size="sm" onClick={() => confirmarEliminacion(p.id)}>
                  Eliminar
                </Button>{" "}
                <Button variant="info" size="sm" onClick={() => generarBoleta(p)}>
                  <FaFilePdf size={22}/>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination className="justify-content-center">
        <Pagination.First onClick={irPrimeraPagina} disabled={paginaActual === 1} />
        <Pagination.Prev onClick={irAnterior} disabled={paginaActual === 1} />
        {obtenerItemsPaginacion()}
        <Pagination.Next onClick={irSiguiente} disabled={paginaActual === totalPaginas} />
        <Pagination.Last onClick={irUltimaPagina} disabled={paginaActual === totalPaginas} />
      </Pagination>
    </>
  );
};

export default PagosplanesList;

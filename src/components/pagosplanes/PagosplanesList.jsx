import React, { useState } from "react";
import { Table, Button, Pagination, InputGroup, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { FaSearch, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const PagosplanesList = ({ pagosplanes, seleccionar, eliminar }) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const elementosPorPagina = 5;

  const pagosplanesFiltrados = pagosplanes.filter((p) => {
    const cliente = p.nombre_cliente?.toLowerCase() || "";
    const plan = p.nombre_plan?.toLowerCase() || "";
    return cliente.includes(busqueda.toLowerCase()) || plan.includes(busqueda.toLowerCase());
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

    const generarReporteGeneral = () => {
    const doc = new jsPDF();
    doc.text("Reporte General de Pagos de Planes", 14, 10);

    autoTable(doc, {
      startY: 20,
      head: [["ID", "Detalle", "Cliente", "Plan", "Precio", "Fecha", "Hora", "Estado"]],
      body: pagosplanesOrdenadas.map((p) => [
        p.id,
        p.id_detalle,
        p.nombre_cliente,
        p.nombre_plan,
        `S/ ${parseFloat(p.precio).toFixed(2)}`,
        new Date(p.fecha).toLocaleDateString("es-PE"),
        p.hora,
        p.estado === 1 || p.estado === "1" ? "Pagado" : "Pendiente"
      ]),
    });

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  };


    const generarBoleta = (p) => {
    const doc = new jsPDF();
    doc.text("Boleta de Pago", 14, 10);
    doc.setFontSize(12);

    doc.text(`ID: ${p.id}`, 14, 20);
    doc.text(`Detalle: ${p.id_detalle}`, 14, 30);
    doc.text(`Cliente: ${p.nombre_cliente}`, 14, 40);
    doc.text(`Plan: ${p.nombre_plan}`, 14, 50);
    doc.text(`Precio: S/ ${parseFloat(p.precio).toFixed(2)}`, 14, 60);
    doc.text(`Fecha: ${new Date(p.fecha).toLocaleDateString("es-PE")}`, 14, 70);
    doc.text(`Hora: ${p.hora}`, 14, 80);
    doc.text(`Estado: ${p.estado === 1 || p.estado === "1" ? "Pagado" : "Pendiente"}`, 14, 90);

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
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
            <th>ID</th>
            <th>Detalle</th>
            <th>Cliente</th>
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

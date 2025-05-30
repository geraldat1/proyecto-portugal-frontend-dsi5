import React, { useState } from "react";
import { Table, Button, Pagination, Form, InputGroup } from "react-bootstrap";
import { FaCheck, FaSearch, FaCalendarAlt } from "react-icons/fa";

const AsistenciaList = ({ asistencias, seleccionar, entrenadores, detallesPlanes, clientes }) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [fecha, setFecha] = useState("");
  const [asistenciasActualizadas, setAsistenciasActualizadas] = useState(new Set());

  const elementosPorPagina = 5;

  const obtenerNombreEntrenador = (id_entrenador) => {
    const entrenador = entrenadores.find(e => e.id === id_entrenador);
    return entrenador ? entrenador.nombre : "Desconocido";
  };

  const obtenerNombreClientePorDetalle = (id_detalle) => {
    const detalle = detallesPlanes.find(d => String(d.id) === String(id_detalle));
    if (!detalle) return "Detalle desconocido";
    const cliente = clientes.find(c => String(c.id) === String(detalle.id_cliente));
    return cliente ? cliente.nombre : "Cliente desconocido";
  };

  const manejarSeleccion = async (asistencia) => {
    try {
      // Esperamos que seleccionar retorne true si la actualización fue exitosa
      const exito = await seleccionar(asistencia);
      if (exito) {
        setAsistenciasActualizadas(prev => new Set(prev).add(asistencia.id_asistencia));
      }
    } catch (error) {
      console.error("Error al actualizar asistencia:", error);
    }
  };

  const asistenciasFiltradas = asistencias.filter((a) => {
    const clienteNombre = obtenerNombreClientePorDetalle(a.id_detalle).toLowerCase();
    const entrenadorNombre = obtenerNombreEntrenador(a.id_entrenador).toLowerCase();
    const filtroBusqueda = busqueda.toLowerCase();

    if (!fecha) return clienteNombre.includes(filtroBusqueda) || entrenadorNombre.includes(filtroBusqueda);

    const fechaAsistenciaStr = new Date(a.fecha).toISOString().split("T")[0];
    const fechaFiltroStr = fecha;

    return (clienteNombre.includes(filtroBusqueda) || entrenadorNombre.includes(filtroBusqueda)) && (fechaAsistenciaStr === fechaFiltroStr);
  });

  const asistenciasOrdenadas = [...asistenciasFiltradas].sort((a, b) => b.id_asistencia - a.id_asistencia);

  const totalPaginas = Math.ceil(asistenciasOrdenadas.length / elementosPorPagina);
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFinal = indiceInicio + elementosPorPagina;
  const asistenciasPaginadas = asistenciasOrdenadas.slice(indiceInicio, indiceFinal);

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

  const limpiarFiltros = () => {
    setBusqueda("");
    setFecha("");
    setPaginaActual(1);
  };

  return (
    <>
      {/* Filtros de búsqueda y fecha */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Group className="mb-0" style={{ maxWidth: "300px" }}>
          <InputGroup size="sm">
            <InputGroup.Text className="bg-white border-end-0">
              <FaSearch className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar por cliente o entrenador"
              className="border-start-0"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1);
              }}
            />
          </InputGroup>
        </Form.Group>
      </div>

      <div className="d-flex align-items-center mb-3 gap-2">
        <div className="d-flex align-items-center gap-2">
          <FaCalendarAlt className="text-secondary" />
          <Form.Control
            type="date"
            size="sm"
            className="w-auto"
            value={fecha}
            onChange={(e) => {
              setFecha(e.target.value);
              setPaginaActual(1);
            }}
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
            setPaginaActual(1);
          }}
        >
          Hoy
        </Button>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={limpiarFiltros}
          disabled={!fecha && !busqueda}
        >
          Limpiar filtros
        </Button>
      </div>

      {/* Tabla */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>F.Registro</th>
            <th>Hora de Entrada</th>
            <th>Hora de Salida</th>
            <th>Cliente</th>
            <th>Entrenador</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {asistenciasPaginadas.length > 0 ? (
            asistenciasPaginadas.map((asistencia) => (
              <tr key={asistencia.id_asistencia}>
                <td>{asistencia.id_asistencia}</td>
                <td>{new Date(asistencia.fecha).toLocaleDateString()}</td>
                <td>{asistencia.hora_entrada}</td>
                <td>{asistencia.hora_salida}</td>
                <td>{obtenerNombreClientePorDetalle(asistencia.id_detalle)}</td>
                <td>{obtenerNombreEntrenador(asistencia.id_entrenador)}</td>
                <td>
                  <span className={`badge ${asistencia.estado === 1 ? 'bg-success' : 'bg-danger'}`}>
                    {asistencia.estado === 1 ? "En Gym" : "Salido"}
                  </span>
                </td>
                <td>
                  <Button
                    variant="success"
                    onClick={() => manejarSeleccion(asistencia)}
                    disabled={asistenciasActualizadas.has(asistencia.id_asistencia) || asistencia.estado === 0}
                  >
                    <FaCheck />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center text-muted">
                No se encontraron asistencias con los filtros aplicados
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Paginación */}
      {asistenciasFiltradas.length > 0 && (
        <Pagination className="justify-content-center">
          <Pagination.First onClick={irPrimeraPagina} disabled={paginaActual === 1} />
          <Pagination.Prev onClick={irAnterior} disabled={paginaActual === 1} />
          {obtenerItemsPaginacion()}
          <Pagination.Next onClick={irSiguiente} disabled={paginaActual === totalPaginas} />
          <Pagination.Last onClick={irUltimaPagina} disabled={paginaActual === totalPaginas} />
        </Pagination>
      )}
    </>
  );
};

export default AsistenciaList;

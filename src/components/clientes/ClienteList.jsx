import React, { useState } from "react";
import { Table, Button, Pagination, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { BiEdit, BiBlock } from "react-icons/bi";

import { FaUserCheck, FaSearch } from "react-icons/fa";
import { InputGroup } from "react-bootstrap";



const ClienteList = ({ clientes, seleccionar, eliminar }) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const elementosPorPagina = 5;

  const clientesFiltrados = clientes.filter((cliente) => {
    const texto = busqueda.toLowerCase();
    return (
      cliente.dni.toString().includes(texto) ||
      cliente.nombre.toLowerCase().includes(texto) ||
      cliente.telefono.toLowerCase().includes(texto) ||
      cliente.direccion.toLowerCase().includes(texto)
    );
  });

  const clientesOrdenados = [...clientesFiltrados].sort((a, b) => b.id - a.id);

  const totalPaginas = Math.ceil(clientesOrdenados.length / elementosPorPagina);
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFinal = indiceInicio + elementosPorPagina;
  const clientesPaginados = clientesOrdenados.slice(indiceInicio, indiceFinal);

  const clientesActivos = clientes.filter(cliente => cliente.estado === 1).length;

  const confirmarEliminacion = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Esto deshabilitará al cliente y no podrá revertirse fácilmente!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, deshabilitar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminar(id);
        Swal.fire("¡Deshabilitado!", "El cliente ha sido deshabilitado.", "success").then(() => {
          const boton = document.querySelector("button");
          if (boton) boton.focus();
        });
      }
    });
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
        <Pagination.Item
          key={i}
          active={i === paginaActual}
          onClick={() => setPaginaActual(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    return paginas;
  };

  return (
    <>
      {/* Buscador */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Group className="mb-0" style={{ maxWidth: 300 }}>
          <InputGroup size="sm">
            <InputGroup.Text className="bg-white border-end-0">
              <FaSearch className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar"
              className="border-start-0"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1);
              }}
              autoComplete="off"
              spellCheck={false}
            />
          </InputGroup>
        </Form.Group>


        <div style={{ fontSize: "1.1rem", fontWeight: "500" }} className="d-flex align-items-center">
          <FaUserCheck size={20} className="me-2 text-success" />
          Clientes activos: {clientesActivos}
        </div>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>DNI</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientesPaginados.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.id}</td>
              <td>{cliente.dni}</td>
              <td>{cliente.nombre}</td>
              <td>{cliente.telefono}</td>
              <td>{cliente.direccion}</td>
              <td>{new Date(cliente.fecha).toLocaleDateString()}</td>
              <td>
                <span className={`badge ${cliente.estado === 1 ? 'bg-success' : 'bg-secondary'}`}>
                  {cliente.estado === 1 ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td>
                <Button 
                  variant="warning" 
                  onClick={() => seleccionar(cliente)} 
                  title="Editar" 
                  disabled={cliente.estado === 0}
                >
                  <BiEdit size={22} />
                </Button>{" "}
                <Button 
                  variant="danger" 
                  onClick={() => confirmarEliminacion(cliente.id)} 
                  title="Eliminar"
                  disabled={cliente.estado === 0}
                >
                  <BiBlock  size={22} />
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

export default ClienteList;

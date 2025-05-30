import React, { useState } from "react";
import { Table, Button, Pagination } from "react-bootstrap";
import Swal from "sweetalert2";

import { BiEdit, BiBlock } from "react-icons/bi";


const UsuarioList = ({ usuarios, seleccionar, eliminar }) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  const totalPaginas = Math.ceil(usuarios.length / elementosPorPagina);
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFinal = indiceInicio + elementosPorPagina;
  const usuariosPaginados = usuarios.slice(indiceInicio, indiceFinal);

  const confirmarEliminacion = (id) => {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "¡El usuario será deshabilitado y no podrá acceder!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, deshabilitar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      eliminar(id);
      Swal.fire("¡Deshabilitado!", "El usuario ha sido deshabilitado.", "success");
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
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Nombre</th>
            <th>Correo</th>
            {/* <th>Clave</th> Eliminado */}
            <th>Teléfono</th>
            {/* <th>Foto</th> Eliminado */}
            <th>Rol</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosPaginados.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.usuario}</td>
              <td>{p.nombre}</td>
              <td>{p.correo}</td>
              {/* <td>{p.clave}</td> Eliminado */}
              <td>{p.telefono}</td>
              {/* Campo foto eliminado */}
              <td>
                <span className={`badge ${p.rol === 1 || p.rol === '1' ? 'bg-success' : 'bg-primary'}`}>
                  {p.rol === 1 || p.rol === '1' ? 'Administrador' : 'Empleado'}
                </span>
              </td>
              <td>{new Date(p.fecha).toLocaleDateString()}</td>
              <td>
                <span className={`badge ${p.estado === 1 || p.estado === '1' ? 'bg-success' : 'bg-secondary'}`}>
                  {p.estado === 1 || p.estado === '1' ? 'Activo' : 'Deshabilitado'}
                </span>
              </td>
              <td>
                <Button 
                  variant="warning" 
                  onClick={() => seleccionar(p)} 
                  title="Editar" 
                  disabled={p.estado === 0 || p.estado === '0'}  // Aquí está la condición
                  className="me-2"
                >
                  <BiEdit size={22} />
                </Button>
                <Button 
                  variant="danger" 
                  onClick={() => confirmarEliminacion(p.id)} 
                  title="Deshabilitar" 
                  disabled={p.estado === 0 || p.estado === '0'}  // Y aquí también
                >
                  <BiBlock size={22} />
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

export default UsuarioList;
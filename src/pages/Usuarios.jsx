import React, { useEffect, useState } from "react";
import { obtenerUsuarios, agregarUsuario, actualizarUsuario, eliminarUsuario } from "../services/usuarioService";
import UsuarioList from "../components/usuarios/UsuarioList";
import UsuarioForm from "../components/usuarios/UsuarioForm";
import { Button } from "react-bootstrap";

import { FaUserPlus } from "react-icons/fa";


const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    const datos = await obtenerUsuarios();
    setUsuarios(datos);
  };

  const agregar = async (usuario) => {
    await agregarUsuario(usuario);
    cargarUsuarios();
    setMostrarModal(false);
  };

  const actualizar = async (id, usuario) => {
    await actualizarUsuario(id, usuario);
    cargarUsuarios();
    setUsuarioSeleccionado(null);
    setMostrarModal(false);
  };

  const eliminar = async (id) => {
    await eliminarUsuario(id);
    cargarUsuarios();
  };

  // Cuando seleccionamos una usuario, mostramos el modal con los datos
  const seleccionarUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setMostrarModal(true);
  };

  return (
    <div>
      <h2>Administración de Usuarios</h2>
      <Button 
      className="mb-3 d-flex align-items-center gap-2" 
      variant="primary"
      onClick={() => {
        setUsuarioSeleccionado(null);
        setMostrarModal(true);
      }}
    >
      <FaUserPlus />
      Agregar Usuario
    </Button>


      <UsuarioList usuarios={usuarios} seleccionar={seleccionarUsuario} eliminar={eliminar} />
      <UsuarioForm
        show={mostrarModal}
        handleClose={() => setMostrarModal(false)}
        agregar={agregar}
        actualizar={actualizar}
        usuarioSeleccionado={usuarioSeleccionado}
      />
    </div>
  );
};

export default Usuarios;

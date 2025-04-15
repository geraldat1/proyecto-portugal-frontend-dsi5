import React, { useEffect, useState } from "react";
import { obtenerClientes, agregarCliente, actualizarCliente, eliminarCliente } from "../services/clienteService";
import ClienteList from "../components/clientes/ClienteList";
import ClienteForm from "../components/clientes/ClienteForm";
import { Button } from "react-bootstrap";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    const datos = await obtenerClientes();
    setClientes(datos);
  };

  const agregar = async (cliente) => {
    await agregarCliente(cliente);
    cargarClientes();
    setMostrarModal(false);
  };

  const actualizar = async (id, cliente) => {
    await actualizarCliente(id, cliente);
    cargarClientes();
    setClienteSeleccionado(null);
    setMostrarModal(false);
  };

  const eliminar = async (id) => {
    await eliminarCliente(id);
    cargarClientes();
  };

  // Cuando seleccionamos una cliente, mostramos el modal con los datos
  const seleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setMostrarModal(true);
  };

  return (
    <div>
      <h2>Gestión de Clientes</h2>
      <Button 
      className="mb-3" 
      variant="primary"
       onClick={() => {
       seleccionarCliente(null);
       setMostrarModal(true);
      }
      }
       >Agregar Cliente</Button>

      <ClienteList clientes={clientes} seleccionar={seleccionarCliente} eliminar={eliminar} />
      <ClienteForm
        show={mostrarModal}
        handleClose={() => setMostrarModal(false)}
        agregar={agregar}
        actualizar={actualizar}
        clienteSeleccionado={clienteSeleccionado}
      />
    </div>
  );
};

export default Clientes;

const API_URL = "http://localhost:3001/api/v1/clientes"; // Cambia esta URL si tu backend está en otro lugar

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const manejarError = (error) => {
  console.error("Error en clienteService:", error.message);
  if (error.message.includes("401") || error.message.includes("Token")) {
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirecciona al login si el token expiró
  }
};

// Obtener todas las clientes
export const obtenerClientes = async () => {
  try {
    const respuesta = await fetch(API_URL, {
      headers: getAuthHeaders(),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al obtener clientes`);
    }

    return await respuesta.json();
  } catch (error) {
    manejarError(error);
    return []; // Devuelve un array vacío para evitar romper el front
  }
};

// Agregar una cliente
export const agregarCliente = async (cliente) => {
  try {
    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(cliente),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al agregar cliente`);
    }
  } catch (error) {
    manejarError(error);
  }
};

// Actualizar cliente por ID
export const actualizarCliente = async (id, cliente) => {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(cliente),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al actualizar cliente`);
    }
  } catch (error) {
    manejarError(error);
  }
};

// Eliminar cliente por ID
export const eliminarCliente = async (id) => {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al eliminar cliente`);
    }
  } catch (error) {
    manejarError(error);
  }
};

const API_URL = "http://localhost:3001/api/v1/detalleplan"; // Cambia esta URL si tu backend está en otro lugar

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const manejarError = (error) => {
  console.error("Error en detalleplanesService:", error.message);
  if (error.message.includes("401") || error.message.includes("Token")) {
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirecciona al login si el token expiró
  }
};

// Obtener todas las detalleplanes
export const obtenerDetalleplanes= async () => {
  try {
    const respuesta = await fetch(API_URL, {
      headers: getAuthHeaders(),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al obtener detalleplasnes`);
    }

    return await respuesta.json();
  } catch (error) {
    manejarError(error);
    return []; // Devuelve un array vacío para evitar romper el front
  }
};

// Agregar una detallesplanes
export const agregarDetalleplan = async (detalleplan) => {
  try {
    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(detalleplan),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al agregar detalleplanes`);
    }
  } catch (error) {
    manejarError(error);
  }
};

// Actualizar detalleplanes por ID
export const actualizarDetalleplan = async (id, detalleplan) => {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(detalleplan),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al actualizar detalleplan`);
    }
  } catch (error) {
    manejarError(error);
  }
};

// Eliminar detalleplan por ID
export const eliminarDetalleplan= async (id) => {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al eliminar detalleplan`);
    }
  } catch (error) {
    manejarError(error);
  }
};

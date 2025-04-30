const API_URL = "http://localhost:3001/api/v1/pagosplan"; // Cambia esta URL si tu backend está en otro lugar

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const manejarError = (error) => {
  console.error("Error en pagosplanesService:", error.message);
  if (error.message.includes("401") || error.message.includes("Token")) {
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirecciona al login si el token expiró
  }
};

// Obtener todas las pagoplanes
export const obtenerPagoplanes = async () => {
  try {
    const respuesta = await fetch(API_URL, {
      headers: getAuthHeaders(),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al obtener pagosplanes`);
    }

    return await respuesta.json();
  } catch (error) {
    manejarError(error);
    return []; // Devuelve un array vacío para evitar romper el front
  }
};

// Agregar una pagosplan
export const agregarPagosplan = async (pagosplan) => {
  try {
    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(pagosplan),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al agregar pagosplan`);
    }
  } catch (error) {
    manejarError(error);
  }
};

// Actualizar pagosplan por ID
export const actualizarPagosplan = async (id, pagosplan) => {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(pagosplan),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al actualizar pagosplan`);
    }
  } catch (error) {
    manejarError(error);
  }
};

// Eliminar pagosplan por ID
export const eliminarPagosplan = async (id) => {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al eliminar pagosplan`);
    }
  } catch (error) {
    manejarError(error);
  }
};

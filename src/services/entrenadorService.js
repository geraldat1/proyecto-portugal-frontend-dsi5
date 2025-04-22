const API_URL = "http://localhost:3001/api/v1/entrenador"; // Cambia esta URL si tu backend está en otro lugar

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const manejarError = (error) => {
  console.error("Error en entrenadorService:", error.message);
  if (error.message.includes("401") || error.message.includes("Token")) {
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirecciona al login si el token expiró
  }
};

// Obtener todas las entrenadores
export const obtenerEntrenadores = async () => {
  try {
    const respuesta = await fetch(API_URL, {
      headers: getAuthHeaders(),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al obtener entrenadores`);
    }

    return await respuesta.json();
  } catch (error) {
    manejarError(error);
    return []; // Devuelve un array vacío para evitar romper el front
  }
};

// Agregar una entrenador
export const agregarEntrenador = async (entrenador) => {
  try {
    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(entrenador),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al agregar entrenador`);
    }
  } catch (error) {
    manejarError(error);
  }
};

// Actualizar entrenador por ID
export const actualizarEntrenador = async (id, entrenador) => {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(entrenador),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al actualizar entrenador`);
    }
  } catch (error) {
    manejarError(error);
  }
};

// Eliminar entrenador por ID
export const eliminarEntrenador = async (id) => {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al eliminar entrenador`);
    }
  } catch (error) {
    manejarError(error);
  }
};

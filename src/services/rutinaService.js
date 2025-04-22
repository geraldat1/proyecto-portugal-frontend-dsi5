const API_URL = "http://localhost:3001/api/v1/rutinas"; // Cambia esta URL si tu backend está en otro lugar

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const manejarError = (error) => {
  console.error("Error en rutinaService:", error.message);
  if (error.message.includes("401") || error.message.includes("Token")) {
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirecciona al login si el token expiró
  }
};

// Obtener todas las rutinas
export const obtenerRutinas = async () => {
  try {
    const respuesta = await fetch(API_URL, {
      headers: getAuthHeaders(),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al obtener rutinas`);
    }

    return await respuesta.json();
  } catch (error) {
    manejarError(error);
    return []; // Devuelve un array vacío para evitar romper el front
  }
};

// Agregar una rutina
export const agregarRutina = async (rutina) => {
  try {
    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(rutina),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al agregar rutina`);
    }
  } catch (error) {
    manejarError(error);
  }
};

// Actualizar rutina por ID
export const actualizarRutina = async (id, rutina) => {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(rutina),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al actualizar rutina`);
    }
  } catch (error) {
    manejarError(error);
  }
};

// Eliminar rutina por ID
export const eliminarRutina = async (id) => {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al eliminar rutina`);
    }
  } catch (error) {
    manejarError(error);
  }
};

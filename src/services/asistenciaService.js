const API_URL = "http://localhost:3001/api/v1/asistencias"; // Cambia esta URL si tu backend está en otro lugar

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const manejarError = (error) => {
  console.error("Error en asistenciaService:", error.message);
  if (error.message.includes("401") || error.message.includes("Token")) {
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirecciona al login si el token expiró
  }
};

// Obtener todas las asistencias
export const obtenerAsistencias = async () => {
  try {
    const respuesta = await fetch(API_URL, {
      headers: getAuthHeaders(),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al obtener asistencias`);
    }

    return await respuesta.json();
  } catch (error) {
    manejarError(error);
    return []; // Devuelve un array vacío para evitar romper el front
  }
};

// Agregar una asistencias
export const agregarAsistencia = async (asistencia) => {
  try {
    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(asistencia),
    });

    const data = await respuesta.json(); // Siempre intenta parsear la respuesta
    
    if (!respuesta.ok) {
      // Si hay un mensaje de error del backend, úsalo
      const errorMsg = data.error || `Error ${respuesta.status} al agregar asistencia`;
      throw new Error(errorMsg);
    }
    
    return data;
  } catch (error) {
    console.error("Error detallado en agregarAsistencia:", error);
    throw error;
  }
};

// Actualizar asistencia por ID
export const actualizarAsistencia = async (id_asistencia, asistencia) => {
  try {
    const respuesta = await fetch(`${API_URL}/${id_asistencia}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(asistencia),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al actualizar asistencia`);
    }
  } catch (error) {
    manejarError(error);
  }
};

// Eliminar asistencia por ID
export const eliminarAsistencia = async (id_asistencia) => {
  try {
    const respuesta = await fetch(`${API_URL}/${id_asistencia}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al eliminar asistencia`);
    }
  } catch (error) {
    manejarError(error);
  }
};

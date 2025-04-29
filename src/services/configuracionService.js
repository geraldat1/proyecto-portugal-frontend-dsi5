const API_URL = "http://localhost:3001/api/v1/configuracion"; // Cambia esta URL si tu backend está en otro lugar

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const manejarError = (error) => {
  console.error("Error en configuracionService:", error.message);
  if (error.message.includes("401") || error.message.includes("Token")) {
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirecciona al login si el token expiró
  }
};

// Obtener todas las configuraciones
export const obtenerConfiguraciones = async () => {
  try {
    const respuesta = await fetch(API_URL, {
      headers: getAuthHeaders(),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al obtener configuraciones`);
    }

    return await respuesta.json();
  } catch (error) {
    manejarError(error);
    return []; // Devuelve un array vacío para evitar romper el front
  }
};

// Agregar una configuracion
export const agregarConfiguracion = async (configuracion) => {
  try {
    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(configuracion),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al agregar configuracion`);
    }
  } catch (error) {
    manejarError(error);
  }
};

// Actualizar configuracion por ID
export const actualizarConfiguracion = async (id, configuracion) => {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(configuracion),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al actualizar configuracion`);
    }
  } catch (error) {
    manejarError(error);
  }
};

// Eliminar configuracion por ID
export const eliminarConfiguracion = async (id) => {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al eliminar configuracion`);
    }
  } catch (error) {
    manejarError(error);
  }
};

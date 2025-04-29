const API_URL = "http://localhost:3001/api/v1/personas"; // Cambia esta URL si tu backend está en otro lugar

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const manejarError = (error) => {
  console.error("Error en personaService:", error.message);
  if (error.message.includes("401") || error.message.includes("Token")) {
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirecciona al login si el token expiró
  }
};

// Obtener todas las personas
export const obtenerPersonas = async () => {
  try {
    const respuesta = await fetch(API_URL, {
      headers: getAuthHeaders(),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al obtener personas`);
    }

    return await respuesta.json();
  } catch (error) {
    manejarError(error);
    return []; // Devuelve un array vacío para evitar romper el front
  }
};

// Agregar una persona
export const agregarPersona = async (persona) => {
  try {
    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(persona),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al agregar persona`);
    }
  } catch (error) {
    manejarError(error);
  }
};

// Actualizar persona por ID
export const actualizarPersona = async (id, persona) => {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(persona),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al actualizar persona`);
    }
  } catch (error) {
    manejarError(error);
  }
};

// Eliminar persona por ID
export const eliminarPersona = async (id) => {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al eliminar persona`);
    }
  } catch (error) {
    manejarError(error);
  }
};

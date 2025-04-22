const API_URL = "http://localhost:3001/api/v1/planes"; // Cambia esta URL si tu backend está en otro lugar

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const manejarError = (error) => {
  console.error("Error en planService:", error.message);
  if (error.message.includes("401") || error.message.includes("Token")) {
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirecciona al login si el token expiró
  }
};

// Obtener todas las planes
export const obtenerPlanes = async () => {
  try {
    const respuesta = await fetch(API_URL, {
      headers: getAuthHeaders(),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al obtener planes`);
    }

    return await respuesta.json();
  } catch (error) {
    manejarError(error);
    return []; // Devuelve un array vacío para evitar romper el front
  }
};

// Agregar una planes
export const agregarPlan = async (plan) => {
  try {
    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(plan),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al agregar plan`);
    }
  } catch (error) {
    manejarError(error);
  }
};

// Actualizar plan por ID
export const actualizarPlan = async (id, plan) => {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(plan),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al actualizar plan`);
    }
  } catch (error) {
    manejarError(error);
  }
};

// Eliminar plan por ID
export const eliminarPlan = async (id) => {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status} al eliminar plan`);
    }
  } catch (error) {
    manejarError(error);
  }
};

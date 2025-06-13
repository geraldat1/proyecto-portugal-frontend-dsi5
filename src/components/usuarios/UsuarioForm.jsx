import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { AuthContext } from "../../context/AuthContext"; // Importa el contexto

const UsuarioForm = ({
  show,
  handleClose,
  agregar,
  actualizar,
  usuarioSeleccionado,
  deshabilitarRol = false,
  modo = undefined
}) => {
  const [usuario, setUsuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rol, setRol] = useState("");
  const [errores, setErrores] = useState({});
  const [mostrarClave, setMostrarClave] = useState(null);

  // Para cambiar contraseña
  const [claveActual, setClaveActual] = useState("");
  const [nuevaClave, setNuevaClave] = useState("");
  const [confirmarClave, setConfirmarClave] = useState(""); // NUEVO
  const [confirmarClaveActualizar, setConfirmarClaveActualizar] = useState(""); // NUEVO

  const { user } = useContext(AuthContext); // Obtén el usuario logueado

  useEffect(() => {
    if (usuarioSeleccionado) {
      setUsuario(usuarioSeleccionado.usuario);
      setNombre(usuarioSeleccionado.nombre);
      setCorreo(usuarioSeleccionado.correo);
      setTelefono(usuarioSeleccionado.telefono);
      setRol(usuarioSeleccionado.rol);
    } else {
      setUsuario("");
      setNombre("");
      setCorreo("");
      setClave("");
      setTelefono("");
      setRol("");
    }
    setClaveActual("");
    setNuevaClave("");
    setConfirmarClave(""); // NUEVO
    setConfirmarClaveActualizar(""); // NUEVO
    setErrores({});
  }, [usuarioSeleccionado, modo]);

  const validar = () => {
    const nuevosErrores = {};

    // Modo editar datos de usuario logueado (sin contraseña)
    if (modo === "config") {
      if (!usuario.trim()) nuevosErrores.usuario = "El usuario es obligatorio";
      if (!nombre.trim()) {
        nuevosErrores.nombre = "El nombre es obligatorio";
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
        nuevosErrores.nombre = "El nombre solo debe contener letras";
      }
      if (!correo.trim()) {
        nuevosErrores.correo = "El correo es obligatorio";
      } else if (!/\S+@\S+\.\S+/.test(correo)) {
        nuevosErrores.correo = "El correo no es válido";
      }
      if (!telefono.trim()) {
        nuevosErrores.telefono = "El teléfono es obligatorio";
      } else if (!/^\d+$/.test(telefono)) {
        nuevosErrores.telefono = "El teléfono debe contener solo números";
      }
      if (!rol.trim()) {
        nuevosErrores.rol = "El rol es obligatorio";
      } else if (!["1", "2"].includes(rol)) {
        nuevosErrores.rol = "El rol debe ser Administrador o Empleado";
      }
    }

    // Modo cambiar contraseña
  if (modo === "password") {
    if (!claveActual.trim()) nuevosErrores.claveActual = "Ingrese su contraseña actual";
    if (!nuevaClave.trim()) nuevosErrores.nuevaClave = "Ingrese la nueva contraseña";
    else if (nuevaClave.length < 6) nuevosErrores.nuevaClave = "La contraseña debe tener al menos 6 caracteres";
    if (!confirmarClave.trim()) nuevosErrores.confirmarClave = "Confirme la nueva contraseña";
    else if (nuevaClave !== confirmarClave) nuevosErrores.confirmarClave = "Las contraseñas no coinciden";
  }
  
    // Modo agregar/actualizar usuario (por defecto)
    if (!modo) {
      if (!usuario.trim()) nuevosErrores.usuario = "El usuario es obligatorio";
      if (!nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
      if (!correo.trim()) {
        nuevosErrores.correo = "El correo es obligatorio";
      } else if (!/\S+@\S+\.\S+/.test(correo)) {
        nuevosErrores.correo = "El correo no es válido";
      }
        if (!usuarioSeleccionado && !clave.trim()) {
      nuevosErrores.clave = "La contraseña es obligatoria";
      } else if (!usuarioSeleccionado && clave.length < 6) {
        nuevosErrores.clave = "La contraseña debe tener al menos 6 caracteres";
      }
      if (!telefono.trim()) {
        nuevosErrores.telefono = "El teléfono es obligatorio";
      } else if (!/^\d+$/.test(telefono)) {
        nuevosErrores.telefono = "El teléfono debe contener solo números";
      }
      if (!rol.trim()) {
        nuevosErrores.rol = "El rol es obligatorio";
      } else if (!["1", "2"].includes(rol)) {
        nuevosErrores.rol = "El rol debe ser Administrador o Empleado";
      }
       if (usuarioSeleccionado && clave.trim() && clave.length < 6) {
      nuevosErrores.clave = "La contraseña debe tener al menos 6 caracteres";
      } else if (usuarioSeleccionado && clave.trim() && clave !== confirmarClaveActualizar) {
        nuevosErrores.confirmarClaveActualizar = "Las contraseñas no coinciden";
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // NUEVO: función para validar la contraseña actual usando el endpoint de login
const validarClaveActual = async () => {
  try {
    const response = await fetch(
      "http://localhost:3001/api/v1/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: user.correo, clave: claveActual }),
      }
    );
    if (!response.ok) return false;
    return true;
  } catch {
    return false;
  }
};

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!validar()) {
      Swal.fire("Campos inválidos", "Por favor revisa los datos ingresados", "error");
      return;
    }

    try {
      // Editar datos de usuario logueado (sin contraseña)
      if (modo === "config") {
        const usuarioData = {
          usuario,
          nombre,
          correo,
          telefono,
          rol,
        };
        await actualizar(usuarioSeleccionado.id, usuarioData);
        Swal.fire({
          icon: "success",
          title: "Datos actualizados",
          text: `${nombre} ha sido actualizado correctamente.`,
          timer: 2000,
          showConfirmButton: false,
        });
        handleClose();
        return;
      }

      // Cambiar contraseña
      if (modo === "password") {
        // Validar contraseña actual
        const esValida = await validarClaveActual();
        if (!esValida) {
          setErrores({ claveActual: "La contraseña actual es incorrecta" });
          Swal.fire("Error", "La contraseña actual es incorrecta", "error");
          return;
        }
        // Cambiar contraseña (solo campo clave)
        await actualizar(usuarioSeleccionado.id, { clave: nuevaClave });
        Swal.fire({
          icon: "success",
          title: "Contraseña actualizada",
          text: `La contraseña ha sido cambiada correctamente.`,
          timer: 2000,
          showConfirmButton: false,
        });
        handleClose();
        return;
      }

      // Agregar/actualizar usuario (por defecto)
      const usuarioData = {
        usuario,
        nombre,
        correo,
        telefono,
        rol,
        ...(clave.trim() && { clave }),
      };

      if (usuarioSeleccionado) {
        await actualizar(usuarioSeleccionado.id, usuarioData);
        setClave(""); // Limpiar solo el campo contraseña
        Swal.fire({
          icon: "success",
          title: "Usuario actualizado",
          text: `${nombre} ha sido actualizado correctamente.`,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await agregar(usuarioData);
        Swal.fire({
          icon: "success",
          title: "Usuario registrado",
          text: `${nombre} ha sido registrado correctamente.`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
      handleClose();
    } catch (error) {
      console.error("Error al guardar:", error);
      Swal.fire("Error", "No se pudo guardar los cambios", "error");
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size="lg"
      centered
    >
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="fw-bold">
          {modo === "config"
            ? <>Configuración de la Cuenta de Usuario: {usuarioSeleccionado?.nombre}</>
            : modo === "password"
            ? <>Cambiar Contraseña</>
            : usuarioSeleccionado
            ? <><i className="bi bi-lock me-2"></i>Editar Información del Usuario: {usuarioSeleccionado.nombre}</>
            : <><i className="bi bi-person-plus me-2"></i>Agregar Nuevo Usuario</>
          }
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={manejarEnvio} noValidate>
          {/* Formulario para editar datos de usuario logueado */}
          {modo === "config" && (
            <>
              <div className="row">
                <Form.Group className="mb-3 col-md-6" controlId="usuarioInput">
                  <Form.Label className="fw-bold">
                    Usuario <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese nombre de usuario"
                    value={usuario}
                    onChange={(e) => {
                      const valor = e.target.value;
                      if (/^[a-zA-Z0-9_]*$/.test(valor)) setUsuario(valor);
                    }}
                    isInvalid={!!errores.usuario}
                    maxLength={20}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.usuario}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3 col-md-6" controlId="nombreInput">
                  <Form.Label className="fw-bold">
                    Nombre <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese nombre completo"
                    value={nombre}
                    onChange={(e) => {
                      // Solo permite letras, espacios y tildes
                      const valor = e.target.value;
                      if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(valor)) setNombre(valor);
                    }}
                    isInvalid={!!errores.nombre}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.nombre}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              <Form.Group className="mb-3" controlId="correoInput">
                <Form.Label className="fw-bold">
                  Correo <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  isInvalid={!!errores.correo}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errores.correo}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="telefonoInput">
                <Form.Label className="fw-bold">
                  Teléfono <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese teléfono"
                  value={telefono}
                  onChange={(e) => {
                    const valor = e.target.value;
                    if (/^\d{0,9}$/.test(valor)) setTelefono(valor);
                  }}
                  isInvalid={!!errores.telefono}
                  maxLength={9}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errores.telefono}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="rolSelect">
                <Form.Label className="fw-bold">
                  Rol <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="select"
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  isInvalid={!!errores.rol}
                  required
                  disabled={deshabilitarRol}
                >
                  <option value="">Seleccione un rol</option>
                  <option value="1">Administrador</option>
                  <option value="2">Empleado</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errores.rol}
                </Form.Control.Feedback>
              </Form.Group>
            </>
          )}

          {/* Formulario para cambiar contraseña */}
          {modo === "password" && (
            <>
              <Form.Group className="mb-3" controlId="claveActualInput">
                <Form.Label className="fw-bold">
                  Contraseña Actual <span className="text-danger">*</span>
                </Form.Label>
                <div className="input-group">
                  <Form.Control
                    type={mostrarClave === "actual" ? "text" : "password"}
                    placeholder="Ingrese su contraseña actual"
                    value={claveActual}
                    onChange={(e) => setClaveActual(e.target.value)}
                    isInvalid={!!errores.claveActual}
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setMostrarClave(mostrarClave === "actual" ? null : "actual")}
                    type="button"
                  >
                    {mostrarClave === "actual" ? <BsEye /> : <BsEyeSlash />}
                  </Button>
                </div>
                <Form.Control.Feedback type="invalid">
                  {errores.claveActual}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="nuevaClaveInput">
                <Form.Label className="fw-bold">
                  Nueva Contraseña <span className="text-danger">*</span>
                </Form.Label>
                <div className="input-group">
                  <Form.Control
                    type={mostrarClave === "nueva" ? "text" : "password"}
                    placeholder="Ingrese la nueva contraseña"
                    value={nuevaClave}
                    onChange={(e) => setNuevaClave(e.target.value)}
                    isInvalid={!!errores.nuevaClave}
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setMostrarClave(mostrarClave === "nueva" ? null : "nueva")}
                    type="button"
                  >
                    {mostrarClave === "nueva" ? <BsEye /> : <BsEyeSlash />}
                  </Button>
                </div>
                <Form.Control.Feedback type="invalid">
                  {errores.nuevaClave}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="confirmarClaveInput">
                <Form.Label className="fw-bold">
                  Confirmar Nueva Contraseña <span className="text-danger">*</span>
                </Form.Label>
                <div className="input-group">
                  <Form.Control
                    type={mostrarClave === "confirmar" ? "text" : "password"}
                    placeholder="Confirme la nueva contraseña"
                    value={confirmarClave}
                    onChange={(e) => setConfirmarClave(e.target.value)}
                    isInvalid={!!errores.confirmarClave}
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setMostrarClave(mostrarClave === "confirmar" ? null : "confirmar")}
                    type="button"
                  >
                    {mostrarClave === "confirmar" ? <BsEye /> : <BsEyeSlash />}
                  </Button>
                </div>
                <Form.Control.Feedback type="invalid">
                  {errores.confirmarClave}
                </Form.Control.Feedback>
              </Form.Group>
            </>
          )}

          {/* Formulario original para agregar/actualizar usuario */}
          {!modo && (
            <>
              <div className="row">
                <Form.Group className="mb-3 col-md-6" controlId="usuarioInput">
                  <Form.Label className="fw-bold">
                    Usuario <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese nombre de usuario"
                    value={usuario}
                    onChange={(e) => {
                      const valor = e.target.value;
                      if (/^[a-zA-Z0-9_]*$/.test(valor)) setUsuario(valor);
                    }}
                    isInvalid={!!errores.usuario}
                    maxLength={20}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.usuario}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3 col-md-6" controlId="nombreInput">
                  <Form.Label className="fw-bold">
                    Nombre <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese nombre completo"
                    value={nombre}
                    onChange={(e) => {
                      // Solo permite letras, espacios y tildes
                      const valor = e.target.value;
                      if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(valor)) setNombre(valor);
                    }}
                    isInvalid={!!errores.nombre}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.nombre}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              <Form.Group className="mb-3" controlId="correoInput">
                <Form.Label className="fw-bold">
                  Correo <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  isInvalid={!!errores.correo}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errores.correo}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="claveInput">
                <Form.Label className="fw-bold">
                  Contraseña {usuarioSeleccionado ? "(opcional)" : ""} <span className="text-danger">*</span>
                </Form.Label>
                <div className="input-group">
                  <Form.Control
                    type={mostrarClave ? "text" : "password"}
                    placeholder="Ingrese contraseña"
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                    isInvalid={!!errores.clave}
                    required={!usuarioSeleccionado}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setMostrarClave(!mostrarClave)}
                    type="button"
                  >
                    {mostrarClave ? <BsEye /> : <BsEyeSlash />}
                  </Button>
                </div>
                <Form.Control.Feedback type="invalid">
                  {errores.clave}
                </Form.Control.Feedback>
                {usuarioSeleccionado && (
                  <Form.Text className="text-muted">
                    Dejar vacío para mantener la contraseña actual
                  </Form.Text>
                )}
              </Form.Group>

              {usuarioSeleccionado && (
                <Form.Group className="mb-3" controlId="confirmarClaveActualizarInput">
                  <Form.Label className="fw-bold">
                    Confirmar Contraseña <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type={mostrarClave ? "text" : "password"}
                      placeholder="Confirme la contraseña"
                      value={confirmarClaveActualizar}
                      onChange={(e) => setConfirmarClaveActualizar(e.target.value)}
                      isInvalid={!!errores.confirmarClaveActualizar}
                      required={!!clave}
                      disabled={!clave}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setMostrarClave(!mostrarClave)}
                      type="button"
                    >
                      {mostrarClave ? <BsEye /> : <BsEyeSlash />}
                    </Button>
                  </div>
                  <Form.Control.Feedback type="invalid">
                    {errores.confirmarClaveActualizar}
                  </Form.Control.Feedback>
                </Form.Group>
              )}

              <Form.Group className="mb-3" controlId="telefonoInput">
                <Form.Label className="fw-bold">
                  Teléfono <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese teléfono"
                  value={telefono}
                  onChange={(e) => {
                    const valor = e.target.value;
                    if (/^\d{0,9}$/.test(valor)) setTelefono(valor);
                  }}
                  isInvalid={!!errores.telefono}
                  maxLength={9}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errores.telefono}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="rolSelect">
                <Form.Label className="fw-bold">
                  Rol <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="select"
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  isInvalid={!!errores.rol}
                  required
                  disabled={deshabilitarRol}
                >
                  <option value="">Seleccione un rol</option>
                  <option value="1">Administrador</option>
                  <option value="2">Empleado</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errores.rol}
                </Form.Control.Feedback>
              </Form.Group>
            </>
          )}

          <div className="d-flex justify-content-end gap-3 mt-4">
            <Button variant="outline-secondary" onClick={handleClose} className="px-4">
              Cancelar
            </Button>
            <Button variant="primary" type="submit" className="px-4 fw-bold">
              {modo === "config"
                ? "Actualizar Datos"
                : modo === "password"
                ? "Cambiar Contraseña"
                : usuarioSeleccionado
                ? "Actualizar Datos"
                : "Registrar Usuario"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UsuarioForm;

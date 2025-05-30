import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";

import { BsEye, BsEyeSlash } from "react-icons/bs";

const UsuarioForm = ({
  show,
  handleClose,
  agregar,
  actualizar,
  usuarioSeleccionado,
  soloCambiarClave = false, // nuevo prop para modo cambio de clave
}) => {
  const [usuario, setUsuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rol, setRol] = useState("");
  const [errores, setErrores] = useState({});

  const [mostrarClave, setMostrarClave] = useState(false);

  useEffect(() => {
    if (usuarioSeleccionado) {
      setUsuario(usuarioSeleccionado.usuario);
      setNombre(usuarioSeleccionado.nombre);
      setCorreo(usuarioSeleccionado.correo);
      setClave("");
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
    setErrores({});
  }, [usuarioSeleccionado]);

  const validar = () => {
    const nuevosErrores = {};

    if (!soloCambiarClave) {
      if (!usuario.trim()) nuevosErrores.usuario = "El usuario es obligatorio";
      if (!nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";

      if (!correo.trim()) {
        nuevosErrores.correo = "El correo es obligatorio";
      } else if (!/\S+@\S+\.\S+/.test(correo)) {
        nuevosErrores.correo = "El correo no es válido";
      }

      if (!usuarioSeleccionado && !clave.trim()) {
        nuevosErrores.clave = "La clave es obligatoria";
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
    } else {
      // Validar solo clave
      if (!clave.trim()) {
        nuevosErrores.clave = "La clave es obligatoria";
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (!validar()) {
      Swal.fire("Campos inválidos", "Por favor revisa los datos ingresados", "error");
      return;
    }

    if (soloCambiarClave) {
      // Solo cambiar clave
      if (usuarioSeleccionado) {
        const actualizado = {
          ...usuarioSeleccionado,
          clave,
        };
        actualizar(usuarioSeleccionado.id, actualizado);
        Swal.fire({
          icon: "success",
          title: "Contraseña actualizada",
          text: `La contraseña de ${usuarioSeleccionado.nombre} ha sido actualizada correctamente.`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
      handleClose();
      return;
    }

    // Modo completo
    const nuevoUsuario = {
      usuario,
      nombre,
      correo,
      clave,
      telefono,
      rol,
    };

    if (clave.trim()) {
      nuevoUsuario.clave = clave;
    }

    if (usuarioSeleccionado) {
      actualizar(usuarioSeleccionado.id, nuevoUsuario);
      Swal.fire({
        icon: "success",
        title: "Usuario actualizado",
        text: `${nombre} ha sido actualizado correctamente.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      agregar(nuevoUsuario);
      Swal.fire({
        icon: "success",
        title: "Usuario registrado",
        text: `${nombre} ha sido registrado correctamente.`,
        timer: 2000,
        showConfirmButton: false,
      });
    }

    setUsuario("");
    setNombre("");
    setCorreo("");
    setClave("");
    setTelefono("");
    setRol("");
    setErrores({});
    handleClose();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size={soloCambiarClave ? "sm" : "lg"}
      centered
    >
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="fw-bold">
          {soloCambiarClave ? (
            <>Cambiar Contraseña</>
          ) : usuarioSeleccionado ? (
            <>
              <i className="bi bi-pencil-square me-2"></i>Editar Usuario
            </>
          ) : (
            <>
              <i className="bi bi-person-plus me-2"></i>Agregar Nuevo Usuario
            </>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={manejarEnvio} noValidate>
          {!soloCambiarClave && (
            <>
              <div className="row">
                {/* Usuario */}
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
                  <Form.Text className="text-muted">
                    Solo letras, números y guiones bajos, máximo 20 caracteres.
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">{errores.usuario}</Form.Control.Feedback>
                </Form.Group>

                {/* Nombre */}
                <Form.Group className="mb-3 col-md-6" controlId="nombreInput">
                  <Form.Label className="fw-bold">
                    Nombre Completo <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese nombre completo"
                    value={nombre}
                    onChange={(e) => {
                      const valor = e.target.value;
                      if (/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/.test(valor)) setNombre(valor);
                    }}
                    isInvalid={!!errores.nombre}
                    required
                  />
                  <Form.Text className="text-muted">Solo letras y espacios.</Form.Text>
                  <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
                </Form.Group>
              </div>

              {/* Correo */}
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
                <Form.Control.Feedback type="invalid">{errores.correo}</Form.Control.Feedback>
              </Form.Group>
            </>
          )}

          {/* Clave */}
          <Form.Group className="mb-3" controlId="claveInput">
            <Form.Label className="fw-bold">
              Clave <span className="text-danger">*</span>
            </Form.Label>
            <div className="input-group">
              <Form.Control
                type={mostrarClave ? "text" : "password"}
                placeholder={soloCambiarClave ? "Ingrese nueva contraseña" : "Ingrese contraseña segura"}
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                isInvalid={!!errores.clave}
                required
              />
              <Button
                variant="outline-secondary"
                onClick={() => setMostrarClave(!mostrarClave)}
                type="button"
                tabIndex={-1}
              >
                {mostrarClave ? <BsEye /> : <BsEyeSlash />}
              </Button>
            </div>
            <Form.Control.Feedback type="invalid">{errores.clave}</Form.Control.Feedback>
            {!soloCambiarClave && usuarioSeleccionado && (
              <Form.Text className="text-muted">
                Dejar vacío para no cambiar la contraseña.
              </Form.Text>
            )}
          </Form.Group>

          {!soloCambiarClave && (
            <>
              {/* Teléfono */}
              <Form.Group className="mb-3" controlId="telefonoInput">
                <Form.Label className="fw-bold">
                  Teléfono <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese teléfono (9 dígitos)"
                  value={telefono}
                  onChange={(e) => {
                    const valor = e.target.value;
                    if (/^\d{0,9}$/.test(valor)) setTelefono(valor);
                  }}
                  isInvalid={!!errores.telefono}
                  maxLength={9}
                  required
                />
                <Form.Text className="text-muted">Solo números, sin espacios ni guiones.</Form.Text>
                <Form.Control.Feedback type="invalid">{errores.telefono}</Form.Control.Feedback>
              </Form.Group>

              {/* Rol */}
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
                >
                  <option value="">Seleccione un rol</option>
                  <option value="1">Administrador</option>
                  <option value="2">Empleado</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">{errores.rol}</Form.Control.Feedback>
              </Form.Group>
            </>
          )}

          <div className="d-flex justify-content-end gap-3 mt-4">
            <Button variant="outline-secondary" onClick={handleClose} className="px-4">
              Cancelar
            </Button>
            <Button variant="primary" type="submit" className="px-4 fw-bold">
              {soloCambiarClave
                ? "Guardar nueva contraseña"
                : usuarioSeleccionado ? (
                  <>
                    <i className="bi bi-check-circle me-2"></i>Guardar Cambios
                  </>
                ) : (
                  <>
                    <i className="bi bi-save me-2"></i>Registrar Usuario
                  </>
                )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UsuarioForm;

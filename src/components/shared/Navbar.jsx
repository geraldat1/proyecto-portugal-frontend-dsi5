import React, { useContext } from "react";
import {
  Navbar as BsNavbar,
  Nav,
  Container,
  NavDropdown,
  Dropdown
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  FaUserCircle,
  FaHome,
  FaUsers,
  FaClipboardList,
  FaCreditCard,
  FaCalendarCheck,
  FaDumbbell,
  FaTasks,
  FaBoxOpen,
  FaCog,
  FaUserTie,
  FaLock,
  FaSignOutAlt,
  FaBars,
  FaChevronDown
} from "react-icons/fa";
import UsuarioForm from "../usuarios/UsuarioForm"; // Ajusta la ruta si es necesario
import Swal from "sweetalert2";
import { actualizarUsuario as actualizarUsuarioService } from "../../services/usuarioService";

import '../shared/css/estiloNavbar.css';

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estado para el modal de cambiar contraseña
  const [showModal, setShowModal] = React.useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = React.useState(null);
  const [modalMode, setModalMode] = React.useState("config"); // "config" o "password"

  // Usar el service para actualizar usuario
  const actualizarUsuario = async (id, usuarioData) => {
    try {
      await actualizarUsuarioService(id, usuarioData);
      // Actualiza el usuario en el contexto si es necesario
      setUser((prev) => ({ ...prev, ...usuarioData }));
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar el usuario", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const menuItem = (icon, text) => (
    <span className="d-inline-flex align-items-center gap-2">
      {icon}
      {text}
    </span>
  );

  const isRole2 = user?.role === '2' || user?.rol === '2';

  const isRole1or2 = user?.role === '1' || user?.rol === '1' || user?.role === '2' || user?.rol === '2';


  const handleConfigCuenta = () => {
    setUsuarioSeleccionado({
      id: user.id,
      usuario: user.usuario,
      nombre: user.name || user.nombre,
      correo: user.correo,
      telefono: user.telefono,
      rol: user.rol || user.role,
    });
    setModalMode("config");
    setShowModal(true);
  };

  const handleCambiarContrasena = () => {
    setUsuarioSeleccionado({
      id: user.id,
      usuario: user.usuario,
      nombre: user.name || user.nombre,
      correo: user.correo,
      telefono: user.telefono,
      rol: user.rol || user.role,
    });
    setModalMode("password");
    setShowModal(true);
  };

  return (
    <div className="navbar-two-tone">
      {/* Parte superior - Diseño administrativo mejorado */}
      <div className="navbar-top">
        <Container className="d-flex justify-content-between align-items-center py-2">
          <div className="d-flex align-items-center">
            <BsNavbar.Brand as={Link} to="/" className="mb-0">
              <img
                src="../imagenes/letra-toreto.png"
                alt="Logo"
                className="navbar-logo"
              />
            </BsNavbar.Brand>
            
            <div className="admin-section ms-4 d-none d-lg-flex align-items-center">
              <div className="admin-icon me-2">
                <FaUserTie size={18} className="text-gold" />
              </div>
              <div>
                <div className="admin-label">Panel Administrativo</div>
                <div className="admin-subtitle">Gestión Integral del Gimnasio</div>
              </div>
            </div>
          </div>
          
          <div className="d-flex align-items-center">
            <div
              className="custom-toggle d-lg-none me-3"
              onClick={() => document.getElementById("basic-navbar-nav").classList.toggle("show")}
            >
              <FaBars className="menu-icon" size={24} />
            </div>
            
            {user && (
              <Dropdown align="end" className="dropdown-user">
                <Dropdown.Toggle 
                  as={Nav.Link}
                  id="dropdown-user"
                  className="dropdown-toggle-user d-flex align-items-center py-1 px-3 border-0 no-caret"
                  style={{ cursor: 'pointer' }}
                >
                  <span className="d-inline-flex align-items-center gap-2">
                    <div className="user-avatar">
                      <FaUserCircle size={24} />
                    </div>
                    <div className="user-info">
                      <div className="user-name">{user.name?.toUpperCase()}</div>
                      <div className="user-role">{isRole2 ? "Empleado" : "Administrador"}</div>
                    </div>
                    <FaChevronDown size={12} className="ms-2 text-gold chevron-hide" />
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-menu-user border-0 shadow-sm rounded-1 mt-1">
                  <div className="dropdown-header d-flex align-items-center p-3">
                    <FaUserCircle size={36} className="me-3 text-gold" />
                    <div>
                      <div className="fw-medium text-light">{user.name}</div>
                      <div className="text-light small">{user.correo}</div>
                    </div>
                  </div>
                  
                  <Dropdown.Divider className="my-0" />
                  
                  {!isRole2 && (
                    <Dropdown.Item 
                      as={Link} 
                      to="/configuracion"
                      className="d-flex align-items-center py-2 px-3"
                    >
                      {menuItem(<FaCog className="text-gold me-2" />, "Acerca de")}
                    </Dropdown.Item>
                  )}
                  
                  {!isRole2 && (
                    <Dropdown.Item 
                      as={Link} 
                      to="/usuarios"
                      className="d-flex align-items-center py-2 px-3"
                    >
                      {menuItem(<FaUserTie className="text-gold me-2" />, "Empleados")}
                    </Dropdown.Item>
                  )}
                  <Dropdown.Item 
                    onClick={handleConfigCuenta}
                    className="d-flex align-items-center py-2 px-3"
                  >
                    {menuItem(<FaLock className="text-gold me-2" />, "Config. de Cuenta")}
                  </Dropdown.Item>
                  <Dropdown.Item 
                    onClick={handleCambiarContrasena}
                    className="d-flex align-items-center py-2 px-3"
                  >
                    {menuItem(<FaLock className="text-gold me-2" />, "Cambiar Contraseña")}
                  </Dropdown.Item>
                  
                  <Dropdown.Divider className="my-1" />
                  
                  <Dropdown.Item 
                    onClick={handleLogout}
                    className="d-flex align-items-center py-2 px-3 text-danger"
                  >
                    {menuItem(<FaSignOutAlt className="me-2" />, "Cerrar sesión")}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </Container>
      </div>
      
      {/* Parte inferior (blanca) */}
      <div className="navbar-bottom">
        <Container>
          <BsNavbar expand="lg" className="navbar-custom-bottom">
            <BsNavbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto navbar-custom-bottom">
                <Nav.Link as={Link} to="/">
                  {menuItem(<FaHome />, "Inicio")}
                </Nav.Link>

                <Nav.Link as={Link} to="/clientes">
                  {menuItem(<FaUsers />, "Clientes")}
                </Nav.Link>

                <NavDropdown 
                  title={menuItem(<FaClipboardList />, "Eleccion y Pagos")} 
                  id="pagos-dropdown"
                  className="nav-dropdown"
                >
                  <NavDropdown.Item as={Link} to="/detalleplanes">
                    {menuItem(<FaClipboardList className="text-success me-2" />, "Pagar Membresía")}
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/pagosplanes">
                    {menuItem(<FaCreditCard className="text-info me-2" />, "Reporte de Pagos")}
                  </NavDropdown.Item>
                </NavDropdown>

                <Nav.Link as={Link} to="/asistencias">
                  {menuItem(<FaCalendarCheck />, "Asistencias")}
                </Nav.Link>
                
                {!isRole2 && (
                  <Nav.Link as={Link} to="/entrenadores">
                    {menuItem(<FaDumbbell />, "Entrenadores")}
                  </Nav.Link>
                )}

                {!isRole2 && (
                  <NavDropdown 
                    title={menuItem(<FaTasks />, "Servicios")} 
                    id="servicios-dropdown"
                    className="nav-dropdown"
                  >
                    <NavDropdown.Item as={Link} to="/planes">
                      {menuItem(<FaBoxOpen className="text-success me-2" />, "Membresías")}
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/rutinas">
                      {menuItem(<FaTasks className="text-danger me-2" />, "Rutinas")}
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
              </Nav>
            </BsNavbar.Collapse>
          </BsNavbar>
        </Container>
      </div>

      {/* Modal para cambiar contraseña */}
      <UsuarioForm
        show={showModal}
        handleClose={() => setShowModal(false)}
        agregar={null}
        actualizar={actualizarUsuario}
        usuarioSeleccionado={usuarioSeleccionado}
        deshabilitarRol={isRole1or2}
        modo={modalMode}
      />
    </div>
  );
};

export default Navbar;
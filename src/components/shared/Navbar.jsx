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
  FaInfoCircle
} from "react-icons/fa";
import '../shared/css/Navbar.css';

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

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

  return (
    <BsNavbar expand="lg" style={{ backgroundColor: "#000", color: "#fff" }}>
      <Container>
        <BsNavbar.Brand as={Link} to="/">
          <img
            src="../imagenes/letra-toreto.png"
            alt="Logo"
            style={{ width: "70px", height: "auto" }}
          />
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="basic-navbar-nav"/>
        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto navbar-custom">
            <Nav.Link as={Link} to="/">
              {menuItem(<FaHome />, "Inicio")}
            </Nav.Link>

            <NavDropdown title={menuItem(<FaUsers />, "Clientes")} id="archivos-dropdown">
              <NavDropdown.Item as={Link} to="/clientes">
                {menuItem(<FaUsers />, "Lista de Clientes")}
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/detalleplanes">
                {menuItem(<FaClipboardList />, "Detalle Planes")}
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/pagosplanes">
                {menuItem(<FaCreditCard />, "Pagos")}
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={Link} to="/asistencias">
              {menuItem(<FaCalendarCheck />, "Asistencias")}
            </Nav.Link>
            <Nav.Link as={Link} to="/entrenadores">
              {menuItem(<FaDumbbell />, "Entrenadores")}
            </Nav.Link>
            <Nav.Link as={Link} to="/rutinas">
              {menuItem(<FaTasks />, "Rutinas")}
            </Nav.Link>
            <Nav.Link as={Link} to="/planes">
              {menuItem(<FaBoxOpen />, "Planes")}
            </Nav.Link>
          </Nav>

          {user && (
            <Dropdown align="end" className="dropdown-user">
              <Dropdown.Toggle className="dropdown-toggle-user" id="dropdown-user">
                <span className="d-inline-flex align-items-center gap-2">
                  <FaUserCircle size={20} />
                  {user.name?.toUpperCase()}
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-menu-user">
                <Dropdown.Item as={Link} to="/acercade">
                  {menuItem(<FaInfoCircle />, "Acerca de Mi APP")}
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/configuracion">
                  {menuItem(<FaCog />, "Configuración")}
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/usuarios">
                  {menuItem(<FaUserTie />, "Empleados")}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => alert("Funcionalidad aún no implementada")}>
                  {menuItem(<FaLock />, "Cambiar contraseña")}
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>
                  {menuItem(<FaSignOutAlt />, "Cerrar sesión")}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;

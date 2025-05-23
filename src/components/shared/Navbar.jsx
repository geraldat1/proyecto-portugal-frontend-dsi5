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
  FaInfoCircle,
  FaBars,
  FaChevronDown
} from "react-icons/fa";
import '../shared/css/estiloNavbar.css';

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
        <div
          className="custom-toggle d-lg-none"
          onClick={() => document.getElementById("basic-navbar-nav").classList.toggle("show")}
        >
          <FaBars className="menu-icon" size={24} />
        </div>
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
  <Dropdown 
    align="end" 
    className="dropdown-user shadow-sm"
  >
    <Dropdown.Toggle 
      variant="light" 
      id="dropdown-user"
      className="dropdown-toggle-user d-flex align-items-center py-2 px-3 border-0 bg-transparent"
    >
      <span className="d-inline-flex align-items-center gap-2 text-light">
        <FaUserCircle size={20} className="text-primary" />
        <span className="fw-medium">
          {user.name?.toUpperCase()}
        </span>
        <FaChevronDown size={12} className="ms-1" />
      </span>
    </Dropdown.Toggle>

     <Dropdown.Menu 
        className="dropdown-menu-user border-0 shadow-sm rounded-1 mt-1"
        style={{ 
          minWidth: "220px",
          position: "absolute",
          left: "0",
          top: "100%"
        }}
      >
      <Dropdown.Header className="text-muted small">
        MENÚ DE USUARIO
      </Dropdown.Header>
      
      <Dropdown.Item 
        as={Link} 
        to="/acercade"
        className="d-flex align-items-center py-2 px-3"
      >
        {menuItem(<FaInfoCircle className="text-info me-2" />, "Acerca de Mi APP")}
      </Dropdown.Item>
      
      <Dropdown.Item 
        as={Link} 
        to="/configuracion"
        className="d-flex align-items-center py-2 px-3"
      >
        {menuItem(<FaCog className="text-secondary me-2" />, "Configuración")}
      </Dropdown.Item>
      
      <Dropdown.Item 
        as={Link} 
        to="/usuarios"
        className="d-flex align-items-center py-2 px-3"
      >
        {menuItem(<FaUserTie className="text-success me-2" />, "Empleados")}
      </Dropdown.Item>
      
      <Dropdown.Item 
        onClick={() => alert("Funcionalidad aún no implementada")}
        className="d-flex align-items-center py-2 px-3"
      >
        {menuItem(<FaLock className="text-warning me-2" />, "Cambiar contraseña")}
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
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;

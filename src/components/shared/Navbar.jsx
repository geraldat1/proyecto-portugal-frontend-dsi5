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
  <BsNavbar expand="lg" className="navbar-custom">
      <Container>
        <BsNavbar.Brand as={Link} to="/">
          <img
            src="../imagenes/letra-toreto.png"
            alt="Logo"
            className="navbar-logo"
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
                {menuItem(<FaUsers className="text-primary me-2" />, "Registrar Clientes")}
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/detalleplanes">
                {menuItem(<FaClipboardList className="text-success me-2" />, "Acuerdos")}
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/pagosplanes">
                {menuItem(<FaCreditCard className="text-info me-2" />, "Pagos")}
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
            <Nav className="ms-auto">
            <Dropdown align="end" className="dropdown-user">
              <Dropdown.Toggle 
                as={Nav.Link}
                id="dropdown-user"
                className="dropdown-toggle-user d-flex align-items-center py-2 px-3 border-0 no-caret"
                style={{ cursor: 'pointer' }}
              >
                <span className="d-inline-flex align-items-center gap-2">
                  <FaUserCircle size={20} />
                  <span className="fw-medium">
                    {user.name?.toUpperCase()}
                  </span>
                  <FaChevronDown size={12} className="ms-1" />
                </span>
              </Dropdown.Toggle>


      <Dropdown.Menu className="dropdown-menu-user border-0 shadow-sm rounded-1 mt-1">
      
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
    </Nav>

)}
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;

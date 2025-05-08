import React, { useContext } from "react";
import { Navbar as BsNavbar, Nav, Container, NavDropdown, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FaUserCircle } from "react-icons/fa"; // Asegúrate de tener react-icons instalado

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      <style>{`
        .navbar-custom .nav-link {
          color: white !important;
          transition: color 0.3s;
        }
        .navbar-custom .nav-link:hover {
          color: #FFD700 !important;
        }

        /* Estilos para el dropdown de Clientes */
        .navbar-custom .nav-item .dropdown-menu {
          background-color: #000 !important; /* Fondo negro */
        }

        .navbar-custom .nav-item .dropdown-menu a {
          color: white !important; /* Texto blanco */
        }

        .navbar-custom .nav-item .dropdown-menu a:hover {
          background-color: #FFD700 !important; /* Fondo amarillo al pasar el ratón */
          color: black !important; /* Texto negro al pasar el ratón */
        }

        .navbar-custom .nav-item .dropdown-toggle {
          background-color: #000 !important;
          border: none;
          color: white !important;
        }

        /* Estilos para el dropdown de Usuario */
        .dropdown-menu-user {
          background-color: #FFD700 !important; /* Fondo amarillo */
        }

        .dropdown-menu-user a {
          color: black !important; /* Texto negro */
        }

        /* Cambiar el fondo del dropdown de usuario a amarillo al pasar el puntero */
        .dropdown-toggle-user:hover {
          background-color: #FFD700 !important;
          color: black !important;
        }

        .dropdown-menu-user a:hover {
          background-color: #f7f7f7 !important; /* Fondo claro al pasar el ratón */
        }

        .dropdown-toggle-user {
          background-color: #FFD700 !important;
          border: none;
          color: black !important;
        }
      `}</style>

      <BsNavbar expand="lg" style={{ backgroundColor: "#000", color: "#fff" }}>
        <Container>
          <BsNavbar.Brand as={Link} to="/">
            <img
              src="../imagenes/letra-toreto.png"
              alt="Logo"
              style={{ width: "70px", height: "auto" }}
            />
          </BsNavbar.Brand>
          <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
          <BsNavbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto navbar-custom">
              <Nav.Link as={Link} to="/">Inicio</Nav.Link>

              <NavDropdown title="Clientes" id="archivos-dropdown">
                <NavDropdown.Item as={Link} to="/clientes">Lista de Clientes</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/detalleplanes">Detalle Planes</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/pagosplanes">Pagos</NavDropdown.Item>
              </NavDropdown>

              <Nav.Link as={Link} to="/asistencias">Asistencias</Nav.Link>
              <Nav.Link as={Link} to="/entrenadores">Entrenadores</Nav.Link>
              <Nav.Link as={Link} to="/rutinas">Rutinas</Nav.Link>
              <Nav.Link as={Link} to="/planes">Planes</Nav.Link>
            </Nav>

            {user && (
              <Dropdown align="end" className="dropdown-user">
                <Dropdown.Toggle className="dropdown-toggle-user" id="dropdown-user">
                  <FaUserCircle size={20} className="me-2" />
                  {user.name?.toUpperCase()}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/acercade">
                    Acerca de Mi APP
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/configuracion">
                    Configuración
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/usuarios">
                    Empleados
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => alert("Funcionalidad aún no implementada")}
                  >
                    Cambiar contraseña
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    Cerrar sesión
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </BsNavbar.Collapse>
        </Container>
      </BsNavbar>
    </>
  );
};

export default Navbar;

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

        .dropdown-menu a {
          color: black;
        }
        .dropdown-menu a:hover {
          background-color: #FFD700;
          color: black;
        }

        .dropdown-toggle {
          background-color: #FFD700 !important;
          border: none;
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
              <Dropdown align="end">
                <Dropdown.Toggle id="dropdown-user">
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

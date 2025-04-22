import React, { useContext } from "react";
import { Navbar as BsNavbar, Nav, Container, Dropdown } from "react-bootstrap";
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
    <BsNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <BsNavbar.Brand as={Link} to="/">
          Mi App
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Inicio
            </Nav.Link>
           
            <Nav.Link as={Link} to="/clientes">
              Clientes
            </Nav.Link>
            <Nav.Link as={Link} to="/entrenadores">
              Entrenadores
            </Nav.Link>
            <Nav.Link as={Link} to="/rutinas">
              Rutinas
            </Nav.Link>
          </Nav>

          {user && (
            <Dropdown align="end">
              <Dropdown.Toggle variant="secondary" id="dropdown-user">
                <FaUserCircle size={20} className="me-2" />
                {user.name?.toUpperCase()}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/acercade">
                  Acerca de Mi APP
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
  );
};

export default Navbar;

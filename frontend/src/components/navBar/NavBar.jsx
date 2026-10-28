import { Navbar, Container, NavDropdown, Button, Nav } from 'react-bootstrap';
import './NavBar.css';
import { useState } from 'react';

const NavBar = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(true)

  return (

    <Navbar fixed='top' className="navbar-custom py-2 px-4">
      <Container fluid className="d-flex flex-row align-items-center justify-content-between p-0 w-100">

        <div className="d-flex align-items-center gap-2 flex-shrink-0">
          <h5 className="mb-0 me-2">Empresa</h5>
          <Button>Reservas</Button>
          <Button>Sedes</Button>
          <Button>Contacto</Button>
        </div>

        <Nav className="d-flex flex-row align-items-center gap-2 flex-shrink-0">
          {isLoggedIn ? (
            <div className="d-flex align-items-center gap-2">
              <h6 className="mb-0">Hola Usuario X!</h6>

              <NavDropdown title="⚙️" align="end">
                <NavDropdown.Item href="#">Mi Perfil</NavDropdown.Item>
                <NavDropdown.Item href="#">Mis Reservas</NavDropdown.Item>
                <NavDropdown.Item href="#">Configuración</NavDropdown.Item>
                <NavDropdown.Item href="#">Soporte Técnico</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#">Cerrar Sesión</NavDropdown.Item>
              </NavDropdown>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2 ms-2">
              <Button className="btn-auth">Iniciar Sesión</Button>
              <Button className="btn-auth">Registrarse</Button>
            </div>
          )}
        </Nav>
      </Container>
    </Navbar>

  );
}

export default NavBar;

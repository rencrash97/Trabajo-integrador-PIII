import { Navbar, Container, Form, Button, Nav } from 'react-bootstrap';
import './NavBar.css';

const NavBar = () => {

  return (

    <Navbar fixed='top' className="navbar-custom py-2 px-4">
      <Container fluid className="d-flex flex-row align-items-center justify-content-between p-0 w-100">

        <div className="d-flex align-items-center gap-2 flex-shrink-0">
          <h5 className="mb-0 me-2">Empresa</h5>
          <Button>A</Button>
          <Button>B</Button>
          <Button>C</Button>
          <Button>D</Button>
        </div>

        <Nav className="d-flex flex-row align-items-center gap-2 flex-shrink-0">
          <h6 className="mb-0 me-2">Hola Usuario X!</h6> {/*cambiar despues para mostrar nombre usuario*/}
          <a href="#" >🔔</a>
          <a href="#">⚙️</a>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavBar;

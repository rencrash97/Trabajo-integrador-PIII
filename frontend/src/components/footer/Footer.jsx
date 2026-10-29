import { Navbar, Container, NavDropdown, Button, Nav } from 'react-bootstrap';
import './Footer.css';

const Footer = () => {
  return (
    <Navbar className="custom-footer">
      <Container>
        <h4>Empresa Copada Srl.</h4>
        <p>Espacios de Coworking para tu empresa :)</p>
      </Container>
    </Navbar>
  );
}

export default Footer;

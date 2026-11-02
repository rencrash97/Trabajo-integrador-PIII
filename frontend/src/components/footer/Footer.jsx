import { Container } from 'react-bootstrap';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="custom-footer py-4 bg-dark text-light">
      <Container className="text-center">
        <h4 className="mb-1">Empresa Copada Srl.</h4>
        <p className="mb-0 text-muted">Espacios de Coworking para tu empresa :)</p>
      </Container>
    </footer>
  );
};

export default Footer;
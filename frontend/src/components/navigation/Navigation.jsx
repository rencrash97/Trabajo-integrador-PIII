import { Navbar, Container, NavDropdown, Button, Nav } from 'react-bootstrap';
import './navigation.css';
import { Link, useNavigate } from "react-router";
import { useContext } from "react";
import { JsonAuthContext } from '../../general/JsonAuthContext.jsx';


const Navigation = () => {

    const navigate = useNavigate();
    const { isSignedIn, localLogout, user, userRole } = useContext(JsonAuthContext);

    const handleLogout = () => {
        navigate("/");
        setTimeout(() => localLogout(),10); //timeout porque no le da tiempo a navigate a moverse de directorio
        };

    const navigateLogin = () => {
        navigate("/login");
    };

    const navigateRegister = () => {
        navigate("/register");
    };

    return (

        <Navbar className="navbar-custom py-2 px-4">
            <Container fluid className="d-flex flex-row align-items-center justify-content-between p-0 w-100">


                <div className="d-flex align-items-center gap-2 flex-shrink-0">
                    <Navbar.Brand as={Link} to="/" className="fw-bold">
                        Alquiler de Oficinas
                    </Navbar.Brand>

                    {isSignedIn && (
                        <NavDropdown title="☰ Menú" align="start">
                            <NavDropdown.Item href="#">Mi Perfil</NavDropdown.Item>
                            <NavDropdown.Item href="/reservations">Mis Reservas</NavDropdown.Item>
                            <NavDropdown.Item href="/catalog">Catálogo</NavDropdown.Item>
                            {["admin", "super_admin"].includes(userRole) && (
                            <NavDropdown.Item
                                as={Link}
                                to="/reservations/all">
                                Gestión de reservas
                                { /* no recarga la pagina */}
                            </NavDropdown.Item>
                            )}
                            <NavDropdown.Item href="#">Soporte Técnico</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#" onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
                        </NavDropdown>
                    )}
                </div>

                <Nav className="d-flex flex-row align-items-center gap-2 flex-shrink-0">
                    {isSignedIn ? (
                        <h6 className="mb-0">{`${user.nombre} ${user.apellido}`}</h6>
                    ) : (
                        <div className="d-flex align-items-center gap-2 ms-2">
                            <Button className="btn-auth" onClick={navigateLogin}>Iniciar Sesión</Button>
                            <Button className="btn-auth" onClick={navigateRegister}>Registrarse</Button>
                        </div>
                    )}
                </Nav>
            </Container>
        </Navbar>

    );
}

export default Navigation;

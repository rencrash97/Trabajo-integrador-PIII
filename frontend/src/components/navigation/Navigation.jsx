
import { Navbar, Container, NavDropdown, Button, Nav } from 'react-bootstrap';
import './navigation.css';
import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";



const Navigation = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const savedUser = localStorage.getItem("userEmail");
        if (savedUser) {
            setUserEmail(savedUser);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("userEmail");
        setUserEmail("");
        navigate("/");
    };
    

    return (

        <Navbar className="navbar-custom py-2 px-4">
            <Container fluid className="d-flex flex-row align-items-center justify-content-between p-0 w-100">


                <div className="d-flex align-items-center gap-2 flex-shrink-0">
                    <Navbar.Brand as={Link} to="/" className="fw-bold">
                        🏢 Alquiler de Oficinas
                    </Navbar.Brand>
                        {/* Ver si funciona dentro de los botones
                        <Nav.Link as={Link} to="/">Página Principal</Nav.Link>
                        <Nav.Link as={Link} to="/reservations">Mis Reservas</Nav.Link>
                        */}

                    <Button>Reservas</Button>
                    <Button>Catálogo</Button>
                </div>

                <Nav className="d-flex flex-row align-items-center gap-2 flex-shrink-0">
                    {isLoggedIn ? (
                        <div className="d-flex align-items-center gap-2">
                            <h6 className="mb-0">{/*Arreglar Mensaje*/(`¡Bienvenido/a, ${data.usuario.nombre}!`)}</h6>

                            <NavDropdown title="⚙️" align="end">
                                <NavDropdown.Item href="#">Mi Perfil</NavDropdown.Item>
                                <NavDropdown.Item href="#">Mis Reservas</NavDropdown.Item>
                                <NavDropdown.Item href="#">Configuración</NavDropdown.Item>
                                <NavDropdown.Item href="#">Soporte Técnico</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#" onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
                            </NavDropdown>
                        </div>
                    ) : (
                        <div className="d-flex align-items-center gap-2 ms-2">
                            <Button className="btn-auth" onClick={() => navigate("/login")}>Iniciar Sesión</Button>
                            <Button className="btn-auth">Registrarse</Button>
                        </div>
                    )}
                </Nav>
            </Container>
        </Navbar>

    );
}

export default Navigation;

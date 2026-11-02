import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";

const Navigation = () => {
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
        <Navbar bg="dark" variant="dark" expand="lg" className="px-4 shadow-sm border-bottom border-secondary">
            <Container fluid>
                <Navbar.Brand as={Link} to="/" className="fw-bold">
                    🏢 Alquiler de Oficinas
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="align-items-center gap-3">
                        <Nav.Link as={Link} to="/">Página Principal</Nav.Link>
                        <Nav.Link as={Link} to="/reservations">Mis Reservas</Nav.Link>

                
                        {userEmail ? (
                            <div className="d-flex align-items-center gap-2">
                                <span className="text-light small">👤 {userEmail}</span>
                                <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                                    Cerrar Sesión
                                </Button>
                            </div>
                        ) : (
                            <Button variant="outline-light" size="sm" onClick={() => navigate("/login")}>
                                Iniciar Sesión
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;
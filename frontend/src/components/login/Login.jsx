import { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import Navigation from "../navigation/Navigation";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        localStorage.setItem("userEmail", email);
        alert(`¡Bienvenido/a, ${email}!`);
        navigate("/");
    };

    return (
        <div style={{ minHeight: "100vh" }} className="bg-light">
            <Navigation />
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={6} lg={5}>
                        <Card className="shadow-sm border-0 p-4">
                            <Card.Body>
                                <h2 className="fw-bold mb-4 text-center text-dark">Iniciar Sesión</h2>
                                <Form onSubmit={handleLogin}>
                                    <Form.Group className="mb-3" controlId="formEmail">
                                        <Form.Label className="fw-semibold">Correo Electrónico</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="ejemplo@correo.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4" controlId="formPassword">
                                        <Form.Label className="fw-semibold">Contraseña</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Ingresá tu contraseña"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Button variant="primary" type="submit" className="w-100 fw-bold py-2 mb-3">
                                        Ingresar
                                    </Button>

                                    <div className="text-center">
                                        <small className="text-muted">
                                            ¿No tenés cuenta? <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>Volver al inicio</span>
                                        </small>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;
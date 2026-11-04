import { useState, useRef, useContext } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router";
import { errorToast } from "../../general/toast.js";
import { JsonAuthContext } from "../../general/JsonAuthContext.jsx";


const Login = () => {
    const navigate = useNavigate();
    const { localLogin } = useContext(JsonAuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState({
        email: false,
        password: false,
    });

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setError({ ...error, email: false });
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setError({ ...error, password: false });
    };


    const handleLogin = async (e) => {
        e.preventDefault();

        if (!emailRef.current.value.length) {
            setError({ ...error, email: true });
            errorToast("¡Email vacío!");
            emailRef.current.focus();
            console.log("Error en mail");
            return;
        }

        if (!password.length || password.length < 7) {
            setError({ ...error, password: true });
            errorToast("¡Password vacío o demasiado corto!");
            passwordRef.current.focus();
            console.log("Error en contra");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mail: email, password: password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Credenciales incorrectas");
            }

            localLogin(data.usuario, data.token);
            navigate("/reservations"); //cuando haya un perfil, cambiar navegacion a perfil principal

        } catch (err) {
            errorToast(err.message);
        };
    };

    return (
        <div style={{ minHeight: "100vh" }} className="bg-light">
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
                                            onChange={handleEmailChange}
                                            ref={emailRef}
                                            className={error.email ? "border border-danger" : ""}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4" controlId="formPassword">
                                        <Form.Label className="fw-semibold">Contraseña</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Ingresá tu contraseña"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            required
                                            ref={passwordRef}
                                            className={error.password ? "border border-danger" : ""}
                                        />
                                    </Form.Group>

                                    <Button variant="primary" type="submit" className="w-100 fw-bold py-2 mb-3">Ingresar</Button>

                                    <div className="text-center">
                                        <small className="text-muted">
                                            ¿No tenés cuenta?
                                            <span className="text-primary" onClick={() => navigate("/")}> Volver al inicio</span>
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
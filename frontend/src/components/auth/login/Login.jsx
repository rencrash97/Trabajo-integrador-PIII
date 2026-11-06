import { useState, useRef, useContext, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { errorToast } from "../../../general/toast.js";
import { JsonAuthContext } from "../../../general/JsonAuthContext.jsx";
import { apiRequest, SESSION_EXPIRED_MESSAGE_KEY } from "../../../general/api.js";


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

    // notificar sesion expirada
    useEffect(() => {
        const sessionMessage = sessionStorage.getItem(SESSION_EXPIRED_MESSAGE_KEY);

        if (!sessionMessage) return;

        const notificationTimer = window.setTimeout(() => {
            errorToast(sessionMessage);
            sessionStorage.removeItem(SESSION_EXPIRED_MESSAGE_KEY);
        }, 0);

        return () => window.clearTimeout(notificationTimer);
    }, []);

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
            return;
        }

        if (!password.length || password.length < 8) {
            setError({ ...error, password: true });
            errorToast("¡Password vacío o demasiado corto!");
            passwordRef.current.focus();
            return;
        }

        try {
            const data = await apiRequest("/api/auth/login", {
                method: "POST",
                body: { mail: email, password: password },
            });

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
                                            <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => navigate("/register")}> Registrate!</span>
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

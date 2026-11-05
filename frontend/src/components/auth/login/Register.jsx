import { useState, useRef } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { errorToast, successToast } from "../../../general/toast.js";

const Register = () => {
    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState({
        nombre: false,
        apellido: false,
        email: false,
        password: false,
    });

    const nombreRef = useRef(null);
    const apellidoRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const handleNombreChange = (e) => {
        setNombre(e.target.value);
        setError({ ...error, nombre: false });
    };

    const handleApellidoChange = (e) => {
        setApellido(e.target.value);
        setError({ ...error, apellido: false });
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setError({ ...error, email: false });
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setError({ ...error, password: false });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!nombre.trim().length) {
            setError({ ...error, nombre: true });
            errorToast("Ingresa tu nombre!");
            nombreRef.current.focus();
            return;
        }

        if (!apellido.trim().length) {
            setError({ ...error, apellido: true });
            errorToast("El apellido no puede estar vacío!");
            apellidoRef.current.focus();
            return;
        }

        if (!emailRef.current.value.length) {
            setError({ ...error, email: true });
            errorToast("Email vacío!");
            emailRef.current.focus();
            return;
        }

        if (!password.length || password.length < 8) {
            setError({ ...error, password: true });
            errorToast("La contraseña es demasiado corta!");
            passwordRef.current.focus();
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/usuarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre: nombre,
                    apellido: apellido,
                    mail: email,
                    password: password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || "No se pudo crear la cuenta :(");
            }

            successToast(data.mensaje || "¡Cuenta creada con éxito! Ya podés iniciar sesión :)");
            navigate("/login");

        } catch (err) {
            errorToast(err.message);
        }
    };

    return (
        <div style={{ minHeight: "100vh" }} className="bg-light">
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="shadow-sm border-0 p-4">
                            <Card.Body>
                                <h2 className="fw-bold mb-4 text-center text-dark">Crear Cuenta</h2>

                                <Form onSubmit={handleRegister}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="formNombre">
                                                <Form.Label className="fw-semibold">Nombre</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Cosme"
                                                    value={nombre}
                                                    onChange={handleNombreChange}
                                                    ref={nombreRef}
                                                    className={error.nombre ? "border border-danger" : ""}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="formApellido">
                                                <Form.Label className="fw-semibold">Apellido</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Fulanito"
                                                    value={apellido}
                                                    onChange={handleApellidoChange}
                                                    ref={apellidoRef}
                                                    className={error.apellido ? "border border-danger" : ""}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

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
                                            placeholder="Mínimo 8 caracteres"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            ref={passwordRef}
                                            className={error.password ? "border border-danger" : ""}
                                        />
                                    </Form.Group>

                                    <Button variant="success" type="submit" className="w-100 fw-bold py-2 mb-3">
                                        Registrarse
                                    </Button>

                                    <div className="text-center">
                                        <small className="text-muted">
                                            ¿Ya tenés una cuenta?
                                            <span className="text-primary style-pointer" style={{ cursor: "pointer" }} onClick={() => navigate("/login")}> Iniciar Sesión</span>
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

export default Register;

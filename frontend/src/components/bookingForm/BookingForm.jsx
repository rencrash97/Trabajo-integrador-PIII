import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router"; 
import Navigation from "../navigation/Navigation";

const BookingForm = () => {
    const navigate = useNavigate();
    const location = useLocation(); 

    const selectedOffice = location.state || { name: "Oficina Ejecutiva Central", price: 15000 };

    const [userEmail, setUserEmail] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [hours, setHours] = useState(1);

    useEffect(() => {
        const savedUser = localStorage.getItem("userEmail");
        if (savedUser) {
            setUserEmail(savedUser);
        }
    }, []);

    const handleBooking = (e) => {
        e.preventDefault();
        if (!userEmail) {
            alert("Debes iniciar sesión para realizar una reserva.");
            navigate("/login");
            return;
        }

        const nuevaReserva = {
            id: Date.now(),
            office: selectedOffice.name, 
            date: date,
            time: `${startTime} hs`,
            status: "Confirmada",
            total: `$${hours * selectedOffice.price}` 
        };

        const reservasGuardadas = JSON.parse(localStorage.getItem("myReservations")) || [];
        const reservasActualizadas = [...reservasGuardadas, nuevaReserva];
        localStorage.setItem("myReservations", JSON.stringify(reservasActualizadas));

        alert(`¡Reserva realizada con éxito para ${selectedOffice.name}!`);
        navigate("/reservations");
    };

    return (
        <div style={{ minHeight: "100vh" }} className="bg-light">
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="shadow-sm border-0 p-4">
                            <Card.Body>
                                <h3 className="fw-bold mb-2 text-dark">Reservar {selectedOffice.name}</h3>
                                <p className="text-muted small mb-3">💲 ${selectedOffice.price} por hora</p>
                                
                                {!userEmail ? (
                                    <Alert variant="warning" className="small">
                                        ⚠️ No has iniciado sesión. <Alert.Link onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>Inicia sesión aquí</Alert.Link> para continuar.
                                    </Alert>
                                ) : (
                                    <Alert variant="info" className="small">
                                        👤 Reservando como: <strong>{userEmail}</strong>
                                    </Alert>
                                )}

                                <Form onSubmit={handleBooking}>
                                    <Form.Group className="mb-3" controlId="bookingDate">
                                        <Form.Label className="fw-semibold">Fecha de alquiler</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="startTime">
                                                <Form.Label className="fw-semibold">Hora de inicio</Form.Label>
                                                <Form.Control
                                                    type="time"
                                                    value={startTime}
                                                    onChange={(e) => setStartTime(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="hours">
                                                <Form.Label className="fw-semibold">Cantidad de horas</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    min={1}
                                                    max={12}
                                                    value={hours}
                                                    onChange={(e) => setHours(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <div className="bg-light border rounded p-3 mb-4 d-flex justify-content-between align-items-center">
                                        <span className="fw-bold text-secondary">Total estimado:</span>
                                        <span className="fs-4 fw-bold text-success">${hours * selectedOffice.price}</span>
                                    </div>

                                    <div className="d-flex justify-content-end gap-2">
                                        <Button variant="outline-secondary" onClick={() => navigate("/")}>
                                            Cancelar
                                        </Button>
                                        <Button variant="success" type="submit" className="fw-bold px-4" disabled={!userEmail}>
                                            Confirmar Reserva
                                        </Button>
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

export default BookingForm;
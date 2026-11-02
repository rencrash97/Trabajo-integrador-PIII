import { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import Navigation from "../navigation/Navigation";

const OfficeCatalog = () => {
    const navigate = useNavigate();

    const [offices] = useState([
        {
            id: 1,
            title: "Oficina Ejecutiva Central",
            location: "Rosario Centro",
            capacity: 4,
            price: 15000,
            summary: "Espacio moderno equipado con escritorios ergonómicos, Wi-Fi de alta velocidad y aire acondicionado."
        },
        {
            id: 2,
            title: "Sala de Reuniones Creativa",
            location: "Pichincha",
            capacity: 10,
            price: 28000,
            summary: "Ideal para reuniones de equipo y presentaciones con proyector LED y pizarra acrílica."
        },
        {
            id: 3,
            title: "Puesto Coworking Individual",
            location: "Pellegrini",
            capacity: 1,
            price: 5000,
            summary: "Escritorio dedicado en zona compartida con acceso a cafetería y áreas de descanso."
        }
    ]);

    return (
        <div style={{ minHeight: "100vh" }} className="bg-light">
            <Navigation />
            <Container className="py-5">
                <div className="text-center mb-5">
                    <h1 className="fw-bold text-dark">Espacios de Trabajo Disponibles</h1>
                    <p className="text-muted fs-5">Encontrá y alquilá tu oficina por hora o por día de forma rápida y sencilla.</p>
                </div>

                <Row className="g-4">
                    {offices.map((office) => (
                        <Col key={office.id} md={4}>
                            <Card className="shadow-sm border-0 h-100">
                                <Card.Body className="d-flex flex-column p-4">
                                    <Card.Title className="fw-bold text-primary fs-4">{office.title}</Card.Title>
                                    <Card.Subtitle className="mb-3 text-muted">📍 {office.location}</Card.Subtitle>
                                    <Card.Text className="text-secondary mb-4">{office.summary}</Card.Text>
                                    
                                    <div className="mt-auto">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <span className="text-muted fw-semibold">👥 Capacidad: {office.capacity} pers.</span>
                                            <span className="fw-bold text-success fs-5">${office.price} /h</span>
                                        </div>
                                        <Button 
                                            variant="primary" 
                                            className="w-100 fw-bold py-2"
                                            onClick={() => navigate("/booking", { state: { name: office.title, price: office.price } })}
                                        >
                                            Reservar Oficina
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default OfficeCatalog;
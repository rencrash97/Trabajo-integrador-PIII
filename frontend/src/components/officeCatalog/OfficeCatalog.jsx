import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { errorToast } from "../../general/toast.js";

const OfficeCatalog = () => {

    const navigate = useNavigate();

    const [offices, setOffices] = useState([]);

    useEffect(() => {

        const fetchOffices = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/espacios");

                if (!response.ok) {
                    throw new Error("No se pudo conectar con el servidor.");
                }

                const data = await response.json();
                setOffices(data);

            } catch (err) {
                errorToast(`Hubo un problema al cargar los espacios: ${err.message}`);
            }
        };

        fetchOffices();
    }, []);

    const navigateReserve = (office) => {
        navigate(`/booking/${office.id_espacio}`)
    };

    return (
        <div style={{ minHeight: "100vh" }} className="bg-light">
            <Container className="py-5">
                <div className="text-center mb-5">
                    <h1 className="fw-bold text-dark">Espacios de Trabajo Disponibles</h1>
                    <p className="text-muted fs-5">Encontrá y alquilá tu oficina por hora o por día de forma rápida y sencilla.</p>
                </div>

                <Row className="g-4">
                    {offices.map((office) => (
                        <Col key={office.id_espacio} md={4}>
                            <Card className="shadow-sm border-0 h-100">
                                <Card.Body className="d-flex flex-column p-4">
                                    <Card.Title className="fw-bold text-primary fs-4">
                                        {office.nombre}
                                    </Card.Title>
                                    <Card.Subtitle className="mb-3 text-muted">
                                        📍 {office.ubicacion}
                                    </Card.Subtitle>
                                    <Card.Text className="text-secondary mb-4">
                                        {office.descripcion}
                                    </Card.Text>

                                    <div className="mt-auto">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <span className="text-muted fw-semibold">
                                                👥 Capacidad: {office.capacidad} pers.
                                            </span>
                                            <span className="fw-bold text-success fs-5">
                                                ${office.precio_por_turno} /h.
                                            </span>
                                        </div>
                                        <Button
                                            variant="primary"
                                            className="w-100 fw-bold py-2"
                                            onClick={() => navigateReserve(office)}
                                        >
                                            Reservar Oficina
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}

                    {offices.length === 0 && (
                        <div className="text-center my-5 w-100">
                            <p className="text-muted fs-5">No hay espacios de trabajo disponibles en este momento.</p>
                        </div>
                    )}
                </Row>
            </Container>
        </div>
    );
};

export default OfficeCatalog;
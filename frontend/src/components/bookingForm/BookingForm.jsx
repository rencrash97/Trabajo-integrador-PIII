import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Form, Button, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import { errorToast, successToast } from "../../general/toast.js";
import { JsonAuthContext } from "../../general/JsonAuthContext.jsx";

const BookingForm = () => { //agregar mensaje en reserva de pendiente. Hacer validaciones de fechas y hora de turno.

    const navigate = useNavigate();
    const { idEspacio } = useParams();
    const { token } = useContext(JsonAuthContext);

    const [office, setOffice] = useState(null);
    const [turnos, setTurnos] = useState([]);
    const [idTurnoSelect, setIdTurnoSelect] = useState("");
    const [date, setDate] = useState("");

    useEffect(() => {
        const fetchOficina = async () => {
            try {

                const resOficina = await fetch(`http://localhost:3000/api/espacios/${idEspacio}`);

                if (!resOficina.ok) {
                    throw new Error("No se pudo obtener la información de la oficina.");
                };

                const dataOffice = await resOficina.json();
                setOffice(dataOffice);

                const resTurnos = await fetch("http://localhost:3000/api/turnos");

                if (!resTurnos.ok) {
                    throw new Error("No se pudieron obtener los horarios.");
                };

                const dataTurnos = await resTurnos.json();
                setTurnos(dataTurnos);

            } catch (err) {
                errorToast(err.message || "Error al cargar los datos de la página.");
            };
        };

        if (idEspacio) fetchOficina();
    }, [idEspacio]);

    const handleBooking = async (event) => {
        event.preventDefault();

        const nuevaReserva = {
            id_espacio: parseInt(idEspacio),
            id_turno: parseInt(idTurnoSelect),
            fecha: date
        };

        try {
            const response = await fetch("http://localhost:3000/api/reservas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(nuevaReserva)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "No se pudo procesar la reserva.");
            }

            successToast(data.mensaje || "¡Solicitud de reserva enviada correctamente!");
            navigate("/reservations");

        } catch (err) {
            errorToast(`Error al reservar: ${err.message}`);
        }
    };




    return (
        <div style={{ minHeight: "100vh" }} className="bg-light">
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="shadow-sm border-0 p-4">
                            <Card.Body>
                                <h3 className="fw-bold mb-2 text-dark">Reservar {office?.nombre}</h3>
                                <p className="text-muted small mb-3">💲 Costo por turno: ${office?.precio_por_turno}</p>

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

                                    <Form.Group className="mb-4" controlId="bookingTurno">

                                        <Form.Label className="fw-semibold">Seleccionar Turno Horario</Form.Label>

                                        <Form.Select
                                            value={idTurnoSelect}
                                            onChange={(e) => setIdTurnoSelect(e.target.value)}
                                            required
                                        >
                                            <option value="">-- Elige un turno --</option>

                                            {turnos.map((turno) => {
                                                //Para evitar problemas convierto la hora a string en pantalla
                                                const inicio = turno.hora_inicio ? String(turno.hora_inicio).slice(0, 5) : "00:00";
                                                const fin = turno.hora_fin ? String(turno.hora_fin).slice(0, 5) : "00:00";

                                                return (
                                                    <option key={turno.id_turno} value={turno.id_turno}>
                                                        {turno.nombre} ({inicio} - {fin} hs)
                                                    </option>
                                                );
                                            })}
                                        </Form.Select>
                                    </Form.Group>

                                    <div className="bg-light border rounded p-3 mb-4 d-flex justify-content-between align-items-center">
                                        <span className="fw-bold text-secondary">Total por turno:</span>
                                        <span className="fs-4 fw-bold text-success">${office?.precio_por_turno}</span>
                                    </div>

                                    <div className="d-flex justify-content-end gap-2">
                                        <Button variant="outline-secondary" onClick={() => navigate("/catalog")}>
                                            Cancelar
                                        </Button>

                                        <Button
                                            variant="success"
                                            type="submit"
                                            className="fw-bold px-4"
                                            disabled={!idTurnoSelect}
                                        >
                                            Solicitar Reserva
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
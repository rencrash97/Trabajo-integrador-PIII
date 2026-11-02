import { useState, useEffect } from "react";
import { Container, Table, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router";
import Navigation from "../navigation/Navigation";

const MyReservations = () => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState("invitado@correo.com");
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        const savedUser = localStorage.getItem("userEmail");
        if (savedUser) {
            setUserEmail(savedUser);
        }

        const savedReservations = localStorage.getItem("myReservations");
        if (savedReservations) {
            setReservations(JSON.parse(savedReservations));
        } else {
            const initialReservations = [
                {
                    id: 1,
                    office: "Oficina Ejecutiva Central",
                    date: "2026-11-05",
                    time: "10:00 hs",
                    status: "Confirmada",
                    total: "$30.000"
                },
                {
                    id: 2,
                    office: "Sala de Reuniones Creativa",
                    date: "2026-11-10",
                    time: "14:00 hs",
                    status: "Confirmada",
                    total: "$56.000"
                }
            ];
            setReservations(initialReservations);
            localStorage.setItem("myReservations", JSON.stringify(initialReservations));
        }
    }, []);

    const handleCancel = (id) => {
        const updatedReservations = reservations.filter(r => r.id !== id);
        setReservations(updatedReservations);
        localStorage.setItem("myReservations", JSON.stringify(updatedReservations));
    };

    return (
        <div style={{ minHeight: "100vh" }} className="bg-light">
            <Navigation />
            <Container className="py-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h2 className="fw-bold text-dark mb-1">Mis Reservas</h2>
                        <p className="text-muted small mb-0">Mostrando reservas para: <strong>{userEmail}</strong></p>
                    </div>
                    <Button variant="primary" onClick={() => navigate("/")}>
                        + Nueva Reserva
                    </Button>
                </div>

                <div className="bg-white border rounded shadow-sm p-3">
                    <Table hover responsive className="align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Oficina</th>
                                <th>Responsable</th>
                                <th>Fecha</th>
                                <th>Horario</th>
                                <th>Estado</th>
                                <th>Total</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.length > 0 ? (
                                reservations.map((res, index) => (
                                    <tr key={res.id}>
                                        <td>{index + 1}</td>
                                        <td className="fw-bold text-dark">{res.office}</td>
                                        <td><span className="text-muted small">{userEmail}</span></td>
                                        <td>{res.date}</td>
                                        <td>{res.time}</td>
                                        <td>
                                            <Badge bg={res.status === "Confirmada" ? "success" : "warning"}>
                                                {res.status}
                                            </Badge>
                                        </td>
                                        <td className="text-success fw-bold">{res.total}</td>
                                        <td>
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm"
                                                onClick={() => handleCancel(res.id)}
                                            >
                                                Cancelar
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center text-muted py-4">
                                        No tenés reservas registradas actualmente.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </Container>
        </div>
    );
};

export default MyReservations;
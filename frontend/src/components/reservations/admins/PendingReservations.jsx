import { useState, useEffect, useContext } from "react";
import { Container, Table, Button, Badge, Card, Form } from "react-bootstrap";
import { errorToast, successToast } from "../../../general/toast.js";
import { JsonAuthContext } from "../../../general/JsonAuthContext.jsx";
import { apiRequest } from "../../../general/api.js";
import AreYouReallyReallySureYouWantToDoThatModal from "../AreYouSureModal.jsx";
import "./PendingReservations.css";
import {
    formatReservationDate,
    formatHour,
    turnoYaComenzo,
} from "../reservationUtils.js";

const fetchAllReservations = (token) =>
    apiRequest("/api/admin/reservas", { token });

const PendingReservations = () => {

    const { token } = useContext(JsonAuthContext);
    const [reservations, setReservations] = useState([]);
    const [estadoSeleccionado, setEstadoSeleccionado] = useState("todos");
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);

    const reload = () => {
        if (!token) return;
        fetchAllReservations(token)
            .then((data) => setReservations(data || []))
            .catch((err) => errorToast(err.message || "Error al conectar con el servidor."));
    };

    useEffect(() => {
        if (!token) return;

        fetchAllReservations(token)
            .then((data) => setReservations(data || []))
            .catch((err) => errorToast(err.message || "Error al conectar con el servidor."));
    }, [token]);

    const handleUpdateStatus = async (idReserva, nuevoEstado) => {
        try {
            const data = await apiRequest(`/api/admin/reservas/${idReserva}/estado`, {
                method: "PATCH",
                token,
                body: { estado: nuevoEstado }
            });

            successToast(data.mensaje || `Reserva modificada a ${nuevoEstado} con éxito.`);
            reload();
        } catch (err) {
            errorToast(`Error al cambiar estado: ${err.message}`);
        }
    };

    const handleOpenCancelModal = (reserva) => {
        setSelectedReservation(reserva);
        setShowCancelModal(true);
    };

    const handleConfirmCancel = async () => {
        if (!selectedReservation) return;

        await handleUpdateStatus(selectedReservation.id_reserva, "cancelada");

        setShowCancelModal(false);
        setSelectedReservation(null);
    };

    const reservasFiltradas = reservations.filter((reserva) => {
        if (estadoSeleccionado === "todos") return true;
        return reserva.estado.toLowerCase() === estadoSeleccionado;
    });

    const reservationsBySede = reservasFiltradas.reduce((groups, res) => {
        const sede = res.espacio_ubicacion || "Sede No Especificada";
        if (!groups[sede]) {
            groups[sede] = [];
        }
        groups[sede].push(res);
        return groups;
    }, {});


    return (
        <div style={{ minHeight: "100vh" }} className="bg-light py-5">
            <Container>
                <div className="mb-4">
                    <h2 className="fw-bold text-dark mb-1">Reservas Globales</h2>
                    <p className="text-muted small">Listado de Oficinas y Turnos</p>
                </div>

                <Form.Group className="mb-4" style={{ maxWidth: "260px" }}>
                    <Form.Label className="fw-semibold">Filtrar por estado</Form.Label>
                    <Form.Select
                        value={estadoSeleccionado}
                        onChange={(event) => setEstadoSeleccionado(event.target.value)}
                    >
                        <option value="todos">Todos los estados</option>
                        <option value="pendiente">Pendientes</option>
                        <option value="confirmada">Confirmadas</option>
                        <option value="cancelada">Canceladas</option>
                    </Form.Select>
                </Form.Group>

                {Object.keys(reservationsBySede).length > 0 ? (
                    Object.entries(reservationsBySede).map(([sedeName, listaReservas]) => (
                        <Card key={sedeName} className="shadow-sm border-0 mb-5 p-3 bg-white">
                            <Card.Body>
                                <h4 className="fw-bold text-primary mb-3 border-bottom pb-2">{sedeName}</h4>

                                <Table hover responsive className="align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Reserva Id</th>
                                            <th>Usuario</th>
                                            <th>Espacio / Oficina</th>
                                            <th>Fecha</th>
                                            <th>Horario</th>
                                            <th>Precio</th>
                                            <th>Estado</th>
                                            <th className="text-center">Acciones de Gestión</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listaReservas.map((r) => {
                                            const estado = r.estado.toLowerCase();
                                            const turnoComenzado = turnoYaComenzo(r);
                                            const puedeGestionar =
                                                estado !== "cancelada" && !turnoComenzado;

                                            return (
                                                <tr
                                                    key={r.id_reserva}
                                                    className={estado === "cancelada" ? "reservation-row-cancelada" : ""}
                                                >
                                                    <td>{r.id_reserva}</td>
                                                    <td>
                                                        <div className="fw-semibold text-dark">
                                                            {r.usuario_nombre} {r.usuario_apellido}
                                                        </div>
                                                        <small className="text-muted">{r.usuario_mail}</small>
                                                    </td>
                                                    <td className="fw-bold text-dark">{r.espacio_nombre}</td>
                                                    <td>{formatReservationDate(r.fecha)}</td>
                                                    <td>{formatHour(r.hora_inicio)}–{formatHour(r.hora_fin)}</td>
                                                    <td className="text-end text-success fw-bold">
                                                        ${parseFloat(r.precio).toLocaleString("es-AR")}
                                                    </td>
                                                    <td className="text-center">
                                                        <Badge
                                                            bg={estado === "confirmada" ? "success" : "secondary"}
                                                            className={`reservation-status-${estado}`}
                                                        >
                                                            {r.estado}
                                                        </Badge>
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="d-flex justify-content-center gap-2">
                                                            {puedeGestionar ? (
                                                                <>
                                                                    <Button
                                                                        variant="success"
                                                                        size="sm"
                                                                        className="fw-semibold"
                                                                        disabled={estado === "confirmada"}
                                                                        onClick={() => handleUpdateStatus(r.id_reserva, "confirmada")}
                                                                    >
                                                                        Confirmar
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline-danger"
                                                                        size="sm"
                                                                        className="fw-semibold"
                                                                        onClick={() => handleOpenCancelModal(r)}
                                                                    >
                                                                        Cancelar
                                                                    </Button>
                                                                </>
                                                            ) : turnoComenzado && estado !== "cancelada" ? (
                                                                <span className="text-muted small">Turno ya iniciado</span>
                                                            ) : null}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <div className="bg-white border rounded text-center text-muted py-5 shadow-sm">
                        {estadoSeleccionado === "todos"
                            ? "No hay ninguna reserva registrada en el sistema actualmente."
                            : "No hay reservas que coincidan con el estado seleccionado."}
                    </div>
                )}
            </Container>

            <AreYouReallyReallySureYouWantToDoThatModal
                show={showCancelModal}
                onHide={() => setShowCancelModal(false)}
                onConfirm={handleConfirmCancel}
                resName={selectedReservation?.espacio_nombre}
                resDate={selectedReservation?.fecha.slice(0, 10)}
            />
        </div>
    );
};

export default PendingReservations;

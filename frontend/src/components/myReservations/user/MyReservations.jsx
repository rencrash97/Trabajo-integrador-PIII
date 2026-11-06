import { useState, useEffect, useContext } from "react";
import { Container, Table, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router";
import { errorToast, successToast } from "../../../general/toast.js";
import AreYouReallyReallySureYouWantToDoThatModal from "../AreYouSureModal.jsx";
import { apiRequest } from "../../../general/api.js";
import "./myReservations.css";
import { JsonAuthContext } from "../../../general/authContext.js";
import {
  formatReservationDate,
  formatHour,
  turnoYaComenzo,
} from "../reservationUtils.js";

const fetchMyReservations = (token) =>
  apiRequest("/api/reservas/mias", { token });

const MyReservations = () => {
  //agregar mensaje en reserva de pendiente
  const navigate = useNavigate();
  const { token, user } = useContext(JsonAuthContext);

  const [reservations, setReservations] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  useEffect(() => {
    if (!token) return;

    void fetchMyReservations(token)
      .then((data) => setReservations(data.reservas))
      .catch((err) =>
        errorToast(err.message || "Error al conectar con el servidor."),
      );
  }, [token]);

  const handleOpenCancelModal = (reservation) => {
    setSelectedReservation(reservation);
    setModalShow(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedReservation) return;

    try {
      const data = await apiRequest(
        `/api/reservas/${selectedReservation.id_reserva}/cancelar`,
        {
          method: "PATCH",
          token,
        },
      );

      successToast(data.mensaje || "Reserva cancelada correctamente.");
      setModalShow(false);
      const refreshedData = await fetchMyReservations(token);
      setReservations(refreshedData.reservas);
    } catch (err) {
      errorToast(`Error al cancelar: ${err.message}`);
    }
  };

  return (
    <div style={{ minHeight: "100vh" }} className="bg-light">
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="fw-bold text-dark mb-1">Mis Reservas</h2>
            <p className="text-muted small mb-0">
              Mostrando reservas para:{" "}
              <strong>
                {user.apellido}, {user.nombre}
              </strong>
            </p>
          </div>
          <Button variant="primary" onClick={() => navigate("/catalog")}>
            + Nueva Reserva
          </Button>
        </div>

        <div className="bg-white border rounded shadow-sm p-3">
          <Table hover responsive className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Oficina</th>
                <th>Fecha</th>
                <th>Horario</th>
                <th className="text-center">Estado</th>
                <th className="text-end">Total</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservations.length > 0 ? (
                reservations.map((r) => {
                  const estado = r.estado.toLowerCase();
                  const turnoComenzado = turnoYaComenzo(r);
                  const puedeCancelar =
                    estado !== "cancelada" && !turnoComenzado;

                  return (
                    <tr
                      key={r.id_reserva}
                      className={estado === "cancelada" ? "reservation-row-cancelada" : ""}
                    >
                      <td className="fw-bold text-dark">{r.espacio_nombre}</td>
                      <td>{formatReservationDate(r.fecha)}</td>
                      <td>
                        {formatHour(r.hora_inicio)}–{formatHour(r.hora_fin)}
                      </td>
                      <td className="text-center">
                        <Badge
                          bg={estado === "confirmada" ? "success" : "secondary"}
                          className={`reservation-status-${estado}`}
                        >
                          {r.estado}
                        </Badge>
                      </td>
                      <td className="text-end text-success fw-bold">
                        ${parseFloat(r.precio).toLocaleString("es-AR")}
                      </td>
                      <td className="text-center">
                        {puedeCancelar ? (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleOpenCancelModal(r)}
                          >
                            Cancelar
                          </Button>
                        ) : turnoComenzado && estado !== "cancelada" ? (
                          <span className="text-muted small">Turno ya iniciado</span>
                        ) : null}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No tienes reservas registradas actualmente.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Container>

      <AreYouReallyReallySureYouWantToDoThatModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        onConfirm={handleConfirmCancel}
        resName={selectedReservation?.espacio_nombre}
        resDate={selectedReservation?.fecha.slice(0, 10)}
      />
    </div>
  );
};

export default MyReservations;

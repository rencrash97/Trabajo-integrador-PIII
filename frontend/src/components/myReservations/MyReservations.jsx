import { useState, useEffect, useContext } from "react";
import { Container, Table, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router";
import { JsonAuthContext } from "../../general/JsonAuthContext.jsx";
import { errorToast, successToast } from "../../general/toast.js";
import AreYouReallyReallySureYouWantToDoThatModal from "./AreYouSureModal.jsx";
import { apiRequest } from "../../general/api.js";

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
                <th>#</th>
                <th>Oficina</th>
                <th>Fecha</th>
                <th>Horario</th>
                <th>Estado</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservations.length > 0 ? (
                reservations.map((r, index) => (
                  <tr key={r.id_reserva}>
                    <td>{index + 1}</td>
                    <td className="fw-bold text-dark">{r.espacio_nombre}</td>
                    <td>{r.fecha.slice(0, 10)}</td>
                    <td>
                      {r.turno_nombre} ({r.hora_inicio.slice(0, 5)} -{" "}
                      {r.hora_fin.slice(0, 5)} hs.)
                    </td>
                    <td>
                      <Badge
                        bg={
                          r.estado.toLowerCase() === "confirmada"
                            ? "success"
                            : "warning"
                        }
                      >
                        {r.estado}
                      </Badge>
                    </td>
                    <td className="text-success fw-bold">
                      ${parseFloat(r.precio).toLocaleString("es-AR")}
                    </td>
                    <td>
                      {r.estado.toLowerCase() !== "cancelada" ? (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleOpenCancelModal(r)}
                        >
                          Cancelar
                        </Button>
                      ) : (
                        <span></span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center text-muted py-4">
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

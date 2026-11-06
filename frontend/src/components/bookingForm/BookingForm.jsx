import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import { errorToast, successToast } from "../../general/toast.js";
import { JsonAuthContext } from "../../general/JsonAuthContext.jsx";
import { apiRequest } from "../../general/api.js";

const BookingForm = () => {
  const navigate = useNavigate();
  const { idEspacio } = useParams();
  const { token } = useContext(JsonAuthContext);

  const [office, setOffice] = useState(null);
  const [turnosDisponibles, setTurnosDisponibles] = useState([]);
  const [cargandoDisponibilidad, setCargandoDisponibilidad] = useState(false);
  const [idTurnoSelect, setIdTurnoSelect] = useState("");
  const [date, setDate] = useState("");

  const mañana = new Date();
  mañana.setDate(mañana.getDate() + 1); //lo dejé en mas uno para simplificar las validaciones de turnos
  const año = mañana.getFullYear();
  const mes = String(mañana.getMonth() + 1).padStart(2, "0");
  const dia = String(mañana.getDate()).padStart(2, "0");
  const fechaMinima = `${año}-${mes}-${dia}`;

  console.log(mañana);

  useEffect(() => {
    const fetchOficina = async () => {
      try {
        const dataOffice = await apiRequest(`/api/espacios/${idEspacio}`);
        setOffice(dataOffice);
      } catch (err) {
        errorToast(err.message || "Error al cargar los datos de la página.");
      }
    };

    if (idEspacio) fetchOficina();
  }, [idEspacio]);

  useEffect(() => {
    if (!date) return;

    const consultarDisponibilidad = async () => {
      setCargandoDisponibilidad(true);

      try {
        const data = await apiRequest(
          `/api/espacios/${idEspacio}/disponibilidad?fecha=${date}`,
        );
        setTurnosDisponibles(data.turnos_disponibles);
      } catch (err) {
        setTurnosDisponibles([]);
        errorToast(err.message || "No se pudo consultar la disponibilidad.");
      } finally {
        setCargandoDisponibilidad(false);
      }
    };

    void consultarDisponibilidad();
  }, [idEspacio, date]);

  const handleBooking = async (event) => {
    event.preventDefault();

    const nuevaReserva = {
      id_espacio: parseInt(idEspacio),
      id_turno: parseInt(idTurnoSelect),
      fecha: date,
    };

    try {
      const data = await apiRequest("/api/reservas", {
        method: "POST",
        token,
        body: nuevaReserva,
      });

      successToast(
        data.mensaje || "¡Solicitud de reserva enviada correctamente!",
      );
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
                <h3 className="fw-bold mb-2 text-dark">
                  Reservar {office?.nombre}
                </h3>
                <p className="text-muted small mb-3">
                  💲 Costo por turno: ${office?.precio_por_turno}
                </p>

                <Form onSubmit={handleBooking}>
                  <Form.Group className="mb-3" controlId="bookingDate">
                    <Form.Label className="fw-semibold">
                      Fecha de alquiler
                    </Form.Label>
                    <Form.Control
                      type="date"
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                        setIdTurnoSelect("");
                        setTurnosDisponibles([]);
                      }}
                      min={fechaMinima}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="bookingTurno">
                    <Form.Label className="fw-semibold">
                      Seleccionar Turno Horario
                    </Form.Label>

                    <Form.Select
                      value={idTurnoSelect}
                      onChange={(e) => setIdTurnoSelect(e.target.value)}
                      required
                      disabled={!date || cargandoDisponibilidad}
                    >
                      <option value="">
                        {cargandoDisponibilidad
                          ? "Consultando disponibilidad..."
                          : !date
                            ? "-- Elegí una fecha primero --"
                            : turnosDisponibles.length === 0
                              ? "No hay turnos disponibles"
                              : "-- Elegí un turno --"}
                      </option>

                      {turnosDisponibles.map((turno) => {
                        //Para evitar problemas convierto la hora a string en pantalla
                        const inicio = turno.hora_inicio
                          ? String(turno.hora_inicio).slice(0, 5)
                          : "00:00";
                        const fin = turno.hora_fin
                          ? String(turno.hora_fin).slice(0, 5)
                          : "00:00";

                        return (
                          <option key={turno.id_turno} value={turno.id_turno}>
                            {turno.nombre} ({inicio} - {fin} hs)
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Form.Group>

                  <div className="bg-light border rounded p-3 mb-4 d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-secondary">
                      Total por turno:
                    </span>
                    <span className="fs-4 fw-bold text-success">
                      ${office?.precio_por_turno}
                    </span>
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="outline-secondary"
                      onClick={() => navigate("/catalog")}
                    >
                      Cancelar
                    </Button>

                    <Button
                      variant="success"
                      type="submit"
                      className="fw-bold px-4"
                      disabled={
                        !idTurnoSelect ||
                        cargandoDisponibilidad ||
                        turnosDisponibles.length === 0
                      }
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

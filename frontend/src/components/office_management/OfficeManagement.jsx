import "./officeManagement.css";
import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { apiRequest } from "../../general/api.js";
import { JsonAuthContext } from "../../general/authContext.js";
import { errorToast, successToast } from "../../general/toast.js";
import CreateEditOffice from "./CreateEditOffice.jsx";

const STATUS_COOLDOWN_MS = 1000;

const OfficeManagement = () => {
    const { token } = useContext(JsonAuthContext);
    const [offices, setOffices] = useState([]);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [showOfficeModal, setShowOfficeModal] = useState(false);
    const [selectedOffice, setSelectedOffice] = useState(null);
    const [guardandoOficina, setGuardandoOficina] = useState(false);

    const loadOffices = () => {
        if (!token) return;

        apiRequest("/api/admin/espacios", { token })
            .then((data) => setOffices(data || []))
            .catch((err) => errorToast(`Error al cargar los espacios: ${err.message}`));
    };

    useEffect(() => {
        loadOffices();
    }, [token]);


    const handleToggleStatus = async (idEspacio, switchChecked) => {
        if (updatingStatus) return;

        setUpdatingStatus(true);

        try {
            const estadoActual = switchChecked ? true : false;

            await apiRequest(`/api/admin/espacios/${idEspacio}/estado`, {
                method: "PATCH",
                token,
                body: { activo: estadoActual }
            });

            successToast(
                estadoActual
                    ? "Espacio activado correctamente."
                    : "Espacio desactivado correctamente."
            );

            loadOffices();

        } catch (err) {
            errorToast(`No se pudo cambiar el estado: ${err.message}`);
        } finally {
            window.setTimeout(() => setUpdatingStatus(false), STATUS_COOLDOWN_MS);
        }
    };

    const handleCreateNavigate = () => {
        setSelectedOffice(null);
        setShowOfficeModal(true);
    };

    const handleEditNavigate = (office) => {
        setSelectedOffice(office);
        setShowOfficeModal(true);
    };


    const handleSaveOffice = async (formData) => {
        if (guardandoOficina) return;

        setGuardandoOficina(true);
        try {
            const dataFormat = {
                nombre: formData.nombre,
                descripcion: formData.descripcion,
                capacidad: parseInt(formData.capacidad, 10),
                ubicacion: formData.ubicacion,
                precio_por_turno: parseFloat(formData.precio_por_turno)
            };

            if (selectedOffice) {
                // patch para editar
                await apiRequest(`/api/admin/espacios/${selectedOffice.id_espacio}`, {
                    method: "PATCH",
                    token,
                    body: {
                        nombre: dataFormat.nombre,
                        descripcion: dataFormat.descripcion,
                        capacidad: dataFormat.capacidad,
                        ubicacion: dataFormat.ubicacion,
                        precio_por_turno: dataFormat.precio_por_turno
                    }
                });
                successToast("Oficina actualizada correctamente.");
            } else {
                // post para crear
                await apiRequest("/api/admin/espacios", {
                    method: "POST",
                    token,
                    body: {
                        nombre: dataFormat.nombre,
                        descripcion: dataFormat.descripcion,
                        capacidad: dataFormat.capacidad,
                        ubicacion: dataFormat.ubicacion,
                        precio_por_turno: dataFormat.precio_por_turno
                    }
                });
                successToast("Nueva oficina registrada con éxito.");
            }

            setShowOfficeModal(false);
            loadOffices();
        } catch (err) {
            errorToast(`Error al guardar la oficina: ${err.message}`);
        } finally {
            setGuardandoOficina(false);
        }
    };


    return (
        <div style={{ minHeight: "100vh" }} className="bg-light py-5">
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h2 className="fw-bold text-dark mb-1">Gestión de Oficinas</h2>
                        <p className="text-muted small">Panel de Administración de Espacios</p>
                    </div>
                    <Button
                        variant="success"
                        className="fw-bold px-4 py-2 shadow-sm"
                        onClick={handleCreateNavigate}
                    >
                        + Crear Nueva Oficina
                    </Button>
                </div>

                <Row className="g-4">
                    {offices.map((office) => {
                        const isAvailable = Number(office.activo) === 1;

                        return (
                            <Col key={office.id_espacio} md={4}>
                                <Card
                                    className={`management-office-card h-100 ${!isAvailable ? "management-office-card--inactive" : ""}`}
                                >
                                    <Card.Body className="d-flex flex-column p-4">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <Card.Title className={`fw-bold fs-4 mb-0 ${isAvailable ? "text-primary" : "text-secondary text-decoration-line-through"}`}>
                                                {office.nombre}
                                            </Card.Title>

                                            <Form.Check
                                                type="switch"
                                                id={`status-switch-${office.id_espacio}`}
                                                checked={isAvailable}
                                                disabled={updatingStatus}
                                                onChange={(e) => handleToggleStatus(office.id_espacio, e.target.checked)}
                                                className={`ms-2 management-status-switch ${updatingStatus ? "management-status-switch--disabled" : ""}`}
                                                aria-label={`${isAvailable ? "Desactivar" : "Activar"} ${office.nombre}`}
                                            />
                                        </div>

                                        <Card.Subtitle className="mb-3 text-muted">
                                            {office.ubicacion}
                                        </Card.Subtitle>

                                        <Card.Text className="text-secondary mb-4 small">
                                            {office.descripcion}
                                        </Card.Text>

                                        <div className="mt-auto">
                                            <div className="d-flex justify-content-between align-items-center mb-4 border-top pt-3">
                                                <span className="text-muted small fw-semibold">
                                                    Capacidad: {office.capacidad} pers.
                                                </span>
                                                <span className="fw-bold text-dark fs-5">
                                                    ${parseFloat(office.precio_por_turno).toLocaleString("es-AR")} <span className="fs-6 text-muted fw-normal">/ turno</span>
                                                </span>
                                            </div>

                                            <Button
                                                variant="primary"
                                                className="w-100 fw-bold py-2"
                                                onClick={() => handleEditNavigate(office)}
                                            >
                                                Editar Datos
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}

                    {offices.length === 0 && (
                        <div className="text-center my-5 w-100">
                            <p className="text-muted fs-5">No hay oficinas cargadas en el sistema.</p>
                        </div>
                    )}
                </Row>
            </Container>
            <CreateEditOffice
                show={showOfficeModal}
                onHide={() => setShowOfficeModal(false)}
                onSave={handleSaveOffice}
                officeToEdit={selectedOffice}
            />
        </div>
    );
};

export default OfficeManagement;

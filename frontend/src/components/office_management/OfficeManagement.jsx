import "./officeManagment.css"
import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { apiRequest } from "../../general/api.js";
import { JsonAuthContext } from "../../general/authContext.js";
import { errorToast, successToast } from "../../general/toast.js";

const OfficeManagement = () => {
    const { token } = useContext(JsonAuthContext);
    const [offices, setOffices] = useState([]);

    const loadOffices = () => {
        apiRequest("/api/espacios")
            .then((data) => setOffices(data || []))
            .catch((err) => errorToast(`Error al cargar los espacios: ${err.message}`));
    };

    useEffect(() => {
        loadOffices();
    }, [token]);


    const handleToggleStatus = async (idEspacio, currentStatus) => {
        try {
            const nuevoEstado = !currentStatus;

            await apiRequest(`/api/admin/espacios/${idEspacio}`, {
                method: "PATCH",
                token,
                body: { "activo": nuevoEstado }
            });

            successToast(`Oficina ${nuevoEstado ?
                "Se dió de alta el espacio "
                :
                "Se dió de baja el espacio "
                } ${idEspacio} con éxito.`);
                
            loadOffices();
            
        } catch (err) {
            errorToast(`No se pudo cambiar el estado: ${err.message}`);
        }
    };

    // 3. NAVEGACIÓN A EDICIÓN (Redirecciona al formulario con los datos pre-cargados)
    const handleEditNavigate = (idEspacio) => {
        // Reemplaza esta ruta por la de tu formulario de edición real
        window.location.assign(`/admin/espacios/editar/${idEspacio}`);
    };

    // 4. NAVEGACIÓN A CREACIÓN
    const handleCreateNavigate = () => {
        window.location.assign("/admin/espacios/nuevo");
    };

    return (
        <div style={{ minHeight: "100vh" }} className="bg-light py-5">
            <Container>
                {/* Cabecera del panel con botón de alta */}
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
                        Crear Nueva Oficina
                    </Button>
                </div>

                <Row className="g-4">
                    {offices.map((office) => {
                        // Asumimos que tu backend devuelve 'office.activo' o puedes mapear la propiedad correcta
                        const isAvailable = office.activo !== false;

                        return (
                            <Col key={office.id_espacio} md={4}>
                                <Card
                                    className={`office-card h-100 shadow-sm border-0 ${!isAvailable ? "opacity-50 bg-white" : ""}`}
                                >
                                    <Card.Body className="d-flex flex-column p-4">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <Card.Title className={`fw-bold fs-4 mb-0 ${isAvailable ? "text-primary" : "text-secondary text-decoration-line-through"}`}>
                                                {office.nombre}
                                            </Card.Title>

                                            {/* Switch de Bootstrap para el Toggle Alta/Baja */}
                                            <Form.Check
                                                type="switch"
                                                id={`status-switch-${office.id_espacio}`}
                                                checked={isAvailable}
                                                onChange={() => handleToggleStatus(office.id_espacio, isAvailable)}
                                                className="ms-2 custom-switch"
                                                style={{ cursor: "pointer" }}
                                            />
                                        </div>

                                        <Card.Subtitle className="mb-3 text-muted">
                                            🗺️ {office.ubicacion}
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
                                                    ${parseFloat(office.precio_por_turno).toLocaleString("es-AR")} <span className="fs-6 text-muted fw-normal">/h.</span>
                                                </span>
                                            </div>

                                            {/* Botón de acciones administrativas */}
                                            <Button
                                                variant="outline-primary"
                                                className="w-100 fw-bold py-2"
                                                onClick={() => handleEditNavigate(office.id_espacio)}
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
        </div>
    );
};

export default OfficeManagement;

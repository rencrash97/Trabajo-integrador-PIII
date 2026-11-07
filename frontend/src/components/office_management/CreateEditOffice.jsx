import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const CreateEditOffice = ({ show, onHide, onSave, officeToEdit }) => {

    const initialState = {
        nombre: "",
        descripcion: "",
        capacidad: 0,
        ubicacion: "",
        precio_por_turno: 0
    };

    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        if (officeToEdit) {
            
            setFormData({
                nombre: officeToEdit.nombre || "",
                descripcion: officeToEdit.descripcion || "",
                capacidad: officeToEdit.capacidad || 0,
                ubicacion: officeToEdit.ubicacion || "",
                precio_por_turno: officeToEdit.precio_por_turno || 0
            });
        } else {
            setFormData(initialState);
        }
    }, [officeToEdit, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onSave(formData);
    };

    const isEditMode = !!officeToEdit;

    return (
        <Modal show={show} onHide={onHide} size="lg" centered className="office-management-modal">
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold text-dark">
                    {isEditMode ? "Editar Oficina" : "Crear Nueva Oficina"}
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body className="px-4 py-3">
                    <Row className="g-3">
                        <Col md={12}>
                            <Form.Group controlId="officeName">
                                <Form.Label className="fw-semibold text-secondary">Nombre de la Oficina / Espacio</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Ej: Sala de Reuniones Ejecutiva"
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={12}>
                            <Form.Group controlId="officeLocation">
                                <Form.Label className="fw-semibold text-secondary">Ubicación / Sede</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="ubicacion"
                                    value={formData.ubicacion}
                                    onChange={handleChange}
                                    placeholder="Ej: Sede Centro - Piso 3"
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="officeCapacity">
                                <Form.Label className="fw-semibold text-secondary">Capacidad (personas)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="capacidad"
                                    value={formData.capacidad}
                                    onChange={handleChange}
                                    placeholder="Ej: 8"
                                    min="1"
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="officePrice">
                                <Form.Label className="fw-semibold text-secondary">Precio por turno ($)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="precio_por_turno"
                                    value={formData.precio_por_turno}
                                    onChange={handleChange}
                                    placeholder="Ej: 4500"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={12}>
                            <Form.Group controlId="officeDescription">
                                <Form.Label className="fw-semibold text-secondary">Descripción</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    placeholder="Detalles sobre el equipamiento (Proyector, pizarra, Wifi, etc.)"
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="px-4">
                    <Button variant="outline-secondary" onClick={onHide}>
                        Cancelar
                    </Button>
                    <Button variant={isEditMode ? "primary" : "success"} type="submit" className="fw-bold px-4">
                        {isEditMode ? "Guardar Cambios" : "Crear Oficina"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default CreateEditOffice;

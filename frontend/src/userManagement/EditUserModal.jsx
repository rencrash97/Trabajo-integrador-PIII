import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const EditUserModal = ({ show, onHide, onSave, userToEdit }) => {
    const [formData, setFormData] = useState({ nombre: "", apellido: "", email: "" });

    useEffect(() => {
        if (userToEdit) {
            setFormData({
                nombre: userToEdit.nombre || "",
                apellido: userToEdit.apellido || "",
                mail: userToEdit.mail || ""
            });
        }
    }, [userToEdit, show]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold text-dark">Editar Datos de Usuario</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Row className="g-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="fw-semibold small text-secondary">Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="fw-semibold small text-secondary">Apellido</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.apellido}
                                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label className="fw-semibold small text-secondary">Correo Electrónico</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={formData.mail}
                                    onChange={(e) => setFormData({ ...formData, mail: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={onHide}>Cancelar</Button>
                    <Button variant="primary" type="submit" className="fw-bold">Guardar Cambios</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EditUserModal;

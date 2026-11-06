import { Modal, Button } from "react-bootstrap";

const AreYouReallyReallySureYouWantToDoThatModal = ({ show, onHide, onConfirm, resName, resDate }) => {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold text-danger">Confirmar Cancelación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>¿Estás seguro de que deseas cancelar tu reserva para <strong>{resName}</strong> para el dia <strong>{resDate}</strong>?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onHide}>
                    No, volver
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    Sí, cancelar reserva
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AreYouReallyReallySureYouWantToDoThatModal;

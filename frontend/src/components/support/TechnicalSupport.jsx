import { Card, Container } from "react-bootstrap";

const TechnicalSupport = () => {
  return (
    <div style={{ minHeight: "100vh" }} className="bg-light py-5">
      <Container>
        <div className="mb-4">
          <h2 className="fw-bold text-dark mb-1">Soporte Técnico</h2>
        </div>

        <Card className="border-0 shadow-sm mb-3">
          <Card.Body>
            <Card.Title className="fw-bold text-primary">
              No puedo realizar una reserva
            </Card.Title>
            <Card.Text className="text-secondary mb-0">
              Verificá que hayas seleccionado una fecha y uno de los turnos
              disponibles. Si el turno dejó de estar disponible, elegí otro y
              volvé a intentarlo.
            </Card.Text>
          </Card.Body>
        </Card>

        <Card className="border-0 shadow-sm mb-3">
          <Card.Body>
            <Card.Title className="fw-bold text-primary">
              Mi sesión expiró
            </Card.Title>
            <Card.Text className="text-secondary mb-0">
              Iniciá sesión nuevamente.
            </Card.Text>
          </Card.Body>
        </Card>

        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <Card.Title className="fw-bold text-primary">
              No puedo cancelar una reserva
            </Card.Title>
            <Card.Text className="text-secondary mb-0">
              Las reservas cuyo turno ya comenzó no pueden cancelarse.
            </Card.Text>
          </Card.Body>
        </Card>

        <Card className="border shadow-sm">
          <Card.Body>
            <Card.Title className="fw-bold text-dark">Contacto</Card.Title>
            <Card.Text className="text-secondary">
              Si no encontraste una solución, escribinos
            </Card.Text>
            <a href="mailto:soporte@coworking.com" className="fw-semibold text-primary">
              soporte@coworking.com
            </a>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default TechnicalSupport;

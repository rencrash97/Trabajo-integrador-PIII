import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router";

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold text-dark">Espacios de Coworking para tu empresa</h1>
        <p className="text-muted fs-5">Encontrá el lugar ideal para trabajar de forma cómoda y flexible.</p>
        <div className="d-flex justify-content-center gap-2 mt-4">
          <Button variant="outline-primary" onClick={() => navigate("/catalog")}>
            Ver Catálogo
          </Button>
          <Button variant="outline-primary" onClick={() => navigate("/login")}>
            Iniciar Sesión
          </Button>
        </div>
      </div>

      <main>
        <div className="mb-5">
          <img src="/src/assets/oficina-3.jpg" alt="Img_1" className="w-100 rounded shadow-sm mb-2" />
          <p className="text-secondary">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptate provident voluptas fugit maiores harum nobis? In omnis nihil mollitia consequatur sequi culpa praesentium fugiat iusto recusandae ad, consequuntur inventore sapiente.</p>
        </div>
        <div className="mb-5">
          <img src="/src/assets/oficina-5.jpg" alt="Img_2" className="w-100 rounded shadow-sm mb-2" />
          <p className="text-secondary">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptate provident voluptas fugit maiores harum nobis? In omnis nihil mollitia consequatur sequi culpa praesentium fugiat iusto recusandae ad, consequuntur inventore sapiente.</p>
        </div>
        <div className="mb-5">
          <img src="/src/assets/oficina.jpg" alt="Img_3" className="w-100 rounded shadow-sm mb-2" />
          <p className="text-secondary">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptate provident voluptas fugit maiores harum nobis? In omnis nihil mollitia consequatur sequi culpa praesentium fugiat iusto recusandae ad, consequuntur inventore sapiente.</p>
        </div>
      </main>
    </Container>
  );
};

export default MainPage;
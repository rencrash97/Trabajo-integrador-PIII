import { Container } from "react-bootstrap";
import officeThree from "../../assets/oficina-3.jpg";
import officeFive from "../../assets/oficina-5.jpg";
import office from "../../assets/oficina.jpg";

const MainPage = () => {
  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold text-dark">Espacios de Coworking para tu empresa</h1>
        <p className="text-muted fs-5">Encontrá el lugar ideal para trabajar de forma cómoda y flexible.</p>
      </div>

      <main>
        <div className="mb-5">
          <img src={officeThree} alt="Espacio de coworking luminoso" className="w-100 rounded shadow-sm mb-2" />
          <p className="text-secondary">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptate provident voluptas fugit maiores harum nobis? In omnis nihil mollitia consequatur sequi culpa praesentium fugiat iusto recusandae ad, consequuntur inventore sapiente.</p>
        </div>
        <div className="mb-5">
          <img src={officeFive} alt="Sala de trabajo compartida" className="w-100 rounded shadow-sm mb-2" />
          <p className="text-secondary">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptate provident voluptas fugit maiores harum nobis? In omnis nihil mollitia consequatur sequi culpa praesentium fugiat iusto recusandae ad, consequuntur inventore sapiente.</p>
        </div>
        <div className="mb-5">
          <img src={office} alt="Oficina equipada para trabajar" className="w-100 rounded shadow-sm mb-2" />
          <p className="text-secondary">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptate provident voluptas fugit maiores harum nobis? In omnis nihil mollitia consequatur sequi culpa praesentium fugiat iusto recusandae ad, consequuntur inventore sapiente.</p>
        </div>
      </main>
    </Container>
  );
};

export default MainPage;

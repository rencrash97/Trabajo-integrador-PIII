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
          <p className="text-secondary">Nuestras áreas comunes están diseñadas para maximizar la entrada de luz natural, creando un entorno estimulante que potencia la productividad. Disfrutá de un espacio abierto y dinámico, ideal para conectar con otros profesionales y hacer crecer tu red de contactos.</p>
        </div>
        <div className="mb-5">
          <img src={officeFive} alt="Sala de trabajo compartida" className="w-100 rounded shadow-sm mb-2" />
          <p className="text-secondary">Fomentá la colaboración en nuestras salas de trabajo compartidas, equipadas con mobiliario ergonómico y zonas de descanso interactivas. El equilibrio perfecto entre concentración y sinergia en equipo, adaptado al ritmo de las empresas modernas.</p>
        </div>
        <div className="mb-5">
          <img src={office} alt="Oficina equipada para trabajar" className="w-100 rounded shadow-sm mb-2" />
          <p className="text-secondary">Si tu empresa busca mayor privacidad, disponemos de oficinas privadas y salas de reuniones totalmente equipadas con tecnología de vanguardia y conectividad de alta velocidad. Todo lo que necesitás para operar desde el primer día sin preocuparte por la gestión del lugar.</p>
        </div>
      </main>
    </Container>
  );
};

export default MainPage;

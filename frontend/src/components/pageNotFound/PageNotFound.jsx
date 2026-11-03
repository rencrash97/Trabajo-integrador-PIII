import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';

export const PageNotFound = () => {

    const navigate = useNavigate();

    return (
        <>
            <div  className='d-flex-column align-items-center text-center'>
                <header>
                    <h1 className="mt-4">Um... Oficina equivocada!</h1>
                </header>

                <main>
                    <div>
                        <img src="src\assets\404-not-found.jpg" alt="Img_Not_Found" className="w-75 mx-auto mt-4 d-block" />
                        <p className="mt-4">No te preocupes! Tenemos todo bajo control 😅</p>
                        <p className="mt-4">Por favor, vuelve a la pagina principal.</p>
                    </div>
                    <div className="mt-4 ">
                        <Button onClick={() => navigate("/")}>🐙 Volver al Inicio 🐙</Button>
                    </div>
                </main>

            </div>
        </>
    )
}

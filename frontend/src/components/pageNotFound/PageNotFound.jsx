import { Button } from 'react-bootstrap';

export const PageNotFound = () => {
    return (
        <>
            <div>
                <header>
                    <h1>Oh OH!</h1>
                </header>

                <main>
                    <div>
                        <img src="src\assets\404-not-found.jpg" alt="Img_Not_Found" className="image-big-width w-100" />
                        <h2>No deberias estar aquí!</h2>
                    </div>
                    <Button>Volver al Inicio</Button>
                </main>

                <footer>
                </footer>
            </div>
        </>
    )
}

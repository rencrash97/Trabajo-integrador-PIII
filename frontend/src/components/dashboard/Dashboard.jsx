import MainPage from "../mainPage/mainPage.jsx"
import NavBar from "../navBar/NavBar.jsx"

export const Dashboard = () => {
    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', minHeight: '100vh', paddingTop: '65px' }}>
                <NavBar />
                <MainPage />
            </div>
        </>
    )
}

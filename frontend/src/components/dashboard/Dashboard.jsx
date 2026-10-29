import Footer from "../footer/Footer.jsx";
import MainPage from "../mainPage/MainPage.jsx"
import NavBar from "../navBar/NavBar.jsx"

const Dashboard = () => {
    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', minHeight: '100vh', paddingTop: '65px' }}>
                <NavBar />
                <MainPage />
                <Footer />
            </div>
        </>

    )
};

export default Dashboard;
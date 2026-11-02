import Footer from "../footer/Footer.jsx";
import MainPage from "../mainPage/MainPage.jsx";
import Navigation from "../navigation/Navigation.jsx";

const Dashboard = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh'}}>
            <Navigation />
            <div style={{ flex: 1 }}>
                <MainPage />
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;
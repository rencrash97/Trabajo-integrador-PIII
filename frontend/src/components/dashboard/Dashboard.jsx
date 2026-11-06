import { Outlet } from "react-router";
import Footer from "../footer/Footer.jsx";
import Navigation from "../navigation/Navigation.jsx";

const Dashboard = () => {
    return (
        <div className="dashboardStyle">
            <Navigation />
            <div className="main-content-wrapper">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;

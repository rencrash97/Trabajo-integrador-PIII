import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router';
import Dashboard from './components/dashboard/Dashboard.jsx';
import MainPage from './components/mainPage/MainPage.jsx';
import OfficeCatalog from './components/officeCatalog/OfficeCatalog.jsx';
import Login from './components/login/Login.jsx';
import BookingForm from './components/bookingForm/BookingForm.jsx';
import MyReservations from './components/myReservations/MyReservations.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/catalog" element={<OfficeCatalog />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/reservations" element={<MyReservations />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router';
import Dashboard from './components/dashboard/Dashboard.jsx';
import MainPage from './components/mainPage/MainPage.jsx';
import OfficeCatalog from './components/officeCatalog/OfficeCatalog.jsx';
import Login from './components/login/Login.jsx';
import BookingForm from './components/bookingForm/BookingForm.jsx';
import MyReservations from './components/myReservations/MyReservations.jsx';
import {PageNotFound} from './components/pageNotFound/PageNotFound.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<MainPage />} />
          <Route path="/catalog" element={<OfficeCatalog />} />
          <Route path="/booking" element={<BookingForm />} />
          <Route path="/reservations" element={<MyReservations />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
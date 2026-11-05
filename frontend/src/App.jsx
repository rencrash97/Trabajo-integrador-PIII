import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router';
import Dashboard from './components/dashboard/Dashboard.jsx';
import MainPage from './components/mainPage/MainPage.jsx';
import OfficeCatalog from './components/officeCatalog/OfficeCatalog.jsx';
import Login from './components/auth/login/Login.jsx';
import BookingForm from './components/bookingForm/BookingForm.jsx';
import MyReservations from './components/myReservations/MyReservations.jsx';
import { PageNotFound } from './components/pageNotFound/PageNotFound.jsx';
import Register from './components/auth/login/Register.jsx';
import { Protected } from './components/auth/protection/Protected.jsx';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/*rutas publicas*/}
        <Route path="/" element={<Dashboard />}>
          <Route index element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path='*' element={<PageNotFound />} />

        {/*rutas privadas*/}
        <Route path="/" element={
          <Protected>
            <Dashboard />
          </Protected>}>

          <Route path="/catalog" element={<OfficeCatalog />} />
          <Route path="/booking/:idEspacio" element={<BookingForm />} />
          <Route path="/reservations" element={<MyReservations />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
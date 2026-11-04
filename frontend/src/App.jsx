import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router';
import Dashboard from './components/dashboard/Dashboard.jsx';
import MainPage from './components/mainPage/MainPage.jsx';
import OfficeCatalog from './components/officeCatalog/OfficeCatalog.jsx';
import Login from './auth/login/Login.jsx';
import BookingForm from './components/bookingForm/BookingForm.jsx';
import MyReservations from './components/myReservations/MyReservations.jsx';
import { PageNotFound } from './components/pageNotFound/PageNotFound.jsx';
import { useState } from 'react';
import { Protected } from './auth/protection/Protected.jsx';

function App() {

  // Inicializa en true si ya hay un token en el localStorage
  const [isSignedIn, setIsSignedIn] = useState(() => {
    return !!localStorage.getItem("ADO_token");
  });

  const handleLogIn = () => {
     setIsSignedIn(true)
  }


  return (
    <BrowserRouter>
      <Routes>
        {/*rutas publicas*/}
        <Route path="/" element={<Dashboard />}>
          <Route index element={<MainPage />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLogIn} />} />
        </Route>
        <Route path='*' element={<PageNotFound />} />

        {/*rutas privadas*/}
        <Route path="/" element={
          <Protected isSignedIn={isSignedIn}>
            <Dashboard />
          </Protected>}>

          <Route path="/catalog" element={<OfficeCatalog />} />
          <Route path="/booking" element={<BookingForm />} />
          <Route path="/reservations" element={<MyReservations />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
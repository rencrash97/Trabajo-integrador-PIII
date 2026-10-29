import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Dashboard from "./components/dashboard/Dashboard.jsx"
import { BrowserRouter, Route, Routes } from 'react-router'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/home' element={<Dashboard />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

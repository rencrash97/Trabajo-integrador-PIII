import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Dashboard from "./components/dashboard/Dashboard.jsx"
import { BrowserRouter, Route, Routes } from 'react-router'
import { PageNotFound } from './components/pageNotFound/PageNotFound.jsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

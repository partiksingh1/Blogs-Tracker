import { Route, Routes } from "react-router-dom"
import './App.css'
import { Toaster } from 'react-hot-toast';
import LandingPage from "./pages/LandingPage";
import { Dashboard } from "./pages/Dashboard";
function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </>
  )
}

export default App

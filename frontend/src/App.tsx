import { Route, Routes } from "react-router-dom"
import { Login } from "./pages/Login"
import './App.css'
import { Signup } from "./pages/Signup"
import { Blogs } from "./pages/Dashboard"
import { Toaster } from 'react-hot-toast';
import LandingPage from "./pages/LandingPage"

function App() {

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path='/dashboard' element={<Blogs />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  )
}

export default App

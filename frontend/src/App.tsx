import { Route, Routes } from "react-router-dom"
import './App.css'
import { Toaster } from 'react-hot-toast';
import LandingPage from "./app/page";
import { Dashboard } from "./app/dashboard/page";
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

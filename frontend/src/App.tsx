import { Route, Routes } from "react-router-dom"
import './App.css'
import { Toaster } from 'react-hot-toast';
import LandingPage from "./app/page";
import { Dashboard } from "./app/dashboard/page";
import { Category } from "./app/categories/page";
function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/categories' element={<Category />} />
      </Routes>
    </>
  )
}

export default App

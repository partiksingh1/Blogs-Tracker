import { Route, Routes } from "react-router-dom"
import {Login} from "./pages/Login"
import './App.css'
import { Signup } from "./pages/Signup"
import { Blogs } from "./pages/Blogs"
import { Toaster } from 'react-hot-toast';

function App() {

  return(
    <>
            <Toaster />
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path='/blogs' element={<Blogs/>}/>
      </Routes>
    </>
  )
}

export default App

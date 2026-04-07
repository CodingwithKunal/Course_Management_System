import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../pages/public/Home"
import Login from "../pages/auth/Login"
import Register from "../pages/auth/Register"
import PublicLayout from "../components/layouts/PublicLayout"

function AppRoutes() {
   return (
      <BrowserRouter>
         <Routes>
            <Route element={<PublicLayout/>}>
                <Route path="/" element={<Home/>} />
            </Route>
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />

         </Routes>
      </BrowserRouter>
   )
}

export default AppRoutes

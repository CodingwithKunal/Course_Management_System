import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../pages/public/Home"
import Login from "../pages/auth/Login"
import Register from "../pages/auth/Register"
import PublicLayout from "../components/layouts/PublicLayout"
import RegisterInstructor from "../pages/auth/RegisterInstructor"
import ProtectedRoute from "./ProtectedRoute"
import Courses from "../pages/public/Courses"

function AppRoutes() {
   return (
      <BrowserRouter>
         <Routes>
            <Route element={<PublicLayout />}>
               <Route path="/" element={<Home />} />
               <Route path="/courses" element={<Courses/>}/>
            </Route>


            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-instructor" element={<RegisterInstructor />} />



            <Route path="/dashboard" element={
               <ProtectedRoute allowedRoles={["USER"]}>
                  <h1> User Dashboard</h1>
               </ProtectedRoute>
            }
            />

            <Route path="/instructor" element={
               <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
                  <h1>Instructor Dashboard</h1>
               </ProtectedRoute>
            } />

            <Route path="/admin" element={
               <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <h1>Admin Dashboard</h1>
               </ProtectedRoute>
            } />



            <Route path="*" element={<h1>404 Not Found</h1>} />

         </Routes>
      </BrowserRouter>
   )
}

export default AppRoutes

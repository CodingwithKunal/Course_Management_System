import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../pages/public/Home"
import Login from "../pages/auth/Login"
import Register from "../pages/auth/Register"
import PublicLayout from "../components/layouts/PublicLayout"
import RegisterInstructor from "../pages/auth/RegisterInstructor"
import ProtectedRoute from "./ProtectedRoute"
import Courses from "../pages/public/Courses"
import CourseDetail from "../pages/public/CourseDetail"
import Checkout from "../pages/student/Checkout"
import CourseLearn from "../pages/student/CourseLearn"
import Dashboard from "../pages/student/Dashboard"
import InstructorDashboard from "../pages/instructor/InstructorDashboard"
import CreateCourse from "../pages/instructor/CreateCourse"
import AdminDashboard from "../pages/admin/AdminDashboard"

function AppRoutes() {
   return (
      <BrowserRouter>
         <Routes>
            <Route element={<PublicLayout />}>
               <Route path="/" element={<Home />} />
               <Route path="/courses" element={<Courses />} />
               <Route path="/courses/:id" element={<CourseDetail />} />

               <Route path="/course/:id/learn" element={
                  <ProtectedRoute allowedRoles={["USER",]}>
                     <CourseLearn />
                  </ProtectedRoute>
               } />
               
            </Route>

            <Route path="/checkout/:courseId" element={<Checkout />} />


            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-instructor" element={<RegisterInstructor />} />



            <Route path="/dashboard" element={
               <ProtectedRoute allowedRoles={["USER"]}>
                  <Dashboard/>
               </ProtectedRoute>
            }
            />

            <Route path="/instructor/dashboard" element={
               <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
                  <InstructorDashboard/>
               </ProtectedRoute>
            } />

            <Route path="/instructor/create-course" element={
               <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
                  <CreateCourse/>
               </ProtectedRoute>
            }/>

            <Route path="/admin" element={
               <ProtectedRoute allowedRoles={["ADMIN"]}>
                 <AdminDashboard/>
               </ProtectedRoute>
            } />



            <Route path="*" element={<h1>404 Not Found</h1>} />

         </Routes>
      </BrowserRouter>
   )
}

export default AppRoutes

import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../pages/public/Home"
import Login from "../pages/auth/Login"

import PublicLayout from "../components/layouts/PublicLayout"

import ProtectedRoute from "./ProtectedRoute"
import Courses from "../pages/public/Courses"
import CourseDetail from "../pages/public/CourseDetail"
import Checkout from "../pages/student/Checkout"
import CourseLearn from "../pages/student/CourseLearn"
import Dashboard from "../pages/student/Dashboard"

import CreateCourse from "../pages/instructor/CreateCourse"
import AdminDashboard from "../pages/admin/AdminDashboard"
import Main_Dash from "../pages/instructor/instructor_Analytic_Dashboard/Main_Dash"
import Draft_courses from "../pages/instructor/instructor_Analytic_Dashboard/Draft_courses"
import Edit_course from "../pages/instructor/instructor_Analytic_Dashboard/Edit_course"
import ResubmitCourse from "../pages/instructor/ResubmitCourse"
import { Register } from "../pages/auth/Register"
import { ForgotPassword } from "../pages/auth/ForgotPassword"
import { ResetPassword } from "../pages/auth/ResetPassword"
import { VerifyOtp } from "../pages/auth/VerifyOtp"



function AppRoutes() {
   return (
      <BrowserRouter>
         <Routes>
            <Route element={<PublicLayout />}>
               <Route path="/" element={<Home />} />
               <Route path="/courses" element={<Courses />} />
               <Route path="/courses/:id" element={<CourseDetail />} />

            </Route>

            <Route path="/course/:id/learn" element={
               <ProtectedRoute allowedRoles={["USER", "INSTRUCTOR", "ADMIN"]}>
                  <CourseLearn />
               </ProtectedRoute>
            } />

            <Route path="/checkout/:courseId" element={<Checkout />} />


            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register/>} />
            <Route path="/verify-otp" element={<VerifyOtp/>}/>
            <Route path="/forgot-password" element={<ForgotPassword/>}/>
            <Route path ="/reset-password/:resetToken" element={<ResetPassword/>} />
            



            <Route path="/dashboard" element={
               <ProtectedRoute allowedRoles={["USER"]}>
                  <Dashboard />
               </ProtectedRoute>
            }
            />

            <Route path="/instructor/dashboard" element={
               <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>

                  <Main_Dash />
               </ProtectedRoute>
            } />

            <Route path="/instructor/handle_draft_courses" element={
               <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
                  <Draft_courses />
               </ProtectedRoute>
            } />

            <Route path="/instructor/edit-course/:courseId" element={
               <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
                  <Edit_course />
               </ProtectedRoute>
            } />

            <Route path="/instructor/resubmit-course/:courseId" element={
               <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
                  <ResubmitCourse />
               </ProtectedRoute>
            } />

            <Route path="/instructor/create-course" element={
               <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
                  <CreateCourse />
               </ProtectedRoute>
            } />

            <Route path="/admin" element={
               <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
               </ProtectedRoute>
            } />



            <Route path="*" element={<h1>404 Not Found</h1>} />

         </Routes>
      </BrowserRouter>
   )
}

export default AppRoutes

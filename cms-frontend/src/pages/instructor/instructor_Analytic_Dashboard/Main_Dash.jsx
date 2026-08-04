import React from 'react'
import { useInstructorProfile, useInstructorStatus } from '../../../hooks/useInstructor_profile.js';
import { MdAdd } from "react-icons/md";
import { useNavigate } from 'react-router';
import Instructor_Data_show from './Instructor_Data_show.jsx';
import Pending_courses from './Pending_courses.jsx';
import Rejected_courses from './Rejected_courses.jsx';



const Main_Dash = () => {
   const { instructor, isError, isLoading, } = useInstructorProfile();
   const { status, isBlocked } = useInstructorStatus()
   const navigate = useNavigate()
   if (isLoading) { return <div>Loading...</div> }
   if (isError) { return <div>Error loading instructor profile</div> }

   return (
      <main className='container'>

         {status === false && (
            <div className='bg-red-500 text-white p-4 rounded-lg mb-4'>
               <h2 className='text-lg font-semibold'>Your instructor profile is not approved yet.</h2>
               <p>Please wait for the admin to review and approve your profile.</p>
            </div>
         )}


         {isBlocked && (
            <div className='bg-red-500 text-white p-4 rounded-lg mb-4'>
               <h2 className='text-lg font-semibold'>Your instructor profile is blocked.</h2>
               <p>Please contact support for further assistance.</p>
            </div>
         )}


         {status === true && (
            <>
               <div className="flex justify-between mt-5 mr-10">
                  <h1 onClick={() => navigate("/")} className=' cursor-pointer border border-white rounded-2xl px-4 py-1 ml-4'>Home</h1>
                  <h6 className="underline text-sm bg-white rounded-2xl text-black py-2 px-2 font-bold">
                     {instructor?.name}
                  </h6>
               </div>

               <div className='flex justify-between mr-15 mt-10 bg-rose-950 py-4 pl-10 rounded-xl ml-10'>
                  <div>
                     <h2 className='font-medium underline text-3xl'>Welcome Teacher</h2>
                     <h4 className='text-sm ml-1 text-gray-300'>Here What's happening with your courses today.</h4>
                  </div>

                  <div className='flex justify-center gap-5 pr-5'>
                     <div className='bg-white/20 py-2 px-2 rounded-2xl flex flex-col items-center justify-center'>
                        <h3 className='text-4xl leading-none mb-1 font-extrabold cursor-pointer text-blue-400 ' onClick={() => navigate("/instructor/create-course")}>
                           <MdAdd />
                        </h3>
                        <h3 className='text-xs font-medium text-center'>Create New Course</h3>
                     </div>
                     <div className='bg-white/20 py-2 px-2 rounded-2xl flex flex-col items-center justify-center'>
                        <h3 className='text-xs font-medium text-center cursor-pointer' onClick={() => navigate("/instructor/handle_draft_courses")} >Draft Courses </h3>
                     </div>
                  </div>
               </div>

               <Instructor_Data_show />

               <section className='mt-10 flex flex-col gap-10 px-10'>
                  <Rejected_courses />
                  <Pending_courses />
               </section>


            </>
         )}

      </main>



   )
}

export default Main_Dash

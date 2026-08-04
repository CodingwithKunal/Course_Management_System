import React from 'react'
import Instruct_data_cards from '../Data_cards/Instruct_data_cards'
import { getInstructorEnrollments, getInstructorRevenue, useInstructorCourse } from '../../../hooks/useInstructorCourses.js'
import EmptyState from '../../../components/common/EmptyState'
import { useNavigate } from 'react-router'
import { MdCheckCircle, MdPendingActions, MdCancel, MdGroups, MdPayments } from "react-icons/md";
import { TbClipboardSearch } from "react-icons/tb";

const Instructor_Data_show = () => {
  const {courses, error, isLoading} = useInstructorCourse()
  const { enrollments, isLoading: enrollmentsLoading, error: enrollmentsError } = getInstructorEnrollments()
  const {revenue} = getInstructorRevenue()
  const nevigate = useNavigate()

  if(isLoading || enrollmentsLoading) { return <h2 className=' text-2xl text-center'>Loading...</h2> }
  if(error || enrollmentsError) {return <h2>Failed to load</h2> } 
  if(!courses || courses.length === 0 ){
    return (
      <EmptyState
        message="You have not created or Publish any Courses"
        cta="Go And create Course"
        oncta={() =>nevigate("/instructor/create-course")}
      />
    )
  }
  
  const totalCourses = courses.length 
  const publishCourses = courses.filter((item)=> item.status === "PUBLISHED").length
  const pendingCourses = courses.filter((item)=> item.status === "PENDING").length
  const rejectedCourses = courses.filter((item)=> item.status === "REJECTED").length
  const totalEnrollment = enrollments ?? 0
  const totalRevenue = revenue ?? 0
   


  return (
    <section className='mt-10 mx-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-6 '>
     <Instruct_data_cards
       title="Total Courses"
       value={totalCourses}
       icon={TbClipboardSearch}
       color="#0ea5e9"
     />
     <Instruct_data_cards
       title="Published Courses"
       value={publishCourses}
       icon={MdCheckCircle}
       color="#22c55e"
     />
     <Instruct_data_cards
       title="Pending Courses"
       value={pendingCourses}
       icon={MdPendingActions}
       color="#f59e0b"
     />
     <Instruct_data_cards
       title="Rejected Courses"
       value={rejectedCourses}
       icon={MdCancel}
       color="#ef4444"
     />
     
     <Instruct_data_cards
      title="Total Enrolled"
      value = {totalEnrollment}
      icon={MdGroups}
      color='#8b5cf6'
     />

     <Instruct_data_cards
      title="Total Revenue"
      value={`₹${totalRevenue ?? 0}`}
      icon={MdPayments}
      color='#14b8a6'
     />
    </section>
  )
}

export default Instructor_Data_show

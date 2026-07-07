import React from 'react'
import { useCourseDetail } from '../../hooks/useCourseDetail.js'
import { useNavigate, useParams } from 'react-router-dom'
import { enrollInCourse } from '../../services/courseService.js'
import { useSelector } from 'react-redux'
import { useMutation, useQueryClient } from '@tanstack/react-query'

function CourseDetail() {

    const { id } = useParams()
    const Navigate = useNavigate()
    const { isAuthenticated } = useSelector(state => state.auth)
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: enrollInCourse,
        onSuccess : () =>{
             queryClient.setQueryData(["enrollment-status", id], { ok: true, isEnrolled: true })
             queryClient.invalidateQueries({ queryKey:['my-enrollments'] })
             queryClient.invalidateQueries({ queryKey:['course-detail', id]})
             Navigate(`/course/${course._id}/learn`)
        }
    })

    const { course, isLoading, error, isEnrolled, enrollmentLoading } = useCourseDetail(id)
    



    if (isLoading) { return <div>Loading...</div>; }
    if (error) { return <div>Error loading course details.</div>; }
    if (!course) { return <div>Course not found.</div>; }
    if (enrollmentLoading) { return <div>Checking enrollment status...</div>; }




    const handle_Enroll = async () => {
     
        if(!isAuthenticated){
            return Navigate('/login')
        }
       

        if (course.price === 0) {
           
                mutation.mutate(course._id)
           
        } else {
            Navigate(`/checkout/${course._id}`)
        }

    }

    const renderEnrollButton = () => {
        // If not authenticated, show login prompt
        if (!isAuthenticated) {
            return (
                <button 
                    onClick={() => Navigate('/login')}
                    className='border border-white rounded-2xl cursor-pointer py-2 px-4 active:bg-amber-300 hover:bg-blue-500 transition'
                >
                    Login to Enroll
                </button>
            )
        }

        // If already enrolled, show enrolled status
        if (isEnrolled) {
            return (
                <button 
                   onClick={()=>Navigate(`/course/${course._id}/learn`)}
                    className='border border-green-500 bg-green-100 text-green-700 rounded-2xl cursor-pointer  py-2 px-4'
                >
                    ✓ You are Enrolled
                </button>
            )
        }

        // If not enrolled, show enroll/buy button
        return (
            <button 
                onClick={handle_Enroll} 
                className='border border-white rounded-2xl cursor-pointer py-2 px-4 active:bg-amber-300 hover:bg-blue-500 transition'
                disabled={mutation.isPending}
            >
                {mutation.isPending ? "Enrolling..." : course.price === 0 || "" ? "Enroll Now (Free)" : "Buy Now"}
            </button>
        )
    }




    return (
        <div className=' flex-col flex gap-4 p-5 w-1/2 border border-blue-500 rounded-lg'>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
            <p>Instructor: {course.instructor.name}</p>
            <p>Level: {course.level}</p>
            <p>Category: {course.category}</p>
            <p>Price: ₹{course.price}</p>

            {renderEnrollButton()}

        </div>
    )
}

export default CourseDetail

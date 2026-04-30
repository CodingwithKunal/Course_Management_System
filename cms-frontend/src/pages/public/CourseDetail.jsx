import React from 'react'
import { useCourseDetail } from '../../hooks/useCourseDetail.js'
import { useNavigate, useParams } from 'react-router'
import { enrollInCourse } from '../../services/courseService.js'

function CourseDetail() {

    const { id } = useParams()
    const Nevigate = useNavigate()

    const { course, isLoading, error } = useCourseDetail(id)

    if (isLoading) { return <div>Loading...</div>; }
    if (error) { return <div>Error loading course details.</div>; }
    if (!course) { return <div>Course not found.</div>; }




    const handle_Enroll = async () => { 
        const res = await enrollInCourse(course._id)
        if(res.ok){
            Nevigate("/") // Leter we Update 
        }
    }



    return (
        <div className=' flex-col flex gap-4 p-5 w-1/2 border border-blue-500 rounded-lg'>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
            <p>Instructor: {course.instructor.name}</p>
            <p>Level: {course.level}</p>
            <p>Category: {course.category}</p>
            <p>Price: ${course.price}</p>

            <button onClick={handle_Enroll} className='border border-white rounded-2xl cursor-pointer py-2 active:bg-amber-300'>{ course.price === 0 ? "Enroll Now" : "Buy Now" } </button>

        </div>
    )
}

export default CourseDetail

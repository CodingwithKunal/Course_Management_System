import React from 'react'
import { useCourses } from '../../hooks/useCourses.js'

function Courses() {

    const { courses, filters, isLoading, isError, setfilters } = useCourses();

    if (isLoading) return <p>Loading...</p>
    if (isError) return <p>Error loading courses.</p>

    return (
        <main>
            <h1 className=' text-center font-extrabold text-2xl text-blue-500'>Courses</h1>
            <div className= "flex items-start justify-center mt-5" >
                 <input type="text" placeholder='Search courses...' className='p-2 border border-gray-300 rounded-md w-1/2'
                    value={filters.search } 
                    onChange={(e)=>setfilters({...filters, search: e.target.value})}
                 />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5'>
                {courses.map((course , key)=>(
                    <div  key={key} className='border p-4 rounded-md shadow-sm'>
                        <h2 className='text-lg font-semibold'>{course.title}</h2>
                        <p className='text-gray-600'>{course.description}</p>
                        <p className='text-sm text-gray-500'>Category: {course.category}</p>
                        <p className='text-sm text-gray-500'>Level: {course.level}</p>
                        <p className='text-sm text-gray-500'>Instructor: {course.instructor?.name}</p>
                    </div>
                ))}
            </div>
        </main>
    )
}

export default Courses

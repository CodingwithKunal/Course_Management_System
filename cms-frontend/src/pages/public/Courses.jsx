
import { useCourses } from '../../hooks/useCourses.js'
import { Link } from 'react-router-dom';
import CourseFilteration from './CourseFilteration.jsx';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useMemo } from 'react';

function Courses() {

    const { courses, filters, isLoading, isError, setfilters, totalPages } = useCourses();


    const handleSearch = (e) => {
        setfilters((prev) => ({
            ...prev,
            search: e.target.value,
            page: 1,
        }))
    }


    const pageNumbers = useMemo(() => {
        return Array.from({ length: totalPages }, (_, index) => index + 1)
    }, [totalPages])



    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setfilters((prev) => ({
                ...prev,
                page: newPage,
            }))

            window.scroll({ top: 0, behavior: "smooth" })
        }
    }


    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20 text-slate-400">
                <p className="animate-pulse font-medium text-lg">Loading courses...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center py-20 text-red-400">
                <p className="font-medium text-lg">Failed to load courses. Please try again later.</p>
            </div>
        );
    }

    return (
        <main className=' px-10   mx-auto flex gap-8   py-8  '>

            <section className='mt-10'>
                <CourseFilteration filters={filters} setfilters={setfilters} />
            </section>

            <section className='flex-1'  >

                <div className="mb-8">
                    <h1 className="text-center text-3xl font-extrabold text-blue-500">
                        Explore Courses
                    </h1>

                    <p className="mt-2 text-center text-sm text-gray-400">
                        Find the right course and start learning today
                    </p>
                </div>


                <div className=" mb-8 flex justify-center" >
                    <div className="relative w-full max-w-2xl">

                        <FiSearch
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                        />

                        <input
                            type="text"
                            placeholder="Search courses by title or description..."
                            className="w-full rounded-xl border border-gray-700 bg-gray-900 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            value={filters.search}
                            onChange={handleSearch}
                        />

                    </div>
                </div>

                {courses.length === 0 ? (

                    <div className="text-center py-16 text-slate-500">
                        <p className="text-lg">No courses found matching your criteria.</p>
                    </div>

                ) : (

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 '>
                        {courses.map((course) => (
                            <div key={course._id} className='border p-4 rounded-md shadow-sm'>
                                <h2 className='text-lg font-semibold'>{course.title}</h2>
                                <p className='text-gray-600'>{course.description}</p>
                                <p className='text-sm text-gray-500'>Category: {course.category}</p>
                                <p className='text-sm text-gray-500'>Level: {course.level}</p>
                                <p className='text-sm text-gray-500'>Instructor: {course.instructor?.name}</p>
                                <div className=' flex items-center'>

                                    <Link to={`/courses/${course._id}`} className='py-2 px-3 border border-white rounded-2xl text-center mt-4 cursor-pointer '>View Details</Link>
                                </div>

                            </div>
                        ))}
                    </div>

                )}

                {totalPages > 1 && (
                    <div className='mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-800 pt-6'>
                        <p className='text-sm text-gray-400'>
                            Showing Page <span className='font-semibold text-white'>{filters.page}</span> of <span className='font-semibold text-white'>{totalPages}</span>
                        </p>

                        <div className='flex justify-end items-center gap-5 '>
                            <button
                                className='flex items-center gap-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm rounded-xl py-2 px-4 transition border border-gray-700'
                                onClick={() => handlePageChange(filters.page - 1)}
                                disabled={filters.page == 1}
                            >
                                <FiChevronLeft size={16} />Previous
                            </button>

                            <div className='flex items-center gap-1.5'>
                                {pageNumbers.map((pageNum) => (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`h-9 w-9 rounded-xl text-sm font-medium transition flex items-center justify-center ${filters.page === pageNum
                                            ? "bg-blue-600 text-white font-bold"
                                            : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                ))}
                            </div>

                            <button
                                className='flex items-center gap-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm rounded-xl py-2 px-4 transition border border-gray-700'
                                onClick={() => handlePageChange(filters.page + 1)}
                                disabled={filters.page == totalPages}
                            >
                                Next<FiChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}



            </section>


        </main>
    )
}

export default Courses

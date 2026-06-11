import { useInstructorCourse } from "../../hooks/useInstructorCourses.js"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import EmptyState from "../../components/common/EmptyState.jsx"
import StatusBadge from "../../components/common/StatusBadge.jsx"
import { submitCourseForReview } from "../../services/instructorService.js"

const InstructorDashboard = () => {
    const { courses, error, isLoading, refetch } = useInstructorCourse()
    const navigate = useNavigate()
    const [submitting, setSubmitting] = useState(null)

    const handleSubmitCourse = async (courseId) => {
        setSubmitting(courseId)
        const res = await submitCourseForReview(courseId)
        setSubmitting(null)
        if (res.ok) {
            refetch()
        }
    }

    if (isLoading) return <p className="text-center py-10">Loading...</p>
    if (error) return <p className="text-center py-10">Failed to load courses</p>
    if (!courses || courses.length === 0) return (
        <EmptyState
            title="No Courses Found"
            description="You haven't created any courses yet. Start by creating your first course!"
            cta="Create Course"
            oncta={() => navigate("/instructor/create-course")}
        />
    )

    return (
        <main className="container mx-auto p-6">
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
               <div className="flex items-center gap-3">
                   <button onClick={()=> navigate("/")}  className=" cursor-pointer py-5 " > Home </button>
               </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-200 my-5">Instructor Dashboard</h1>
                    <p className="text-sm text-gray-300">Manage your courses, edit content, and submit for review.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/instructor/create-course')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
                    >
                        + Create Course
                    </button>
                </div>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <article key={course._id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                        <div className="p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">{course.title}</h2>
                                    <p className="text-sm text-gray-500 mt-1">{course.category} • {course.level || 'All Levels'}</p>
                                </div>
                                <div className="ml-4">
                                    <StatusBadge status={course.status} />
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 mt-3 line-clamp-3">{course.description || 'No description provided.'}</p>

                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Instructor: <span className="font-medium text-gray-700">{course.instructor?.name || 'You'}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => navigate(`/instructor/edit-course/${course._id}`)}
                                        className="px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
                                    >
                                        Edit
                                    </button>

                                    {course.status === "DRAFT" && (
                                        <button
                                            className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => handleSubmitCourse(course._id)}
                                            disabled={submitting === course._id}
                                        >
                                            {submitting === course._id ? "Submitting..." : "Submit"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <footer className="bg-gray-50 px-4 py-2 text-xs text-gray-500 flex items-center justify-between">
                            <span>{course.countLessons ? `${course.countLessons} lessons` : '—'}</span>
                            <span>Created {new Date(course.createdAt).toLocaleDateString()}</span>
                        </footer>
                    </article>
                ))}
            </section>
        </main>
    )
}

export default InstructorDashboard

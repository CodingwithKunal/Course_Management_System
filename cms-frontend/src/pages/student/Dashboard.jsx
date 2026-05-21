
import { useNavigate } from "react-router"
import EmptyState from "../../components/common/EmptyState"
import useMyEnrollments from "../../hooks/useMyEnrollments.js"
import { ProgressBar } from "../../components/course/ProgressBar.jsx"


function Dashboard() {
    const nevigate = useNavigate()
    const { enrollments, error, isLoading } = useMyEnrollments()

    if (isLoading) { return <h2>Loading Dashboard...</h2> }
    if (error) { return <h2>Failed to load dashboard. Please try again.</h2> }
    if (!enrollments || enrollments.length === 0) {
        return (
            <EmptyState
                message="You have no enrollments yet."
                cta="Go to Courses"
                oncta={() => nevigate("/courses")}
            />
        )
    }
    return (
        <main className="p-5">
            <h1 className="text-3xl font-bold mb-6">
                My Learning Dashboard
            </h1>

            <div className="grid md:grid-cols-2 gap-5">
                {enrollments.map((item) => (
                    <div
                        key={item._id}
                        className="border rounded-lg p-4 shadow"
                    >
                        <h2 className="text-xl font-semibold">
                            {item.course.title}
                        </h2>

                        <p className="text-gray-500">
                            Instructor: {item.course.instructor?.name}
                        </p>

                        <ProgressBar progress={item.progress} />

                        <p className="mt-2">
                            Status: {item.progress}
                        </p>

                        <button
                            onClick={() =>
                                nevigate(`/course/${item.course._id}/learn`)
                            }
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Continue Learning
                        </button>
                    </div>
                ))}
            </div>
        </main>
    )
}

export default Dashboard

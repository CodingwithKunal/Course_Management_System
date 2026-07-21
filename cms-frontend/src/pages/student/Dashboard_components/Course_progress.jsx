
import useMyEnrollments from "../../../hooks/useMyEnrollments.js"
import { useNavigate } from "react-router"
import { ProgressBar} from "../../../components/course/ProgressBar.jsx"
import EmptyState from "../../../components/common/EmptyState.jsx"

const Course_progress = () => {
    const nevigate = useNavigate()

    const { enrollments, error, isLoading } = useMyEnrollments()
    if (isLoading) { return <h2>Loading Dashboard...</h2> }
    if (error) { return <h2>Failed to load dashboard. Please try again.</h2> }
    if (!ProgressBar || ProgressBar.length === 0) {
        return (
            
            <EmptyState
                message="You have no course progress yet."
                cta="Go to Courses"
                oncta={() => nevigate("/courses")}
            />
        )
    }

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
        <section>
            <div className="grid md:grid-cols-3 gap-5">
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
                         
                         {item.progress === "IN_PROGRESS" && (
                                  <ProgressBar progress={item.progress} />
                         ) }

                        <p className="mt-2">
                            Status: {item.progress}
                        </p>

                      
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Course_progress

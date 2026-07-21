import { useNavigate } from "react-router"
import EmptyState from "../../components/common/EmptyState"
import useMyEnrollments from "../../hooks/useMyEnrollments.js"
import Statecard from "./Dashboard_StateCards/Statecard.jsx"
import ContinueLearningCard from "./Dashboard_components/ContinueLearningCard.jsx"
import Course_progress from "./Dashboard_components/Course_progress.jsx"


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

    const totalEnrollment = enrollments.length
    const completedCourses = enrollments.filter((item) => item.progress === "COMPLETED").length
    const courseProgress = enrollments.filter((item) => item.progress === "IN_PROGRESS").length
    const notstartedCourse = enrollments.filter((item) => item.progress === "NOT_STARTED").length
    const pendingCourse = courseProgress + notstartedCourse
    const totalCompletion = totalEnrollment === 0 ? 0 : Math.round((completedCourses / totalEnrollment) * 100)

    return (
        <main className="p-5">
            <div>
                <h2 className=" font-bold">Welcome Back <span className=" text-3xl text-cyan-500">{enrollments[0]?.user?.name || "Student"}</span> </h2>
            </div>
            <h1 className="text-3xl font-bold mb-6 text-center">
                My Learning Dashboard
            </h1>
            {/* show the Statecards with Values */}
            <div className="flex justify-center items-center">
                <div className=" mb-6  p-6 rounded-lg bg-white/30 w-9/10 backdrop-blur-3xl shadow-md">
                    <h3 className="font-bold text-xl mb-4">About Courses </h3>
                    <section className="flex flex-wrap justify-center gap-4 mb-6">

                        <Statecard title="Total Enrollments" value={totalEnrollment} color="bg-blue-500" />
                        <Statecard title="Completed Courses" value={completedCourses} color="bg-green-500" />
                        <Statecard title="Pending Courses" value={pendingCourse} color="bg-yellow-500" />
                        <Statecard title="Not Started Courses" value={notstartedCourse} color="bg-red-500" />
                        <Statecard title="Total Completion" value={`${totalCompletion}%`} color="bg-purple-500" />

                    </section>
                </div>
            </div>




            <Course_progress/>
            <ContinueLearningCard/>


        </main>
    )
}

export default Dashboard

import { useInstructorCourse } from "../../../hooks/useInstructorCourses.js"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import StatusBadge from "../../../components/common/StatusBadge"
import { submitCourseForReview } from "../../../services/instructorService.js"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FiArrowLeft, FiEdit2, FiSend, FiFileText, FiCheckCircle, FiPlusCircle } from "react-icons/fi"
import { deleteCourse } from "../../../services/instructorService.js"


const Draft_courses = () => {
    const { courses, error, isLoading, refetch } = useInstructorCourse()
    const navigate = useNavigate()
    const [submitting, setsubmitting] = useState(null)
    const draftCourses = courses.filter((course) => course.status === "DRAFT")
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: submitCourseForReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getInstructor_course"] })
        },
        onSettled: () => {
            setsubmitting(null)
        }
    })

    const handleSubmitCourse = (courseId) => {
        const confirmSubmit = window.confirm("Are you sure you want to submit this course for review? Once submitted, you won't be able to edit it until the admin reviews it.");
        if (!confirmSubmit) return
        setsubmitting(courseId)
        mutation.mutate(courseId)
    }

    const deleteAction = async (courseId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this course?");
        if (confirmDelete) {
            const result = await deleteCourse(courseId)
            if(result?.ok) {
                refetch()
            }
        }
    }

    if (isLoading) {
        return (
            <main className="container mx-auto p-6">
                <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-8 text-center text-slate-200">
                    Loading draft courses...
                </div>
            </main>
        )
    }

    if (error) {
        return (
            <main className="container mx-auto p-6">
                <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-8 text-center text-red-200">
                    Failed to load your draft courses.
                </div>
            </main>
        )
    }

    if (!courses || courses.length === 0) {
        return (
            <main className="container mx-auto p-6">
                <section className="rounded-3xl border border-slate-700 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-slate-100 shadow-xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <FiFileText className="mx-auto mb-4 text-4xl text-amber-400" />
                        <h1 className="text-2xl font-bold">No courses created yet</h1>
                        <p className="mt-2 text-slate-300">Create your first course draft to start building content for review.</p>
                        <button
                            onClick={() => navigate("/instructor/create-course")}
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 font-semibold text-slate-900 transition hover:bg-amber-300"
                        >
                            <FiPlusCircle />
                            Create Course
                        </button>
                    </div>
                </section>
            </main>
        )
    }

    if (draftCourses.length === 0) {
        return (
            <main className="container mx-auto p-6">
                <section className="rounded-3xl border border-emerald-500/30 bg-linear-to-br from-slate-900 via-emerald-950/40 to-slate-900 p-8 text-slate-100 shadow-xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <FiCheckCircle className="mx-auto mb-4 text-4xl text-emerald-400" />
                        <h1 className="text-2xl font-bold">All draft courses are submitted</h1>
                        <p className="mt-2 text-slate-300">You have no pending drafts right now. Admin review is in progress for your submitted courses.</p>
                        <div className="mt-6 flex flex-wrap justify-center gap-3">
                            <button
                                onClick={() => navigate("/instructor/create-course")}
                                className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 font-semibold text-slate-900 transition hover:bg-amber-300"
                            >
                                <FiPlusCircle />
                                Create New Draft
                            </button>
                            <button
                                onClick={() => navigate("/instructor/dashboard")}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-500 px-4 py-2 text-slate-200 transition hover:bg-slate-700/50"
                            >
                                <FiArrowLeft />
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        )
    }

    return (
        <main className="container mx-auto p-6">
            <header className="mb-8 rounded-3xl border border-slate-700 bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 p-6 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <button
                        onClick={() => navigate("/instructor/dashboard")}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-500 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700/60"
                    >
                        <FiArrowLeft />
                        Dashboard
                    </button>
                    <div className="text-right text-xs text-slate-300">
                        {draftCourses.length} Draft {draftCourses.length === 1 ? "Course" : "Courses"}
                    </div>
                </div>

                <div className="mt-5">
                    <h1 className="text-3xl font-bold text-slate-100">Draft Courses Workspace</h1>
                    <p className="mt-2 text-sm text-slate-300">Only your draft courses are shown here. Edit each draft or submit it for admin review.</p>
                </div>
            </header>

            <section className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-900/70 shadow-2xl backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-700 text-left text-sm">
                        <thead className="bg-slate-800/90 text-slate-300">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Course</th>
                                <th className="px-4 py-3 font-semibold">Category</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                                <th className="px-4 py-3 font-semibold">Created</th>
                                <th className="px-4 py-3 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {draftCourses.map((course) => (
                                <tr key={course._id} className="bg-slate-900/60 transition hover:bg-slate-800/70">
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-100">{course.title}</span>
                                             
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-slate-300">{course.category || "Uncategorized"}</td>
                                    <td className="pl-1 py-4">
                                        <StatusBadge status={course.status} />
                                    </td>
                                    <td className="px-4 py-4 text-slate-400">{new Date(course.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/instructor/edit-course/${course._id}`)}
                                                className="inline-flex items-center gap-1 rounded-md bg-amber-500 px-3 py-1.5 text-sm font-medium text-slate-950 transition hover:bg-amber-400 cursor-pointer"
                                            >
                                                <FiEdit2 className="text-xs" />
                                                Edit
                                            </button>

                                           

                                            <button
                                                className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                                onClick={() => handleSubmitCourse(course._id)}
                                                disabled={submitting === course._id}
                                            >
                                                <FiSend className="text-xs" />
                                                {submitting === course._id ? "Submitting..." : "Submit Review"}
                                            </button>


                                             <button
                                                onClick={() => deleteAction(course._id)}
                                                className="inline-flex items-center gap-1 rounded-md bg-red-950/30 hover:bg-red-900/40 px-3 py-1.5 text-sm font-medium  text-red-400 transition cursor-pointer "
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    )
}

export default Draft_courses

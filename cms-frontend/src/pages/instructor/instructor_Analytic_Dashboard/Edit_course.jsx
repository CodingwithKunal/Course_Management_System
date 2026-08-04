import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { updateCourse } from '../../../services/instructorService'
import { useNavigate, useParams } from 'react-router-dom'
import { useInstructorCourse } from '../../../hooks/useInstructorCourses'

const EditCourseForm = ({ course }) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    title: course.title || "",
    description: course.description || "",
    category: course.category || "",
    level: course.level || "",
    price: course.price ?? "",
  })

  const mutation = useMutation({
    mutationFn: ({ courseId, data }) => updateCourse(courseId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getInstructor_course"] })
      navigate("/instructor/handle_draft_courses")
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    mutation.mutate({ courseId: course._id, data: formData })
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-900 py-12 px-4">
      <button
        onClick={() => navigate("/instructor/handle_draft_courses")}
        className="absolute top-5 left-5 text-gray-400 hover:text-gray-200 cursor-pointer text-sm"
      >
        ← Back to Draft Courses
      </button>

      <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Edit Course</h1>
          <p className="text-gray-400 mt-2">
            Update the current course details and save your changes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
              Course Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Complete Web Development Bootcamp"
              className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your course in detail."
              rows="5"
              className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-white mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              >
                <option value="">Select a category</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Data Science">Data Science</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Cloud Computing">Cloud Computing</option>
                <option value="DevOps">DevOps</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="level" className="block text-sm font-medium text-white mb-2">
                Difficulty Level *
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              >
                <option value="">Select a level</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-white mb-2">
              Price *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-400 text-lg">₹</span>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full pl-8 pr-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Set 0 for a free course</p>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 shadow-md"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Editing..." : "Edit Course"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/instructor/dashboard")}
              className="flex-1 py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-4 mt-8">
          <p className="text-sm text-blue-200">
            <span className="font-semibold">💡 Tip:</span> Make sure your course title is clear and descriptive. Provide a detailed description to attract more students.
          </p>
        </div>
      </div>
    </main>
  )
} 

const Edit_course = () => {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const { courses, isLoading, error } = useInstructorCourse()
  const selectedCourse = courses.find((course) => course._id === courseId)

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-900 px-4 py-12 text-gray-200">
        Loading course details...
      </main>
    )
  }

  if (error || !selectedCourse) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-900 px-4 py-12 text-gray-200">
        <div className="max-w-md rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-center">
          <h1 className="text-xl font-semibold text-white">Course not found</h1>
          <p className="mt-2 text-sm text-red-200">We could not load the course you want to edit.</p>
          <button
            onClick={() => navigate("/instructor/handle_draft_courses")}
            className="mt-4 rounded-lg bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-400"
          >
            Back to Drafts
          </button>
        </div>
      </main>
    )
  }

  return <EditCourseForm key={selectedCourse._id} course={selectedCourse} />
}

export default Edit_course



import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCourse } from "../../services/instructorService.js";
import { useMutation } from "@tanstack/react-query";


const CreateCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "",
    price: "",
  });

  const mutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      navigate("/instructor/dashboard")
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault();

    mutation.mutate(formData);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-900 py-12 px-4">
      <button
        onClick={() => navigate("/instructor/dashboard")}
        className="absolute top-5 left-5 text-gray-400 hover:text-gray-200 cursor-pointer text-sm"
      >
        ← Back to Dashboard
      </button>

      <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Create New Course</h1>
          <p className="text-gray-400 mt-2">
            Fill in the details below to create a new course. You can edit these details later.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
              Course Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"

              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Complete Web Development Bootcamp"
              className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"

              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your course in detail. What will students learn?"
              rows="5"
              className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              required
            />
          </div>

          {/* Category and Level - Two Column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Field */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-white mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"

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

            {/* Level Field */}
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-white mb-2">
                Difficulty Level *
              </label>
              <select
                id="level"
                name="level"

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

          {/* Price Field */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-white mb-2">
              Price (USD)*
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-400 text-lg">$</span>
              <input
                type="number"
                id="price"
                name="price"
                
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

          {/* Form Actions */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 shadow-md"
              disabled = {mutation.isPending}
            >
              {mutation.isPending ? "Creating...":"Create Course"}
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

        {/* Info Box */}
        <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-4 mt-8">
          <p className="text-sm text-blue-200">
            <span className="font-semibold">💡 Tip:</span> Make sure your course title is clear and descriptive. Provide a detailed description to attract more students.
          </p>
        </div>
      </div>
    </main>
  );
}

export default CreateCourse;

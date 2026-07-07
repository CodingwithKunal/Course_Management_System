import React, { useState, useEffect } from "react";
import { getPending_course, publishCourse, unpublishCourse, rejectCourse } from "../../services/adminService.js";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

const AdminCheckCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const fetchCourses = async () => {
    setLoading(true);
    const result = await getPending_course();
    setCourses(result.ok ? (result.data.pendingCourses || []) : []);
    setLoading(false);
  };


  // Fetch pending courses
  useEffect(() => {
    const timerId = window.setTimeout(() => {
      fetchCourses();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, []);



  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || course.status === filterStatus;
    return matchesSearch && matchesStatus;
  });



  // Handle publish course
  const handlePublish = async (courseId) => {
    setActionLoading((prev) => ({ ...prev, [`publish_${courseId}`]: true }));
    const result = await publishCourse(courseId);
    setActionLoading((prev) => ({ ...prev, [`publish_${courseId}`]: false }));
    if (result.ok) {
      toast.success(result.message || "Course published successfully");
      await fetchCourses();
      setExpandedCourseId(null);
    } else {
      toast.error(result.message || "Failed to publish course");
    }
  };



  // Handle unpublish course
  const handleUnpublish = async (courseId) => {
    if (!window.confirm("Unpublish this course? It will no longer be available to students.")) {
      return;
    }
    setActionLoading((prev) => ({ ...prev, [`unpublish_${courseId}`]: true }));
    const result = await unpublishCourse(courseId);
    setActionLoading((prev) => ({ ...prev, [`unpublish_${courseId}`]: false }));
    if (result.ok) {
      toast.success(result.message || "Course unpublished successfully");
      await fetchCourses();
      setExpandedCourseId(null);
    } else {
      toast.error(result.message || "Failed to unpublish course");
    }
  };



  // Handle reject course
  const rejectMutation = useMutation({
    mutationFn: ({ courseId, rejectReason}) => rejectCourse(courseId, rejectReason),
     onSuccess: () => {
        toast.success("Course Rejected")

        fetchCourses();

        setShowRejectModal(null);
        setRejectReason("");
        setExpandedCourseId(null);
     },
     onError: (error)=>{
      toast.error(error?.message || "Failed to reject course")
     }
  })
   
  const handleReject = async (courseId) => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    
    rejectMutation.mutate({courseId, rejectReason});
  };



  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }



  // Empty state
  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No pending courses to review</p>
      </div>
    );
  }




  return (
    <div className="rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Management</h2>
        <p className="text-gray-600">
          Review and manage course submissions. Total pending: <span className="font-semibold">{courses.length}</span>
        </p>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Search Bar */}
        <div className="md:col-span-2 relative">
          <svg
            className="absolute left-3 top-3 w-5 h-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by course name or instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="PUBLISHED">Published</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Results Info */}
      <div className="mb-4 text-sm text-gray-600">
        Showing <span className="font-semibold">{filteredCourses.length}</span> of{" "}
        <span className="font-semibold">{courses.length}</span> courses
      </div>

      {/* Courses Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition"
            >
              {/* Course Thumbnail */}
              <div className="relative w-full h-40 bg-gray-200 overflow-hidden">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: "linear-gradient(to bottom right, rgb(96 165 250), rgb(37 99 235))" }}
                  >
                    <svg
                      className="w-12 h-12 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C6.596.75 2.583 3.528 2.583 7.333c0 4.368 5.4 9.327 9.417 12.582.52.391 1.203.391 1.723 0 4.017-3.255 9.417-8.214 9.417-12.582 0-3.805-4.013-6.583-9.417-6.583z"
                      />
                    </svg>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      course.status === "PUBLISHED"
                        ? "bg-green-100 text-green-800"
                        : course.status === "REJECTED"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {course.status}
                  </span>
                </div>
              </div>

              {/* Course Details */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>

                {/* Course Info */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-4 h-4 mr-2 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="font-medium">{course.instructor?.name || "Unknown"}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-4 h-4 mr-2 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <span className="font-medium">{course.level}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-4 h-4 mr-2 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-medium">${course.price}</span>
                  </div>

                  {course.category && (
                    <div className="flex items-center text-gray-600">
                      <svg
                        className="w-4 h-4 mr-2 text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      <span className="font-medium">{course.category}</span>
                    </div>
                  )}
                </div>

                {/* Show rejection reason if rejected */}
                {course.status === "REJECTED" && course.rejectionReason && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-xs font-semibold text-red-800 mb-1">Rejection Reason:</p>
                    <p className="text-sm text-red-700">{course.rejectionReason}</p>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() =>
                    setExpandedCourseId(expandedCourseId === course._id ? null : course._id)
                  }
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm font-medium border border-blue-200"
                >
                  Actions
                  <svg
                    className={`w-4 h-4 transition transform ${
                      expandedCourseId === course._id ? "rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </button>

                {/* Expanded Actions */}
                {expandedCourseId === course._id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                    {course.status !== "PUBLISHED" && (
                      <button
                        onClick={() => handlePublish(course._id)}
                        disabled={actionLoading[`publish_${course._id}`]}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {actionLoading[`publish_${course._id}`] ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            Publishing...
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Publish Course
                          </>
                        )}
                      </button>
                    )}

                    {course.status === "PUBLISHED" && (
                      <button
                        onClick={() => handleUnpublish(course._id)}
                        disabled={actionLoading[`unpublish_${course._id}`]}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg font-medium hover:bg-orange-200 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {actionLoading[`unpublish_${course._id}`] ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            Unpublishing...
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            Unpublish Course
                          </>
                        )}
                      </button>
                    )}

                    {course.status !== "REJECTED" && (
                      <button
                        onClick={() => setShowRejectModal(course._id)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition text-sm"
                      >
                        <svg
                          className="w-4 h-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Reject Course
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No courses match your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reject Course</h3>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">
                Please provide a reason for rejecting this course. This will be shown to the instructor.
              </p>
              <p className="text-xs text-gray-500">Optional</p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
                maxLength={500}
                className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition resize-none"
                rows="5"
              />
              <p className="text-xs text-gray-500 mt-1">{rejectReason.length}/500</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectReason("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(showRejectModal)}
                disabled={actionLoading[`reject_${showRejectModal}`] || !rejectReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled= {rejectMutation.isPending}
              >
                {rejectMutation.isPending ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCheckCourses;

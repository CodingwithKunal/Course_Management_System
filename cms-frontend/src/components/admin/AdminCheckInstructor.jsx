import React, { useState, useEffect } from "react";
import { getPendingInstructors, approveInstructor, disapproveInstructor } from "../../services/adminService.js";
import { toast } from "sonner";

const AdminCheckInstructor = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [expandedInstructorId, setExpandedInstructorId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // Fetch pending instructors
  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    setLoading(true);
    const result = await getPendingInstructors();
    if (result.ok && result.data.pendingInstructors) {
      setInstructors(result.data.pendingInstructors);
    }
    setLoading(false);
  };

  // Filter instructors
  const filteredInstructors = instructors.filter((instructor) => {
    const matchesSearch =
      instructor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "ALL" ||
      (filterStatus === "PENDING" && !instructor.instructor?.isApproved) ||
      (filterStatus === "APPROVED" && instructor.instructor?.isApproved);
    return matchesSearch && matchesStatus;
  });

  // Handle approve instructor
  const handleApprove = async (instructorId) => {
    setActionLoading((prev) => ({ ...prev, [`approve_${instructorId}`]: true }));
    const result = await approveInstructor(instructorId);
    setActionLoading((prev) => ({ ...prev, [`approve_${instructorId}`]: false }));
    if (result.ok) {
      toast.success(result.message || "Instructor approved successfully");
      fetchInstructors();
      setExpandedInstructorId(null);
    } else {
      toast.error(result.message || "Failed to approve instructor");
    }
  };

  // Handle disapprove instructor
  const handleDisapprove = async (instructorId) => {
    if (!window.confirm("Are you sure you want to disapprove this instructor?")) {
      return;
    }
    setActionLoading((prev) => ({ ...prev, [`disapprove_${instructorId}`]: true }));
    const result = await disapproveInstructor(instructorId);
    setActionLoading((prev) => ({ ...prev, [`disapprove_${instructorId}`]: false }));
    if (result.ok) {
      toast.success(result.message || "Instructor disapproved successfully");
      fetchInstructors();
      setExpandedInstructorId(null);
    } else {
      toast.error(result.message || "Failed to disapprove instructor");
    }
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
  if (instructors.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No pending instructors to review</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Instructor Management</h2>
        <p className="text-gray-600">
          Review and approve instructor registrations. Total pending: <span className="font-semibold">{instructors.length}</span>
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
            placeholder="Search by name or email..."
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
          <option value="APPROVED">Approved</option>
        </select>
      </div>

      {/* Results Info */}
      <div className="mb-4 text-sm text-gray-600">
        Showing <span className="font-semibold">{filteredInstructors.length}</span> of{" "}
        <span className="font-semibold">{instructors.length}</span> instructors
      </div>

      {/* Instructors Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredInstructors.length > 0 ? (
          filteredInstructors.map((instructor) => (
            <div
              key={instructor._id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition"
            >
              {/* Header with status badge */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-6 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center font-bold text-blue-600 text-lg">
                      {instructor.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{instructor.name}</h3>
                      <p className="text-blue-100 text-sm">{instructor.email}</p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      instructor.instructor?.isApproved
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {instructor.instructor?.isApproved ? "Approved" : "Pending"}
                  </span>
                </div>
              </div>

              {/* Instructor Details */}
              <div className="p-4">
                {/* Role */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-xs text-gray-500 font-semibold mb-1">ROLE</p>
                  <p className="text-gray-900 font-semibold flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      />
                    </svg>
                    {instructor.role}
                  </p>
                </div>

                {/* Instructor Info */}
                <div className="space-y-3 mb-4">
                  {/* Bio */}
                  <div>
                    <p className="text-xs text-gray-500 font-semibold mb-1">BIO</p>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {instructor.instructor?.bio || "No bio provided"}
                    </p>
                  </div>

                  {/* Expertise */}
                  <div>
                    <p className="text-xs text-gray-500 font-semibold mb-1">EXPERTISE</p>
                    <p className="text-sm text-gray-700">
                      {instructor.instructor?.expertise || "Not specified"}
                    </p>
                  </div>

                  {/* Experience */}
                  <div>
                    <p className="text-xs text-gray-500 font-semibold mb-1">EXPERIENCE</p>
                    <p className="text-sm text-gray-700">
                      {instructor.instructor?.experience || "Not specified"}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() =>
                    setExpandedInstructorId(
                      expandedInstructorId === instructor._id ? null : instructor._id
                    )
                  }
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm font-medium border border-blue-200"
                >
                  Actions
                  <svg
                    className={`w-4 h-4 transition transform ${
                      expandedInstructorId === instructor._id ? "rotate-180" : ""
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
                {expandedInstructorId === instructor._id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                    {!instructor.instructor?.isApproved && (
                      <button
                        onClick={() => handleApprove(instructor._id)}
                        disabled={actionLoading[`approve_${instructor._id}`]}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {actionLoading[`approve_${instructor._id}`] ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            Approving...
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
                            Approve Instructor
                          </>
                        )}
                      </button>
                    )}

                    {instructor.instructor?.isApproved && (
                      <button
                        onClick={() => handleDisapprove(instructor._id)}
                        disabled={actionLoading[`disapprove_${instructor._id}`]}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg font-medium hover:bg-orange-200 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {actionLoading[`disapprove_${instructor._id}`] ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            Disapproving...
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
                            Disapprove Instructor
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No instructors match your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCheckInstructor;

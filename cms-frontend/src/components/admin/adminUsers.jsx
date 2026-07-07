
import React, { useState } from "react";
import { adminData } from "../../hooks/useAdminData.js";
import { blockUnblockUser, deleteUser } from "../../services/adminService.js";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AdminUsers = () => {
  const { users, userLoading, } = adminData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [expandedUserId, setExpandedUserId] = useState(null);
  const queryClient =  useQueryClient()


  // Filter users based on search and role (exclude ADMIN users)
  const filteredUsers = users
    .filter((user) => user.role !== "ADMIN") // Exclude admin users
    .filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === "ALL" || user.role === filterRole;
      return matchesSearch && matchesRole;
    });



  // Handle block/unblock user
  const blockToggleMutation = useMutation({
     mutationFn: blockUnblockUser,

     onSuccess:(result)=>{

      toast.success(result.data.message || "User Status Updated")

      queryClient.invalidateQueries({ queryKey: ['admin_user']});

     },onError:(error)=>{
      toast.error( error.response?.data?.message || "Failed to update user status")
     }
  }) 
  
  const handleBlockToggle = (userId) => {
     blockToggleMutation.mutate(userId)
  };



  // Handle delete user
  const userDeleteMutation = useMutation({
    mutationFn:  deleteUser,
    onSuccess:(result)=>{

      toast.success(result.data.message|| "User Deleted")
      queryClient.invalidateQueries({queryKey: ['admin_user']})
      setExpandedUserId(null)

    },onError: (error)=> {
      toast.error(error.response?.data?.message || "Faild to delete User")
    }
  })

  const handleDelete =  (userId) => {
    if (!window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }
    userDeleteMutation.mutate(userId)
  };



  // Loading state
  if (userLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }



  // Empty state
  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No users found in the system</p>
      </div>
    );
  }




  return (
    <div className=" rounded-lg shadow-sm border border-gray-200 p-6">


      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">User Management</h2>
        <p className="text-gray-600">
          Manage instructors and students. Total users: <span className="font-semibold">{users.filter(u => u.role !== "ADMIN").length}</span>
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



        {/* Role Filter */}
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="ALL">All Roles</option>
          <option value="USER">Student</option>
          <option value="INSTRUCTOR">Instructor</option>
        </select>
      </div>



      {/* Results Info */}
      <div className="mb-4 text-sm text-gray-600">
        Showing <span className="font-semibold">{filteredUsers.length}</span> of{" "}
        <span className="font-semibold">{users.filter(u => u.role !== "ADMIN").length}</span> users
      </div>



      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "INSTRUCTOR"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.isBlocked
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() =>
                        setExpandedUserId(expandedUserId === user._id ? null : user._id)
                      }
                      className="inline-flex items-center gap-2 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm font-medium"
                    >
                      Actions
                      <svg
                        className={`w-4 h-4 transition transform ${
                          expandedUserId === user._id ? "rotate-180" : ""
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
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                  No users match your search or filter criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Expanded Actions */}
      {expandedUserId && (
        <div className="mt-6 border-t pt-6">
          {(() => {
            const user = users.find((u) => u._id === expandedUserId);
            if (!user) {
              return null;
            }
            return (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Actions for <span className="text-blue-600">{user.name}</span>
                </h3>
                <div className="flex flex-wrap gap-3">


                  {/* Block/Unblock Button */}
                  <button
                    onClick={() => handleBlockToggle(user._id, user.isBlocked)}
                    disabled={blockToggleMutation.isPending}
                    className="px-4 py-1.5 rounded bg-amber-600 text-white text-sm disabled:opacity-50"
                  >
                   {blockToggleMutation.isPending ? "Processing..." : user.isBlocked ? "Unblock User" : "Block "}
         
                  </button>




                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(user._id)}
                    disabled={userDeleteMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {userDeleteMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete User
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
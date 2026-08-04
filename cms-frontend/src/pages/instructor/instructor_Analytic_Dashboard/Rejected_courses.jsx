import React from 'react'
import { useInstructorCourse } from '../../../hooks/useInstructorCourses.js'
import { MdCancel, MdOutlineFeedback, MdOutlineSchool } from 'react-icons/md'
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'
import { deleteCourse } from '../../../services/instructorService.js';

const Rejected_courses = () => {
  const { courses, error, isLoading, refetch } = useInstructorCourse()
  const navigate = useNavigate()
  
  if (isLoading) { return <div className="rounded-3xl border border-red-500/20 bg-slate-950/70 p-8 text-center text-gray-400">Loading rejected courses...</div>}
  if (error) { return <div className="rounded-3xl border border-red-500/20 bg-slate-950/70 p-8 text-center text-red-400">Failed to load courses. Please try again.</div>}

  const getRejectedCoures = (courses || []).filter((item) => item.status === "REJECTED")
  if (!getRejectedCoures || getRejectedCoures.length === 0){
    return (
      <div className="rounded-3xl border border-red-500/20 bg-slate-950/70 p-8 text-center text-gray-400 shadow-2xl shadow-black/30">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
          <MdCancel size={26} />
        </div>
        <h1 className="text-lg font-semibold text-slate-100">No rejected courses</h1>
        <p className="mt-2 text-sm text-slate-400">All your submitted courses are still under review or have already been cleared.</p>
      </div>
    )
  }
  
  const deletAction = async (courseId)=>{
      const confirm = window.confirm("Are you sure You want to delete this ?")
      if(confirm){
        const result = await deleteCourse(courseId)
         if(result?.ok){
          refetch()
         }
      }
  }

  return (
      <main className="w-full space-y-4 font-sans">
      {/* Title Header */}
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shadow-sm shadow-red-500/50"></span>
        Rejected Courses with Message
      </h2>

      {/* Table Container */}
      <div className="w-full bg-[#111622] rounded-xl overflow-hidden border border-slate-800/80 shadow-2xl">
        {getRejectedCoures.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No rejected courses found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 bg-[#161c2e]/60">
                  <th className="py-4 px-6 w-1/6">Course Title</th>
                  <th className="py-4 px-6 w-1/12">Price</th>
                  <th className="py-4 px-6 w-1/8">Level</th>
                  <th className="py-4 px-6 w-1/12">Status</th>
                  <th className="py-4 px-6 w-2/5">Rejection Reason</th>
                  <th className="py-4 px-6 text-right w-1/5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-xs">
                {getRejectedCoures.map((course) => (
                  <tr 
                    key={course._id || course.id} 
                    className="hover:bg-slate-800/20 transition-colors duration-150"
                  >
                    {/* Course Title */}
                    <td className="py-5 px-6 font-bold text-white text-sm">
                      {course.title || 'Untitled Course'}
                    </td>

                    {/* Price */}
                    <td className="py-5 px-6 text-slate-200 font-semibold">
                      ₹{course.price ?? '0'}
                    </td>

                    {/* Level */}
                    <td className="py-5 px-6 text-slate-300 font-medium uppercase tracking-wider text-[11px]">
                      {course.level || 'ADVANCED'}
                    </td>

                    {/* Status Badge */}
                    <td className="py-5 px-6">
                      <span className="inline-block px-2.5 py-1 text-[10px] font-extrabold text-red-500 bg-red-950/40 border border-red-900/60 rounded uppercase tracking-wider">
                        REJECTED
                      </span>
                    </td>

                    {/* Rejection Reason Box */}
                    <td className="py-5 px-6">
                      <div className="bg-[#182032] border border-slate-800 px-4 py-2.5 rounded-lg text-xs italic text-slate-300 max-w-lg truncate">
                        "{course.rejectionReason || course.rejectionMessage || 'No specific rejection reason provided.'}"
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-5 px-6">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit & Resubmit Button */}
                        <button
                          onClick={() => navigate(`/instructor/resubmit-course/${course._id}`)}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg shadow-md transition-all active:scale-95"
                        >
                          <FiEdit className="w-3.5 h-3.5" />
                          <span>Edit & Resubmit</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => deletAction(course._id) }  
                          title="Delete Course"
                          className="p-2 bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-800/40 rounded-lg transition-all active:scale-95"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}

export default Rejected_courses

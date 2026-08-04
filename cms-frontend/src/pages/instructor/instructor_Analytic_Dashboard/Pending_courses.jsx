import React from 'react'
import { useInstructorCourse } from '../../../hooks/useInstructorCourses.js'
import { MdPendingActions } from 'react-icons/md'
import { FiEdit, FiTrash2 } from 'react-icons/fi'
 

const Pending_courses = () => {
  const { courses, error, isLoading, } = useInstructorCourse()
  

  if (isLoading) { return <div className="rounded-3xl border border-amber-500/20 bg-slate-950/70 p-8 text-center text-gray-400">Loading pending courses...</div> }
  if (error) { return <div className="rounded-3xl border border-red-500/20 bg-slate-950/70 p-8 text-center text-red-400">Failed to load courses. Please try again.</div> }

  const getPendingCourses = (courses || []).filter((item) => item.status === "PENDING")

  if (!getPendingCourses || getPendingCourses.length === 0) {
    return (
      <div className="rounded-3xl border border-amber-500/20 bg-slate-950/70 p-8 text-center text-gray-400 shadow-2xl shadow-black/30">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
          <MdPendingActions size={26} />
        </div>
        <h1 className="text-lg font-semibold text-slate-100">No pending courses</h1>
        <p className="mt-2 text-sm text-slate-400">All submitted courses have already been reviewed or you have not submitted any yet.</p>
      </div>
    )
  }
  

  return (
 <main className="w-full space-y-4">
      {/* Title Header */}
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
        Pending Courses
      </h2>

      {/* Table Container */}
      <div className="w-full bg-[#0b0f19] rounded-xl overflow-hidden shadow-xl border border-slate-800/60">
        {getPendingCourses.length === 0 ? (
          <div className="p-6 text-center text-gray-400">No pending courses found.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-bold uppercase text-slate-400 border-b border-slate-800/80 bg-slate-900/40">
                <th className="py-4 px-6">Course Title</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Level</th>
                <th className="py-4 px-6">Status</th>
                 
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm">
              {getPendingCourses.map((course) => (
                <tr key={course._id || course.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-100">
                    {course.title || 'Untitled Course'}
                  </td>
                  <td className="py-4 px-6 text-slate-300 font-medium">
                    ₹{course.price ?? '0.00'}
                  </td>
                  <td className="py-4 px-6 text-slate-300 capitalize">
                    {course.level || 'N/A'}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-block px-2.5 py-1 text-xs font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded uppercase">
                      PENDING
                    </span>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  )
}

export default Pending_courses

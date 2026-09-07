
import useMyEnrollments from '../../../hooks/useMyEnrollments'
import { useParams } from 'react-router'
import { FiCalendar, FiClock, FiFileText, FiUser, FiBarChart2 } from 'react-icons/fi';
import { format, formatDistanceToNow } from "date-fns";

const CourseOverview = () => {
  const { id } = useParams()
  const { enrollments, isLoading, error } = useMyEnrollments()

  const currentEnrollment = enrollments?.find((item) => item.course === id || item.course?._id === id)

  const courseData = typeof currentEnrollment?.course === "object" ? currentEnrollment?.course : null
  const instructorName = courseData?.instructor?.name || "N/A"
  
  const enrollAt = currentEnrollment?.enrolledAt || "N/A"
  const formattedDateEnrolled = format(new Date(enrollAt), "MMM dd, yy")

  const lastActive = currentEnrollment?.updatedAt || "N/A"
  const formateLastActiveDate = formatDistanceToNow(new Date(lastActive), {addSuffix:true})

  if (isLoading) return <p className="text-slate-400  flex justify-center items-center">Loading overview...</p>
  if (error) return <p className="text-red-400 flex justify-center items-center  ">Failed to load overview.</p>

  return (
    <section className="space-y-6 text-slate-200">

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Enrolled Date */}
        <div className="bg-[#111622] border border-slate-800/80 p-4 rounded-xl flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
            <FiCalendar size={18} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Enrolled On</p>
            <p className="text-sm font-bold text-white mt-0.5">{ formattedDateEnrolled }</p>
          </div>
        </div>

         
        <div className="bg-[#111622] border border-slate-800/80 p-4 rounded-xl flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
            <FiClock size={18} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Last Active</p>
            <p className="text-sm font-bold text-white mt-0.5">{formateLastActiveDate}</p>
          </div>
        </div>

         
        <div className="bg-[#111622] border border-slate-800/80 p-4 rounded-xl flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
            <FiBarChart2 size={18} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Skill Level</p>
            <p className="text-sm font-bold text-white mt-0.5">{courseData?.level}</p>
          </div>
        </div>

         
        <div className="bg-[#111622] border border-slate-800/80 p-4 rounded-xl flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
            <FiUser size={18} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Instructor</p>
            <p className="text-sm font-bold text-white mt-0.5 truncate max-w-32.5">
                {instructorName}
            </p>
          </div>
        </div>
      </div>

      
      <div className="bg-[#111622] border border-slate-800/80 p-6 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-base border-b border-slate-800 pb-2">
          <FiFileText size={18} />
          <h3>About This Course</h3>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
          {courseData?.description || 'No detailed description provided for this course.'}
        </p>
      </div>


    </section>
  )
}

export default CourseOverview

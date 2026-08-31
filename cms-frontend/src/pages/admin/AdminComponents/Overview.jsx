import Admin_Data_cards from '../Admin_Data_cards'
import { adminData } from '../../../hooks/useAdminData'
import RecentActivity from '../../../components/admin/AdminRecent_Activity.jsx'

const Overview = () => {

  const {
    totalStudent,
    totalRevenue,
    publishCourse,
    activities,
    activitiesLoading,
    activitiesError,
    publishcourseError,
    publishcourseLoading,
    studentLoading,
    studentError,
    revenueLoading,
    revenueError } = adminData()


  const studentCount = Number(totalStudent) || 0
  const TotalAmount = Number(totalRevenue) || 0
  const TotalPublishCourse = Number(publishCourse) || 0

  return (
    <main>

      <section className='mt-10 mx-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-5 text-black/70'>

        <Admin_Data_cards
          title={"Total Revenue"} value={TotalAmount} prefix="₹" isLoading={revenueLoading} isError={revenueError}
        />

        <Admin_Data_cards
          title={"Total Students"} value={studentCount} isLoading={studentLoading} isError={studentError}
        />

        <Admin_Data_cards
          title={"Active Course"} value={TotalPublishCourse} isLoading={publishcourseLoading} isError={publishcourseError}
        />

        <Admin_Data_cards
          title={"Avg Rating"} value={"60"} isLoading={publishcourseLoading} isError={publishcourseError}
        />

      </section>


      <div className='flex justify-center items-center gap-5 p-5'>

        <section className=' mx-10 mt-5 p-5 w-3/4  bg-gray-500 rounded-xl '>

          <h1 className=' font-bold underline '>Revenue Growth of 1 week</h1>

        </section>

        <section className='mt-5 w-4/10 bg-stone-400  rounded-2xl '>
          <RecentActivity
            activities={activities}
            isLoading={activitiesLoading}
            isError={activitiesError}
          />

        </section>

      </div>




    </main>







  )
}

export default Overview

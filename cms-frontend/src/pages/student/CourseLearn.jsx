import { useParams } from 'react-router-dom'
import VideoPlayer from '../../components/course/VideoPlayer';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useMyEnrollments from '../../hooks/useMyEnrollments.js';
import { markCourseComplete } from '../../services/enrollmentService.js';
import { toast } from 'sonner';
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import CourseOverview from './CourseLearningComponent/CourseOverview.jsx';
import { useState } from 'react';
import CourseRating from './CourseLearningComponent/CourseRating.jsx';


const CourseLearn = () => {

  const [activeTabe, setactiveTabe] = useState("overview")

  const Navigate = useNavigate()
  const { id } = useParams();
  const queryClient = useQueryClient()

  // Get Enrollment status from Hook/useMyEnrollments
  const { enrollments, isLoading, error, } = useMyEnrollments()

  // Find the specific enrollment matching this course ID 
  const currentEnrollment = enrollments.find(item => item.course === id || item.course?._id === id);

  // Setup modificaton by mutation 
  const mutation = useMutation({
    mutationFn: () => markCourseComplete(id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["my-enrollments"] });

      const previousEnrollments = queryClient.getQueryData(["my-enrollments"]);

      queryClient.setQueryData(["my-enrollments"], (oldData) => {
        if (!oldData?.data?.enrollments) return oldData;

        return {
          ...oldData,
          data: {
            ...oldData.data,
            enrollments: oldData.data.enrollments.map((enrollment) => {
              const courseId = enrollment.course?._id || enrollment.course;

              if (courseId !== id) return enrollment;

              return {
                ...enrollment,
                progress: "COMPLETED",
              };
            }),
          },
        };
      });

      return { previousEnrollments };
    },
    onSuccess: () => {
      toast.success("Course marked as completed")
      queryClient.invalidateQueries({ queryKey: ["my-enrollments"] });
    },
    onError: (err, _variables, context) => {
      if (context?.previousEnrollments) {
        queryClient.setQueryData(["my-enrollments"], context.previousEnrollments);
      }
      toast.error(err?.message || "Failed to update course completion status");
    }
  })



  // Checking Status 
  const isCompleted = currentEnrollment?.progress === 'COMPLETED';
  const isSaving = mutation.isPending;


  const courseData = typeof currentEnrollment?.course === "object" ? currentEnrollment?.course : null


  const handleComplete = async () => {
    if (isCompleted || isSaving) return;

    mutation.mutate();
  };


  if (isLoading) return <div className='p-5'>Loading enrollment state...</div>;
  if (error) return <div className='p-5'>Error checking enrollment details.</div>;

  return (
    <main >
      <header className='flex justify-between items-center bg-gray-800 px-5 py-2'>
        <div className='flex gap-8'>
          <button onClick={() => Navigate("/dashboard")} className=' cursor-pointer hover:text-3xl text-xl transition-all duration-300'><FaLongArrowAltLeft /></button>

             <div>
              
             </div>
            <h1 className=' font-bold text-2xl'>{courseData?.title || "Course Name"}</h1>
            <h2 className='font-extralight text-xs bg-gray-700 rounded-sm py-2 px-2 border border-blue-400'>{currentEnrollment?.progress}</h2>
          

        </div>
        <button
          onClick={handleComplete}
          disabled={isCompleted || isSaving}
          className={` px-2 py-2 rounded  transition-colors ${isCompleted
            ? 'bg-emerald-600 cursor-none text-gray-300'
            : isSaving
              ? 'bg-emerald-400 cursor-wait text-white'
              : 'bg-green-500 hover:bg-green-600 cursor-pointer text-white'
            }`}
        >
          {isCompleted ? 'Done' : isSaving ? 'Saving...' : 'Mark as Done'}
        </button>
      </header>

      <section className='flex justify-center py-5 w-full  '>
        <VideoPlayer courseId={id} />
      </section>

      <section>
        <div className='flex gap-8 mx-28 mt-10 border-b-gray-600  border-b pb-2.5'>
          <button
            type='button'
            onClick={() => setactiveTabe("overview")}
            className={`cursor-pointer font-semibold transition-all ${activeTabe === 'overview'
                ? 'text-indigo-400 border-b-2 border-indigo-400 pb-2 -mb-2.75'
                : 'text-gray-400 hover:text-white'
              }`}
          >
            Overview
          </button>

          <button
            type='button'
            onClick={() => setactiveTabe("rating")}
            className={`cursor-pointer font-semibold transition-all ${activeTabe === 'rating'
                ? 'text-indigo-400 border-b-2 border-indigo-400 pb-2 -mb-2.75'
                : 'text-gray-400 hover:text-white'
              }`}
          >
            Rating
          </button>

        </div>

        <div className='px-20 mt-5 pb-10'>
          {activeTabe === "overview" && <CourseOverview/>}
          {activeTabe === "rating" && <CourseRating />}
        </div>


      </section>


    </main>
  )
}

export default CourseLearn

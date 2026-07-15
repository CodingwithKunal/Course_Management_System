import { useParams } from 'react-router-dom'

import VideoPlayer from '../../components/course/VideoPlayer';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useMyEnrollments from '../../hooks/useMyEnrollments.js';
import { markCourseComplete } from '../../services/enrollmentService.js';
import { toast } from 'sonner';


const CourseLearn = () => {
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

  if (isLoading) return <div className='p-5'>Loading enrollment state...</div>;
  if (error) return <div className='p-5'>Error checking enrollment details.</div>;

  // Checking Status 
  const isCompleted = currentEnrollment?.progress === 'COMPLETED';
  const isSaving = mutation.isPending;



  const handleComplete = async () => {
    if (isCompleted || isSaving) return;

    mutation.mutate();
  };

  return (
    <main className='p-5'>
      <h1 className='text-2xl font-bold mb-4'>Course Learning Page</h1>
      <VideoPlayer courseId={id} />
      <button
        onClick={handleComplete}
        disabled={isCompleted || isSaving}
        className={`mt-4 px-4 py-2 rounded text-white transition-colors ${isCompleted
            ? 'bg-emerald-600 cursor-default'
            : isSaving
              ? 'bg-emerald-400 cursor-wait'
              : 'bg-green-500 hover:bg-green-600'
          }`}
      >
        {isCompleted ? 'Done' : isSaving ? 'Saving...' : 'Mark as Done'}
      </button>
    </main>
  )
}

export default CourseLearn

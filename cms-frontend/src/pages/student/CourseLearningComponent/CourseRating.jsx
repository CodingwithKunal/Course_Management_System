
import { RiStarFill, RiStarSLine } from "react-icons/ri";
import { courseRating } from "../../../services/courseService";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import { toast } from "sonner";

const CourseRating = () => {
  const stars = [1, 2, 3, 4, 5]

  const [comment, setcomment] = useState("")
  const [rating, setrating] = useState(0)
  const [hover, setHover] = useState(0)

  const queryClient = useQueryClient()
  const { id: courseId } = useParams()

  const mutation = useMutation({
    mutationFn: (courseData) => courseRating(courseId, courseData),
    onSuccess: () => {
      setcomment(''),
        setrating(0),

        queryClient.invalidateQueries({ queryKey: ['my-enrollments'] })
      queryClient.invalidateQueries({ queryKey: ['course-review'] })
    }
  })


  const handleSubmit = (e) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error("Please select a star rating before submitting")
      return
    }
    mutation.mutate({ rating, comment })
  }

  return (
    <section className=' flex justify-center items-center '>
      <div className=' p-10 bg-gray-800 w-1/2 rounded-2xl'>
        <form onSubmit={handleSubmit} >
          <div className=' text-center font-extralight text-gray-300 '>
            <h2 className='mb-5'>Share Your Experience</h2>
            <p>Your feedback helps us improve the course for everyone</p>
            <h1 className='my-5 text-xl font-bold'>Your Rating</h1>
            <div className='flex justify-center  gap-5'>

              {stars.map((star) => {
                const StarIcon = star <= (hover || rating) ? RiStarFill : RiStarSLine

                return <StarIcon
                  key={star}
                  size={55}
                  onClick={() => setrating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className={`cursor-pointer transition-all active:scale-85 ${star <= (hover || rating) ? "text-amber-400" : "text-indigo-500 hover:text-amber-200"
                    }`}
                />
              })}

            </div>
          </div>
          <h1 className=' uppercase text-md mt-15 mb-2 '>Review Comment</h1>
          <div className='flex justify-center items-center'>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => (setcomment(e.target.value))}
              placeholder='Tell us what you learned...'
              maxLength={500}
              required
              className="w-full p-4 text-sm text-slate-100 bg-[#111622] border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-500 resize-none"
            />
          </div>
          <button disabled={mutation.isPending} className='bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-medium w-full py-2.5 rounded-3xl mt-5 cursor-pointer transition-colors active:scale-[0.99]'>
            {mutation.isPending ? "submitting..." : "Submit Review"}
          </button>

        </form>
      </div>

    </section>
  )
}

export default CourseRating

import { useQuery } from "@tanstack/react-query"
import { getInstructorCourses } from "../services/instructorService.js"

export const useInstructorCourse = () => {
    const { data, error, isLoading, refetch} = useQuery({
    queryKey:["getInstructor_course"],
    queryFn: () => getInstructorCourses(), 
   
})
return {
    courses: data?.data?.course || [],
    error,
    isLoading,
    refetch,
   

}
}
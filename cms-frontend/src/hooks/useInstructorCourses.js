import { useQuery } from "@tanstack/react-query"
import { getInstructorCourses, getEnrollmentsForInstructor, getRevenueForInstructor } from "../services/instructorService.js"

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


export const getInstructorEnrollments = () => {
    const { data, error, isLoading, refetch} = useQuery({
        queryKey:["getInstructor_enrollments"],
        queryFn: () => getEnrollmentsForInstructor(),
    })
    return {
        enrollments: data?.data?.totalEnrollments || 0,
        error,
        isLoading,
        refetch,
    }
}



export const getInstructorRevenue = () => {
    const { data, error, isLoading, refetch} = useQuery({
        queryKey:["getInstructor_revenue"],
        queryFn: () => getRevenueForInstructor(),
    })
    return {
        revenue: data?.data?.totalRevenue || 0,
        error,
        isLoading,
        refetch,
    }
}
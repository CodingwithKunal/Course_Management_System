import { useQuery } from "@tanstack/react-query"
import { getCourseDetails } from "../services/courseService"



 export  const  useCourseDetail = (courseId) => {
    const { data, isLoading, error, refetch} = useQuery({
        queryKey: ["course-detail", courseId],
        queryFn: () => getCourseDetails(courseId),
        enabled: !!courseId, // Only run query if courseId is available
    })

    return {
        course: data?.data?.course || null,
        isLoading,
        error,
        refetch
    };
}
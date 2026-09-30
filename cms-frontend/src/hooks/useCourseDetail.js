import { useQuery } from "@tanstack/react-query"
import { getCourseDetails, checkCourseEnrollment } from "../services/courseService"
import { useSelector } from "react-redux"



 export  const  useCourseDetail = (courseId) => {
    const { isAuthenticated } = useSelector(state => state.auth)
    
    const { data, isLoading, error, refetch} = useQuery({
        queryKey: ["course-detail", courseId],
        queryFn: () => getCourseDetails(courseId),
        enabled: !!courseId,
    })

    const { data: enrollmentData, isLoading: enrollmentLoading } = useQuery({
        queryKey: ["enrollment-status", courseId],
        queryFn: () => checkCourseEnrollment(courseId),
        enabled: !!courseId && isAuthenticated,
    })

    return {
        course: data?.data?.course || null,
        isLoading,
        error,
        refetch,
        isEnrolled: enrollmentData?.isEnrolled || false,
        enrollmentLoading
    };
}
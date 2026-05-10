import { useQuery } from "@tanstack/react-query"
import { getCourseDetails, checkCourseEnrollment } from "../services/courseService"
import { useSelector } from "react-redux"



 export  const  useCourseDetail = (courseId) => {
    const { isAuthenticated } = useSelector(state => state.auth)
    
    const { data, isLoading, error, refetch} = useQuery({
        queryKey: ["course-detail", courseId],
        queryFn: () => getCourseDetails(courseId),
        enabled: !!courseId, // Only run query if courseId is available
    })

    // Check enrollment status only if user is authenticated
    const { data: enrollmentData, isLoading: enrollmentLoading } = useQuery({
        queryKey: ["enrollment-status", courseId],
        queryFn: () => checkCourseEnrollment(courseId),
        enabled: !!courseId && isAuthenticated, // Only run if user is authenticated
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
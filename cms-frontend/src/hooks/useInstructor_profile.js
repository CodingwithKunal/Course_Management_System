import { useQuery } from "@tanstack/react-query"
import { getInstructorProfile, getInstructorApprovedStatus } from "../services/instructorService.js"

export const useInstructorProfile = () => {
    const { data, isError, isLoading, refetch } = useQuery({
        queryKey: ["instructor-profile"],
        queryFn: () => getInstructorProfile(),
        enabled: true,
    })

    return {
        instructor: data?.data?.instructor || null,
        isError,
        isLoading,
        refetch,
    }
}

export const useInstructorStatus = () => {
    const { data, isError, isLoading } = useQuery({
        queryKey: ["instructor-status"],
        queryFn: () => getInstructorApprovedStatus(),
        enabled: true,
    })

    const responseData = data?.data || {}

    return {
        status: responseData.isApproved ?? false,
        isBlocked: responseData.isBlocked ?? false,
        isError,
        isLoading,
    }
}
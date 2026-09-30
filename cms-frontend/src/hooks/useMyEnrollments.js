
import { useQuery } from "@tanstack/react-query";
import { getMyEnrollments } from "../services/enrollmentService";

function useMyEnrollments() {
    const { data, error, isLoading, refetch} = useQuery({
        queryKey: ["my-enrollments"],
        queryFn: getMyEnrollments,
        enabled: true,
    })
   return {
       enrollments : data?.data?.enrollments || [],
       isLoading,
       error,
       refetch 
   }
}

export default useMyEnrollments

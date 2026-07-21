import { useQuery } from "@tanstack/react-query";
import { getContinueLearningCourse } from "../services/courseService.js";


export function useContinueLearning() {
const { data, isLoading, isError, refetch } = useQuery({
    queryKey:["countinue-learning"],
    queryFn:  getContinueLearningCourse
})

return {
    enrollment: data?.data?.data || null,
    loading: isLoading,
    error: isError,
    refetch: refetch
}

}
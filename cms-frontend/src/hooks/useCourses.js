import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllCourses } from "../services/courseService.js";



export const useCourses = () => {
    const [filters, setfilters] = useState({
        category: "",
        level: "",
        search:"",
        page: 1, 
    });
    

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["courses", filters], 
        queryFn: () => getAllCourses(filters)
    });
    return {
        courses: data?.data?.courses || [],
        totalPages: data?.data?.totalPages || 1,
        isLoading,
        isError,
        setfilters,
        filters,
        refetch
    };
};
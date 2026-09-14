import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllCourses } from "../services/courseService.js";
import { useDebounce } from "./useCourse_Debounce_search.js";


export const useCourses = () => {
    const [filters, setfilters] = useState({
        category:[],
        level:[],
        search: "",
        page: 1,
    });
  
    const debouncedSearch = useDebounce(filters.search, 500)

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["courses", { ...filters, search: debouncedSearch }],
        queryFn: () => getAllCourses({ ...filters, search: debouncedSearch }),

        // Naya data aane tak purana data screen par hold karke rakhega
        placeholderData: keepPreviousData,
    });
    return {
        courses: data?.data?.courses || [],
        totalPages: data?.data?.totalPages || 1,
        currentPage: data?.data?.currentPage || 1,
        totalCourses: data?.data?.totalCourses || 0,
        isLoading,
        isError,
        setfilters,
        filters,
        refetch
    };
};
import {  useQuery } from "@tanstack/react-query";
import { getAllUsers, getPending_course } from "../services/adminService";


export const adminData = () => {

    const usersQuery = useQuery({
        queryKey: ["admin_user"],
        queryFn: getAllUsers,
    });

    const coursesQuery = useQuery({
        queryKey: ["admin_courses"],
        queryFn: getPending_course,
    });

    return {
        users: usersQuery.data?.data?.users || [],

        pending_courses: coursesQuery.data?.data?.pending_courses || [],

        userLoading: usersQuery.isLoading,
        courseLoading: coursesQuery.isLoading,

        refetchUsers: usersQuery.refetch,
        refetchCourse: coursesQuery.refetch,

    };

};
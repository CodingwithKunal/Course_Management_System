import {  useQuery } from "@tanstack/react-query";
import { getAdminRecentActivity, getAllUsers, getPending_course, getPublishCourse, getTotalEnrolledStudent, getTotalRevenue, publishCourse } from "../services/adminService";


export const useAdminData = () => {

    const usersQuery = useQuery({
        queryKey: ["admin_user"],
        queryFn: getAllUsers,
    });

    const StudentQuery = useQuery({
        queryKey:["admin_students"],
        queryFn:getTotalEnrolledStudent,
    })

    const coursesQuery = useQuery({
        queryKey: ["admin_courses"],
        queryFn: getPending_course,
    });


    const getRevenueQuery = useQuery({
        queryKey:["admin_Revenue"],
        queryFn: getTotalRevenue,
    })

    const getPusblishCourseQuery = useQuery({
        queryKey:["admin publishcourse"],
        queryFn:getPublishCourse,
    })

    const getRecentAcitivitiesQuery = useQuery({
        queryKey:["admin_activity"],
        queryFn:getAdminRecentActivity,
    })

    return {
        users: usersQuery.data?.data?.users || [],
        totalStudent: StudentQuery.data?.data?.totalStudent ?? StudentQuery.data?.data?.totalEnrolledStudent ?? 0,
        pending_courses: coursesQuery.data?.data?.pending_courses || [],
        totalRevenue: getRevenueQuery.data?.data?.totalRevenue || 0,
        publishCourse: getPusblishCourseQuery.data?.data?.publishCourse || 0,
        activities : getRecentAcitivitiesQuery.data?.data?.activities || [],

        activitiesLoading: getRecentAcitivitiesQuery.isLoading,
        activitiesError: getRecentAcitivitiesQuery.isError,
        activitiesRefetch: getRecentAcitivitiesQuery.refetch,

        publishcourseLoading : getPusblishCourseQuery.isLoading,
        publishcourseError: getPusblishCourseQuery.isError,
        publishcourseRefetch: getPusblishCourseQuery.refetch,

        revenueLoading : getRevenueQuery.isLoading,
        revenueError : getRevenueQuery.isError,
        revenueRefetch: getRevenueQuery.refetch,
        
        userLoading: usersQuery.isLoading,
        userError: usersQuery.isError,

        studentLoading : StudentQuery.isLoading,
        studentError: StudentQuery.isError,

        courseError: coursesQuery.isError,
        courseLoading: coursesQuery.isLoading,

        refetchUsers: usersQuery.refetch,
        refetchStudent: StudentQuery.refetch,
        refetchCourse: coursesQuery.refetch,

    };

};

export const adminData = useAdminData;
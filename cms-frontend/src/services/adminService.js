import { toast } from 'sonner'
import API from './api';

export const getAllUsers = async () => {
    try {
        const res = await API.get("/admin/users")
        return { ok: true, data: res.data }

    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch users")
        return { ok: false }
    }
}

// Get pending instructors
export const getPendingInstructors = async () => {
    try {
        const res = await API.get("/admin/pending-instructors");
        return {
            ok: true,
            data: res.data
        };
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch pending instructors");
        return { ok: false }
    }
}

// Approve instructor
export const approveInstructor = async (instructorId) => {
    try {
        const res = await API.patch(`/admin/approve-instructor/${instructorId}`);
        return {
            ok: true,
            message: res.data.message,
            data: res.data.instructor
        };
    } catch (error) {
        return {
            ok: false,
            message: error.response?.data?.message || "Failed to approve instructor"
        };
    }
}

// Disapprove instructor
export const disapproveInstructor = async (instructorId) => {
    try {
        const res = await API.patch(`/admin/disapprove-instructor/${instructorId}`);
        return {
            ok: true,
            message: res.data.message,
            data: res.data.instructor
        };
    } catch (error) {
        return {
            ok: false,
            message: error.response?.data?.message || "Failed to disapprove instructor"
        };
    }
}

export const getPending_course = async () => {

    try {
        const res = await API.get("/admin/pending-courses")
        return {
            ok: true,
            data: res.data
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch Pending Courses");
        return {ok:false}
    }

}


export const rejectCourse = async(courseId,reason) => {
    try {
        const res = await API.patch(`/admin/reject-course/${courseId}`,{reason})
        return {
            ok:true,
            data:res.data
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to reject course")
        return { ok: false }
    }
}

// Publish course
export const publishCourse = async (courseId) => {
    try {
        const res = await API.patch(`/admin/publish-course/${courseId}`);
        return {
            ok: true,
            message: res.data.message,
            data: res.data.course
        };
    } catch (error) {
        return {
            ok: false,
            message: error.response?.data?.message || "Failed to publish course"
        };
    }
};

// Unpublish course
export const unpublishCourse = async (courseId) => {
    try {
        const res = await API.patch(`/admin/unpublish-course/${courseId}`);
        return {
            ok: true,
            message: res.data.message,
            data: res.data.course
        };
    } catch (error) {
        return {
            ok: false,
            message: error.response?.data?.message || "Failed to unpublish course"
        };
    }
};

// Block/Unblock user
export const blockUnblockUser = async (userId) => {
    try {
        const res = await API.patch(`/admin/block-unblock-user/${userId}`);
        return {
            ok: true,
            message: res.data.message,
            data: res.data.user
        };
    } catch (error) {
        return {
            ok: false,
            message: error.response?.data?.message || "Failed to update user status"
        };
    }
};

// Delete user
export const deleteUser = async (userId) => {
    try {
        const res = await API.delete(`/admin/delete-user/${userId}`);
        return {
            ok: true,
            message: res.data.message,
            data: res.data.user
        };
    } catch (error) {
        return {
            ok: false,
            message: error.response?.data?.message || "Failed to delete user"
        };
    }
};

// Promote user to admin
export const promoteToAdmin = async (userId) => {
    try {
        const res = await API.patch(`/admin/promote-admin/${userId}`);
        return {
            ok: true,
            message: res.data.message,
            data: res.data.user
        };
    } catch (error) {
        return {
            ok: false,
            message: error.response?.data?.message || "Failed to promote user to admin"
        };
    }
};
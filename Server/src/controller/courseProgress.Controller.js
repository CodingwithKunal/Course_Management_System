import mongoose from "mongoose";
import EnrollmentModel from "../models/enrollment.js";
import CourseModel from "../models/course.js";

const checkUserLearningAccess = async (userId, userRole, courseId) => {
    if (userRole === "ADMIN") return true;

    const course = await CourseModel.findById(courseId);

    if (!course) return false;

    if (userRole === "INSTRUCTOR" && course.instructor && course.instructor.toString() === userId.toString()) {
        return true;
    }

    const enrollment = await EnrollmentModel.findOne({ user: userId, course: courseId, paymentStatus: "SUCCESS" });
    return !!enrollment;
};



export const CompleteCourse = async (req, res) => {
    try {
        const UserId = req.user._id;
        const { courseId } = req.params;
        const enrollment = await EnrollmentModel.findOne({ user: UserId, course: courseId, paymentStatus: "SUCCESS" });

        if (!enrollment) {
            return res.status(404).json({ message: "You are not enrolled in this course" });
        }
        if (enrollment.progress === "COMPLETED") {
            return res.status(400).json({ message: "Course is already marked as completed" });
        }

        enrollment.progress = "COMPLETED";
        await enrollment.save();
        res.status(200).json({ message: "Course marked as completed", progress: enrollment.progress });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}




export const getCourseProgress = async (req, res) => {
    try {
        const UserId = req.user._id;
        const userRole = req.user.role;
        const { courseId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: "Invalid course ID" });
        }

        const hasAccess = await checkUserLearningAccess( UserId , userRole, courseId);
        if (!hasAccess) {
            return res.status(403).json({ message: "You don't have access to this course" });
        }

        const enrollment = await EnrollmentModel.findOne({
            user: UserId,
            course: courseId,
            paymentStatus: "SUCCESS"
        });

        return res.status(200).json({
            success: true,
            progress: enrollment ? enrollment.progress : "NOT_STARTED",
            lastWatchedTime: enrollment ? enrollment.lastWatchedTime : 0
        })


    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}




export const updateWatchProgress = async (req, res) => {
    try {

        const userId = req.user._id;
        const userRole = req.user.role;
        const { courseId } = req.params;
        const { currentTime } = req.body;

        const hasAccess = await checkUserLearningAccess(userId, userRole, courseId);
        if (!hasAccess) {
            return res.status(403).json({ message: "You are not enrolled in this course" });
        }

        let enrollment = await EnrollmentModel.findOne({
            user: userId,
            course: courseId,
            paymentStatus: "SUCCESS"
        });

        if (!enrollment) {
            enrollment = new EnrollmentModel({
                user: userId,
                course: courseId,
                paymentStatus: "SUCCESS",
                progress: "IN_PROGRESS",
                lastWatchedTime: currentTime || 0
            });
        } else {

            enrollment.lastWatchedTime = currentTime
            enrollment.lastWatchedAt = new Date()

            if (enrollment.progress === "NOT_STARTED") {
                enrollment.progress = "IN_PROGRESS";
            }
        }



        await enrollment.save();

        return res.status(200).json({
            success: true,
            message: "Watch progress updated",
            enrollment,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


export const continuLearning = async (req, res) => {
    try {
        const userId = req.user._id;
        const course = await EnrollmentModel.findOne({ user: userId, progress: "IN_PROGRESS" })
            .sort({ lastWatchedAt: -1 })
            .populate("course", "title description thumbnail");
        if (!course) {
            return res.status(200).json({ message: "No course found for continue learning" });
        }
        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
            success: false
        });
    }
}
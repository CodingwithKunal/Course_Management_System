import EnrollmentModel from "../models/enrollment.js";




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
        const { courseId } = req.params;
        const enrollment = await EnrollmentModel.findOne({ user: UserId, course: courseId, paymentStatus: "SUCCESS" });

        if (!enrollment) {
            return res.status(404).json({ message: "You are not enrolled in this course" });
        }

        res.status(200).json({ progress: enrollment.progress });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}




export const updateWatchProgress = async (req, res) => {
    try {

        const userId = req.user._id;
        const { courseId } = req.params;
        const { currentTime } = req.body;

        const enrollment = await EnrollmentModel.findOne({
            user: userId,
            course: courseId,
            paymentStatus: "SUCCESS"
        });

        if (!enrollment) {
            return res.status(403).json({
                message: "You are not enrolled in this course"
            });
        }

        enrollment.lastWatchedTime = currentTime;

        if (enrollment.progress === "NOT_STARTED") {
            enrollment.progress = "IN_PROGRESS";
        }

        await enrollment.save();

        res.status(200).json({
            message: "Watch progress updated",
            lastWatchedTime: enrollment.lastWatchedTime
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};
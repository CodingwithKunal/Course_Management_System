import mongoose from "mongoose";
import CourseModel from "../models/course.js";
import EnrollmentModel from "../models/enrollment.js";
import ReviewModel from "../models/review.js";


export const creatCourse = async (req, res) => {
    try {
        const { title, description, price, thumbnail, category, level } = req.body;

        if (!title || !category || !price) {
            return res.status(400).json({ message: "Title, category, and price are required" });
        }
        const course = await CourseModel.create({
            title,
            description,
            price,
            thumbnail,
            category,
            level,
            instructor: req.user._id, 
        });

        res.status(200).json({ success: true, course });


    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}


export const getAllCourses = async (req, res) => {
    try {
        const course = await CourseModel.find({
            instructor: req.user._id, 
        }).populate("instructor", "name"); 
        res.status(200).json({
            success: true,
            count: course.length,
            course
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}




export const UpdateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description, price, thumbnail, category, level } = req.body;
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to update this course" });
        }
        course.title = title || course.title;
        course.description = description || course.description;
        course.price = price !== undefined && price !== "" ? price : course.price;
        course.thumbnail = thumbnail || course.thumbnail;
        course.category = category || course.category;
        course.level = level || course.level;
        await course.save();
        res.status(200).json({ success: true, course });

    } catch (error) {

        res.status(500).json({ success: false, message: "Server Error", error: error.message });

    }

}


export const resubmitCourse = async (req, res) => {
    try {
        const { courseId } = req.params; 
        const { title, description, price, thumbnail, category, level } = req.body;
        const course = await CourseModel.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to resubmit this course" });
        }

        course.title = title || course.title;
        course.description = description || course.description;
        course.price = price !== undefined && price !== "" ? price : course.price;
        course.thumbnail = thumbnail || course.thumbnail;
        course.category = category || course.category;
        course.level = level || course.level;
        course.status = "PENDING";
        course.rejectionReason = null;

        await course.save();

        res.status(200).json({ success: true, message: "Course resubmitted successfully", course });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}




export const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this course" });
        }

        if (course.studentsEnrolled.length > 0) {

            return res.status(404).json({ message: "Course cannot be deleted because students are enrolled in this course" });

        }

        const deletedCourse = await CourseModel.deleteOne({ _id: courseId });


        res.status(200).json({ success: true, deletedCourse });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}



export const publishCourse = async (req, res) => {
    try {
        const { search, category, level, page = 1, limit = 9 } = req.query 

        const query = { status: "PUBLISHED" }; 

        if (search) {
            const sanitizedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); 
            query.$or = [
                { title: { $regex: sanitizedSearch, $options: "i" } },
                { description: { $regex: sanitizedSearch, $options: "i" } },
            ];
        }

        
        if (category) {
            const categoryArray = Array.isArray(category) ? category : category.split(',');
            if (category.length > 0) {
                query.category = { $in: categoryArray };
            }
        }

        
        if (level && level !== "ALL") {
            const levelArray = Array.isArray(level)
                ? level.map(l => l.toUpperCase()) : level.split(",").map(l => l.toUpperCase())

            if (levelArray.length > 0) {
                query.level = { $in: levelArray }
            }
        }


        
        const pageNumber = Math.max(1, parseInt(page, 10) || 1);
        const limitNumber = Math.max(1, parseInt(limit, 10) || 9);
        const skip = (pageNumber - 1) * limitNumber;

        
        const totalCourses = await CourseModel.countDocuments(query);


        const courses = await CourseModel.find(query)
            .populate("instructor", "name ") 
            .sort({ createdAt: -1 }) 
            .skip(skip) 
            .limit(limitNumber) 
            .lean(); 


        res.status(200).json({
            success: true,
            count: courses.length,
            totalCourses,
            totalPages: Math.ceil(totalCourses / limitNumber) || 1,
            currentPage: pageNumber,
            courses

        });


    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}





export const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await CourseModel.findById(courseId).populate("instructor", "name email bio");

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (course.status !== "PUBLISHED") {
            return res.status(403).json({ message: "Not Available yet" });
        }

        res.status(200).json({ success: true, course });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}





export const enrollInCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const userRole = req.user.role;


        const course = await CourseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }


        if (userRole === "ADMIN") {
            await EnrollmentModel.findOneAndUpdate(
                { user: userId, course: courseId },
                { user: userId, course: courseId, paymentStatus: "SUCCESS" },
                { upsert: true, new: true }
            );
            await CourseModel.findByIdAndUpdate(courseId, { $addToSet: { studentsEnrolled: userId } })
            return res.status(200).json({ success: true, message: "Admin auto-granted course access." });
        }


        const isOwner = course.instructor.toString() === userId.toString();

        if (userRole === "INSTRUCTOR" && isOwner) {
            await EnrollmentModel.findOneAndUpdate(
                { user: userId, course: courseId },
                { user: userId, course: courseId, paymentStatus: "SUCCESS" },
                { upsert: true, new: true }
            );
            await CourseModel.findByIdAndUpdate(courseId, { $addToSet: { studentsEnrolled: userId } });
            return res.status(200).json({ success: true, message: "Instructor auto-granted access to own course." });
        }



        if (course.status !== "PUBLISHED") {
            return res.status(403).json({ message: "Not Available yet" });
        }

        const alreadyEnrolled = await EnrollmentModel.findOne({ user: req.user._id, course: courseId });
        if (alreadyEnrolled) {
            return res.status(400).json({ message: "You are already enrolled in this course" });
        }


        if (course.price === 0) {
            const enrollment = await EnrollmentModel.create({
                user: userId,
                course: courseId,
                paymentStatus: "SUCCESS", 
            })

            const updatedCourse = await CourseModel.findByIdAndUpdate(
                courseId,
                { $addToSet: { studentsEnrolled: userId } },
                { new: true }
            );

            return res.status(200).json({ success: true, enrollment });
        }

        return res.status(400).json({
            success: false,
            requiresPayment: true,
            message: "Payment required for this course."
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}




export const checkEnrollmentStatus = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user._id;
        const userRole = req.user.role;

        const course = await CourseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ ok: false, message: "Course not found" });
        }

        const hasPrivilegedAccess = userRole === "ADMIN" ||
            (userRole === "INSTRUCTOR" && course.instructor.toString() === userId.toString());

        if (hasPrivilegedAccess) {
            await EnrollmentModel.findOneAndUpdate(
                { user: userId, course: courseId },
                {
                    $set: { paymentStatus: "SUCCESS" },
                    $setOnInsert: { user: userId, course: courseId }
                },
                { upsert: true, new: true }
            );
            await CourseModel.findByIdAndUpdate(courseId, { $addToSet: { studentsEnrolled: userId } });
            return res.status(200).json({ok: true, isEnrolled: true, message:"Course access granted" }) 
        }

        const enrollment = await EnrollmentModel.findOne({ user: userId, course: courseId, paymentStatus: "SUCCESS" });

        if (enrollment) {
            return res.status(200).json({ ok: true, isEnrolled: true, message: "You are already enrolled in this course" });
        }

        res.status(200).json({ ok: true, isEnrolled: false, message: "You are not enrolled in this course" });

    } catch (error) {
        res.status(500).json({ ok: false, message: "Server Error", error: error.message });
    }
}




export const getEnrolledCourses = async (req, res) => {
    try {
        const enrollments = await EnrollmentModel.find({ user: req.user._id, paymentStatus: "SUCCESS" })
            .populate("user", "name") 
            .populate({
                path: "course",
                select: "title description level category thumbnail instructor", 
                populate: {
                    path: "instructor",
                    select: "name email"
                }
            }); 

         

        res.status(200).json({ success: true, count: enrollments ? enrollments.length : 0, enrollments: enrollments || [] });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}






export const submitCourseForReview = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to submit this course for review" });
        }
        if (course.status === "PENDING") {
            return res.status(400).json({ message: "Course is already submitted for review" });
        }

        course.status = "PENDING";
        await course.save();
        res.status(200).json({ success: true, course });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}





export const reviewController = async (req, res) => {
    try {
        const userId = req.user._id; 
        const { courseId } = req.params;
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating is required and must be between 1 and 5",
            })
        }

        const course = await CourseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        if (course.status !== "PUBLISHED") {
            return res.status(403).json({ success: false, message: "Course is not published yet" });
        }


        const enrollment = await EnrollmentModel.findOne({ user: userId, course: courseId, paymentStatus: "SUCCESS" });
        if (!enrollment) {
            return res.status(403).json({ message: "You are not enrolled in this course" });
        }


        const alreadyReviewed = await ReviewModel.findOne({ user: userId, course: courseId });
        if (alreadyReviewed) {
            return res.status(400).json({ success: false, message: "You have already reviewed this course" });
        }


        const review = await ReviewModel.create({
            user: userId,
            course: courseId,
            rating: Number(rating),
            comment: comment?.trim() || "",
        });


        const reviews = await ReviewModel.find({ course: courseId });
        const totalRating = reviews.reduce((sum, item) => sum + item.rating, 0);
        const rawAverage = totalRating > 0 ? totalRating / reviews.length : 0;
        const averageRating = Math.round(rawAverage * 10) / 10;

        await CourseModel.findByIdAndUpdate(courseId, { averageRating: averageRating, totalReviews: reviews.length });


        res.status(201).json({ success: true, review, });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "You have already reviewed this course"
            });
        }
        res.status(500).json({ message: "Server Error", success: false, error: error.message });
    }
}



export const getCourseReviews = async (req, res) => {
    try {
        const { courseId } = req.params;
        const reviews = await ReviewModel.find({ course: courseId }).populate("user", "name").sort({ createdAt: -1 }); 

        res.status(200).json({ success: true, count: reviews.length, reviews });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}



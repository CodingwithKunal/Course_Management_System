import CourseModel from "../models/course.js";


export const creatCourse = async (req, res) => {
    try {
        const { title, description, price, thumbnail, category, level } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({ message: "Title, description, and category are required" });
        }
        const course = await CourseModel.create({
            title,
            description,
            price,
            thumbnail,
            category,
            level,
            instructor: req.user._id, // instructor id ko course ke sath link karna
        });

        res.status(201).json({ message: "Course created successfully", course });


    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}


export const getAllCourses = async (req, res) => {
    try {
        const course = await CourseModel.find({
            instructor: req.user._id, // see only your courses
        }).populate("instructor", "name"); // instructor ke name  ko populate karna
        res.status(200).json({
            message: "Courses fetched successfully",
            count: course.length,
            course
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
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
        course.price = price || course.price;
        course.thumbnail = thumbnail || course.thumbnail;
        course.category = category || course.category;
        course.level = level || course.level;
        await course.save();
        res.status(200).json({ message: "Course updated successfully", course });

    } catch (error) {

        res.status(500).json({ message: "Server Error", error: error.message });

    }

}




export const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await CourseModel.findById(courseId)
        const deletedCourse = await CourseModel.deleteOne({ _id: courseId });
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        if (course.deletedCount === 0) {
            return res.status(404).json({ message: "Course not found" });
        }
        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this course" });
        }



        res.status(200).json({ message: "Course deleted successfully" }, deletedCourse);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}



export const publishCourse = async (req, res) => {
    try {
        const { search, category, level, page = 1, limit = 6 } = req.query //search query for filtering courses by title or category or Level

        const query = { isPublished: true };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        // category ke basis par courses ko filter karna
        if (category) {
            query.category = { $reges: category, $options: "i" }; // case-insensitive search for category means if user search for "programming" it will match with "Programming" or "programming" in database
        }

        // search by level
        if (level) {
            query.level = level.toUpperCase();
        }

        // pagination 
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        // total courses count for pagination or frontend display
        const totalCourses = await CourseModel.countDocuments(query);


        const courses = await CourseModel.find(query)
            .populate("instructor", "name") // populate instructor name
            .sort({ createdAt: -1 }) // latest courses first
            .skip(skip) // skip courses for pagination
            .limit(limitNumber); // limit courses for pagination



        res.status(200).json({
            message: "Published courses fetched successfully",
            count: courses.length, courses,
            totalCourses,
            totalPages: Math.ceil(totalCourses / limitNumber),
            currentPage: pageNumber
        });


    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}






// get single course details for course details page
export const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await CourseModel.findById(courseId).populate("instructor", "name email bio");

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (!course.isPublished) {
            return res.status(403).json({ message: "Course is not published yet" });
        }

        res.status(200).json({ message: "Course details fetched successfully", course });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}


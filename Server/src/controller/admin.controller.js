
import UserModel from "../models/user.js";
import CourseModel from "../models/course.js";


//Purpose: Admin dashboard me user list show karna.
export const getAllUsers = async (req, res) => {
    try {
       const users = await UserModel.find().select("-password"); 
       if(!users || users.length === 0){
        return res.status(404).json({ message: "No users found" });
       }
       res.status(200).json({ 
         message : "Users fetched successfully",
         count: users.length,
        users 
    });
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


//Purpose: Instructor approval ke liye admin dashboard me ek route banana.
export const approveInstructor = async (req, res) => {
    try {
        const  {instructorId} = req.params; // Take URL parameter for instructor ID
        const instructor = await UserModel.findById(instructorId);
        if (!instructor || instructor.role !== "INSTRUCTOR") {
            return res.status(404).json({ message: "Instructor not found" });
        }
        if (instructor.instructor.isApproved) {
            return res.status(400).json({ message: "Instructor is already approved" });
        }
        instructor.instructor.isApproved = true;
        await instructor.save();
        res.status(200).json({ message: "Instructor approved successfully", instructor });
        
    } catch (error) {
       res.status(500).json({ message: "Server error", error: error.message }); 
    }
}



// Purpose: User ko block ya unblock karne ke liye admin dashboard me ek route banana.
export const blockUnblockUser = async (req, res) => {
    try {
        const { userId } = req.params; // Take URL parameter for user ID
        const user  = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.isBlocked = !user.isBlocked; // Toggle block status
        await user.save();
        res.status(200).json({ message: `User has been ${user.isBlocked ? "blocked" : "unblocked"} successfully`, user });
        
    } catch (error) {
       res.status(500).json({ message: "Server error", error: error.message }); 
    }
}



// Purpose: User ko delete karne ke liye admin dashboard me ek route banana.
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params; // Take URL parameter for user ID
        const user = await UserModel.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully", user });
        
    } catch (error) {
       res.status(500).json({ message: "Server error", error: error.message });  
    }
}




// Purpose: User ko ADMIN me promote karne ke liye admin dashboard me ek route banana. (only SuperAdmin should have access ideally)
export const promoteToAdmin = async (req, res) => {
    try {
        const { userId } = req.params; // Take URL parameter for user ID
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role === "ADMIN") {
            return res.status(400).json({ message: "User is already an admin" });
        }
        user.role = "ADMIN";
        user.instructor = undefined; // Remove instructor details if any
        await user.save();
        res.status(200).json({ message: "User promoted to admin successfully", user });
        
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });  
    }
}



// Purpose: Aproved instructor course as a published  
export const publishCourse = async (req, res) => {
    try {
        const { courseId } = req.params; // Take URL parameter for course ID
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        if(course.status === "PUBLISHED") {
            return res.status(400).json({ message: "Course is already published" });
        }
        
        course.status = "PUBLISHED";
        await course.save();
        res.status(200).json({ message: "Course published successfully", course });
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}



export const rejectCourse = async (req, res) => {
    try {
        const { courseId } = req.params; 
        const { reason } = req.body; // Take rejection reason from request body
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        if(course.status === "REJECTED") {
            return res.status(400).json({ message: "Course is already rejected" });
        }

        course.status = "REJECTED";
        course.rejectionReason = reason || "No reason provided"; // Set rejection reason
        await course.save();

        res.status(200).json({ message: "Course rejected successfully", course });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


export const unpublishCourse = async (req, res) => {
    try {
        const { courseId } = req.params; // Take URL parameter for course ID
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        if(course.status !== "PUBLISHED") {
            return res.status(400).json({ message: "Only published courses can be unpublished" });
        }
        
        course.status = "DRAFT";
        await course.save();

        res.status(200).json({ message: "Course unpublished successfully", course });
        
    } catch (error) {
         res.status(500).json({ message: "Server error", error: error.message });       
    }
}




// Purpose: Check Pending courses whether they are published or not 
export const getPendingCourses  = async (req, res) => {
    try {
        const pendingCourses = await CourseModel.find({ status: "PENDING"}).populate("instructor", "name email");
        if (!pendingCourses || pendingCourses.length === 0) {
            return res.status(404).json({ message: "No pending courses found" });
        }
        res.status(200).json({ 
            count: pendingCourses.length,
            pendingCourses 
        });
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
        
    }
}





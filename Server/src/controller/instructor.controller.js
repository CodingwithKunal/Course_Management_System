// Instructor Powers:
// View own profile
// Update instructor details


import UserModel from "../models/user.js";



//Purpose:  View Instructor profile 
export const viewInstructorProfile = async (req, res) => {
   try {
        const instructorId = req.user._id; // Assuming the instructor's ID is stored in req.user
        const instructor = await UserModel.findById(instructorId).select("-password");
        if (!instructor || instructor.role !== "INSTRUCTOR") {
            return res.status(404).json({ message: "Instructor not found" });
        }
        instructor.instructor.isApproved = instructor.instructor.isApproved ? "Approved" : "Pending Approval";
        
        res.status(200).json({ instructor });

    
   } catch (error) {
     res.status(500).json({ message: "Server error", error: error.message });
   }
}


//Purpose: Update Instructor details
export const updateInstructorProfile = async (req, res) => {
    const { bio, expertise, experience } = req.body;
    try {
        const instructorId = req.user._id; // Assuming the instructor's ID is stored in req.user
        const instructor = await UserModel.findById(instructorId).select("-password");
        if (!instructor || instructor.role !== "INSTRUCTOR") {
            return res.status(404).json({ message: "Instructor not found" });
        }
        instructor.instructor.bio = bio || instructor.instructor.bio;
        instructor.instructor.expertise = expertise || instructor.instructor.expertise;
        instructor.instructor.experience = experience || instructor.instructor.experience;
        await instructor.save();
        res.status(200).json({ message: "Instructor profile updated successfully", instructor });
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message }); 
    }
}
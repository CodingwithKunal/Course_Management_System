// ADMIN Powers:

// Get all users

// Approve instructor

// Block / Unblock user

// Delete user

// Promote user to ADMIN (only SuperAdmin ideally)


import UserModel from "../models/user.js";


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
        await user.save();
        res.status(200).json({ message: "User promoted to admin successfully", user });
        
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });  
    }
}


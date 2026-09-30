 
import mongoose from "mongoose";

import UserModel from "../models/user.js";
import EnrollmentModel from "../models/enrollment.js";
import PaymentModel from "../models/payments.js";




export const viewInstructorProfile = async (req, res) => {
    try {
        const instructorId = req.user._id; 
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



export const updateInstructorProfile = async (req, res) => {
    const { bio, expertise, experience } = req.body;
    try {
        const instructorId = req.user._id; 
        const instructor = await UserModel.findById(instructorId).select("-password");
        if (!instructor) {
            return res.status(404).json({ message: "User not found" });
        }

        if (instructor.role !== "INSTRUCTOR") {
            return res.status(403).json({ message: "Access denied. Not an instructor" });
        }


        instructor.instructor.bio = bio || instructor.instructor.bio;
        instructor.instructor.expertise = expertise || instructor.instructor.expertise;
        instructor.instructor.experience = experience || instructor.instructor.experience;
        
        await instructor.save();
        res.status(200).json({
            message: "Instructor profile updated successfully", instructor: {
                bio: instructor.instructor.bio,
                expertise: instructor.instructor.expertise,
                experience: instructor.instructor.experience
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


export const getTotalStudentEnrollments = async (req,res)=>{
    try {
        const instructorId = req.user._id; 
        const instructor = await UserModel.findById(instructorId).select("-password");
        if (!instructor || instructor.role !== "INSTRUCTOR") {
            return res.status(404).json({ message: "Instructor not found" });
        }
        const totalEnrollments = await EnrollmentModel.countDocuments({ instructor: instructorId }); 
        
        res.status(200).json({ totalEnrollments });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}



export const getTotalRevenueForInstructor = async (req,res)=>{
      try {
        const instructorId = req.user._id; 

        
        const instructor = await UserModel.findById(instructorId).select("-password");
        if (!instructor || instructor.role !== "INSTRUCTOR") {
            return res.status(404).json({ message: "Instructor not found" });
        }

        
        const revenueData = await PaymentModel.aggregate([
            
            {
                $match: {
                    status: "SUCCESS"
                }
            },
            
            
            {
                $lookup: {
                    from: "courses",          
                    localField: "course",     
                    foreignField: "_id",      
                    as: "courseInfo"          
                }
            },

            
            {
                $unwind: "$courseInfo"
            },

            
            {
                $match: {
                    "courseInfo.instructor": new mongoose.Types.ObjectId(instructorId)
                }
            },

            
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$amount" }
                }
            }
        ]);

        
        const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

        return res.status(200).json({ 
            success: true, 
            totalRevenue: totalRevenue 
        });

    } catch (error) {
        console.error("Revenue calculation error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
}


export const getInstructorApprovedStatus = async (req,res)=>{
    try {
        const instructorId = req.user._id;
        const instructor = await UserModel.findById(instructorId).select("-password");
        
        if (!instructor || instructor.role !== "INSTRUCTOR") {
            return res.status(404).json({ message: "Instructor not found" });
        }

         
        const isApproved = instructor.instructor.isApproved;
        const isBlocked = instructor.isBlocked;   

        if (isBlocked) {
            return res.status(403).json({ 
                success: false,
                message: "Your instructor profile is blocked. Please contact support." 
            });
        }

        res.status(200).json({ 
            success: true, 
            isApproved, 
            isBlocked 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Server error", 
            error: error.message 
        });
    }
} 
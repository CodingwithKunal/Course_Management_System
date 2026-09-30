import express from 'express';
import { authorizeRoles, verifyToken } from '../middleware/auth.middleware.js';
import { updateInstructorProfile, viewInstructorProfile, getTotalStudentEnrollments, getTotalRevenueForInstructor, getInstructorApprovedStatus } from '../controller/instructor.controller.js';
const router = express.Router();



router.get("/viewInstructorProfile", verifyToken, authorizeRoles("INSTRUCTOR"), viewInstructorProfile);
router.put("/updateInstructorProfile", verifyToken, authorizeRoles("INSTRUCTOR"), updateInstructorProfile);
router.get("/totalEnrollments", verifyToken, authorizeRoles("INSTRUCTOR"), getTotalStudentEnrollments);
router.get("/getInstructorRevenue", verifyToken, authorizeRoles("INSTRUCTOR"), getTotalRevenueForInstructor);
router.get("/getInstructorCourses", verifyToken, authorizeRoles("INSTRUCTOR"), getTotalStudentEnrollments);
router.get("/checkInstructorStatus", verifyToken, authorizeRoles("INSTRUCTOR"), getInstructorApprovedStatus);

export default router;
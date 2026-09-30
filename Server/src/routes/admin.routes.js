import express from 'express';
import { authorizeRoles, authorizeSuperAdmin, verifyToken } from '../middleware/auth.middleware.js';
import { approveInstructor, disapproveInstructor, getPendingInstructors, blockUnblockUser, getAllUsers, deleteUser , promoteToAdmin, publishCourse, getPendingCourses, rejectCourse, unpublishCourse, getEnrolledStudent, getTotalRevenue, getAllPublishCourse, getAdminRecentActivity, getReviewRating } from '../controller/admin.controller.js';
const router = express.Router();


router.get("/users", verifyToken, authorizeRoles("ADMIN"), getAllUsers);
router.get("/total_Student",verifyToken, authorizeRoles("ADMIN"), getEnrolledStudent);
router.patch("/approve-instructor/:instructorId", verifyToken, authorizeRoles("ADMIN"), approveInstructor);
router.patch("/disapprove-instructor/:instructorId", verifyToken, authorizeRoles("ADMIN"), disapproveInstructor);
router.patch("/block-unblock-user/:userId", verifyToken, authorizeRoles("ADMIN"), blockUnblockUser);
router.delete("/delete-user/:userId", verifyToken, authorizeRoles("ADMIN"), deleteUser);
router.patch("/promote-admin/:userId", verifyToken,authorizeSuperAdmin , authorizeRoles("ADMIN"), promoteToAdmin); 
router.patch("/publish-course/:courseId", verifyToken, authorizeRoles("ADMIN"), publishCourse);
router.patch("/reject-course/:courseId", verifyToken, authorizeRoles("ADMIN"), rejectCourse);
router.patch("/unpublish-course/:courseId", verifyToken, authorizeRoles("ADMIN"), unpublishCourse);
router.get("/pending-courses", verifyToken , authorizeRoles("ADMIN"), getPendingCourses);
router.get("/pending-instructors", verifyToken, authorizeRoles("ADMIN"), getPendingInstructors);
router.get("/getTotalRevenue",verifyToken,authorizeRoles("ADMIN"),getTotalRevenue);
router.get("/getPublishCourse", verifyToken, authorizeRoles("ADMIN"), getAllPublishCourse);
router.get("/getRecentAcitivities", verifyToken,authorizeRoles("ADMIN"), getAdminRecentActivity)
router.get("/getTotalAvgRating",verifyToken,authorizeRoles("ADMIN"), getReviewRating)

export default router;
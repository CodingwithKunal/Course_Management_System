import express from 'express';
import { authorizeRoles, authorizeSuperAdmin, verifyToken } from '../middleware/auth.middleware.js';
import { approveInstructor, blockUnblockUser, getAllUsers, deleteUser , promoteToAdmin, publishCourse, getPendingCourses, rejectCourse, unpublishCourse } from '../controller/admin.controller.js';
const router = express.Router();


router.get("/users", verifyToken, authorizeRoles("ADMIN"), getAllUsers);
router.patch("/aprove-instructor/:instructorId", verifyToken, authorizeRoles("ADMIN"), approveInstructor);
router.patch("/block-unblock-user/:userId", verifyToken, authorizeRoles("ADMIN"), blockUnblockUser);
router.delete("/delete-user/:userId", verifyToken, authorizeRoles("ADMIN"), deleteUser);
router.patch("/promote-admin/:userId", verifyToken,authorizeSuperAdmin , authorizeRoles("ADMIN"), promoteToAdmin); 
router.patch("/publish-course/:courseId", verifyToken, authorizeRoles("ADMIN"), publishCourse);
router.patch("/reject-course/:courseId", verifyToken, authorizeRoles("ADMIN"), rejectCourse);
router.patch("/unpublish-course/:courseId", verifyToken, authorizeRoles("ADMIN"), unpublishCourse);
router.get("/pending-courses", verifyToken , authorizeRoles("ADMIN"), getPendingCourses);

export default router;
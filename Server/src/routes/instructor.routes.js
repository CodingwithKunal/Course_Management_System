import express from 'express';
import { authorizeRoles, verifyToken } from '../middleware/auth.middleware.js';
import { updateInstructorProfile, viewInstructorProfile } from '../controller/instructor.controller.js';
const router = express.Router();



router.get("/viewInstructorProfile", verifyToken, authorizeRoles("INSTRUCTOR"), viewInstructorProfile);
router.put("/updateInstructorProfile", verifyToken, authorizeRoles("INSTRUCTOR"), updateInstructorProfile);

export default router;
import express from 'express';
import { authorizeRoles, verifyToken } from '../middleware/auth.middleware.js';
import { creatCourse ,deleteCourse,getAllCourses, UpdateCourse} from '../controller/course.controller.js';
const router = express.Router();


router.post("/create-course", verifyToken, authorizeRoles("INSTRUCTOR"), creatCourse);
router.get("/get-courses", verifyToken, authorizeRoles("INSTRUCTOR"), getAllCourses);
router.put("/update-course/:courseId", verifyToken, authorizeRoles("INSTRUCTOR"), UpdateCourse);
router.delete("/delete-course/:courseId", verifyToken, authorizeRoles("INSTRUCTOR"), deleteCourse);

export default router;

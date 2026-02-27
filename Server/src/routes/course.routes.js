import express from 'express';
import { authorizeRoles, verifyToken } from '../middleware/auth.middleware.js';
import { creatCourse ,deleteCourse,enrollInCourse,getAllCourses, getCourseById, getEnrolledCourses, publishCourse, submitCourseForReview, UpdateCourse,} from '../controller/course.controller.js';
const router = express.Router();


router.post("/create-course", verifyToken, authorizeRoles("INSTRUCTOR"), creatCourse);
router.get("/get-courses", verifyToken, authorizeRoles("INSTRUCTOR"), getAllCourses);
router.put("/update-course/:courseId", verifyToken, authorizeRoles("INSTRUCTOR"), UpdateCourse);
router.delete("/delete-course/:courseId", verifyToken, authorizeRoles("INSTRUCTOR"), deleteCourse);
router.get("/get-all-courses", publishCourse); // all courses for students and public
router.get("/course-details/:courseId", getCourseById) // all course  details for students and public
router.post("/enroll/:courseId", verifyToken, authorizeRoles("USER"), enrollInCourse); // Enroll in course for students
router.get("/my-enrollments", verifyToken, authorizeRoles("USER"), getEnrolledCourses); // see enrolled courses for students
router.patch("/submit/:courseId", verifyToken, authorizeRoles("INSTRUCTOR"), submitCourseForReview); // submit course for review by admin

export default router;

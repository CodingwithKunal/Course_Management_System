import express from 'express';
import { authorizeRoles, verifyToken } from '../middleware/auth.middleware.js';
import { creatCourse, deleteCourse, enrollInCourse, getAllCourses, getCourseById, getCourseReviews, getEnrolledCourses, publishCourse, reviewController, submitCourseForReview, UpdateCourse, checkEnrollmentStatus, resubmitCourse } from '../controller/course.controller.js';
import { CompleteCourse, getCourseProgress, updateWatchProgress, continuLearning } from '../controller/courseProgress.Controller.js';
const router = express.Router();


router.post("/create-course", verifyToken, authorizeRoles("INSTRUCTOR"), creatCourse);
router.get("/get-courses", verifyToken, authorizeRoles("INSTRUCTOR"), getAllCourses);
router.put("/update-course/:courseId", verifyToken, authorizeRoles("INSTRUCTOR"), UpdateCourse);
router.put("/resubmit-course/:courseId", verifyToken, authorizeRoles("INSTRUCTOR"), resubmitCourse);
router.delete("/delete-course/:courseId", verifyToken, authorizeRoles("INSTRUCTOR"), deleteCourse);
router.get("/get-all-courses", publishCourse); 
router.get("/course-details/:courseId", getCourseById) 
router.get("/check-enrollment/:courseId", verifyToken, authorizeRoles("USER", "INSTRUCTOR", "ADMIN"), checkEnrollmentStatus); 
router.post("/enroll/:courseId", verifyToken, authorizeRoles("USER", "INSTRUCTOR", "ADMIN"), enrollInCourse); 
router.get("/my-enrollments", verifyToken, authorizeRoles("USER","INSTRUCTOR", "ADMIN"), getEnrolledCourses); 
router.patch("/submit/:courseId", verifyToken, authorizeRoles("INSTRUCTOR"), submitCourseForReview); 
router.patch("/course/:courseId/complete", verifyToken, CompleteCourse); 
router.get("/course/:courseId/progress", verifyToken, authorizeRoles("USER", "INSTRUCTOR", "ADMIN"), getCourseProgress); 
router.patch("/courses/:courseId/watch-progress", verifyToken, authorizeRoles("USER", "INSTRUCTOR", "ADMIN"), updateWatchProgress); 
router.post("/:courseId/review", verifyToken, reviewController); 
router.get("/course/:courseId/reviews", getCourseReviews)
router.get("/continue-learning", verifyToken, authorizeRoles("USER"), continuLearning); 

export default router;

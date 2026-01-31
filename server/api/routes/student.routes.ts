import { Router } from 'express';
import * as studentController from '../controllers/student.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/dashboard', verifyToken, studentController.getDashboard);
router.get('/profile', verifyToken, studentController.getProfile);
router.get('/profile-details', verifyToken, studentController.getProfileDetails);
router.get('/pending-tasks', verifyToken, studentController.getPendingTasks);
router.get('/progress', verifyToken, studentController.getProgress);
router.get('/subjects/:subjectCode/homework', verifyToken, studentController.getHomeworkBySubject);
router.get('/assignments/:assignmentId/personalized', verifyToken, studentController.getPersonalizedAssignment);
router.post('/assignments/:assignmentId/submit', verifyToken, studentController.submitHomework);

export default router;

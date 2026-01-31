import { Router } from 'express';
import * as teacherController from '../controllers/teacher.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/profile', verifyToken, teacherController.getProfile);
router.get('/classes', verifyToken, teacherController.getClasses);
router.get('/students', verifyToken, teacherController.getStudents);
router.post('/assignments', verifyToken, teacherController.createAssignment);
router.get('/assignments', verifyToken, teacherController.getAssignments);
router.get('/submissions', verifyToken, teacherController.getSubmissions);
router.get('/lesson-plans', verifyToken, teacherController.getLessonPlans);
router.get('/daily-doses', verifyToken, teacherController.getDailyDoses);
router.get('/assessments', verifyToken, teacherController.getAssessments);
router.get('/queries', verifyToken, teacherController.getQueries);

export default router;

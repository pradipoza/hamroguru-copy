import { Router } from 'express';
import * as subjectController from '../controllers/subject.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', verifyToken, subjectController.getAllSubjects);
router.get('/:subjectCode', verifyToken, subjectController.getSubject);
router.get('/:subjectCode/homework', verifyToken, subjectController.getHomework);
router.get('/:subjectCode/notes', verifyToken, subjectController.getNotes);
router.get('/:subjectCode/tests', verifyToken, subjectController.getTests);
router.get('/:subjectCode/resources', verifyToken, subjectController.getResources);
router.get('/:subjectCode/ai-tutor', verifyToken, subjectController.getAiTutorSession);
router.post('/:subjectCode/ai-tutor', verifyToken, subjectController.postAiTutorMessage);

// TODO: Add routes for notes, tests, etc.

export default router;

import { Router } from 'express';
import * as studentController from '../controllers/student.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/dashboard', verifyToken, studentController.getDashboard);

export default router;

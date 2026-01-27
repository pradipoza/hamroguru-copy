import { Router } from 'express';
import * as teacherController from '../controllers/teacher.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/profile', verifyToken, teacherController.getProfile);

export default router;

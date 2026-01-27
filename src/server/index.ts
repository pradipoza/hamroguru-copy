import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';

dotenv.config({ path: './.env' });
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Loaded' : 'Not Loaded');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

import studentRoutes from './api/routes/student.routes';
import authRoutes from './api/routes/auth.routes';
import subjectRoutes from './api/routes/subject.routes';
import teacherRoutes from './api/routes/teacher.routes';

app.get('/', (req, res) => {
  res.send('MeroGuru Backend is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/teacher', teacherRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

import { users } from '../db/schema';

export type NewUser = typeof users.$inferInsert & {
  fullName: string;
  role?: 'student' | 'teacher' | 'admin';
};

export type UserRole = 'student' | 'teacher' | 'admin';

export interface NewUser {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
  subjectCode?: string;
}

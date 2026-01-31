import { pgTable, text, timestamp, uuid, integer, unique, pgEnum, jsonb, decimal, boolean, date, customType, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

const vector = customType<{ data: number[]; driverData: string }>({
  dataType() {
    return 'vector(1536)';
  },
  toDriver(value) {
    return `[${value.join(',')}]`;
  },
  fromDriver(value) {
    return value as unknown as number[];
  },
});

// ENUMS
export const appRoleEnum = pgEnum('app_role', ['student', 'teacher', 'admin']);
export const homeworkStatusEnum = pgEnum('homework_status', ['pending', 'submitted', 'checked', 'reviewed', 'late', 'missed']);
export const noteStatusEnum = pgEnum('note_status', ['pending', 'completed', 'verified']);
export const testStatusEnum = pgEnum('test_status', ['upcoming', 'available', 'completed']);
export const queryStatusEnum = pgEnum('query_status', ['pending', 'addressed', 'not_addressed']);
export const lessonStatusEnum = pgEnum('lesson_status', ['upcoming', 'completed', 'missed']);
export const feedbackTypeEnum = pgEnum('feedback_type', ['understood', 'still_confused', 'not_addressed']);

// CORE TABLES
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
});

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  fullName: text('full_name').notNull(),
  avatarUrl: text('avatar_url'),
  phone: text('phone'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const userRoles = pgTable('user_roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: appRoleEnum('role').notNull().default('student'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => {
  return {
    uniqueUserIdRole: unique('user_roles_user_id_role_unique').on(table.userId, table.role),
  };
});

export const schools = pgTable('schools', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  address: text('address'),
  type: text('type').default('government'),
  contactPhone: text('contact_phone'),
  contactEmail: text('contact_email'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const classes = pgTable('classes', {
  id: uuid('id').primaryKey().defaultRandom(),
  schoolId: uuid('school_id').references(() => schools.id, { onDelete: 'cascade' }),
  grade: integer('grade').notNull(),
  section: text('section').notNull().default('A'),
  academicYear: text('academic_year').notNull().default('2024'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => {
  return {
    uniqueClass: unique('classes_school_id_grade_section_academic_year_unique').on(table.schoolId, table.grade, table.section, table.academicYear),
  };
});

export const subjects = pgTable('subjects', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  nameNepali: text('name_nepali'),
  code: text('code').notNull().unique(),
  gradeLevel: integer('grade_level'),
  description: text('description'),
  icon: text('icon').default('book'),
  color: text('color').default('blue'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// STUDENT TABLES
export const studentProfiles = pgTable('student_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  classId: uuid('class_id').references(() => classes.id, { onDelete: 'set null' }),
  rollNumber: integer('roll_number'),
  learningStyle: text('learning_style'),
  learningProfile: jsonb('learning_profile'),
  goals: text('goals').array(),
  interests: text('interests').array(),
  parentContact: text('parent_contact'),
  address: text('address'),
  streakDays: integer('streak_days').default(0),
  totalPoints: integer('total_points').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const homeworkAssignments = pgTable('homework_assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  sequenceId: serial('sequence_id').unique(), // Auto-increment for n8n trigger
  classId: uuid('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
  subjectId: uuid('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  teacherId: uuid('teacher_id').references(() => users.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  description: text('description'),
  chapter: text('chapter'),
  dueDate: timestamp('due_date', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const homeworkSubmissions = pgTable('homework_submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  assignmentId: uuid('assignment_id').notNull().references(() => homeworkAssignments.id, { onDelete: 'cascade' }),
  studentId: uuid('student_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow(),
  images: text('images').array(),
  status: homeworkStatusEnum('status').notNull().default('pending'),
  aiFeedback: jsonb('ai_feedback'),
  score: integer('score'),
  teacherFeedback: text('teacher_feedback'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => {
  return {
    uniqueSubmission: unique('homework_submissions_assignment_id_student_id_unique').on(table.assignmentId, table.studentId),
  };
});

export const personalizedAssignments = pgTable('personalized_assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  assignmentId: uuid('assignment_id').notNull().references(() => homeworkAssignments.id, { onDelete: 'cascade' }),
  studentId: uuid('student_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  personalizedContent: jsonb('personalized_content').notNull(),
  questions: jsonb('questions').notNull(),
  difficulty: text('difficulty').default('medium'),
  estimatedTime: integer('estimated_time').default(30),
  learningObjectives: text('learning_objectives').array(),
  personalizedInstructions: text('personalized_instructions'),
  status: text('status').default('ready'),
  generatedAt: timestamp('generated_at', { withTimezone: true }).defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => {
  return {
    uniquePersonalizedAssignment: unique('personalized_assignments_assignment_id_student_id_unique').on(table.assignmentId, table.studentId),
  };
});

export const tests = pgTable('tests', {
  id: uuid('id').primaryKey().defaultRandom(),
  classId: uuid('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
  subjectId: uuid('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  teacherId: uuid('teacher_id').references(() => users.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  chapter: text('chapter'),
  type: text('type').default('unit'),
  totalQuestions: integer('total_questions').default(10),
  totalMarks: integer('total_marks').default(100),
  duration: integer('duration').default(60),
  scheduledDate: timestamp('scheduled_date', { withTimezone: true }),
  status: testStatusEnum('status').notNull().default('upcoming'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const testResults = pgTable('test_results', {
  id: uuid('id').primaryKey().defaultRandom(),
  testId: uuid('test_id').notNull().references(() => tests.id, { onDelete: 'cascade' }),
  studentId: uuid('student_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  score: integer('score'),
  percentage: decimal('percentage', { precision: 5, scale: 2 }),
  grade: text('grade'),
  topicScores: jsonb('topic_scores'),
  weakAreas: text('weak_areas').array(),
  completedAt: timestamp('completed_at', { withTimezone: true }).defaultNow(),
}, (table) => {
  return {
    uniqueResult: unique('test_results_test_id_student_id_unique').on(table.testId, table.studentId),
  };
});

export const studentNotes = pgTable('student_notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  subjectId: uuid('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  chapter: text('chapter').notNull(),
  topic: text('topic').notNull(),
  content: text('content'),
  images: text('images').array(),
  status: noteStatusEnum('status').notNull().default('pending'),
  verifiedBy: uuid('verified_by').references(() => users.id, { onDelete: 'set null' }),
  verifiedAt: timestamp('verified_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const aiTutorSessions = pgTable('ai_tutor_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  subjectId: uuid('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  messages: jsonb('messages').array().default([]),
  sessionSummary: text('session_summary'),
  topicsDiscussed: text('topics_discussed').array(),
  understandingLevel: jsonb('understanding_level'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  endedAt: timestamp('ended_at', { withTimezone: true }),
});

export const studentLearningInsights = pgTable('student_learning_insights', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  subjectId: uuid('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  strengths: text('strengths').array(),
  weaknesses: text('weaknesses').array(),
  recommendedTopics: text('recommended_topics').array(),
  progressTrend: text('progress_trend'),
  lastUpdated: timestamp('last_updated', { withTimezone: true }).defaultNow(),
}, (table) => {
  return {
    uniqueInsight: unique('student_learning_insights_student_id_subject_id_unique').on(table.studentId, table.subjectId),
  };
});

// TEACHER TABLES
export const teacherProfiles = pgTable('teacher_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  schoolId: uuid('school_id').references(() => schools.id, { onDelete: 'set null' }),
  employeeId: text('employee_id'),
  qualification: text('qualification'),
  subjectsTaught: text('subjects_taught').array(),
  yearsExperience: integer('years_experience').default(0),
  joinDate: date('join_date'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const teacherClassAssignments = pgTable('teacher_class_assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  teacherId: uuid('teacher_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  classId: uuid('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
  subjectId: uuid('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  academicYear: text('academic_year').notNull().default('2024'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => {
  return {
    uniqueAssignment: unique('teacher_class_assignments_teacher_id_class_id_subject_id_academic_year_unique').on(table.teacherId, table.classId, table.subjectId, table.academicYear),
  };
});

export const lessonPlans = pgTable('lesson_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  teacherId: uuid('teacher_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  classId: uuid('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
  subjectId: uuid('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  date: date('date').notNull(),
  topics: text('topics').array(),
  studentQueries: jsonb('student_queries').array(),
  weakAreas: text('weak_areas').array(),
  aiRecommendation: text('ai_recommendation'),
  status: lessonStatusEnum('status').notNull().default('upcoming'),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  feedbackCollected: boolean('feedback_collected').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const dailyDoses = pgTable('daily_doses', {
  id: uuid('id').primaryKey().defaultRandom(),
  teacherId: uuid('teacher_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  subjectId: uuid('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  date: date('date').notNull().defaultNow(),
  title: text('title').notNull(),
  description: text('description'),
  content: text('content'),
  topics: text('topics').array(),
  estimatedTime: integer('estimated_time').default(15),
  source: text('source'),
  completed: boolean('completed').default(false),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const teacherAssessments = pgTable('teacher_assessments', {
  id: uuid('id').primaryKey().defaultRandom(),
  teacherId: uuid('teacher_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  subjectId: uuid('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  totalQuestions: integer('total_questions').default(10),
  duration: integer('duration').default(30),
  scheduledDate: timestamp('scheduled_date', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  score: integer('score'),
  status: testStatusEnum('status').notNull().default('upcoming'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const studentQueries = pgTable('student_queries', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  teacherId: uuid('teacher_id').references(() => users.id, { onDelete: 'set null' }),
  subjectId: uuid('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  queryText: text('query_text').notNull(),
  topic: text('topic'),
  source: text('source').default('ai_tutor'),
  status: queryStatusEnum('status').notNull().default('pending'),
  askedAt: timestamp('asked_at', { withTimezone: true }).defaultNow(),
  addressedAt: timestamp('addressed_at', { withTimezone: true }),
  studentFeedback: feedbackTypeEnum('student_feedback'),
  addedToPortfolio: boolean('added_to_portfolio').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const teacherPortfolio = pgTable('teacher_portfolio', {
  id: uuid('id').primaryKey().defaultRandom(),
  teacherId: uuid('teacher_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  metricType: text('metric_type').notNull(),
  value: decimal('value', { precision: 10, scale: 2 }),
  date: date('date').notNull().defaultNow(),
  details: jsonb('details'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// CHAT MEMORY TABLE (for AI Tutor)
export const chatMemory = pgTable('chat_memory', {
  id: integer('id').primaryKey(),
  sessionId: text('session_id').notNull(),
  message: jsonb('message').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  subject: text('subject'),
});

// UTILITY TABLES
export const webhookLogs = pgTable('webhook_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  webhookType: text('webhook_type').notNull(),
  payload: jsonb('payload'),
  response: jsonb('response'),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const resources = pgTable('resources', {
  id: uuid('id').primaryKey().defaultRandom(),
  subjectId: uuid('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  chapter: text('chapter'),
  title: text('title').notNull(),
  type: text('type').notNull(),
  url: text('url'),
  isBookmarked: boolean('is_bookmarked').default(false),
  recommended: boolean('recommended').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const subjectTextbookEmbeddings = pgTable('subject_textbook_embeddings', {
  id: uuid('id').primaryKey().defaultRandom(),
  subjectId: uuid('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  chapter: text('chapter'),
  topic: text('topic'),
  chunkIndex: integer('chunk_index').notNull(),
  content: text('content').notNull(),
  embedding: vector('embedding').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => {
  return {
    uniqueSubjectChunk: unique('subject_textbook_embeddings_subject_id_chunk_index_unique').on(table.subjectId, table.chunkIndex),
  };
});

// RELATIONS
export const studentProfilesRelations = relations(studentProfiles, ({ one }) => ({
  user: one(users, {
    fields: [studentProfiles.userId],
    references: [users.id],
  }),
  class: one(classes, {
    fields: [studentProfiles.classId],
    references: [classes.id],
  }),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles),
  roles: many(userRoles),
  studentProfile: one(studentProfiles),
  teacherProfile: one(teacherProfiles),
  homeworkSubmissions: many(homeworkSubmissions),
  personalizedAssignments: many(personalizedAssignments),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.id],
    references: [users.id],
  }),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  school: one(schools, {
    fields: [classes.schoolId],
    references: [schools.id],
  }),
  students: many(studentProfiles),
}));

export const homeworkAssignmentsRelations = relations(homeworkAssignments, ({ one, many }) => ({
  class: one(classes, {
    fields: [homeworkAssignments.classId],
    references: [classes.id],
  }),
  subject: one(subjects, {
    fields: [homeworkAssignments.subjectId],
    references: [subjects.id],
  }),
  teacher: one(users, {
    fields: [homeworkAssignments.teacherId],
    references: [users.id],
  }),
  submissions: many(homeworkSubmissions),
  personalizedAssignments: many(personalizedAssignments),
}));

export const homeworkSubmissionsRelations = relations(homeworkSubmissions, ({ one }) => ({
  assignment: one(homeworkAssignments, {
    fields: [homeworkSubmissions.assignmentId],
    references: [homeworkAssignments.id],
  }),
  student: one(users, {
    fields: [homeworkSubmissions.studentId],
    references: [users.id],
  }),
}));

export const personalizedAssignmentsRelations = relations(personalizedAssignments, ({ one }) => ({
  assignment: one(homeworkAssignments, {
    fields: [personalizedAssignments.assignmentId],
    references: [homeworkAssignments.id],
  }),
  student: one(users, {
    fields: [personalizedAssignments.studentId],
    references: [users.id],
  }),
}));

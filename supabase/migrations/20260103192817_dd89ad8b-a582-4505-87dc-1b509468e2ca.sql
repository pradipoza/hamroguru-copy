
-- =============================================
-- PHASE 1: ENUMS
-- =============================================

-- Create role enum
CREATE TYPE public.app_role AS ENUM ('student', 'teacher', 'admin');

-- Create status enums
CREATE TYPE public.homework_status AS ENUM ('pending', 'submitted', 'checked', 'reviewed', 'late', 'missed');
CREATE TYPE public.note_status AS ENUM ('pending', 'completed', 'verified');
CREATE TYPE public.test_status AS ENUM ('upcoming', 'available', 'completed');
CREATE TYPE public.query_status AS ENUM ('pending', 'addressed', 'not_addressed');
CREATE TYPE public.lesson_status AS ENUM ('upcoming', 'completed', 'missed');
CREATE TYPE public.feedback_type AS ENUM ('understood', 'still_confused', 'not_addressed');

-- =============================================
-- PHASE 2: CORE TABLES (must come before functions that reference them)
-- =============================================

-- Profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Schools table
CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  type TEXT DEFAULT 'government',
  contact_phone TEXT,
  contact_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Classes table
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  grade INTEGER NOT NULL,
  section TEXT NOT NULL DEFAULT 'A',
  academic_year TEXT NOT NULL DEFAULT '2024',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (school_id, grade, section, academic_year)
);

-- Subjects table
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_nepali TEXT,
  code TEXT NOT NULL UNIQUE,
  grade_level INTEGER,
  description TEXT,
  icon TEXT DEFAULT 'book',
  color TEXT DEFAULT 'blue',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- PHASE 3: SECURITY FUNCTIONS (after user_roles exists)
-- =============================================

-- Security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get user's role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- =============================================
-- PHASE 4: STUDENT TABLES
-- =============================================

-- Student profiles
CREATE TABLE public.student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  roll_number INTEGER,
  learning_style TEXT,
  goals TEXT[],
  interests TEXT[],
  parent_contact TEXT,
  address TEXT,
  streak_days INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Homework assignments
CREATE TABLE public.homework_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  chapter TEXT,
  due_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Homework submissions
CREATE TABLE public.homework_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES public.homework_assignments(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  images TEXT[],
  status homework_status NOT NULL DEFAULT 'pending',
  ai_feedback JSONB,
  score INTEGER,
  teacher_feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (assignment_id, student_id)
);

-- Tests table
CREATE TABLE public.tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  chapter TEXT,
  type TEXT DEFAULT 'unit',
  total_questions INTEGER DEFAULT 10,
  total_marks INTEGER DEFAULT 100,
  duration INTEGER DEFAULT 60,
  scheduled_date TIMESTAMPTZ,
  status test_status NOT NULL DEFAULT 'upcoming',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Test results
CREATE TABLE public.test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  score INTEGER,
  percentage DECIMAL(5,2),
  grade TEXT,
  topic_scores JSONB,
  weak_areas TEXT[],
  completed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (test_id, student_id)
);

-- Student notes
CREATE TABLE public.student_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  chapter TEXT NOT NULL,
  topic TEXT NOT NULL,
  content TEXT,
  images TEXT[],
  status note_status NOT NULL DEFAULT 'pending',
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- AI tutor sessions
CREATE TABLE public.ai_tutor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  messages JSONB[] DEFAULT '{}',
  session_summary TEXT,
  topics_discussed TEXT[],
  understanding_level JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ
);

-- Student learning insights
CREATE TABLE public.student_learning_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  strengths TEXT[],
  weaknesses TEXT[],
  recommended_topics TEXT[],
  progress_trend TEXT,
  last_updated TIMESTAMPTZ DEFAULT now(),
  UNIQUE (student_id, subject_id)
);

-- =============================================
-- PHASE 5: TEACHER TABLES
-- =============================================

-- Teacher profiles
CREATE TABLE public.teacher_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  employee_id TEXT,
  qualification TEXT,
  subjects_taught TEXT[],
  years_experience INTEGER DEFAULT 0,
  join_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Teacher class assignments
CREATE TABLE public.teacher_class_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  academic_year TEXT NOT NULL DEFAULT '2024',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (teacher_id, class_id, subject_id, academic_year)
);

-- Lesson plans
CREATE TABLE public.lesson_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  topics TEXT[],
  student_queries JSONB[],
  weak_areas TEXT[],
  ai_recommendation TEXT,
  status lesson_status NOT NULL DEFAULT 'upcoming',
  completed_at TIMESTAMPTZ,
  feedback_collected BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Daily doses
CREATE TABLE public.daily_doses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  topics TEXT[],
  estimated_time INTEGER DEFAULT 15,
  source TEXT,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Teacher assessments
CREATE TABLE public.teacher_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  total_questions INTEGER DEFAULT 10,
  duration INTEGER DEFAULT 30,
  scheduled_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  score INTEGER,
  status test_status NOT NULL DEFAULT 'upcoming',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Student queries
CREATE TABLE public.student_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  query_text TEXT NOT NULL,
  topic TEXT,
  source TEXT DEFAULT 'ai_tutor',
  status query_status NOT NULL DEFAULT 'pending',
  asked_at TIMESTAMPTZ DEFAULT now(),
  addressed_at TIMESTAMPTZ,
  student_feedback feedback_type,
  added_to_portfolio BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Teacher portfolio
CREATE TABLE public.teacher_portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  metric_type TEXT NOT NULL,
  value DECIMAL(10,2),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- PHASE 6: UTILITY TABLES
-- =============================================

-- Webhook logs
CREATE TABLE public.webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_type TEXT NOT NULL,
  payload JSONB,
  response JSONB,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Resources
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  chapter TEXT,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT,
  is_bookmarked BOOLEAN DEFAULT false,
  recommended BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- PHASE 7: ENABLE RLS
-- =============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homework_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homework_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tutor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_learning_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_class_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_doses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PHASE 8: RLS POLICIES
-- =============================================

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User roles policies
CREATE POLICY "Users can view their own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Schools policies
CREATE POLICY "Anyone can view schools" ON public.schools FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage schools" ON public.schools FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Classes policies
CREATE POLICY "Anyone can view classes" ON public.classes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage classes" ON public.classes FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Subjects policies
CREATE POLICY "Anyone can view subjects" ON public.subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage subjects" ON public.subjects FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Student profiles policies
CREATE POLICY "Students can view their own profile" ON public.student_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Students can update their own profile" ON public.student_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Students can insert their own profile" ON public.student_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Teachers can view students in their classes" ON public.student_profiles FOR SELECT USING (
  public.has_role(auth.uid(), 'teacher') AND 
  class_id IN (SELECT class_id FROM public.teacher_class_assignments WHERE teacher_id = auth.uid())
);

-- Homework assignments policies
CREATE POLICY "Students can view assignments for their class" ON public.homework_assignments FOR SELECT USING (
  class_id IN (SELECT class_id FROM public.student_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Teachers can manage assignments for their classes" ON public.homework_assignments FOR ALL USING (
  teacher_id = auth.uid() OR 
  class_id IN (SELECT class_id FROM public.teacher_class_assignments WHERE teacher_id = auth.uid())
);

-- Homework submissions policies
CREATE POLICY "Students can view their own submissions" ON public.homework_submissions FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Students can submit homework" ON public.homework_submissions FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "Students can update their submissions" ON public.homework_submissions FOR UPDATE USING (student_id = auth.uid());
CREATE POLICY "Teachers can view submissions for their assignments" ON public.homework_submissions FOR SELECT USING (
  assignment_id IN (SELECT id FROM public.homework_assignments WHERE teacher_id = auth.uid())
);
CREATE POLICY "Teachers can grade submissions" ON public.homework_submissions FOR UPDATE USING (
  assignment_id IN (SELECT id FROM public.homework_assignments WHERE teacher_id = auth.uid())
);

-- Tests policies
CREATE POLICY "Students can view tests for their class" ON public.tests FOR SELECT USING (
  class_id IN (SELECT class_id FROM public.student_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Teachers can manage tests" ON public.tests FOR ALL USING (
  teacher_id = auth.uid() OR 
  class_id IN (SELECT class_id FROM public.teacher_class_assignments WHERE teacher_id = auth.uid())
);

-- Test results policies
CREATE POLICY "Students can view their own results" ON public.test_results FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Students can submit results" ON public.test_results FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "Teachers can view results for their tests" ON public.test_results FOR SELECT USING (
  test_id IN (SELECT id FROM public.tests WHERE teacher_id = auth.uid())
);

-- Student notes policies
CREATE POLICY "Students can manage their own notes" ON public.student_notes FOR ALL USING (student_id = auth.uid());
CREATE POLICY "Teachers can verify notes" ON public.student_notes FOR UPDATE USING (public.has_role(auth.uid(), 'teacher'));

-- AI tutor sessions policies
CREATE POLICY "Students can manage their own sessions" ON public.ai_tutor_sessions FOR ALL USING (student_id = auth.uid());

-- Student learning insights policies
CREATE POLICY "Students can view their own insights" ON public.student_learning_insights FOR SELECT USING (student_id = auth.uid());

-- Teacher profiles policies
CREATE POLICY "Teachers can view their own profile" ON public.teacher_profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Teachers can update their own profile" ON public.teacher_profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Teachers can insert their own profile" ON public.teacher_profiles FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Students can view teacher profiles" ON public.teacher_profiles FOR SELECT TO authenticated USING (true);

-- Teacher class assignments policies
CREATE POLICY "Teachers can view their assignments" ON public.teacher_class_assignments FOR SELECT USING (teacher_id = auth.uid());
CREATE POLICY "Admins can manage assignments" ON public.teacher_class_assignments FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Lesson plans policies
CREATE POLICY "Teachers can manage their lesson plans" ON public.lesson_plans FOR ALL USING (teacher_id = auth.uid());

-- Daily doses policies
CREATE POLICY "Teachers can manage their daily doses" ON public.daily_doses FOR ALL USING (teacher_id = auth.uid());

-- Teacher assessments policies
CREATE POLICY "Teachers can manage their assessments" ON public.teacher_assessments FOR ALL USING (teacher_id = auth.uid());

-- Student queries policies
CREATE POLICY "Students can create queries" ON public.student_queries FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "Students can view their queries" ON public.student_queries FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Students can update feedback" ON public.student_queries FOR UPDATE USING (student_id = auth.uid());
CREATE POLICY "Teachers can view and address queries" ON public.student_queries FOR SELECT USING (teacher_id = auth.uid());
CREATE POLICY "Teachers can update queries" ON public.student_queries FOR UPDATE USING (teacher_id = auth.uid());

-- Teacher portfolio policies
CREATE POLICY "Teachers can view their portfolio" ON public.teacher_portfolio FOR SELECT USING (teacher_id = auth.uid());

-- Webhook logs policies
CREATE POLICY "Service can manage webhook logs" ON public.webhook_logs FOR ALL TO service_role USING (true);

-- Resources policies
CREATE POLICY "Anyone can view resources" ON public.resources FOR SELECT TO authenticated USING (true);
CREATE POLICY "Teachers can manage resources" ON public.resources FOR ALL USING (public.has_role(auth.uid(), 'teacher'));

-- =============================================
-- PHASE 9: TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON public.schools FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON public.classes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_student_profiles_updated_at BEFORE UPDATE ON public.student_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_homework_assignments_updated_at BEFORE UPDATE ON public.homework_assignments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_homework_submissions_updated_at BEFORE UPDATE ON public.homework_submissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_student_notes_updated_at BEFORE UPDATE ON public.student_notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_teacher_profiles_updated_at BEFORE UPDATE ON public.teacher_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lesson_plans_updated_at BEFORE UPDATE ON public.lesson_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data ->> 'role')::app_role, 'student')
  );
  
  RETURN NEW;
END;
$$;

-- Trigger on new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- PHASE 10: SEED DATA
-- =============================================

INSERT INTO public.subjects (name, name_nepali, code, grade_level, description, icon, color) VALUES
  ('Mathematics', 'गणित', 'math', NULL, 'Basic and advanced mathematics', 'calculator', 'math'),
  ('Science', 'विज्ञान', 'science', NULL, 'Natural and physical sciences', 'flask', 'science'),
  ('English', 'अंग्रेजी', 'english', NULL, 'English language and literature', 'book-open', 'english'),
  ('Nepali', 'नेपाली', 'nepali', NULL, 'Nepali language and literature', 'languages', 'nepali'),
  ('Social Studies', 'सामाजिक अध्ययन', 'social', NULL, 'History, geography, and civics', 'globe', 'social'),
  ('Computer Science', 'कम्प्युटर विज्ञान', 'computer', NULL, 'Computer fundamentals and programming', 'laptop', 'computer');

-- =============================================
-- PHASE 11: STORAGE BUCKETS
-- =============================================

INSERT INTO storage.buckets (id, name, public) VALUES ('homework-images', 'homework-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('notes-images', 'notes-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('resources', 'resources', true);

-- Storage policies
CREATE POLICY "Users can upload homework images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'homework-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view homework images" ON storage.objects FOR SELECT USING (bucket_id = 'homework-images');
CREATE POLICY "Users can delete their homework images" ON storage.objects FOR DELETE USING (bucket_id = 'homework-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload notes images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'notes-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view notes images" ON storage.objects FOR SELECT USING (bucket_id = 'notes-images');
CREATE POLICY "Users can delete their notes images" ON storage.objects FOR DELETE USING (bucket_id = 'notes-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view resources" ON storage.objects FOR SELECT USING (bucket_id = 'resources');
CREATE POLICY "Teachers can upload resources" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resources' AND public.has_role(auth.uid(), 'teacher'));

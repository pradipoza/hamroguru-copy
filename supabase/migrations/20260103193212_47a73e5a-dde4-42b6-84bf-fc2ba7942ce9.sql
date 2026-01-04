
-- =============================================
-- SEED DATA FOR DEMO
-- =============================================

-- Create a demo school
INSERT INTO public.schools (id, name, address, type, contact_phone, contact_email) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Shree Nepal Rastriya Secondary School', 'Kathmandu, Nepal', 'government', '+977-1-4123456', 'info@nrss.edu.np');

-- Create classes for the school
INSERT INTO public.classes (id, school_id, grade, section, academic_year) VALUES
  ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111111', 9, 'A', '2024'),
  ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111111', 9, 'B', '2024'),
  ('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111111', 10, 'A', '2024'),
  ('22222222-2222-2222-2222-222222222204', '11111111-1111-1111-1111-111111111111', 10, 'B', '2024');

-- Add sample resources
INSERT INTO public.resources (subject_id, chapter, title, type, url, recommended) 
SELECT id, 'Chapter 1', 'Introduction Video', 'video', 'https://youtube.com/example', true FROM public.subjects WHERE code = 'math'
UNION ALL
SELECT id, 'Chapter 1', 'Practice Problems PDF', 'pdf', 'https://example.com/practice.pdf', true FROM public.subjects WHERE code = 'math'
UNION ALL
SELECT id, 'Chapter 2', 'Algebra Basics', 'video', 'https://youtube.com/algebra', false FROM public.subjects WHERE code = 'math'
UNION ALL
SELECT id, 'Chapter 1', 'Science Lab Guide', 'pdf', 'https://example.com/lab.pdf', true FROM public.subjects WHERE code = 'science'
UNION ALL
SELECT id, 'Chapter 1', 'Physics Experiments', 'video', 'https://youtube.com/physics', true FROM public.subjects WHERE code = 'science';

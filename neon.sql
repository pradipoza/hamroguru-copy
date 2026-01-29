--
-- PostgreSQL database dump
--

\restrict U8wzZmDSf1eUbpyOGzvENgpe1da9fdERQ34voSdG75c44GZfZMb1lsUfcZoYCz5

-- Dumped from database version 17.7 (bdd1736)
-- Dumped by pg_dump version 18.1

-- Started on 2026-01-29 23:19:34

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 7 (class 2615 OID 24576)
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA drizzle;


--
-- TOC entry 2 (class 3079 OID 32768)
-- Name: vector; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;


--
-- TOC entry 3955 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION vector; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION vector IS 'vector data type and ivfflat and hnsw access methods';


--
-- TOC entry 992 (class 1247 OID 24587)
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'student',
    'teacher',
    'admin'
);


--
-- TOC entry 995 (class 1247 OID 24594)
-- Name: feedback_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.feedback_type AS ENUM (
    'understood',
    'still_confused',
    'not_addressed'
);


--
-- TOC entry 998 (class 1247 OID 24602)
-- Name: homework_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.homework_status AS ENUM (
    'pending',
    'submitted',
    'checked',
    'reviewed',
    'late',
    'missed'
);


--
-- TOC entry 1001 (class 1247 OID 24616)
-- Name: lesson_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.lesson_status AS ENUM (
    'upcoming',
    'completed',
    'missed'
);


--
-- TOC entry 1004 (class 1247 OID 24624)
-- Name: note_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.note_status AS ENUM (
    'pending',
    'completed',
    'verified'
);


--
-- TOC entry 1007 (class 1247 OID 24632)
-- Name: query_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.query_status AS ENUM (
    'pending',
    'addressed',
    'not_addressed'
);


--
-- TOC entry 1010 (class 1247 OID 24640)
-- Name: test_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.test_status AS ENUM (
    'upcoming',
    'available',
    'completed'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 24578)
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: -
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


--
-- TOC entry 219 (class 1259 OID 24577)
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: -
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3956 (class 0 OID 0)
-- Dependencies: 219
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: -
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- TOC entry 221 (class 1259 OID 24647)
-- Name: ai_tutor_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_tutor_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    student_id uuid NOT NULL,
    subject_id uuid NOT NULL,
    messages jsonb[] DEFAULT '{}'::jsonb[],
    session_summary text,
    topics_discussed text[],
    understanding_level jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    ended_at timestamp with time zone
);


--
-- TOC entry 246 (class 1259 OID 40961)
-- Name: chat_memory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_memory (
    id integer NOT NULL,
    session_id character varying(255) NOT NULL,
    message jsonb NOT NULL
);


--
-- TOC entry 245 (class 1259 OID 40960)
-- Name: chat_memory_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chat_memory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3957 (class 0 OID 0)
-- Dependencies: 245
-- Name: chat_memory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chat_memory_id_seq OWNED BY public.chat_memory.id;


--
-- TOC entry 222 (class 1259 OID 24657)
-- Name: classes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.classes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    school_id uuid,
    grade integer NOT NULL,
    section text DEFAULT 'A'::text NOT NULL,
    academic_year text DEFAULT '2024'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 223 (class 1259 OID 24671)
-- Name: daily_doses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.daily_doses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    teacher_id uuid NOT NULL,
    subject_id uuid NOT NULL,
    date date DEFAULT now() NOT NULL,
    title text NOT NULL,
    description text,
    content text,
    topics text[],
    estimated_time integer DEFAULT 15,
    source text,
    completed boolean DEFAULT false,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 224 (class 1259 OID 24683)
-- Name: homework_assignments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.homework_assignments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    class_id uuid NOT NULL,
    subject_id uuid NOT NULL,
    teacher_id uuid,
    title text NOT NULL,
    description text,
    chapter text,
    due_date timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 225 (class 1259 OID 24693)
-- Name: homework_submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.homework_submissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    assignment_id uuid NOT NULL,
    student_id uuid NOT NULL,
    submitted_at timestamp with time zone DEFAULT now(),
    images text[],
    status public.homework_status DEFAULT 'pending'::public.homework_status NOT NULL,
    ai_feedback jsonb,
    score integer,
    teacher_feedback text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 226 (class 1259 OID 24707)
-- Name: lesson_plans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lesson_plans (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    teacher_id uuid NOT NULL,
    class_id uuid NOT NULL,
    subject_id uuid NOT NULL,
    date date NOT NULL,
    topics text[],
    student_queries jsonb[],
    weak_areas text[],
    ai_recommendation text,
    status public.lesson_status DEFAULT 'upcoming'::public.lesson_status NOT NULL,
    completed_at timestamp with time zone,
    feedback_collected boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 227 (class 1259 OID 24719)
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    full_name text NOT NULL,
    avatar_url text,
    phone text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 228 (class 1259 OID 24728)
-- Name: resources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resources (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    subject_id uuid NOT NULL,
    chapter text,
    title text NOT NULL,
    type text NOT NULL,
    url text,
    is_bookmarked boolean DEFAULT false,
    recommended boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 229 (class 1259 OID 24739)
-- Name: schools; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schools (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    address text,
    type text DEFAULT 'government'::text,
    contact_phone text,
    contact_email text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 230 (class 1259 OID 24750)
-- Name: student_learning_insights; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_learning_insights (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    student_id uuid NOT NULL,
    subject_id uuid NOT NULL,
    strengths text[],
    weaknesses text[],
    recommended_topics text[],
    progress_trend text,
    last_updated timestamp with time zone DEFAULT now()
);


--
-- TOC entry 231 (class 1259 OID 24761)
-- Name: student_notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_notes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    student_id uuid NOT NULL,
    subject_id uuid NOT NULL,
    chapter text NOT NULL,
    topic text NOT NULL,
    content text,
    images text[],
    status public.note_status DEFAULT 'pending'::public.note_status NOT NULL,
    verified_by uuid,
    verified_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 232 (class 1259 OID 24772)
-- Name: student_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    class_id uuid,
    roll_number integer,
    learning_style text,
    goals text[],
    interests text[],
    parent_contact text,
    address text,
    streak_days integer DEFAULT 0,
    total_points integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    learning_profile jsonb
);


--
-- TOC entry 233 (class 1259 OID 24786)
-- Name: student_queries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_queries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    student_id uuid NOT NULL,
    teacher_id uuid,
    subject_id uuid NOT NULL,
    query_text text NOT NULL,
    topic text,
    source text DEFAULT 'ai_tutor'::text,
    status public.query_status DEFAULT 'pending'::public.query_status NOT NULL,
    asked_at timestamp with time zone DEFAULT now(),
    addressed_at timestamp with time zone,
    student_feedback public.feedback_type,
    added_to_portfolio boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 244 (class 1259 OID 33096)
-- Name: subject_textbook_embeddings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subject_textbook_embeddings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    subject_id uuid NOT NULL,
    chapter text,
    topic text,
    chunk_index integer NOT NULL,
    content text NOT NULL,
    embedding public.vector(1536) NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 234 (class 1259 OID 24799)
-- Name: subjects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subjects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    name_nepali text,
    code text NOT NULL,
    grade_level integer,
    description text,
    icon text DEFAULT 'book'::text,
    color text DEFAULT 'blue'::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 235 (class 1259 OID 24812)
-- Name: teacher_assessments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.teacher_assessments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    teacher_id uuid NOT NULL,
    subject_id uuid NOT NULL,
    title text NOT NULL,
    total_questions integer DEFAULT 10,
    duration integer DEFAULT 30,
    scheduled_date timestamp with time zone,
    completed_at timestamp with time zone,
    score integer,
    status public.test_status DEFAULT 'upcoming'::public.test_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 236 (class 1259 OID 24824)
-- Name: teacher_class_assignments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.teacher_class_assignments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    teacher_id uuid NOT NULL,
    class_id uuid NOT NULL,
    subject_id uuid NOT NULL,
    academic_year text DEFAULT '2024'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 237 (class 1259 OID 24836)
-- Name: teacher_portfolio; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.teacher_portfolio (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    teacher_id uuid NOT NULL,
    metric_type text NOT NULL,
    value numeric(10,2),
    date date DEFAULT now() NOT NULL,
    details jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 238 (class 1259 OID 24846)
-- Name: teacher_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.teacher_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    school_id uuid,
    employee_id text,
    qualification text,
    subjects_taught text[],
    years_experience integer DEFAULT 0,
    join_date date,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 239 (class 1259 OID 24859)
-- Name: test_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.test_results (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    test_id uuid NOT NULL,
    student_id uuid NOT NULL,
    score integer,
    percentage numeric(5,2),
    grade text,
    topic_scores jsonb,
    weak_areas text[],
    completed_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 240 (class 1259 OID 24870)
-- Name: tests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    class_id uuid NOT NULL,
    subject_id uuid NOT NULL,
    teacher_id uuid,
    title text NOT NULL,
    chapter text,
    type text DEFAULT 'unit'::text,
    total_questions integer DEFAULT 10,
    total_marks integer DEFAULT 100,
    duration integer DEFAULT 60,
    scheduled_date timestamp with time zone,
    status public.test_status DEFAULT 'upcoming'::public.test_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 241 (class 1259 OID 24884)
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role DEFAULT 'student'::public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 242 (class 1259 OID 24894)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    password text NOT NULL
);


--
-- TOC entry 243 (class 1259 OID 24904)
-- Name: webhook_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.webhook_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    webhook_type text NOT NULL,
    payload jsonb,
    response jsonb,
    status text DEFAULT 'pending'::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 3571 (class 2604 OID 24581)
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: -
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- TOC entry 3662 (class 2604 OID 40964)
-- Name: chat_memory id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_memory ALTER COLUMN id SET DEFAULT nextval('public.chat_memory_id_seq'::regclass);


--
-- TOC entry 3923 (class 0 OID 24578)
-- Dependencies: 220
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: -
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
1	5c3e400964a75fe77cd177827367a259bb4e1db8c9eaeb923859340dd796b0a6	1769489606701
2	b7d1eafbe476447e9969a7fc46c3c2a535b44e441a9e7805d94554084bafb0e4	1769523677396
3	1447906078bc54afdd99b6d577ca6056592939af89800762f748f0fcefa85008	1769677764212
\.


--
-- TOC entry 3924 (class 0 OID 24647)
-- Dependencies: 221
-- Data for Name: ai_tutor_sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ai_tutor_sessions (id, student_id, subject_id, messages, session_summary, topics_discussed, understanding_level, created_at, ended_at) FROM stdin;
02f04faf-61c9-45d4-bd8e-ed8807911b87	85079b8e-4704-49b1-84ed-2d3c501654ee	4f254b63-c125-47b9-abb0-3066aca8adf1	{"{\\"role\\": \\"user\\", \\"content\\": \\"hey\\"}","{\\"role\\": \\"assistant\\", \\"content\\": \\"This is a mocked AI response. In a real application, this would be generated by an AI model.\\"}"}	\N	\N	\N	2026-01-29 09:39:29.314655+00	\N
\.


--
-- TOC entry 3949 (class 0 OID 40961)
-- Dependencies: 246
-- Data for Name: chat_memory; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chat_memory (id, session_id, message) FROM stdin;
\.


--
-- TOC entry 3925 (class 0 OID 24657)
-- Dependencies: 222
-- Data for Name: classes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.classes (id, school_id, grade, section, academic_year, created_at, updated_at) FROM stdin;
06dff094-078a-4f29-9cd8-bbfbb60e7b96	94d11654-f1c3-4d68-a104-ac1cded8e13f	10	A	2025-2026	2025-11-30 09:15:04.24+00	2025-11-30 09:15:04.24+00
\.


--
-- TOC entry 3926 (class 0 OID 24671)
-- Dependencies: 223
-- Data for Name: daily_doses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.daily_doses (id, teacher_id, subject_id, date, title, description, content, topics, estimated_time, source, completed, completed_at, created_at) FROM stdin;
\.


--
-- TOC entry 3927 (class 0 OID 24683)
-- Dependencies: 224
-- Data for Name: homework_assignments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.homework_assignments (id, class_id, subject_id, teacher_id, title, description, chapter, due_date, created_at, updated_at) FROM stdin;
e5977ac4-cc31-4cd1-afc1-afd0d8f24fb5	06dff094-078a-4f29-9cd8-bbfbb60e7b96	4f254b63-c125-47b9-abb0-3066aca8adf1	ec0eb6d5-25df-4e35-9940-bc34abcd8ed9	Quadratic Equations Practice	Solve Exercise 2.1 and 2.2	Chapter 2	2025-12-12 09:15:04.24+00	2025-12-07 09:15:04.24+00	2025-12-10 09:15:04.24+00
91886b6f-3a4f-4cda-8b87-997f97d8a38e	06dff094-078a-4f29-9cd8-bbfbb60e7b96	4f254b63-c125-47b9-abb0-3066aca8adf1	ec0eb6d5-25df-4e35-9940-bc34abcd8ed9	Linear Equations Review	Mixed word problems	Chapter 1	2025-12-22 09:15:04.24+00	2025-12-17 09:15:04.24+00	2025-12-20 09:15:04.24+00
c8ef462a-599e-4f79-ae51-5d0dc1a870c6	06dff094-078a-4f29-9cd8-bbfbb60e7b96	4f254b63-c125-47b9-abb0-3066aca8adf1	ec0eb6d5-25df-4e35-9940-bc34abcd8ed9	Polynomial Factorization	Factorize expressions 1-12	Chapter 3	2026-02-10 09:15:04.24+00	2026-02-05 09:15:04.24+00	2026-02-08 09:15:04.24+00
eb0cc5fc-fce3-42b5-95c5-416f31d2453a	06dff094-078a-4f29-9cd8-bbfbb60e7b96	933ccbee-242b-44be-b6ab-729d5bd6d691	85d68757-04d1-4213-a3f5-8af479bceb4a	Chemical Reactions Report	Lab observations and conclusions	Chapter 5	2025-12-15 09:15:04.24+00	2025-12-10 09:15:04.24+00	2025-12-13 09:15:04.24+00
d4a5083e-b61e-45ec-ada2-018cceb6a28b	06dff094-078a-4f29-9cd8-bbfbb60e7b96	933ccbee-242b-44be-b6ab-729d5bd6d691	85d68757-04d1-4213-a3f5-8af479bceb4a	Physics Motion Worksheet	Solve numericals 1-15	Chapter 4	2025-12-25 09:15:04.24+00	2025-12-20 09:15:04.24+00	2025-12-23 09:15:04.24+00
c68cba43-759c-4ea3-a462-f906676228be	06dff094-078a-4f29-9cd8-bbfbb60e7b96	933ccbee-242b-44be-b6ab-729d5bd6d691	85d68757-04d1-4213-a3f5-8af479bceb4a	Acids and Bases Notes	Summarize key concepts	Chapter 6	2026-02-05 09:15:04.24+00	2026-01-31 09:15:04.24+00	2026-02-03 09:15:04.24+00
b29506d6-d438-4ea8-ad18-8deca1b35049	06dff094-078a-4f29-9cd8-bbfbb60e7b96	2061036e-3ae3-4a41-8a6e-be022c0c38b5	b9ec8689-5563-4d7d-a5b6-965e3d32b275	Grammar Quiz Prep	Practice tense exercises	Chapter 3	2025-12-18 09:15:04.24+00	2025-12-13 09:15:04.24+00	2025-12-16 09:15:04.24+00
b80aab97-03c3-417c-9d54-2c678f91fd96	06dff094-078a-4f29-9cd8-bbfbb60e7b96	2061036e-3ae3-4a41-8a6e-be022c0c38b5	b9ec8689-5563-4d7d-a5b6-965e3d32b275	Essay: My Village	Write 250 words essay	Chapter 2	2025-12-28 09:15:04.24+00	2025-12-23 09:15:04.24+00	2025-12-26 09:15:04.24+00
92fedffb-a84a-4c32-8a55-00a4117ef49e	06dff094-078a-4f29-9cd8-bbfbb60e7b96	2061036e-3ae3-4a41-8a6e-be022c0c38b5	b9ec8689-5563-4d7d-a5b6-965e3d32b275	Reading Comprehension	Answer questions from Unit 4	Chapter 4	2026-02-12 09:15:04.24+00	2026-02-07 09:15:04.24+00	2026-02-10 09:15:04.24+00
9d5ec54d-18c4-4bec-b53c-c4b8295b40d5	06dff094-078a-4f29-9cd8-bbfbb60e7b96	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	836c6d73-d9ef-44c9-abb0-73c24cd900f2	निबन्ध लेखन	"मेरो देश नेपाल" विषयमा निबन्ध लेख्नुहोस्	एकाइ ४	2025-12-21 09:15:04.24+00	2025-12-16 09:15:04.24+00	2025-12-19 09:15:04.24+00
7230246b-e807-492b-a374-45ce86c47aba	06dff094-078a-4f29-9cd8-bbfbb60e7b96	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	836c6d73-d9ef-44c9-abb0-73c24cd900f2	व्याकरण अभ्यास	कारक सम्बन्धी अभ्यास	एकाइ ३	2025-12-31 09:15:04.24+00	2025-12-26 09:15:04.24+00	2025-12-29 09:15:04.24+00
311d76f2-75c3-4158-8f73-1b146e86716e	06dff094-078a-4f29-9cd8-bbfbb60e7b96	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	836c6d73-d9ef-44c9-abb0-73c24cd900f2	कविता विश्लेषण	पाठ ६ को कविता विश्लेषण	एकाइ ६	2026-02-10 09:15:04.24+00	2026-02-05 09:15:04.24+00	2026-02-08 09:15:04.24+00
dd3c8e3b-fd7e-4bad-a421-f5c38d23457e	06dff094-078a-4f29-9cd8-bbfbb60e7b96	fe69fe37-af8d-4db5-be75-5260099a06bc	7fd08be2-a61e-4a2a-905c-b2fc005155c5	Constitution Summary	Summarize key articles	Chapter 6	2025-12-24 09:15:04.24+00	2025-12-19 09:15:04.24+00	2025-12-22 09:15:04.24+00
7653bb90-1050-459b-bd5c-63b543ee8b85	06dff094-078a-4f29-9cd8-bbfbb60e7b96	fe69fe37-af8d-4db5-be75-5260099a06bc	7fd08be2-a61e-4a2a-905c-b2fc005155c5	Geography Map Work	Label provinces and rivers	Chapter 4	2026-01-03 09:15:04.24+00	2025-12-29 09:15:04.24+00	2026-01-01 09:15:04.24+00
f69317f0-b80d-4f17-86eb-197d33698ffc	06dff094-078a-4f29-9cd8-bbfbb60e7b96	fe69fe37-af8d-4db5-be75-5260099a06bc	7fd08be2-a61e-4a2a-905c-b2fc005155c5	Civic Duties	Short notes with examples	Chapter 5	2026-02-10 09:15:04.24+00	2026-02-05 09:15:04.24+00	2026-02-08 09:15:04.24+00
53da4d4d-6137-4bb3-8ee5-63e27e969f0a	06dff094-078a-4f29-9cd8-bbfbb60e7b96	3d83b951-f597-4f18-952b-0040470020bb	ac2ec10f-3a2c-4674-81e1-f72c983de087	HTML Basics	Create a simple webpage	Chapter 3	2025-12-27 09:15:04.24+00	2025-12-22 09:15:04.24+00	2025-12-25 09:15:04.24+00
384992f0-8523-4f19-aa03-93e8ee03a86c	06dff094-078a-4f29-9cd8-bbfbb60e7b96	3d83b951-f597-4f18-952b-0040470020bb	ac2ec10f-3a2c-4674-81e1-f72c983de087	Algorithms Flowchart	Draw flowchart for tasks	Chapter 2	2026-01-06 09:15:04.24+00	2026-01-01 09:15:04.24+00	2026-01-04 09:15:04.24+00
e9b1095f-ccd3-41a5-ad1f-2f998f7298de	06dff094-078a-4f29-9cd8-bbfbb60e7b96	3d83b951-f597-4f18-952b-0040470020bb	ac2ec10f-3a2c-4674-81e1-f72c983de087	Spreadsheet Practice	Create table with formulas	Chapter 1	2026-02-06 09:15:04.24+00	2026-02-01 09:15:04.24+00	2026-02-04 09:15:04.24+00
\.


--
-- TOC entry 3928 (class 0 OID 24693)
-- Dependencies: 225
-- Data for Name: homework_submissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.homework_submissions (id, assignment_id, student_id, submitted_at, images, status, ai_feedback, score, teacher_feedback, created_at, updated_at) FROM stdin;
5aceff50-d9ca-424f-8a64-9fed14648f13	e5977ac4-cc31-4cd1-afc1-afd0d8f24fb5	cdacd5ec-aa0b-4a66-8f17-0f767466513a	2025-12-12 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-12 09:15:04.24+00	2025-12-12 09:15:04.24+00
825a2d6e-fe4a-4122-ad27-acd2b0fcd68e	e5977ac4-cc31-4cd1-afc1-afd0d8f24fb5	85079b8e-4704-49b1-84ed-2d3c501654ee	2025-12-11 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-12 09:15:04.24+00	2025-12-12 09:15:04.24+00
0c0d7d8d-2be2-41e5-9873-073ad2c4eddc	e5977ac4-cc31-4cd1-afc1-afd0d8f24fb5	67d4f333-220d-4a64-bcd2-8dc53a56624c	2025-12-15 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-12 09:15:04.24+00	2025-12-12 09:15:04.24+00
dac86e3a-2139-46c6-b053-8cb8f525fc4c	e5977ac4-cc31-4cd1-afc1-afd0d8f24fb5	345bb275-556d-4960-b7de-28922983a7b2	2025-12-11 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-12 09:15:04.24+00	2025-12-12 09:15:04.24+00
9953ecb4-2423-4f13-a773-4c6a6cda79cf	e5977ac4-cc31-4cd1-afc1-afd0d8f24fb5	355120e6-b04a-46f7-876a-b5d7aab3bde0	2025-12-12 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	10	\N	2025-12-12 09:15:04.24+00	2025-12-12 09:15:04.24+00
fdd0d3ed-3d2b-49d5-a3d0-797a0f007484	e5977ac4-cc31-4cd1-afc1-afd0d8f24fb5	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	2025-12-10 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-12 09:15:04.24+00	2025-12-12 09:15:04.24+00
d390fc90-b7c2-4048-83fb-87fdf5335bec	e5977ac4-cc31-4cd1-afc1-afd0d8f24fb5	c18f6551-43e9-4a77-a52e-954d93cee377	2025-12-12 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-12 09:15:04.24+00	2025-12-12 09:15:04.24+00
d8ae67c3-2dd9-4dd5-a4ff-35ecec8dd1f6	e5977ac4-cc31-4cd1-afc1-afd0d8f24fb5	d7e84df8-3a50-4db2-96a7-f478ff5f9764	2025-12-12 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-12 09:15:04.24+00	2025-12-12 09:15:04.24+00
e59229bf-c6ee-4de2-8def-0c1c90f2102f	e5977ac4-cc31-4cd1-afc1-afd0d8f24fb5	dde039c1-6339-4f2b-91fd-54a185c68b52	2025-12-11 09:15:04.24+00	\N	checked	\N	6	\N	2025-12-12 09:15:04.24+00	2025-12-12 09:15:04.24+00
ea0ab3f1-116f-462f-85ea-baec83911167	e5977ac4-cc31-4cd1-afc1-afd0d8f24fb5	e0f448c8-7d42-4d39-bbcd-de58daff9420	2025-12-12 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-12 09:15:04.24+00	2025-12-12 09:15:04.24+00
5e2a7b26-f660-47cb-ad4d-973b454012d7	e5977ac4-cc31-4cd1-afc1-afd0d8f24fb5	97dfe15c-dcba-496a-9e58-2720c211d00a	2025-12-12 09:15:04.24+00	\N	submitted	\N	7	\N	2025-12-12 09:15:04.24+00	2025-12-12 09:15:04.24+00
7837adab-8587-442e-bd85-f5a9eef4f535	e5977ac4-cc31-4cd1-afc1-afd0d8f24fb5	7b46e55e-46b4-4cfd-8809-b6e205a6e567	2025-12-12 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-12 09:15:04.24+00	2025-12-12 09:15:04.24+00
c55300f9-9fa8-44d6-ac46-95edd42c70ac	e5977ac4-cc31-4cd1-afc1-afd0d8f24fb5	60277f16-d457-4dc1-958d-a312a8d9471b	2025-12-11 09:15:04.24+00	\N	checked	\N	7	\N	2025-12-12 09:15:04.24+00	2025-12-12 09:15:04.24+00
ff7da885-d595-4f2f-84aa-b2b124ab41ba	e5977ac4-cc31-4cd1-afc1-afd0d8f24fb5	772182f8-2921-4fe3-a427-8c86cca2f2db	2025-12-12 09:15:04.24+00	\N	checked	\N	7	\N	2025-12-12 09:15:04.24+00	2025-12-12 09:15:04.24+00
6d1a923d-afc4-44ea-af9f-58aac6b34350	e5977ac4-cc31-4cd1-afc1-afd0d8f24fb5	9f6c81bf-ea4e-402f-96a1-968323555263	2025-12-10 09:15:04.24+00	\N	checked	\N	6	\N	2025-12-12 09:15:04.24+00	2025-12-12 09:15:04.24+00
b76a5a74-b806-4421-b798-a78443bd6981	e5977ac4-cc31-4cd1-afc1-afd0d8f24fb5	5835a0de-c500-4ad7-b0e2-76aa107db95c	2025-12-10 09:15:04.24+00	\N	checked	\N	6	\N	2025-12-12 09:15:04.24+00	2025-12-12 09:15:04.24+00
c6a31b1e-d5b3-4566-8931-6b132c4d8d51	e5977ac4-cc31-4cd1-afc1-afd0d8f24fb5	15a117ff-1cb4-49cf-8fd5-845f9061f160	2025-12-10 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-12 09:15:04.24+00	2025-12-12 09:15:04.24+00
799e1357-9460-464a-9d35-acb863d3f92c	e5977ac4-cc31-4cd1-afc1-afd0d8f24fb5	e0633026-2d69-4e2f-9731-dc6e05038f24	2025-12-10 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-12 09:15:04.24+00	2025-12-12 09:15:04.24+00
e81131a9-9b4b-4de8-90ac-feface7d0013	e5977ac4-cc31-4cd1-afc1-afd0d8f24fb5	63e27c91-167e-44c0-b455-ca85896b666c	2025-12-12 09:15:04.24+00	\N	submitted	\N	7	\N	2025-12-12 09:15:04.24+00	2025-12-12 09:15:04.24+00
b06bf17b-97fb-46b1-a5d4-b7bf183f5486	e5977ac4-cc31-4cd1-afc1-afd0d8f24fb5	4c7a3cbd-447c-4cbc-918d-8e923ce57b80	\N	\N	missed	\N	\N	\N	2025-12-12 09:15:04.24+00	2025-12-12 09:15:04.24+00
31f027ad-a18b-4ce0-93c2-51447b8356b2	e5977ac4-cc31-4cd1-afc1-afd0d8f24fb5	503b5c9c-042c-4813-9898-63b129515ad7	2025-12-11 09:15:04.24+00	\N	submitted	\N	3	Needs more practice on key steps.	2025-12-12 09:15:04.24+00	2025-12-12 09:15:04.24+00
17ccacf2-9c34-4ce1-b1cf-8eb42a2b61d0	e5977ac4-cc31-4cd1-afc1-afd0d8f24fb5	acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	2025-12-11 09:15:04.24+00	\N	submitted	\N	3	Needs more practice on key steps.	2025-12-12 09:15:04.24+00	2025-12-12 09:15:04.24+00
6a8bb7e8-3d62-4d5c-88d5-b46bf29d860a	e5977ac4-cc31-4cd1-afc1-afd0d8f24fb5	2286be2d-ff3b-4c8e-8c16-0b4bc6bebdc7	2025-12-12 09:15:04.24+00	\N	checked	\N	3	Needs more practice on key steps.	2025-12-12 09:15:04.24+00	2025-12-12 09:15:04.24+00
5c9d16f7-f04f-46ae-b133-0952524edcf3	e5977ac4-cc31-4cd1-afc1-afd0d8f24fb5	60498abe-fb45-4fce-b715-796c6ad2a7b1	2025-12-12 09:15:04.24+00	\N	checked	\N	4	Needs more practice on key steps.	2025-12-12 09:15:04.24+00	2025-12-12 09:15:04.24+00
7aeff456-572a-4fac-b010-2478cf02a2eb	e5977ac4-cc31-4cd1-afc1-afd0d8f24fb5	cecbea1b-e71b-4995-97cc-6254e7815265	2025-12-11 09:15:04.24+00	\N	checked	\N	6	\N	2025-12-12 09:15:04.24+00	2025-12-12 09:15:04.24+00
5068148a-72e8-4d42-ba07-0bd39301361f	91886b6f-3a4f-4cda-8b87-997f97d8a38e	cdacd5ec-aa0b-4a66-8f17-0f767466513a	2025-12-22 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	10	\N	2025-12-22 09:15:04.24+00	2025-12-22 09:15:04.24+00
d8e07c86-c91b-4714-9b0b-08f6b251d0a4	91886b6f-3a4f-4cda-8b87-997f97d8a38e	85079b8e-4704-49b1-84ed-2d3c501654ee	2025-12-22 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-22 09:15:04.24+00	2025-12-22 09:15:04.24+00
e3ce4bbc-9503-4d4a-8292-2d8e7ce0d484	91886b6f-3a4f-4cda-8b87-997f97d8a38e	67d4f333-220d-4a64-bcd2-8dc53a56624c	2025-12-22 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-22 09:15:04.24+00	2025-12-22 09:15:04.24+00
e457157f-8924-4bf6-9d49-59cb124d35ad	91886b6f-3a4f-4cda-8b87-997f97d8a38e	345bb275-556d-4960-b7de-28922983a7b2	2025-12-21 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-22 09:15:04.24+00	2025-12-22 09:15:04.24+00
160adefb-21d4-4b4b-a40c-8ef7c12cca15	91886b6f-3a4f-4cda-8b87-997f97d8a38e	355120e6-b04a-46f7-876a-b5d7aab3bde0	2025-12-20 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-22 09:15:04.24+00	2025-12-22 09:15:04.24+00
faa4fdd8-e883-4478-8c48-58c115a733b7	91886b6f-3a4f-4cda-8b87-997f97d8a38e	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	2025-12-20 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-22 09:15:04.24+00	2025-12-22 09:15:04.24+00
0a7dba65-26d0-46b0-afea-1b4bf066b2a0	91886b6f-3a4f-4cda-8b87-997f97d8a38e	c18f6551-43e9-4a77-a52e-954d93cee377	\N	\N	missed	\N	\N	\N	2025-12-22 09:15:04.24+00	2025-12-22 09:15:04.24+00
1ca1776d-afd0-429c-8f57-de594dadf338	91886b6f-3a4f-4cda-8b87-997f97d8a38e	d7e84df8-3a50-4db2-96a7-f478ff5f9764	2025-12-22 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-22 09:15:04.24+00	2025-12-22 09:15:04.24+00
d0e432c6-8fdd-4e0a-af30-8722e91f0d79	91886b6f-3a4f-4cda-8b87-997f97d8a38e	b1965024-9f05-4ab8-a89c-9169ec08a541	2025-12-22 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-22 09:15:04.24+00	2025-12-22 09:15:04.24+00
b5a00f0a-ac7b-40f6-ae76-579e2daf7fb8	91886b6f-3a4f-4cda-8b87-997f97d8a38e	dde039c1-6339-4f2b-91fd-54a185c68b52	2025-12-22 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-22 09:15:04.24+00	2025-12-22 09:15:04.24+00
09b11bd8-634f-473e-b8ba-5bc64165eca8	91886b6f-3a4f-4cda-8b87-997f97d8a38e	e700842a-602b-4ecb-8df6-96e43d98e00e	2025-12-21 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-22 09:15:04.24+00	2025-12-22 09:15:04.24+00
8598e6a8-54c7-42b9-b228-0d5bb29515b1	91886b6f-3a4f-4cda-8b87-997f97d8a38e	e0f448c8-7d42-4d39-bbcd-de58daff9420	2025-12-21 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-22 09:15:04.24+00	2025-12-22 09:15:04.24+00
619cd2e2-4779-4c23-b50a-5d82fbf379ea	91886b6f-3a4f-4cda-8b87-997f97d8a38e	97dfe15c-dcba-496a-9e58-2720c211d00a	\N	\N	missed	\N	\N	\N	2025-12-22 09:15:04.24+00	2025-12-22 09:15:04.24+00
b4634f9e-5b67-442b-a049-54a883157fd3	91886b6f-3a4f-4cda-8b87-997f97d8a38e	7b46e55e-46b4-4cfd-8809-b6e205a6e567	2025-12-21 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-22 09:15:04.24+00	2025-12-22 09:15:04.24+00
574150a3-90c2-4caf-b1fd-a2e872dc6bb4	91886b6f-3a4f-4cda-8b87-997f97d8a38e	60277f16-d457-4dc1-958d-a312a8d9471b	2025-12-20 09:15:04.24+00	\N	checked	\N	7	\N	2025-12-22 09:15:04.24+00	2025-12-22 09:15:04.24+00
88015487-f442-452c-ad4b-b191f7dd471d	91886b6f-3a4f-4cda-8b87-997f97d8a38e	9f6c81bf-ea4e-402f-96a1-968323555263	\N	\N	missed	\N	\N	\N	2025-12-22 09:15:04.24+00	2025-12-22 09:15:04.24+00
85f5a479-8563-4fb9-8434-fabb210e3d54	91886b6f-3a4f-4cda-8b87-997f97d8a38e	5835a0de-c500-4ad7-b0e2-76aa107db95c	2025-12-21 09:15:04.24+00	\N	checked	\N	7	\N	2025-12-22 09:15:04.24+00	2025-12-22 09:15:04.24+00
5262b39f-8adf-4272-a97e-a4d29094103f	91886b6f-3a4f-4cda-8b87-997f97d8a38e	e0633026-2d69-4e2f-9731-dc6e05038f24	2025-12-22 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-22 09:15:04.24+00	2025-12-22 09:15:04.24+00
5f60a6d6-0036-4b3f-a188-85976629ba52	91886b6f-3a4f-4cda-8b87-997f97d8a38e	63e27c91-167e-44c0-b455-ca85896b666c	2025-12-20 09:15:04.24+00	\N	checked	\N	4	Needs more practice on key steps.	2025-12-22 09:15:04.24+00	2025-12-22 09:15:04.24+00
735ba42d-6478-4ea0-9f4d-731c55ad1461	91886b6f-3a4f-4cda-8b87-997f97d8a38e	4c7a3cbd-447c-4cbc-918d-8e923ce57b80	2025-12-23 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-22 09:15:04.24+00	2025-12-22 09:15:04.24+00
dd233422-62ab-4d91-97f3-2847fc215636	91886b6f-3a4f-4cda-8b87-997f97d8a38e	503b5c9c-042c-4813-9898-63b129515ad7	2025-12-24 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-22 09:15:04.24+00	2025-12-22 09:15:04.24+00
dfe7ff91-ac5d-4548-84a1-b07bf5f35209	91886b6f-3a4f-4cda-8b87-997f97d8a38e	a6de668b-ecfa-4842-97a5-3cc27b34e1f6	2025-12-23 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-22 09:15:04.24+00	2025-12-22 09:15:04.24+00
bd5669e4-d1ef-4952-b21d-07a75925475e	91886b6f-3a4f-4cda-8b87-997f97d8a38e	b470a0a0-fa44-468e-8b5e-102d68c08ed4	2025-12-25 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-22 09:15:04.24+00	2025-12-22 09:15:04.24+00
5d13216e-f58b-44b6-9be5-4c264f0bf0d7	91886b6f-3a4f-4cda-8b87-997f97d8a38e	acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	2025-12-21 09:15:04.24+00	\N	checked	\N	5	Needs more practice on key steps.	2025-12-22 09:15:04.24+00	2025-12-22 09:15:04.24+00
5f5dc116-a78a-46e1-82e6-2eb547b90d22	91886b6f-3a4f-4cda-8b87-997f97d8a38e	cecbea1b-e71b-4995-97cc-6254e7815265	2025-12-21 09:15:04.24+00	\N	submitted	\N	5	Needs more practice on key steps.	2025-12-22 09:15:04.24+00	2025-12-22 09:15:04.24+00
221b34a7-c382-4c59-881f-66b30eb700f1	c8ef462a-599e-4f79-ae51-5d0dc1a870c6	cdacd5ec-aa0b-4a66-8f17-0f767466513a	2026-02-09 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	10	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
451a2572-c5ec-4d19-8ebd-7cff585067e9	c8ef462a-599e-4f79-ae51-5d0dc1a870c6	85079b8e-4704-49b1-84ed-2d3c501654ee	2026-02-09 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
1c9cdf8c-3b1d-4eac-b8a3-aebf43e7c057	c8ef462a-599e-4f79-ae51-5d0dc1a870c6	67d4f333-220d-4a64-bcd2-8dc53a56624c	2026-02-08 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
f541858d-c597-413a-84a3-f9a24a7a853c	c8ef462a-599e-4f79-ae51-5d0dc1a870c6	345bb275-556d-4960-b7de-28922983a7b2	2026-02-08 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
f28aeb93-090d-4c57-975c-de499f0d1e83	c8ef462a-599e-4f79-ae51-5d0dc1a870c6	355120e6-b04a-46f7-876a-b5d7aab3bde0	2026-02-09 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
795927c5-7788-4c52-b8af-db106710ade8	c8ef462a-599e-4f79-ae51-5d0dc1a870c6	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	2026-02-08 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
8324d729-497f-49e8-9e9f-6b7edd4e56ee	c8ef462a-599e-4f79-ae51-5d0dc1a870c6	c18f6551-43e9-4a77-a52e-954d93cee377	2026-02-09 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
63743035-70d1-40b0-bff1-5d12f644f7f6	c8ef462a-599e-4f79-ae51-5d0dc1a870c6	d7e84df8-3a50-4db2-96a7-f478ff5f9764	2026-02-08 09:15:04.24+00	\N	submitted	\N	7	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
6d979beb-861c-416f-be7d-36d50dc3348a	c8ef462a-599e-4f79-ae51-5d0dc1a870c6	dde039c1-6339-4f2b-91fd-54a185c68b52	2026-02-09 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
e01e245f-4a3e-4372-993d-2d40550371c6	c8ef462a-599e-4f79-ae51-5d0dc1a870c6	e700842a-602b-4ecb-8df6-96e43d98e00e	2026-02-10 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
a50311c6-4524-4047-a721-ecf51d792e25	c8ef462a-599e-4f79-ae51-5d0dc1a870c6	e0f448c8-7d42-4d39-bbcd-de58daff9420	2026-02-09 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
b5da1172-b086-48e7-b88e-6cca99ccd2ba	c8ef462a-599e-4f79-ae51-5d0dc1a870c6	97dfe15c-dcba-496a-9e58-2720c211d00a	2026-02-10 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
9c636daf-38ed-4393-bd4c-79090b8a3cb2	c8ef462a-599e-4f79-ae51-5d0dc1a870c6	7b46e55e-46b4-4cfd-8809-b6e205a6e567	2026-02-10 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
33eb1f6f-fff7-4a30-9804-19095a725366	c8ef462a-599e-4f79-ae51-5d0dc1a870c6	60277f16-d457-4dc1-958d-a312a8d9471b	2026-02-09 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
cd76f949-0178-4525-8e05-b3881ed6558e	c8ef462a-599e-4f79-ae51-5d0dc1a870c6	772182f8-2921-4fe3-a427-8c86cca2f2db	2026-02-08 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
500635a2-37dc-41bb-802f-7f81191b50ed	c8ef462a-599e-4f79-ae51-5d0dc1a870c6	9f6c81bf-ea4e-402f-96a1-968323555263	2026-02-08 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
fb7148f5-b905-47d4-9e72-264514f52708	c8ef462a-599e-4f79-ae51-5d0dc1a870c6	5835a0de-c500-4ad7-b0e2-76aa107db95c	2026-02-08 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
1be1b5c6-e45c-47f5-9b6d-60c1ec148b47	c8ef462a-599e-4f79-ae51-5d0dc1a870c6	15a117ff-1cb4-49cf-8fd5-845f9061f160	2026-02-10 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
90018f28-451d-44a4-98a1-72d514ce7777	c8ef462a-599e-4f79-ae51-5d0dc1a870c6	e0633026-2d69-4e2f-9731-dc6e05038f24	2026-02-08 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
3d357cf3-7ed1-45c2-a6b4-fa7704fd35ec	c8ef462a-599e-4f79-ae51-5d0dc1a870c6	63e27c91-167e-44c0-b455-ca85896b666c	2026-02-08 09:15:04.24+00	\N	submitted	\N	7	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
f95f7e59-87d6-461e-ada1-01ce0067926c	c8ef462a-599e-4f79-ae51-5d0dc1a870c6	f684fc32-dcc9-4b44-bf14-112cd8958129	2026-02-08 09:15:04.24+00	\N	submitted	\N	3	Needs more practice on key steps.	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
c28346cc-ef43-4bbd-b108-4dba89237d62	c8ef462a-599e-4f79-ae51-5d0dc1a870c6	4c7a3cbd-447c-4cbc-918d-8e923ce57b80	2026-02-08 09:15:04.24+00	\N	submitted	\N	3	Needs more practice on key steps.	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
1b650a88-88ff-444a-8a57-a248c37edb04	c8ef462a-599e-4f79-ae51-5d0dc1a870c6	503b5c9c-042c-4813-9898-63b129515ad7	2026-02-08 09:15:04.24+00	\N	submitted	\N	7	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
d27d4821-af29-4cfa-98dc-ed0b06459a18	c8ef462a-599e-4f79-ae51-5d0dc1a870c6	a6de668b-ecfa-4842-97a5-3cc27b34e1f6	2026-02-08 09:15:04.24+00	\N	submitted	\N	3	Needs more practice on key steps.	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
7a1a00bc-af4c-4636-8ac8-63dafe69164c	c8ef462a-599e-4f79-ae51-5d0dc1a870c6	b470a0a0-fa44-468e-8b5e-102d68c08ed4	2026-02-10 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
046d76ad-160e-4f24-b3b4-2beea5e5274c	c8ef462a-599e-4f79-ae51-5d0dc1a870c6	acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	2026-02-10 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
0594fd20-8c4b-43ad-be55-b8043239076c	c8ef462a-599e-4f79-ae51-5d0dc1a870c6	2286be2d-ff3b-4c8e-8c16-0b4bc6bebdc7	2026-02-10 09:15:04.24+00	\N	submitted	\N	3	Needs more practice on key steps.	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
fe1d96a2-81ab-48a0-9b95-a80e7e524499	c8ef462a-599e-4f79-ae51-5d0dc1a870c6	60498abe-fb45-4fce-b715-796c6ad2a7b1	2026-02-08 09:15:04.24+00	\N	submitted	\N	5	Needs more practice on key steps.	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
64083233-2615-4243-a9f1-06427d4828cc	eb0cc5fc-fce3-42b5-95c5-416f31d2453a	cdacd5ec-aa0b-4a66-8f17-0f767466513a	2025-12-13 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	10	\N	2025-12-15 09:15:04.24+00	2025-12-15 09:15:04.24+00
810ecf2e-af9e-444e-82aa-990a76ab50eb	eb0cc5fc-fce3-42b5-95c5-416f31d2453a	85079b8e-4704-49b1-84ed-2d3c501654ee	2025-12-13 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-15 09:15:04.24+00	2025-12-15 09:15:04.24+00
93cb3d71-577e-4cc6-8a95-7fb28e20bcb1	eb0cc5fc-fce3-42b5-95c5-416f31d2453a	67d4f333-220d-4a64-bcd2-8dc53a56624c	2025-12-15 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-15 09:15:04.24+00	2025-12-15 09:15:04.24+00
92910b12-18f3-4c8a-ab97-792d34296a8c	eb0cc5fc-fce3-42b5-95c5-416f31d2453a	345bb275-556d-4960-b7de-28922983a7b2	2025-12-14 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	10	\N	2025-12-15 09:15:04.24+00	2025-12-15 09:15:04.24+00
745f843c-3304-4484-916d-ebd866a80891	eb0cc5fc-fce3-42b5-95c5-416f31d2453a	355120e6-b04a-46f7-876a-b5d7aab3bde0	2025-12-14 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	10	\N	2025-12-15 09:15:04.24+00	2025-12-15 09:15:04.24+00
2c3b2e11-c691-4dcf-a5b4-696e7382e3cb	eb0cc5fc-fce3-42b5-95c5-416f31d2453a	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	2025-12-17 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-15 09:15:04.24+00	2025-12-15 09:15:04.24+00
47a9c452-0163-4c6c-a890-7c2c6c7692c0	eb0cc5fc-fce3-42b5-95c5-416f31d2453a	c18f6551-43e9-4a77-a52e-954d93cee377	2025-12-15 09:15:04.24+00	\N	checked	\N	6	\N	2025-12-15 09:15:04.24+00	2025-12-15 09:15:04.24+00
c7c490e3-8711-4e2f-b0ee-bfb9e99f85e8	eb0cc5fc-fce3-42b5-95c5-416f31d2453a	d7e84df8-3a50-4db2-96a7-f478ff5f9764	\N	\N	missed	\N	\N	\N	2025-12-15 09:15:04.24+00	2025-12-15 09:15:04.24+00
9f442b67-2e9c-4083-9622-426d20291c02	eb0cc5fc-fce3-42b5-95c5-416f31d2453a	b1965024-9f05-4ab8-a89c-9169ec08a541	2025-12-13 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-15 09:15:04.24+00	2025-12-15 09:15:04.24+00
d1f58969-74e5-491e-984c-45ed246e973b	eb0cc5fc-fce3-42b5-95c5-416f31d2453a	dde039c1-6339-4f2b-91fd-54a185c68b52	2025-12-14 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-15 09:15:04.24+00	2025-12-15 09:15:04.24+00
dddbed59-17ea-42e0-a0c3-134c30e0ea27	eb0cc5fc-fce3-42b5-95c5-416f31d2453a	e700842a-602b-4ecb-8df6-96e43d98e00e	2025-12-16 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-15 09:15:04.24+00	2025-12-15 09:15:04.24+00
18bfbc46-e065-44dc-bdbd-68109aeb3307	eb0cc5fc-fce3-42b5-95c5-416f31d2453a	e0f448c8-7d42-4d39-bbcd-de58daff9420	2025-12-13 09:15:04.24+00	\N	submitted	\N	7	\N	2025-12-15 09:15:04.24+00	2025-12-15 09:15:04.24+00
19c7ac4c-0915-4e99-bb92-a6fb51904fb4	eb0cc5fc-fce3-42b5-95c5-416f31d2453a	97dfe15c-dcba-496a-9e58-2720c211d00a	2025-12-13 09:15:04.24+00	\N	checked	\N	6	\N	2025-12-15 09:15:04.24+00	2025-12-15 09:15:04.24+00
7d6354c8-c36c-4799-9f41-fdf32c947083	eb0cc5fc-fce3-42b5-95c5-416f31d2453a	7b46e55e-46b4-4cfd-8809-b6e205a6e567	2025-12-13 09:15:04.24+00	\N	checked	\N	6	\N	2025-12-15 09:15:04.24+00	2025-12-15 09:15:04.24+00
01e5f6b5-b97c-405e-ae3e-b102e1a543c9	eb0cc5fc-fce3-42b5-95c5-416f31d2453a	60277f16-d457-4dc1-958d-a312a8d9471b	2025-12-14 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-15 09:15:04.24+00	2025-12-15 09:15:04.24+00
f6c32f1c-d38b-46e7-b87f-7309ffe8e19a	eb0cc5fc-fce3-42b5-95c5-416f31d2453a	772182f8-2921-4fe3-a427-8c86cca2f2db	2025-12-13 09:15:04.24+00	\N	checked	\N	7	\N	2025-12-15 09:15:04.24+00	2025-12-15 09:15:04.24+00
11954a1e-b51a-44ca-8fad-77231ba98005	eb0cc5fc-fce3-42b5-95c5-416f31d2453a	9f6c81bf-ea4e-402f-96a1-968323555263	2025-12-15 09:15:04.24+00	\N	submitted	\N	6	\N	2025-12-15 09:15:04.24+00	2025-12-15 09:15:04.24+00
432aebd0-05dc-4b9d-bcbb-bd25425af908	eb0cc5fc-fce3-42b5-95c5-416f31d2453a	15a117ff-1cb4-49cf-8fd5-845f9061f160	2025-12-14 09:15:04.24+00	\N	submitted	\N	6	\N	2025-12-15 09:15:04.24+00	2025-12-15 09:15:04.24+00
041ce989-8393-4f82-ba18-27c55629eadd	eb0cc5fc-fce3-42b5-95c5-416f31d2453a	e0633026-2d69-4e2f-9731-dc6e05038f24	2025-12-13 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-15 09:15:04.24+00	2025-12-15 09:15:04.24+00
f375c61c-094b-4d87-90e3-785d2f0b6ddb	eb0cc5fc-fce3-42b5-95c5-416f31d2453a	63e27c91-167e-44c0-b455-ca85896b666c	\N	\N	missed	\N	\N	\N	2025-12-15 09:15:04.24+00	2025-12-15 09:15:04.24+00
58757c2b-c855-4e52-9807-2bcf8cd1394e	eb0cc5fc-fce3-42b5-95c5-416f31d2453a	f684fc32-dcc9-4b44-bf14-112cd8958129	\N	\N	missed	\N	\N	\N	2025-12-15 09:15:04.24+00	2025-12-15 09:15:04.24+00
1d952b0c-c889-4b09-87cf-035b5eb5b3b2	eb0cc5fc-fce3-42b5-95c5-416f31d2453a	4c7a3cbd-447c-4cbc-918d-8e923ce57b80	2025-12-15 09:15:04.24+00	\N	checked	\N	4	Needs more practice on key steps.	2025-12-15 09:15:04.24+00	2025-12-15 09:15:04.24+00
9291d27d-2f56-4364-bc5d-73f27e02204e	eb0cc5fc-fce3-42b5-95c5-416f31d2453a	503b5c9c-042c-4813-9898-63b129515ad7	2025-12-15 09:15:04.24+00	\N	checked	\N	6	\N	2025-12-15 09:15:04.24+00	2025-12-15 09:15:04.24+00
2acbe3a6-6287-4fd2-b8e3-48354e3f5b88	eb0cc5fc-fce3-42b5-95c5-416f31d2453a	a6de668b-ecfa-4842-97a5-3cc27b34e1f6	2025-12-13 09:15:04.24+00	\N	checked	\N	6	\N	2025-12-15 09:15:04.24+00	2025-12-15 09:15:04.24+00
b2505b21-ccd1-4441-8572-0f66a6986db7	eb0cc5fc-fce3-42b5-95c5-416f31d2453a	acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	2025-12-13 09:15:04.24+00	\N	submitted	\N	3	Needs more practice on key steps.	2025-12-15 09:15:04.24+00	2025-12-15 09:15:04.24+00
1a259a36-abe5-421a-beec-d516c9a51e6a	eb0cc5fc-fce3-42b5-95c5-416f31d2453a	2286be2d-ff3b-4c8e-8c16-0b4bc6bebdc7	2025-12-15 09:15:04.24+00	\N	checked	\N	4	Needs more practice on key steps.	2025-12-15 09:15:04.24+00	2025-12-15 09:15:04.24+00
ef2902c8-d029-430b-886d-f9692a960730	eb0cc5fc-fce3-42b5-95c5-416f31d2453a	60498abe-fb45-4fce-b715-796c6ad2a7b1	2025-12-13 09:15:04.24+00	\N	checked	\N	7	\N	2025-12-15 09:15:04.24+00	2025-12-15 09:15:04.24+00
47e3eda3-016e-48cf-88fe-4d28b9da98a8	eb0cc5fc-fce3-42b5-95c5-416f31d2453a	cecbea1b-e71b-4995-97cc-6254e7815265	2025-12-15 09:15:04.24+00	\N	checked	\N	4	Needs more practice on key steps.	2025-12-15 09:15:04.24+00	2025-12-15 09:15:04.24+00
92690fe1-1bcc-4ae2-aadc-c2a378af565a	d4a5083e-b61e-45ec-ada2-018cceb6a28b	cdacd5ec-aa0b-4a66-8f17-0f767466513a	2025-12-24 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-25 09:15:04.24+00	2025-12-25 09:15:04.24+00
1c6f8a58-d6c3-45c8-8b30-a7e79c18f6b3	d4a5083e-b61e-45ec-ada2-018cceb6a28b	85079b8e-4704-49b1-84ed-2d3c501654ee	2025-12-24 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-25 09:15:04.24+00	2025-12-25 09:15:04.24+00
f0820cc6-d5d7-4089-aeda-7b617cfa4177	d4a5083e-b61e-45ec-ada2-018cceb6a28b	67d4f333-220d-4a64-bcd2-8dc53a56624c	2025-12-24 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-25 09:15:04.24+00	2025-12-25 09:15:04.24+00
073a2417-dccb-46e5-a822-fd5cd12e55db	d4a5083e-b61e-45ec-ada2-018cceb6a28b	345bb275-556d-4960-b7de-28922983a7b2	2025-12-23 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	10	\N	2025-12-25 09:15:04.24+00	2025-12-25 09:15:04.24+00
a2bf4cc2-c01d-4bbd-a196-547148f1f010	d4a5083e-b61e-45ec-ada2-018cceb6a28b	355120e6-b04a-46f7-876a-b5d7aab3bde0	2025-12-25 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	10	\N	2025-12-25 09:15:04.24+00	2025-12-25 09:15:04.24+00
2c9b9897-d72d-45e0-94a9-bd229c461830	d4a5083e-b61e-45ec-ada2-018cceb6a28b	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	2025-12-25 09:15:04.24+00	\N	submitted	\N	6	\N	2025-12-25 09:15:04.24+00	2025-12-25 09:15:04.24+00
11a891c5-8838-4fa1-9ee5-e7504a236d64	d4a5083e-b61e-45ec-ada2-018cceb6a28b	d7e84df8-3a50-4db2-96a7-f478ff5f9764	2025-12-23 09:15:04.24+00	\N	checked	\N	6	\N	2025-12-25 09:15:04.24+00	2025-12-25 09:15:04.24+00
518a76af-4abb-4ca2-80c7-7716afdd648d	d4a5083e-b61e-45ec-ada2-018cceb6a28b	b1965024-9f05-4ab8-a89c-9169ec08a541	2025-12-25 09:15:04.24+00	\N	submitted	\N	6	\N	2025-12-25 09:15:04.24+00	2025-12-25 09:15:04.24+00
6fd95c04-d764-4e6a-8550-6c3871b43408	d4a5083e-b61e-45ec-ada2-018cceb6a28b	dde039c1-6339-4f2b-91fd-54a185c68b52	2025-12-25 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-25 09:15:04.24+00	2025-12-25 09:15:04.24+00
bf9d16d3-1344-4700-be5f-20eba20fef4e	d4a5083e-b61e-45ec-ada2-018cceb6a28b	e700842a-602b-4ecb-8df6-96e43d98e00e	2025-12-26 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-25 09:15:04.24+00	2025-12-25 09:15:04.24+00
da79262c-88a5-411c-925b-3d4943f63523	d4a5083e-b61e-45ec-ada2-018cceb6a28b	e0f448c8-7d42-4d39-bbcd-de58daff9420	2025-12-26 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-25 09:15:04.24+00	2025-12-25 09:15:04.24+00
511b2050-993e-4272-9230-526d0e14d638	d4a5083e-b61e-45ec-ada2-018cceb6a28b	7b46e55e-46b4-4cfd-8809-b6e205a6e567	2025-12-23 09:15:04.24+00	\N	checked	\N	7	\N	2025-12-25 09:15:04.24+00	2025-12-25 09:15:04.24+00
8c978747-80a2-4374-aebe-b12bd70b5fe5	d4a5083e-b61e-45ec-ada2-018cceb6a28b	60277f16-d457-4dc1-958d-a312a8d9471b	2025-12-23 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-25 09:15:04.24+00	2025-12-25 09:15:04.24+00
fbeb8bc8-db4a-49b5-9cc6-1bae2afe00cc	d4a5083e-b61e-45ec-ada2-018cceb6a28b	772182f8-2921-4fe3-a427-8c86cca2f2db	2025-12-23 09:15:04.24+00	\N	submitted	\N	7	\N	2025-12-25 09:15:04.24+00	2025-12-25 09:15:04.24+00
d1d42f8a-9916-4e7d-8d4f-1653f3ddfe81	d4a5083e-b61e-45ec-ada2-018cceb6a28b	9f6c81bf-ea4e-402f-96a1-968323555263	\N	\N	missed	\N	\N	\N	2025-12-25 09:15:04.24+00	2025-12-25 09:15:04.24+00
b8a32225-62d4-4e35-be77-e1db82caaff2	d4a5083e-b61e-45ec-ada2-018cceb6a28b	5835a0de-c500-4ad7-b0e2-76aa107db95c	2025-12-24 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-25 09:15:04.24+00	2025-12-25 09:15:04.24+00
8856870b-60b7-4268-89df-2d3157f06564	d4a5083e-b61e-45ec-ada2-018cceb6a28b	15a117ff-1cb4-49cf-8fd5-845f9061f160	2025-12-25 09:15:04.24+00	\N	checked	\N	7	\N	2025-12-25 09:15:04.24+00	2025-12-25 09:15:04.24+00
ce5c80b4-783b-4c11-a47c-706483b5f757	d4a5083e-b61e-45ec-ada2-018cceb6a28b	63e27c91-167e-44c0-b455-ca85896b666c	\N	\N	missed	\N	\N	\N	2025-12-25 09:15:04.24+00	2025-12-25 09:15:04.24+00
c8b7c37b-cdc4-41af-acae-fc33372f3fca	d4a5083e-b61e-45ec-ada2-018cceb6a28b	f684fc32-dcc9-4b44-bf14-112cd8958129	\N	\N	missed	\N	\N	\N	2025-12-25 09:15:04.24+00	2025-12-25 09:15:04.24+00
c0ec80ed-05c5-4aa8-be64-e587ab9925af	d4a5083e-b61e-45ec-ada2-018cceb6a28b	4c7a3cbd-447c-4cbc-918d-8e923ce57b80	\N	\N	missed	\N	\N	\N	2025-12-25 09:15:04.24+00	2025-12-25 09:15:04.24+00
3d2e5853-d40c-4e52-9e82-1d1e836680fb	d4a5083e-b61e-45ec-ada2-018cceb6a28b	503b5c9c-042c-4813-9898-63b129515ad7	2025-12-26 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-25 09:15:04.24+00	2025-12-25 09:15:04.24+00
2c479676-80d8-4b9c-9286-58828436ae74	d4a5083e-b61e-45ec-ada2-018cceb6a28b	a6de668b-ecfa-4842-97a5-3cc27b34e1f6	\N	\N	missed	\N	\N	\N	2025-12-25 09:15:04.24+00	2025-12-25 09:15:04.24+00
4a8cd581-29fe-4365-8bdf-9a2cebacf5e6	d4a5083e-b61e-45ec-ada2-018cceb6a28b	b470a0a0-fa44-468e-8b5e-102d68c08ed4	2025-12-25 09:15:04.24+00	\N	checked	\N	3	Needs more practice on key steps.	2025-12-25 09:15:04.24+00	2025-12-25 09:15:04.24+00
a2b96ae6-dec9-41af-8f01-4a691dc16a35	d4a5083e-b61e-45ec-ada2-018cceb6a28b	acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	2025-12-24 09:15:04.24+00	\N	checked	\N	4	Needs more practice on key steps.	2025-12-25 09:15:04.24+00	2025-12-25 09:15:04.24+00
47455464-d253-4a94-aa96-b64142212404	d4a5083e-b61e-45ec-ada2-018cceb6a28b	60498abe-fb45-4fce-b715-796c6ad2a7b1	2025-12-24 09:15:04.24+00	\N	checked	\N	6	\N	2025-12-25 09:15:04.24+00	2025-12-25 09:15:04.24+00
575376e9-81f4-4216-920e-010c059730e5	d4a5083e-b61e-45ec-ada2-018cceb6a28b	cecbea1b-e71b-4995-97cc-6254e7815265	2025-12-25 09:15:04.24+00	\N	submitted	\N	3	Needs more practice on key steps.	2025-12-25 09:15:04.24+00	2025-12-25 09:15:04.24+00
57fee905-65e2-441b-850c-6e31345bb342	c68cba43-759c-4ea3-a462-f906676228be	cdacd5ec-aa0b-4a66-8f17-0f767466513a	2026-02-04 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2026-02-05 09:15:04.24+00	2026-02-05 09:15:04.24+00
5f53cb97-c3f2-4d25-9d2a-a9d1703bafcf	c68cba43-759c-4ea3-a462-f906676228be	85079b8e-4704-49b1-84ed-2d3c501654ee	2026-02-04 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-05 09:15:04.24+00	2026-02-05 09:15:04.24+00
e9829a2e-f106-4a47-b3db-5e8ef1cc3357	c68cba43-759c-4ea3-a462-f906676228be	67d4f333-220d-4a64-bcd2-8dc53a56624c	2026-02-05 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-05 09:15:04.24+00	2026-02-05 09:15:04.24+00
f0f07018-cf83-4fad-af72-c9b7f57ca55c	c68cba43-759c-4ea3-a462-f906676228be	345bb275-556d-4960-b7de-28922983a7b2	2026-02-04 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2026-02-05 09:15:04.24+00	2026-02-05 09:15:04.24+00
2fb8746d-ac4b-40e8-b488-38f7c1887655	c68cba43-759c-4ea3-a462-f906676228be	355120e6-b04a-46f7-876a-b5d7aab3bde0	2026-02-04 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2026-02-05 09:15:04.24+00	2026-02-05 09:15:04.24+00
e37e1543-a3e7-4cf2-990e-8ffaa5b66106	c68cba43-759c-4ea3-a462-f906676228be	d7e84df8-3a50-4db2-96a7-f478ff5f9764	2026-02-05 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-05 09:15:04.24+00	2026-02-05 09:15:04.24+00
872b4b90-b797-453f-afb1-64f2d0ed89d2	c68cba43-759c-4ea3-a462-f906676228be	b1965024-9f05-4ab8-a89c-9169ec08a541	2026-02-04 09:15:04.24+00	\N	submitted	\N	7	\N	2026-02-05 09:15:04.24+00	2026-02-05 09:15:04.24+00
b12a8466-9f64-4ede-a5f4-28f55655d192	c68cba43-759c-4ea3-a462-f906676228be	dde039c1-6339-4f2b-91fd-54a185c68b52	2026-02-04 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-05 09:15:04.24+00	2026-02-05 09:15:04.24+00
3c1d2ce5-f23a-47b6-ac5f-5653d48c0759	c68cba43-759c-4ea3-a462-f906676228be	e700842a-602b-4ecb-8df6-96e43d98e00e	2026-02-04 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-05 09:15:04.24+00	2026-02-05 09:15:04.24+00
e3532060-a2d9-4a39-aa79-f4bcf84f2e86	c68cba43-759c-4ea3-a462-f906676228be	7b46e55e-46b4-4cfd-8809-b6e205a6e567	2026-02-05 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2026-02-05 09:15:04.24+00	2026-02-05 09:15:04.24+00
9eb61bdb-e5a7-4a0b-aad4-1fdaacad95d0	c68cba43-759c-4ea3-a462-f906676228be	772182f8-2921-4fe3-a427-8c86cca2f2db	2026-02-05 09:15:04.24+00	\N	submitted	\N	7	\N	2026-02-05 09:15:04.24+00	2026-02-05 09:15:04.24+00
9ea8d750-a35a-44f8-b1f5-5e7ef92be3a3	c68cba43-759c-4ea3-a462-f906676228be	9f6c81bf-ea4e-402f-96a1-968323555263	2026-02-05 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-05 09:15:04.24+00	2026-02-05 09:15:04.24+00
5490f78c-bf73-406f-9456-be1104c1be32	c68cba43-759c-4ea3-a462-f906676228be	5835a0de-c500-4ad7-b0e2-76aa107db95c	2026-02-04 09:15:04.24+00	\N	submitted	\N	7	\N	2026-02-05 09:15:04.24+00	2026-02-05 09:15:04.24+00
ac646bc9-ae96-4bee-9c8c-1a6c333d48e1	c68cba43-759c-4ea3-a462-f906676228be	15a117ff-1cb4-49cf-8fd5-845f9061f160	2026-02-04 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-05 09:15:04.24+00	2026-02-05 09:15:04.24+00
8792bcc7-23b4-478b-a219-f005426772df	c68cba43-759c-4ea3-a462-f906676228be	63e27c91-167e-44c0-b455-ca85896b666c	2026-02-04 09:15:04.24+00	\N	submitted	\N	7	\N	2026-02-05 09:15:04.24+00	2026-02-05 09:15:04.24+00
b38ec07c-9d6c-42c7-af16-79c677eb385b	c68cba43-759c-4ea3-a462-f906676228be	f684fc32-dcc9-4b44-bf14-112cd8958129	2026-02-04 09:15:04.24+00	\N	submitted	\N	7	\N	2026-02-05 09:15:04.24+00	2026-02-05 09:15:04.24+00
8a560cb7-3bfe-47c4-880d-dbf6bfcf3d37	c68cba43-759c-4ea3-a462-f906676228be	4c7a3cbd-447c-4cbc-918d-8e923ce57b80	2026-02-03 09:15:04.24+00	\N	submitted	\N	7	\N	2026-02-05 09:15:04.24+00	2026-02-05 09:15:04.24+00
dc550138-53a2-45f4-9cc4-e38524ffdab2	c68cba43-759c-4ea3-a462-f906676228be	503b5c9c-042c-4813-9898-63b129515ad7	2026-02-04 09:15:04.24+00	\N	submitted	\N	7	\N	2026-02-05 09:15:04.24+00	2026-02-05 09:15:04.24+00
ddf02865-4215-47b8-b1a3-35c75b531482	c68cba43-759c-4ea3-a462-f906676228be	a6de668b-ecfa-4842-97a5-3cc27b34e1f6	2026-02-05 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-05 09:15:04.24+00	2026-02-05 09:15:04.24+00
9be91cc5-bbbe-4621-9a6f-93a4b597d537	c68cba43-759c-4ea3-a462-f906676228be	b470a0a0-fa44-468e-8b5e-102d68c08ed4	2026-02-03 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-05 09:15:04.24+00	2026-02-05 09:15:04.24+00
1cd955a2-9517-47fe-82f5-aab0de3d0163	c68cba43-759c-4ea3-a462-f906676228be	acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	2026-02-03 09:15:04.24+00	\N	submitted	\N	5	Needs more practice on key steps.	2026-02-05 09:15:04.24+00	2026-02-05 09:15:04.24+00
89d466e1-ff65-46a6-b1b9-4ef513bd172d	c68cba43-759c-4ea3-a462-f906676228be	60498abe-fb45-4fce-b715-796c6ad2a7b1	2026-02-05 09:15:04.24+00	\N	submitted	\N	4	Needs more practice on key steps.	2026-02-05 09:15:04.24+00	2026-02-05 09:15:04.24+00
563cf12f-f918-468e-a058-e3ba834d9b92	c68cba43-759c-4ea3-a462-f906676228be	cecbea1b-e71b-4995-97cc-6254e7815265	2026-02-04 09:15:04.24+00	\N	submitted	\N	7	\N	2026-02-05 09:15:04.24+00	2026-02-05 09:15:04.24+00
891b5f9f-20e3-4faf-932a-8791e20d51f5	b29506d6-d438-4ea8-ad18-8deca1b35049	cdacd5ec-aa0b-4a66-8f17-0f767466513a	2025-12-18 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	10	\N	2025-12-18 09:15:04.24+00	2025-12-18 09:15:04.24+00
0300ae6d-bdd9-43f6-a4fd-333b09441ca5	b29506d6-d438-4ea8-ad18-8deca1b35049	85079b8e-4704-49b1-84ed-2d3c501654ee	2025-12-16 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-18 09:15:04.24+00	2025-12-18 09:15:04.24+00
45aa1ac0-a333-4c5e-89e1-ce28a77e9d67	b29506d6-d438-4ea8-ad18-8deca1b35049	67d4f333-220d-4a64-bcd2-8dc53a56624c	2025-12-16 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	10	\N	2025-12-18 09:15:04.24+00	2025-12-18 09:15:04.24+00
987598d5-f280-4d93-8c8a-56caacd5e7c6	b29506d6-d438-4ea8-ad18-8deca1b35049	345bb275-556d-4960-b7de-28922983a7b2	2025-12-16 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	10	\N	2025-12-18 09:15:04.24+00	2025-12-18 09:15:04.24+00
55ab9bf3-6c99-48a5-a2a2-ba678e156d0f	b29506d6-d438-4ea8-ad18-8deca1b35049	355120e6-b04a-46f7-876a-b5d7aab3bde0	2025-12-20 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-18 09:15:04.24+00	2025-12-18 09:15:04.24+00
f5c8e665-2055-480b-8406-6c4836e4a6f9	b29506d6-d438-4ea8-ad18-8deca1b35049	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	2025-12-16 09:15:04.24+00	\N	checked	\N	7	\N	2025-12-18 09:15:04.24+00	2025-12-18 09:15:04.24+00
ba65dd5c-20d2-453d-b035-6c7fc8635a69	b29506d6-d438-4ea8-ad18-8deca1b35049	c18f6551-43e9-4a77-a52e-954d93cee377	2025-12-17 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-18 09:15:04.24+00	2025-12-18 09:15:04.24+00
982c4cdd-b113-4a7c-b9d8-ab9101df6597	b29506d6-d438-4ea8-ad18-8deca1b35049	d7e84df8-3a50-4db2-96a7-f478ff5f9764	2025-12-17 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-18 09:15:04.24+00	2025-12-18 09:15:04.24+00
0aab403b-5c93-4b81-8227-2554d6bbf7bd	b29506d6-d438-4ea8-ad18-8deca1b35049	b1965024-9f05-4ab8-a89c-9169ec08a541	2025-12-18 09:15:04.24+00	\N	checked	\N	6	\N	2025-12-18 09:15:04.24+00	2025-12-18 09:15:04.24+00
39ec765b-bb99-4f32-94fd-bce1dfb3f413	b29506d6-d438-4ea8-ad18-8deca1b35049	e700842a-602b-4ecb-8df6-96e43d98e00e	2025-12-18 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-18 09:15:04.24+00	2025-12-18 09:15:04.24+00
b42cdeb2-b75a-44a5-b756-8f6ade00c974	b29506d6-d438-4ea8-ad18-8deca1b35049	97dfe15c-dcba-496a-9e58-2720c211d00a	2025-12-20 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-18 09:15:04.24+00	2025-12-18 09:15:04.24+00
0aa8d225-13dc-459c-8fe9-b52f6b753ad9	b29506d6-d438-4ea8-ad18-8deca1b35049	7b46e55e-46b4-4cfd-8809-b6e205a6e567	2025-12-18 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-18 09:15:04.24+00	2025-12-18 09:15:04.24+00
11426cfe-206c-4dd0-900c-a5bbad74d214	b29506d6-d438-4ea8-ad18-8deca1b35049	60277f16-d457-4dc1-958d-a312a8d9471b	2025-12-20 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-18 09:15:04.24+00	2025-12-18 09:15:04.24+00
1252b016-4f57-411b-bbc4-40294bac7bee	b29506d6-d438-4ea8-ad18-8deca1b35049	772182f8-2921-4fe3-a427-8c86cca2f2db	\N	\N	missed	\N	\N	\N	2025-12-18 09:15:04.24+00	2025-12-18 09:15:04.24+00
f8c65861-c1be-47ee-b27e-ba310d969c8a	b29506d6-d438-4ea8-ad18-8deca1b35049	9f6c81bf-ea4e-402f-96a1-968323555263	2025-12-17 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-18 09:15:04.24+00	2025-12-18 09:15:04.24+00
08426f29-3c94-4c91-a824-994c6c4f7bb9	b29506d6-d438-4ea8-ad18-8deca1b35049	5835a0de-c500-4ad7-b0e2-76aa107db95c	2025-12-17 09:15:04.24+00	\N	submitted	\N	7	\N	2025-12-18 09:15:04.24+00	2025-12-18 09:15:04.24+00
2e337e69-5927-47c0-9c0d-6508f4181c53	b29506d6-d438-4ea8-ad18-8deca1b35049	15a117ff-1cb4-49cf-8fd5-845f9061f160	2025-12-18 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-18 09:15:04.24+00	2025-12-18 09:15:04.24+00
23e3c827-064d-4de8-98a3-b16afbf9e9a1	b29506d6-d438-4ea8-ad18-8deca1b35049	e0633026-2d69-4e2f-9731-dc6e05038f24	2025-12-18 09:15:04.24+00	\N	checked	\N	7	\N	2025-12-18 09:15:04.24+00	2025-12-18 09:15:04.24+00
6e0dc627-2465-4206-bcf5-f9cd752ae455	b29506d6-d438-4ea8-ad18-8deca1b35049	f684fc32-dcc9-4b44-bf14-112cd8958129	\N	\N	missed	\N	\N	\N	2025-12-18 09:15:04.24+00	2025-12-18 09:15:04.24+00
8b6146b3-33f6-4a8a-8a8a-8b0991bf5537	b29506d6-d438-4ea8-ad18-8deca1b35049	503b5c9c-042c-4813-9898-63b129515ad7	\N	\N	missed	\N	\N	\N	2025-12-18 09:15:04.24+00	2025-12-18 09:15:04.24+00
95cce683-6d69-4a94-b48b-606ab1054ba8	b29506d6-d438-4ea8-ad18-8deca1b35049	a6de668b-ecfa-4842-97a5-3cc27b34e1f6	2025-12-16 09:15:04.24+00	\N	submitted	\N	7	\N	2025-12-18 09:15:04.24+00	2025-12-18 09:15:04.24+00
7f410144-cbf0-45ab-b9f8-321a591347f3	b29506d6-d438-4ea8-ad18-8deca1b35049	b470a0a0-fa44-468e-8b5e-102d68c08ed4	2025-12-20 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-18 09:15:04.24+00	2025-12-18 09:15:04.24+00
41f8d73b-1bd9-4bd4-8663-faa129f3ecb1	b29506d6-d438-4ea8-ad18-8deca1b35049	2286be2d-ff3b-4c8e-8c16-0b4bc6bebdc7	2025-12-17 09:15:04.24+00	\N	submitted	\N	5	Needs more practice on key steps.	2025-12-18 09:15:04.24+00	2025-12-18 09:15:04.24+00
3b5e4b42-2acb-4f7a-af4a-d8785d68b3bf	b29506d6-d438-4ea8-ad18-8deca1b35049	cecbea1b-e71b-4995-97cc-6254e7815265	2025-12-17 09:15:04.24+00	\N	checked	\N	7	\N	2025-12-18 09:15:04.24+00	2025-12-18 09:15:04.24+00
e66f1e5c-1420-4a1f-95c4-754e84eef22c	b80aab97-03c3-417c-9d54-2c678f91fd96	cdacd5ec-aa0b-4a66-8f17-0f767466513a	2025-12-27 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-28 09:15:04.24+00	2025-12-28 09:15:04.24+00
4480bb13-4903-4e67-a89b-e0cd6579f27d	b80aab97-03c3-417c-9d54-2c678f91fd96	85079b8e-4704-49b1-84ed-2d3c501654ee	2025-12-30 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-28 09:15:04.24+00	2025-12-28 09:15:04.24+00
dd81a6b4-a31c-497c-8139-95b839db4b12	b80aab97-03c3-417c-9d54-2c678f91fd96	67d4f333-220d-4a64-bcd2-8dc53a56624c	2025-12-27 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-28 09:15:04.24+00	2025-12-28 09:15:04.24+00
5edc8915-e5f0-4bc2-9930-3f56731a8c9f	b80aab97-03c3-417c-9d54-2c678f91fd96	355120e6-b04a-46f7-876a-b5d7aab3bde0	2025-12-26 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-28 09:15:04.24+00	2025-12-28 09:15:04.24+00
53b15eaf-0f88-4b7d-a417-87a1b1fa8acc	b80aab97-03c3-417c-9d54-2c678f91fd96	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	2025-12-27 09:15:04.24+00	\N	submitted	\N	7	\N	2025-12-28 09:15:04.24+00	2025-12-28 09:15:04.24+00
bdc4172f-8e1d-4ef3-bc36-afafc755253b	b80aab97-03c3-417c-9d54-2c678f91fd96	c18f6551-43e9-4a77-a52e-954d93cee377	2025-12-27 09:15:04.24+00	\N	checked	\N	6	\N	2025-12-28 09:15:04.24+00	2025-12-28 09:15:04.24+00
77374fbe-8d81-466c-b477-fea2b2ccf76c	b80aab97-03c3-417c-9d54-2c678f91fd96	d7e84df8-3a50-4db2-96a7-f478ff5f9764	2025-12-26 09:15:04.24+00	\N	checked	\N	7	\N	2025-12-28 09:15:04.24+00	2025-12-28 09:15:04.24+00
4c8fe135-ccaf-4b4a-8bf1-81960c88e628	b80aab97-03c3-417c-9d54-2c678f91fd96	b1965024-9f05-4ab8-a89c-9169ec08a541	2025-12-31 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-28 09:15:04.24+00	2025-12-28 09:15:04.24+00
48467cf5-3b0f-4e6c-8be2-669a005e5b7d	b80aab97-03c3-417c-9d54-2c678f91fd96	dde039c1-6339-4f2b-91fd-54a185c68b52	2025-12-26 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-28 09:15:04.24+00	2025-12-28 09:15:04.24+00
98b1513d-c966-432f-993b-d46c356e7759	b80aab97-03c3-417c-9d54-2c678f91fd96	e700842a-602b-4ecb-8df6-96e43d98e00e	2025-12-28 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-28 09:15:04.24+00	2025-12-28 09:15:04.24+00
7b6bf8f6-6ffe-4a58-90ac-7833e4cdb705	b80aab97-03c3-417c-9d54-2c678f91fd96	e0f448c8-7d42-4d39-bbcd-de58daff9420	\N	\N	missed	\N	\N	\N	2025-12-28 09:15:04.24+00	2025-12-28 09:15:04.24+00
ebe40819-4783-4192-9b59-ee1c7dd6b4e2	b80aab97-03c3-417c-9d54-2c678f91fd96	97dfe15c-dcba-496a-9e58-2720c211d00a	2025-12-26 09:15:04.24+00	\N	checked	\N	7	\N	2025-12-28 09:15:04.24+00	2025-12-28 09:15:04.24+00
5c3855b0-b408-42be-88f5-53e56ff855f9	b80aab97-03c3-417c-9d54-2c678f91fd96	7b46e55e-46b4-4cfd-8809-b6e205a6e567	2025-12-28 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-28 09:15:04.24+00	2025-12-28 09:15:04.24+00
e67a7da3-b682-4a1b-a4c2-40a98078c59a	b80aab97-03c3-417c-9d54-2c678f91fd96	772182f8-2921-4fe3-a427-8c86cca2f2db	2025-12-26 09:15:04.24+00	\N	checked	\N	6	\N	2025-12-28 09:15:04.24+00	2025-12-28 09:15:04.24+00
7a2b3440-e735-46f1-87d8-d7ed26ae005a	b80aab97-03c3-417c-9d54-2c678f91fd96	9f6c81bf-ea4e-402f-96a1-968323555263	2025-12-28 09:15:04.24+00	\N	submitted	\N	6	\N	2025-12-28 09:15:04.24+00	2025-12-28 09:15:04.24+00
12a929ee-e5c9-4003-b4d9-d64227b4b288	b80aab97-03c3-417c-9d54-2c678f91fd96	5835a0de-c500-4ad7-b0e2-76aa107db95c	2025-12-26 09:15:04.24+00	\N	submitted	\N	7	\N	2025-12-28 09:15:04.24+00	2025-12-28 09:15:04.24+00
094d08a3-3ffb-4a3f-939c-d57f0e82b3df	b80aab97-03c3-417c-9d54-2c678f91fd96	e0633026-2d69-4e2f-9731-dc6e05038f24	2025-12-28 09:15:04.24+00	\N	checked	\N	6	\N	2025-12-28 09:15:04.24+00	2025-12-28 09:15:04.24+00
9af4266d-f550-43fe-9775-b22224e7804d	b80aab97-03c3-417c-9d54-2c678f91fd96	63e27c91-167e-44c0-b455-ca85896b666c	\N	\N	missed	\N	\N	\N	2025-12-28 09:15:04.24+00	2025-12-28 09:15:04.24+00
969aadec-f8ba-4586-b686-964525634f5f	b80aab97-03c3-417c-9d54-2c678f91fd96	f684fc32-dcc9-4b44-bf14-112cd8958129	2025-12-30 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-28 09:15:04.24+00	2025-12-28 09:15:04.24+00
dab1c1ee-3998-4faf-9b0a-b5b847928e95	b80aab97-03c3-417c-9d54-2c678f91fd96	4c7a3cbd-447c-4cbc-918d-8e923ce57b80	\N	\N	missed	\N	\N	\N	2025-12-28 09:15:04.24+00	2025-12-28 09:15:04.24+00
e5f11337-3d1d-435d-a2f3-aea1f502ba35	b80aab97-03c3-417c-9d54-2c678f91fd96	503b5c9c-042c-4813-9898-63b129515ad7	2025-12-28 09:15:04.24+00	\N	checked	\N	4	Needs more practice on key steps.	2025-12-28 09:15:04.24+00	2025-12-28 09:15:04.24+00
6716c5b8-bd85-4911-a6ec-cf50f4863326	b80aab97-03c3-417c-9d54-2c678f91fd96	a6de668b-ecfa-4842-97a5-3cc27b34e1f6	2025-12-28 09:15:04.24+00	\N	checked	\N	5	Needs more practice on key steps.	2025-12-28 09:15:04.24+00	2025-12-28 09:15:04.24+00
ecc89fc0-5201-44d2-8c58-31de540fadc7	b80aab97-03c3-417c-9d54-2c678f91fd96	b470a0a0-fa44-468e-8b5e-102d68c08ed4	2025-12-27 09:15:04.24+00	\N	checked	\N	3	Needs more practice on key steps.	2025-12-28 09:15:04.24+00	2025-12-28 09:15:04.24+00
12e0dbfb-ee83-4aed-8686-9fd9e397620d	b80aab97-03c3-417c-9d54-2c678f91fd96	acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	2025-12-27 09:15:04.24+00	\N	submitted	\N	7	\N	2025-12-28 09:15:04.24+00	2025-12-28 09:15:04.24+00
4b9ac61b-b2c3-49c5-a983-d6969ceb6f8a	b80aab97-03c3-417c-9d54-2c678f91fd96	2286be2d-ff3b-4c8e-8c16-0b4bc6bebdc7	2025-12-30 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-28 09:15:04.24+00	2025-12-28 09:15:04.24+00
84f061f7-5ab4-4468-98b7-057234fb1793	b80aab97-03c3-417c-9d54-2c678f91fd96	60498abe-fb45-4fce-b715-796c6ad2a7b1	2025-12-31 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-28 09:15:04.24+00	2025-12-28 09:15:04.24+00
d2ec4b94-be82-4551-85e8-2cde424e4188	92fedffb-a84a-4c32-8a55-00a4117ef49e	cdacd5ec-aa0b-4a66-8f17-0f767466513a	2026-02-11 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2026-02-12 09:15:04.24+00	2026-02-12 09:15:04.24+00
a4e67bfd-067a-45ed-8331-37129a543c00	92fedffb-a84a-4c32-8a55-00a4117ef49e	85079b8e-4704-49b1-84ed-2d3c501654ee	2026-02-12 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	10	\N	2026-02-12 09:15:04.24+00	2026-02-12 09:15:04.24+00
a66c30b7-9653-43bc-bcf3-2c24aec6065f	92fedffb-a84a-4c32-8a55-00a4117ef49e	67d4f333-220d-4a64-bcd2-8dc53a56624c	2026-02-12 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-12 09:15:04.24+00	2026-02-12 09:15:04.24+00
4cca0e46-5de7-40ba-9f19-01cb7a0b78cb	92fedffb-a84a-4c32-8a55-00a4117ef49e	345bb275-556d-4960-b7de-28922983a7b2	2026-02-11 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	10	\N	2026-02-12 09:15:04.24+00	2026-02-12 09:15:04.24+00
2ce7d96a-1504-40c4-9c4d-f9c64bfa6a6d	92fedffb-a84a-4c32-8a55-00a4117ef49e	355120e6-b04a-46f7-876a-b5d7aab3bde0	2026-02-10 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2026-02-12 09:15:04.24+00	2026-02-12 09:15:04.24+00
3f43c4aa-a371-4385-b4b9-79bbad8f169b	92fedffb-a84a-4c32-8a55-00a4117ef49e	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	2026-02-10 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-12 09:15:04.24+00	2026-02-12 09:15:04.24+00
de6a33a5-95b6-42d2-8626-809ac775d6b9	92fedffb-a84a-4c32-8a55-00a4117ef49e	c18f6551-43e9-4a77-a52e-954d93cee377	2026-02-11 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-12 09:15:04.24+00	2026-02-12 09:15:04.24+00
98b7ae6c-8dbb-4932-9080-e73722da6d38	92fedffb-a84a-4c32-8a55-00a4117ef49e	d7e84df8-3a50-4db2-96a7-f478ff5f9764	2026-02-10 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-12 09:15:04.24+00	2026-02-12 09:15:04.24+00
aaaf21fc-bde2-49ae-88d6-664b638aab0a	92fedffb-a84a-4c32-8a55-00a4117ef49e	b1965024-9f05-4ab8-a89c-9169ec08a541	2026-02-10 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-12 09:15:04.24+00	2026-02-12 09:15:04.24+00
8f0b0603-8a5f-46cd-83bb-2c34dcd092e7	92fedffb-a84a-4c32-8a55-00a4117ef49e	dde039c1-6339-4f2b-91fd-54a185c68b52	2026-02-12 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-12 09:15:04.24+00	2026-02-12 09:15:04.24+00
60b59d21-1f02-4b26-a4d7-25f443f35015	92fedffb-a84a-4c32-8a55-00a4117ef49e	e700842a-602b-4ecb-8df6-96e43d98e00e	2026-02-12 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2026-02-12 09:15:04.24+00	2026-02-12 09:15:04.24+00
fea1a931-1d16-4ec3-ae6a-875c2c9867e6	92fedffb-a84a-4c32-8a55-00a4117ef49e	7b46e55e-46b4-4cfd-8809-b6e205a6e567	2026-02-12 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-12 09:15:04.24+00	2026-02-12 09:15:04.24+00
2502e050-8d0d-4911-a735-bda1a5396da6	92fedffb-a84a-4c32-8a55-00a4117ef49e	60277f16-d457-4dc1-958d-a312a8d9471b	2026-02-10 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-12 09:15:04.24+00	2026-02-12 09:15:04.24+00
74c455b8-574d-4b97-9cfb-7082ad84d25a	92fedffb-a84a-4c32-8a55-00a4117ef49e	772182f8-2921-4fe3-a427-8c86cca2f2db	2026-02-11 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-12 09:15:04.24+00	2026-02-12 09:15:04.24+00
e5eff660-4e4f-4548-9428-ae0fd057db15	92fedffb-a84a-4c32-8a55-00a4117ef49e	9f6c81bf-ea4e-402f-96a1-968323555263	2026-02-11 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2026-02-12 09:15:04.24+00	2026-02-12 09:15:04.24+00
1f7664f2-1400-48b7-a4af-fdfd05891ac5	92fedffb-a84a-4c32-8a55-00a4117ef49e	5835a0de-c500-4ad7-b0e2-76aa107db95c	2026-02-12 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2026-02-12 09:15:04.24+00	2026-02-12 09:15:04.24+00
3a746a36-c9b2-4696-ad64-e71bd987dea5	92fedffb-a84a-4c32-8a55-00a4117ef49e	15a117ff-1cb4-49cf-8fd5-845f9061f160	2026-02-10 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-12 09:15:04.24+00	2026-02-12 09:15:04.24+00
166c347b-ca1a-4ef3-ba39-bb4e2edf1e8a	92fedffb-a84a-4c32-8a55-00a4117ef49e	e0633026-2d69-4e2f-9731-dc6e05038f24	2026-02-12 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2026-02-12 09:15:04.24+00	2026-02-12 09:15:04.24+00
9320cb5e-69a0-4a9a-a174-efa97425a2ea	92fedffb-a84a-4c32-8a55-00a4117ef49e	63e27c91-167e-44c0-b455-ca85896b666c	2026-02-12 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-12 09:15:04.24+00	2026-02-12 09:15:04.24+00
a744700c-ae7a-4db3-9e6a-a0b52ec14b8d	92fedffb-a84a-4c32-8a55-00a4117ef49e	4c7a3cbd-447c-4cbc-918d-8e923ce57b80	2026-02-10 09:15:04.24+00	\N	submitted	\N	7	\N	2026-02-12 09:15:04.24+00	2026-02-12 09:15:04.24+00
f6cb8043-db23-4425-9794-f88398b42d5a	92fedffb-a84a-4c32-8a55-00a4117ef49e	2286be2d-ff3b-4c8e-8c16-0b4bc6bebdc7	2026-02-11 09:15:04.24+00	\N	submitted	\N	3	Needs more practice on key steps.	2026-02-12 09:15:04.24+00	2026-02-12 09:15:04.24+00
00ae8351-9a0d-4022-bc1d-05783211f450	92fedffb-a84a-4c32-8a55-00a4117ef49e	60498abe-fb45-4fce-b715-796c6ad2a7b1	2026-02-11 09:15:04.24+00	\N	submitted	\N	4	Needs more practice on key steps.	2026-02-12 09:15:04.24+00	2026-02-12 09:15:04.24+00
abe9b5d2-568b-4e6a-afd4-acb88440556b	92fedffb-a84a-4c32-8a55-00a4117ef49e	cecbea1b-e71b-4995-97cc-6254e7815265	2026-02-12 09:15:04.24+00	\N	submitted	\N	5	Needs more practice on key steps.	2026-02-12 09:15:04.24+00	2026-02-12 09:15:04.24+00
9c3267a6-8b14-4a64-b129-7cfa00eddfe3	9d5ec54d-18c4-4bec-b53c-c4b8295b40d5	cdacd5ec-aa0b-4a66-8f17-0f767466513a	2025-12-20 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-21 09:15:04.24+00	2025-12-21 09:15:04.24+00
ae116fc2-67b7-402f-9b7d-8e3b141d7b6e	9d5ec54d-18c4-4bec-b53c-c4b8295b40d5	85079b8e-4704-49b1-84ed-2d3c501654ee	2025-12-19 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	10	\N	2025-12-21 09:15:04.24+00	2025-12-21 09:15:04.24+00
98a88b37-4294-4f4e-9158-4680f0f08f51	9d5ec54d-18c4-4bec-b53c-c4b8295b40d5	67d4f333-220d-4a64-bcd2-8dc53a56624c	2025-12-21 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-21 09:15:04.24+00	2025-12-21 09:15:04.24+00
b04257f0-2ecf-44b7-b07b-f253fa2f2afb	9d5ec54d-18c4-4bec-b53c-c4b8295b40d5	345bb275-556d-4960-b7de-28922983a7b2	2025-12-20 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	10	\N	2025-12-21 09:15:04.24+00	2025-12-21 09:15:04.24+00
b9ec0d59-1ced-4420-a574-32f012d43428	9d5ec54d-18c4-4bec-b53c-c4b8295b40d5	355120e6-b04a-46f7-876a-b5d7aab3bde0	2025-12-20 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-21 09:15:04.24+00	2025-12-21 09:15:04.24+00
0969cd96-e63d-42c2-b533-23813d135d84	9d5ec54d-18c4-4bec-b53c-c4b8295b40d5	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	2025-12-20 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-21 09:15:04.24+00	2025-12-21 09:15:04.24+00
b10b4dc1-60e6-45aa-acc2-79b5172b36b4	9d5ec54d-18c4-4bec-b53c-c4b8295b40d5	c18f6551-43e9-4a77-a52e-954d93cee377	2025-12-21 09:15:04.24+00	\N	checked	\N	7	\N	2025-12-21 09:15:04.24+00	2025-12-21 09:15:04.24+00
4a58155e-59a2-48e4-9b30-8970e9e56fc5	9d5ec54d-18c4-4bec-b53c-c4b8295b40d5	d7e84df8-3a50-4db2-96a7-f478ff5f9764	2025-12-19 09:15:04.24+00	\N	checked	\N	7	\N	2025-12-21 09:15:04.24+00	2025-12-21 09:15:04.24+00
228846ea-fd3b-4753-b1ce-e896adfecdc4	9d5ec54d-18c4-4bec-b53c-c4b8295b40d5	b1965024-9f05-4ab8-a89c-9169ec08a541	2025-12-21 09:15:04.24+00	\N	submitted	\N	6	\N	2025-12-21 09:15:04.24+00	2025-12-21 09:15:04.24+00
32ba4882-3baa-4405-9434-0e516594b155	9d5ec54d-18c4-4bec-b53c-c4b8295b40d5	dde039c1-6339-4f2b-91fd-54a185c68b52	2025-12-19 09:15:04.24+00	\N	submitted	\N	6	\N	2025-12-21 09:15:04.24+00	2025-12-21 09:15:04.24+00
57ef332b-5b1e-4af9-9837-97239a1d0b89	9d5ec54d-18c4-4bec-b53c-c4b8295b40d5	e700842a-602b-4ecb-8df6-96e43d98e00e	2025-12-21 09:15:04.24+00	\N	checked	\N	6	\N	2025-12-21 09:15:04.24+00	2025-12-21 09:15:04.24+00
b75f6c0b-6c1f-4174-816c-2ebc09e853a2	9d5ec54d-18c4-4bec-b53c-c4b8295b40d5	e0f448c8-7d42-4d39-bbcd-de58daff9420	2025-12-21 09:15:04.24+00	\N	checked	\N	6	\N	2025-12-21 09:15:04.24+00	2025-12-21 09:15:04.24+00
0de665b8-ad0b-47a7-9c6e-21162618cb92	9d5ec54d-18c4-4bec-b53c-c4b8295b40d5	97dfe15c-dcba-496a-9e58-2720c211d00a	2025-12-20 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-21 09:15:04.24+00	2025-12-21 09:15:04.24+00
c59ba4de-c387-4ec3-a1ab-9c989951f886	9d5ec54d-18c4-4bec-b53c-c4b8295b40d5	60277f16-d457-4dc1-958d-a312a8d9471b	\N	\N	missed	\N	\N	\N	2025-12-21 09:15:04.24+00	2025-12-21 09:15:04.24+00
c6a46cdc-6ef4-4b38-8b09-24949b65017b	9d5ec54d-18c4-4bec-b53c-c4b8295b40d5	772182f8-2921-4fe3-a427-8c86cca2f2db	2025-12-19 09:15:04.24+00	\N	checked	\N	6	\N	2025-12-21 09:15:04.24+00	2025-12-21 09:15:04.24+00
39e5fcd3-bc57-4b92-91ea-30a6740886d5	9d5ec54d-18c4-4bec-b53c-c4b8295b40d5	9f6c81bf-ea4e-402f-96a1-968323555263	2025-12-21 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-21 09:15:04.24+00	2025-12-21 09:15:04.24+00
4f9e3ad6-35b8-44dd-9fef-7cb17dc03ef3	9d5ec54d-18c4-4bec-b53c-c4b8295b40d5	5835a0de-c500-4ad7-b0e2-76aa107db95c	2025-12-19 09:15:04.24+00	\N	submitted	\N	7	\N	2025-12-21 09:15:04.24+00	2025-12-21 09:15:04.24+00
854efeb5-3fce-43e3-8a73-7f95ad4b59b4	9d5ec54d-18c4-4bec-b53c-c4b8295b40d5	15a117ff-1cb4-49cf-8fd5-845f9061f160	2025-12-21 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-21 09:15:04.24+00	2025-12-21 09:15:04.24+00
3038fabb-5649-41ef-8ed8-517d8d945ed6	9d5ec54d-18c4-4bec-b53c-c4b8295b40d5	e0633026-2d69-4e2f-9731-dc6e05038f24	2025-12-20 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-21 09:15:04.24+00	2025-12-21 09:15:04.24+00
a757eb0e-e46f-4448-8753-884ec6be5d5d	9d5ec54d-18c4-4bec-b53c-c4b8295b40d5	63e27c91-167e-44c0-b455-ca85896b666c	2025-12-19 09:15:04.24+00	\N	submitted	\N	3	Needs more practice on key steps.	2025-12-21 09:15:04.24+00	2025-12-21 09:15:04.24+00
4ddae632-4a5a-4d47-96a6-0cab5a680c77	9d5ec54d-18c4-4bec-b53c-c4b8295b40d5	4c7a3cbd-447c-4cbc-918d-8e923ce57b80	2025-12-24 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-21 09:15:04.24+00	2025-12-21 09:15:04.24+00
79a0a63c-8b36-4006-89b3-30f03dd72ef0	9d5ec54d-18c4-4bec-b53c-c4b8295b40d5	503b5c9c-042c-4813-9898-63b129515ad7	\N	\N	missed	\N	\N	\N	2025-12-21 09:15:04.24+00	2025-12-21 09:15:04.24+00
ff492efb-af52-4951-be7f-88baf372a8a5	9d5ec54d-18c4-4bec-b53c-c4b8295b40d5	a6de668b-ecfa-4842-97a5-3cc27b34e1f6	2025-12-21 09:15:04.24+00	\N	submitted	\N	4	Needs more practice on key steps.	2025-12-21 09:15:04.24+00	2025-12-21 09:15:04.24+00
4c1d3f24-9904-496c-a239-8f1f163eaf1a	9d5ec54d-18c4-4bec-b53c-c4b8295b40d5	acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	2025-12-24 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-21 09:15:04.24+00	2025-12-21 09:15:04.24+00
3859dc16-a448-4316-89e7-5b951670363f	9d5ec54d-18c4-4bec-b53c-c4b8295b40d5	2286be2d-ff3b-4c8e-8c16-0b4bc6bebdc7	\N	\N	missed	\N	\N	\N	2025-12-21 09:15:04.24+00	2025-12-21 09:15:04.24+00
f5de2638-1001-4564-8c52-37788d82ca47	9d5ec54d-18c4-4bec-b53c-c4b8295b40d5	cecbea1b-e71b-4995-97cc-6254e7815265	2025-12-24 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-21 09:15:04.24+00	2025-12-21 09:15:04.24+00
842a688f-73d2-41d0-a6b1-b7309106397c	7230246b-e807-492b-a374-45ce86c47aba	cdacd5ec-aa0b-4a66-8f17-0f767466513a	2025-12-29 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-31 09:15:04.24+00	2025-12-31 09:15:04.24+00
425bb408-702a-4b2b-9ef4-07f089ac1496	7230246b-e807-492b-a374-45ce86c47aba	85079b8e-4704-49b1-84ed-2d3c501654ee	2026-01-03 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-31 09:15:04.24+00	2025-12-31 09:15:04.24+00
7894441a-51c3-4f15-a36e-bcb24cbe4ad1	7230246b-e807-492b-a374-45ce86c47aba	67d4f333-220d-4a64-bcd2-8dc53a56624c	2025-12-29 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-31 09:15:04.24+00	2025-12-31 09:15:04.24+00
1daec6a8-2672-4e76-a0d2-55aea902a5d5	7230246b-e807-492b-a374-45ce86c47aba	345bb275-556d-4960-b7de-28922983a7b2	2025-12-31 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-31 09:15:04.24+00	2025-12-31 09:15:04.24+00
8439cfea-314e-4b3a-8566-2ea581b3ada4	7230246b-e807-492b-a374-45ce86c47aba	355120e6-b04a-46f7-876a-b5d7aab3bde0	2025-12-29 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-31 09:15:04.24+00	2025-12-31 09:15:04.24+00
c8a499c3-5fbe-491b-af4b-95dec4a67ce5	7230246b-e807-492b-a374-45ce86c47aba	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	2025-12-30 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-31 09:15:04.24+00	2025-12-31 09:15:04.24+00
1a5c7cca-7515-431e-b935-103814f44bfe	7230246b-e807-492b-a374-45ce86c47aba	c18f6551-43e9-4a77-a52e-954d93cee377	2025-12-30 09:15:04.24+00	\N	submitted	\N	7	\N	2025-12-31 09:15:04.24+00	2025-12-31 09:15:04.24+00
89878884-70ae-457f-9c23-c5b53a0d0dee	7230246b-e807-492b-a374-45ce86c47aba	d7e84df8-3a50-4db2-96a7-f478ff5f9764	2025-12-29 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-31 09:15:04.24+00	2025-12-31 09:15:04.24+00
7099f6cf-62b4-4bfc-a3c2-32c0f15f153b	7230246b-e807-492b-a374-45ce86c47aba	b1965024-9f05-4ab8-a89c-9169ec08a541	2025-12-30 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-31 09:15:04.24+00	2025-12-31 09:15:04.24+00
d7ebe1df-7a79-4b4b-9c25-2d54d8cfa94f	7230246b-e807-492b-a374-45ce86c47aba	dde039c1-6339-4f2b-91fd-54a185c68b52	2025-12-30 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-31 09:15:04.24+00	2025-12-31 09:15:04.24+00
3025e12c-5d5b-40d5-9d1c-38202acf03ef	7230246b-e807-492b-a374-45ce86c47aba	e700842a-602b-4ecb-8df6-96e43d98e00e	2025-12-29 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-31 09:15:04.24+00	2025-12-31 09:15:04.24+00
5ec28863-e031-4892-94aa-47d9ce3ad47c	7230246b-e807-492b-a374-45ce86c47aba	e0f448c8-7d42-4d39-bbcd-de58daff9420	2025-12-30 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-31 09:15:04.24+00	2025-12-31 09:15:04.24+00
e99ae405-cc6d-47c0-aa3b-e502426e076f	7230246b-e807-492b-a374-45ce86c47aba	97dfe15c-dcba-496a-9e58-2720c211d00a	2026-01-01 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-31 09:15:04.24+00	2025-12-31 09:15:04.24+00
e014aaa0-858f-4388-964e-bb33938608c7	7230246b-e807-492b-a374-45ce86c47aba	7b46e55e-46b4-4cfd-8809-b6e205a6e567	2026-01-02 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-31 09:15:04.24+00	2025-12-31 09:15:04.24+00
44a0f651-65a9-4edb-869f-36b18413ad0a	7230246b-e807-492b-a374-45ce86c47aba	60277f16-d457-4dc1-958d-a312a8d9471b	2025-12-30 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-31 09:15:04.24+00	2025-12-31 09:15:04.24+00
f86cf8c0-2e82-4480-8bbf-96b34a8ccd68	7230246b-e807-492b-a374-45ce86c47aba	772182f8-2921-4fe3-a427-8c86cca2f2db	\N	\N	missed	\N	\N	\N	2025-12-31 09:15:04.24+00	2025-12-31 09:15:04.24+00
cc93a578-b225-40b9-8c97-f2e598921415	7230246b-e807-492b-a374-45ce86c47aba	9f6c81bf-ea4e-402f-96a1-968323555263	2025-12-29 09:15:04.24+00	\N	submitted	\N	6	\N	2025-12-31 09:15:04.24+00	2025-12-31 09:15:04.24+00
387278f2-f20b-4484-892d-829c5d9a50a6	7230246b-e807-492b-a374-45ce86c47aba	5835a0de-c500-4ad7-b0e2-76aa107db95c	2025-12-30 09:15:04.24+00	\N	checked	\N	6	\N	2025-12-31 09:15:04.24+00	2025-12-31 09:15:04.24+00
6ff73cef-183d-4005-ad54-850449a17624	7230246b-e807-492b-a374-45ce86c47aba	15a117ff-1cb4-49cf-8fd5-845f9061f160	2025-12-30 09:15:04.24+00	\N	checked	\N	7	\N	2025-12-31 09:15:04.24+00	2025-12-31 09:15:04.24+00
6117ac1b-fc84-4197-bee5-d4617fd96fb3	7230246b-e807-492b-a374-45ce86c47aba	e0633026-2d69-4e2f-9731-dc6e05038f24	2026-01-02 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-31 09:15:04.24+00	2025-12-31 09:15:04.24+00
637097b0-ee28-4d1c-91e4-38db0ed5574c	7230246b-e807-492b-a374-45ce86c47aba	63e27c91-167e-44c0-b455-ca85896b666c	\N	\N	missed	\N	\N	\N	2025-12-31 09:15:04.24+00	2025-12-31 09:15:04.24+00
0f4adaa2-190e-4f9d-be4a-a841d1bda768	7230246b-e807-492b-a374-45ce86c47aba	f684fc32-dcc9-4b44-bf14-112cd8958129	2025-12-30 09:15:04.24+00	\N	submitted	\N	3	Needs more practice on key steps.	2025-12-31 09:15:04.24+00	2025-12-31 09:15:04.24+00
1219f484-1ff4-4463-834f-caac565299f5	7230246b-e807-492b-a374-45ce86c47aba	4c7a3cbd-447c-4cbc-918d-8e923ce57b80	2025-12-29 09:15:04.24+00	\N	checked	\N	4	Needs more practice on key steps.	2025-12-31 09:15:04.24+00	2025-12-31 09:15:04.24+00
ae042de7-5509-4e95-8a90-926d1c70da15	7230246b-e807-492b-a374-45ce86c47aba	503b5c9c-042c-4813-9898-63b129515ad7	2025-12-31 09:15:04.24+00	\N	checked	\N	6	\N	2025-12-31 09:15:04.24+00	2025-12-31 09:15:04.24+00
32a48a88-3aa8-4645-924f-94aa6c0fd607	7230246b-e807-492b-a374-45ce86c47aba	a6de668b-ecfa-4842-97a5-3cc27b34e1f6	2025-12-30 09:15:04.24+00	\N	checked	\N	7	\N	2025-12-31 09:15:04.24+00	2025-12-31 09:15:04.24+00
776cd052-695b-43a3-954e-1e61c16039e4	7230246b-e807-492b-a374-45ce86c47aba	acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	2025-12-30 09:15:04.24+00	\N	checked	\N	7	\N	2025-12-31 09:15:04.24+00	2025-12-31 09:15:04.24+00
72124592-04d0-4d83-93f4-09af0014a43d	7230246b-e807-492b-a374-45ce86c47aba	cecbea1b-e71b-4995-97cc-6254e7815265	2025-12-29 09:15:04.24+00	\N	checked	\N	3	Needs more practice on key steps.	2025-12-31 09:15:04.24+00	2025-12-31 09:15:04.24+00
92c7223c-de93-41f1-9b65-6fe8596561eb	311d76f2-75c3-4158-8f73-1b146e86716e	cdacd5ec-aa0b-4a66-8f17-0f767466513a	2026-02-09 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	10	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
7240e41c-31be-4055-97e4-f44dba49699c	311d76f2-75c3-4158-8f73-1b146e86716e	85079b8e-4704-49b1-84ed-2d3c501654ee	2026-02-09 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	10	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
b0eb451b-19e5-47a7-8ce8-54ec0051252f	311d76f2-75c3-4158-8f73-1b146e86716e	67d4f333-220d-4a64-bcd2-8dc53a56624c	2026-02-10 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
0550210c-8b89-416d-b620-fb544405cb94	311d76f2-75c3-4158-8f73-1b146e86716e	345bb275-556d-4960-b7de-28922983a7b2	2026-02-10 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
6102e9a5-99af-4bf5-8236-86523c6fdb6c	311d76f2-75c3-4158-8f73-1b146e86716e	355120e6-b04a-46f7-876a-b5d7aab3bde0	2026-02-10 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	10	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
36cd95aa-0eae-4e33-aff5-f85a92a3fcfa	311d76f2-75c3-4158-8f73-1b146e86716e	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	2026-02-10 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
c006ed19-0957-4e7b-b02b-72d4f6f7cf99	311d76f2-75c3-4158-8f73-1b146e86716e	c18f6551-43e9-4a77-a52e-954d93cee377	2026-02-09 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
104f864c-c470-45d0-a0fe-48aab0e24348	311d76f2-75c3-4158-8f73-1b146e86716e	d7e84df8-3a50-4db2-96a7-f478ff5f9764	2026-02-09 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
84e0fdf5-6842-4b19-a7ee-0e9f645e3ea8	311d76f2-75c3-4158-8f73-1b146e86716e	dde039c1-6339-4f2b-91fd-54a185c68b52	2026-02-10 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
f68ffe18-71e5-43c5-b5ba-cc54071ca2b6	311d76f2-75c3-4158-8f73-1b146e86716e	e0f448c8-7d42-4d39-bbcd-de58daff9420	2026-02-10 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
573973c5-5c04-42c6-9733-96e036651035	311d76f2-75c3-4158-8f73-1b146e86716e	97dfe15c-dcba-496a-9e58-2720c211d00a	2026-02-08 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
2cc8b5ea-bb47-4199-932b-ad5ec575c979	311d76f2-75c3-4158-8f73-1b146e86716e	60277f16-d457-4dc1-958d-a312a8d9471b	2026-02-10 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
d5dc5f03-5caf-44da-a78c-efaf12510126	311d76f2-75c3-4158-8f73-1b146e86716e	772182f8-2921-4fe3-a427-8c86cca2f2db	2026-02-08 09:15:04.24+00	\N	submitted	\N	7	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
4e1439a2-db9d-40b4-8a91-749e0651cc1e	311d76f2-75c3-4158-8f73-1b146e86716e	9f6c81bf-ea4e-402f-96a1-968323555263	2026-02-08 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
f4135965-26af-4e24-80f5-c7eb1292a76d	311d76f2-75c3-4158-8f73-1b146e86716e	5835a0de-c500-4ad7-b0e2-76aa107db95c	2026-02-10 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
3b0d5251-f2a8-4bc7-8c8a-b0fdb6963734	311d76f2-75c3-4158-8f73-1b146e86716e	15a117ff-1cb4-49cf-8fd5-845f9061f160	2026-02-08 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
0bba78e8-d9cd-4ba4-86ad-5febefa9ce33	311d76f2-75c3-4158-8f73-1b146e86716e	e0633026-2d69-4e2f-9731-dc6e05038f24	2026-02-10 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
984bb724-07db-4aa7-a8cf-6f4d749ca0c5	311d76f2-75c3-4158-8f73-1b146e86716e	63e27c91-167e-44c0-b455-ca85896b666c	2026-02-10 09:15:04.24+00	\N	submitted	\N	3	Needs more practice on key steps.	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
54300338-04c4-4864-b6c2-7f56e617ccc1	311d76f2-75c3-4158-8f73-1b146e86716e	f684fc32-dcc9-4b44-bf14-112cd8958129	2026-02-10 09:15:04.24+00	\N	submitted	\N	5	Needs more practice on key steps.	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
80fffec8-916a-4532-92aa-00441081ef93	311d76f2-75c3-4158-8f73-1b146e86716e	4c7a3cbd-447c-4cbc-918d-8e923ce57b80	2026-02-10 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
adb00c75-9311-4f0a-9762-68626be8b1d1	311d76f2-75c3-4158-8f73-1b146e86716e	503b5c9c-042c-4813-9898-63b129515ad7	2026-02-08 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
a7ed60f0-c711-4e6b-b7ec-be155a36ef6c	311d76f2-75c3-4158-8f73-1b146e86716e	b470a0a0-fa44-468e-8b5e-102d68c08ed4	2026-02-08 09:15:04.24+00	\N	submitted	\N	7	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
bcc94cb2-3059-4f80-a255-d8427559faac	311d76f2-75c3-4158-8f73-1b146e86716e	acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	2026-02-08 09:15:04.24+00	\N	submitted	\N	7	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
1b787a94-8d4b-4acc-bf93-2c841e64eb31	311d76f2-75c3-4158-8f73-1b146e86716e	2286be2d-ff3b-4c8e-8c16-0b4bc6bebdc7	2026-02-10 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
a9cf0629-babe-47b0-a0a8-49bf925782f5	dd3c8e3b-fd7e-4bad-a421-f5c38d23457e	cdacd5ec-aa0b-4a66-8f17-0f767466513a	2025-12-27 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-24 09:15:04.24+00	2025-12-24 09:15:04.24+00
7d5f2765-a0ba-49a8-8507-835c9f831ae5	dd3c8e3b-fd7e-4bad-a421-f5c38d23457e	85079b8e-4704-49b1-84ed-2d3c501654ee	2025-12-24 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-24 09:15:04.24+00	2025-12-24 09:15:04.24+00
173e53c8-6d41-4926-8933-5cbb4446635c	dd3c8e3b-fd7e-4bad-a421-f5c38d23457e	67d4f333-220d-4a64-bcd2-8dc53a56624c	2025-12-24 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	10	\N	2025-12-24 09:15:04.24+00	2025-12-24 09:15:04.24+00
ab35dbf5-ac9d-4ec5-b025-bebdcf62be8d	dd3c8e3b-fd7e-4bad-a421-f5c38d23457e	345bb275-556d-4960-b7de-28922983a7b2	2025-12-25 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-24 09:15:04.24+00	2025-12-24 09:15:04.24+00
9382a891-5ca2-4d58-a126-7ba0eceeaf23	dd3c8e3b-fd7e-4bad-a421-f5c38d23457e	355120e6-b04a-46f7-876a-b5d7aab3bde0	2025-12-23 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-24 09:15:04.24+00	2025-12-24 09:15:04.24+00
40d58700-d3fb-4a61-8479-49134a7edd62	dd3c8e3b-fd7e-4bad-a421-f5c38d23457e	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	2025-12-23 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-24 09:15:04.24+00	2025-12-24 09:15:04.24+00
d06dda81-ff95-42d5-84d1-5adbb3196420	dd3c8e3b-fd7e-4bad-a421-f5c38d23457e	c18f6551-43e9-4a77-a52e-954d93cee377	2025-12-26 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-24 09:15:04.24+00	2025-12-24 09:15:04.24+00
ccc8274c-6ad2-410f-9701-ed063b7b83ca	dd3c8e3b-fd7e-4bad-a421-f5c38d23457e	d7e84df8-3a50-4db2-96a7-f478ff5f9764	2025-12-22 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-24 09:15:04.24+00	2025-12-24 09:15:04.24+00
954345f8-8b90-42b5-a4bd-9d55cd5a38b9	dd3c8e3b-fd7e-4bad-a421-f5c38d23457e	b1965024-9f05-4ab8-a89c-9169ec08a541	2025-12-23 09:15:04.24+00	\N	submitted	\N	7	\N	2025-12-24 09:15:04.24+00	2025-12-24 09:15:04.24+00
8f79dcab-104b-4257-b103-c278a7a1acf3	dd3c8e3b-fd7e-4bad-a421-f5c38d23457e	e700842a-602b-4ecb-8df6-96e43d98e00e	2025-12-22 09:15:04.24+00	\N	checked	\N	7	\N	2025-12-24 09:15:04.24+00	2025-12-24 09:15:04.24+00
8f8c95c3-bebb-4cae-8991-676e8518fa99	dd3c8e3b-fd7e-4bad-a421-f5c38d23457e	e0f448c8-7d42-4d39-bbcd-de58daff9420	2025-12-24 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-24 09:15:04.24+00	2025-12-24 09:15:04.24+00
24cd28b1-2aab-4881-a658-7a57f24bb8b0	dd3c8e3b-fd7e-4bad-a421-f5c38d23457e	97dfe15c-dcba-496a-9e58-2720c211d00a	2025-12-23 09:15:04.24+00	\N	submitted	\N	7	\N	2025-12-24 09:15:04.24+00	2025-12-24 09:15:04.24+00
d499f8d9-5f7a-4c1e-afd5-74e2cf22e372	dd3c8e3b-fd7e-4bad-a421-f5c38d23457e	7b46e55e-46b4-4cfd-8809-b6e205a6e567	2025-12-22 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-24 09:15:04.24+00	2025-12-24 09:15:04.24+00
116ad25e-225a-4ff1-8be8-91301d97a85a	dd3c8e3b-fd7e-4bad-a421-f5c38d23457e	60277f16-d457-4dc1-958d-a312a8d9471b	2025-12-22 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-24 09:15:04.24+00	2025-12-24 09:15:04.24+00
af180572-9e71-4d21-8518-366c7b697b70	dd3c8e3b-fd7e-4bad-a421-f5c38d23457e	772182f8-2921-4fe3-a427-8c86cca2f2db	2025-12-24 09:15:04.24+00	\N	submitted	\N	7	\N	2025-12-24 09:15:04.24+00	2025-12-24 09:15:04.24+00
ce42a8aa-e612-4754-98aa-329f2c27a596	dd3c8e3b-fd7e-4bad-a421-f5c38d23457e	9f6c81bf-ea4e-402f-96a1-968323555263	2025-12-24 09:15:04.24+00	\N	checked	\N	6	\N	2025-12-24 09:15:04.24+00	2025-12-24 09:15:04.24+00
675853bc-1ec8-4c5b-ae2a-51572c2d679e	dd3c8e3b-fd7e-4bad-a421-f5c38d23457e	15a117ff-1cb4-49cf-8fd5-845f9061f160	2025-12-24 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-24 09:15:04.24+00	2025-12-24 09:15:04.24+00
cc993dbf-e261-4023-bedd-22b31f594ece	dd3c8e3b-fd7e-4bad-a421-f5c38d23457e	e0633026-2d69-4e2f-9731-dc6e05038f24	\N	\N	missed	\N	\N	\N	2025-12-24 09:15:04.24+00	2025-12-24 09:15:04.24+00
d1b4063b-6eac-43a5-bfb3-f3339ae93483	dd3c8e3b-fd7e-4bad-a421-f5c38d23457e	63e27c91-167e-44c0-b455-ca85896b666c	2025-12-24 09:15:04.24+00	\N	checked	\N	4	Needs more practice on key steps.	2025-12-24 09:15:04.24+00	2025-12-24 09:15:04.24+00
a1bce8ed-56af-44c1-bb27-1d12249678e1	dd3c8e3b-fd7e-4bad-a421-f5c38d23457e	f684fc32-dcc9-4b44-bf14-112cd8958129	2025-12-23 09:15:04.24+00	\N	submitted	\N	3	Needs more practice on key steps.	2025-12-24 09:15:04.24+00	2025-12-24 09:15:04.24+00
97084a50-29f0-44ae-8e30-0e9a76ec15a5	dd3c8e3b-fd7e-4bad-a421-f5c38d23457e	4c7a3cbd-447c-4cbc-918d-8e923ce57b80	2025-12-27 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-24 09:15:04.24+00	2025-12-24 09:15:04.24+00
2fe47756-85d2-4a10-a935-f0f8c1d9e1e6	dd3c8e3b-fd7e-4bad-a421-f5c38d23457e	503b5c9c-042c-4813-9898-63b129515ad7	2025-12-22 09:15:04.24+00	\N	submitted	\N	6	\N	2025-12-24 09:15:04.24+00	2025-12-24 09:15:04.24+00
851cf3e4-9f9d-44a7-8b0e-ef06e58c3447	dd3c8e3b-fd7e-4bad-a421-f5c38d23457e	b470a0a0-fa44-468e-8b5e-102d68c08ed4	\N	\N	missed	\N	\N	\N	2025-12-24 09:15:04.24+00	2025-12-24 09:15:04.24+00
adbc2e68-d1cc-4b66-9093-629b6a3984c1	dd3c8e3b-fd7e-4bad-a421-f5c38d23457e	acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	2025-12-27 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-24 09:15:04.24+00	2025-12-24 09:15:04.24+00
1e12ef8b-29b0-4fae-94de-1808b2c6cd68	dd3c8e3b-fd7e-4bad-a421-f5c38d23457e	60498abe-fb45-4fce-b715-796c6ad2a7b1	2025-12-24 09:15:04.24+00	\N	checked	\N	7	\N	2025-12-24 09:15:04.24+00	2025-12-24 09:15:04.24+00
88722782-ab5e-46c9-8f70-4af5a6995369	dd3c8e3b-fd7e-4bad-a421-f5c38d23457e	cecbea1b-e71b-4995-97cc-6254e7815265	2025-12-23 09:15:04.24+00	\N	checked	\N	7	\N	2025-12-24 09:15:04.24+00	2025-12-24 09:15:04.24+00
ee66e0fa-bf4a-4ea8-a0ba-717736718b2f	7653bb90-1050-459b-bd5c-63b543ee8b85	cdacd5ec-aa0b-4a66-8f17-0f767466513a	2026-01-02 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-01-03 09:15:04.24+00	2026-01-03 09:15:04.24+00
dcb21cb0-8dc2-459c-af96-dc34a2159854	7653bb90-1050-459b-bd5c-63b543ee8b85	85079b8e-4704-49b1-84ed-2d3c501654ee	2026-01-03 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	10	\N	2026-01-03 09:15:04.24+00	2026-01-03 09:15:04.24+00
de0479c6-e106-4633-8170-1fff04c01f2b	7653bb90-1050-459b-bd5c-63b543ee8b85	67d4f333-220d-4a64-bcd2-8dc53a56624c	2026-01-01 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2026-01-03 09:15:04.24+00	2026-01-03 09:15:04.24+00
d49bccd4-792b-42c5-9792-ad31848e67e2	7653bb90-1050-459b-bd5c-63b543ee8b85	345bb275-556d-4960-b7de-28922983a7b2	2026-01-03 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	10	\N	2026-01-03 09:15:04.24+00	2026-01-03 09:15:04.24+00
2549b821-13ee-4302-ab8a-4d52af978c71	7653bb90-1050-459b-bd5c-63b543ee8b85	355120e6-b04a-46f7-876a-b5d7aab3bde0	2026-01-01 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-01-03 09:15:04.24+00	2026-01-03 09:15:04.24+00
d8c2be94-8242-48fc-b55c-f33814354aff	7653bb90-1050-459b-bd5c-63b543ee8b85	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	2026-01-01 09:15:04.24+00	\N	submitted	\N	6	\N	2026-01-03 09:15:04.24+00	2026-01-03 09:15:04.24+00
5018d2c2-653b-43c9-8453-080501219e68	7653bb90-1050-459b-bd5c-63b543ee8b85	c18f6551-43e9-4a77-a52e-954d93cee377	2026-01-02 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-01-03 09:15:04.24+00	2026-01-03 09:15:04.24+00
eb5fb35e-9e48-47ec-a90d-ef652a2b7c65	7653bb90-1050-459b-bd5c-63b543ee8b85	d7e84df8-3a50-4db2-96a7-f478ff5f9764	2026-01-03 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2026-01-03 09:15:04.24+00	2026-01-03 09:15:04.24+00
0b40fcdc-0daa-4e02-8a60-f44d998e9ddd	7653bb90-1050-459b-bd5c-63b543ee8b85	b1965024-9f05-4ab8-a89c-9169ec08a541	2026-01-02 09:15:04.24+00	\N	checked	\N	7	\N	2026-01-03 09:15:04.24+00	2026-01-03 09:15:04.24+00
1ee30db1-2de1-463a-bc84-5b5a2cad969e	7653bb90-1050-459b-bd5c-63b543ee8b85	dde039c1-6339-4f2b-91fd-54a185c68b52	2026-01-01 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-01-03 09:15:04.24+00	2026-01-03 09:15:04.24+00
215bce0f-dc09-4bc3-81ba-bfa8877093ca	7653bb90-1050-459b-bd5c-63b543ee8b85	e700842a-602b-4ecb-8df6-96e43d98e00e	2026-01-03 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	9	\N	2026-01-03 09:15:04.24+00	2026-01-03 09:15:04.24+00
b7185256-0137-450f-af54-6116fcfe1dc1	7653bb90-1050-459b-bd5c-63b543ee8b85	e0f448c8-7d42-4d39-bbcd-de58daff9420	2026-01-05 09:15:04.24+00	\N	late	\N	\N	\N	2026-01-03 09:15:04.24+00	2026-01-03 09:15:04.24+00
62ab1645-552a-4967-91a8-b17b68827dd3	7653bb90-1050-459b-bd5c-63b543ee8b85	97dfe15c-dcba-496a-9e58-2720c211d00a	2026-01-05 09:15:04.24+00	\N	late	\N	\N	\N	2026-01-03 09:15:04.24+00	2026-01-03 09:15:04.24+00
eb181ce3-ccc8-40a8-86ba-8024dbe97cad	7653bb90-1050-459b-bd5c-63b543ee8b85	7b46e55e-46b4-4cfd-8809-b6e205a6e567	2026-01-05 09:15:04.24+00	\N	late	\N	\N	\N	2026-01-03 09:15:04.24+00	2026-01-03 09:15:04.24+00
c7193671-2e07-41bf-84e5-c88d20a2baca	7653bb90-1050-459b-bd5c-63b543ee8b85	60277f16-d457-4dc1-958d-a312a8d9471b	\N	\N	missed	\N	\N	\N	2026-01-03 09:15:04.24+00	2026-01-03 09:15:04.24+00
4d3eb5b5-767f-46ae-9186-4169c5420057	7653bb90-1050-459b-bd5c-63b543ee8b85	5835a0de-c500-4ad7-b0e2-76aa107db95c	2026-01-03 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2026-01-03 09:15:04.24+00	2026-01-03 09:15:04.24+00
3cac967b-d14b-41ba-91bb-71e870ce1b9a	7653bb90-1050-459b-bd5c-63b543ee8b85	15a117ff-1cb4-49cf-8fd5-845f9061f160	2026-01-03 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	9	\N	2026-01-03 09:15:04.24+00	2026-01-03 09:15:04.24+00
7bbd2696-1eb2-4ed6-a841-d396e8370ca8	7653bb90-1050-459b-bd5c-63b543ee8b85	e0633026-2d69-4e2f-9731-dc6e05038f24	2026-01-05 09:15:04.24+00	\N	late	\N	\N	\N	2026-01-03 09:15:04.24+00	2026-01-03 09:15:04.24+00
1d043d91-3f87-4bee-ab0c-0c818c39fd08	7653bb90-1050-459b-bd5c-63b543ee8b85	63e27c91-167e-44c0-b455-ca85896b666c	\N	\N	missed	\N	\N	\N	2026-01-03 09:15:04.24+00	2026-01-03 09:15:04.24+00
e7f38089-79d6-4f2f-89f5-9ffa643e686a	7653bb90-1050-459b-bd5c-63b543ee8b85	f684fc32-dcc9-4b44-bf14-112cd8958129	2026-01-02 09:15:04.24+00	\N	submitted	\N	7	\N	2026-01-03 09:15:04.24+00	2026-01-03 09:15:04.24+00
63e639b7-9824-4819-bb80-61f500344675	7653bb90-1050-459b-bd5c-63b543ee8b85	503b5c9c-042c-4813-9898-63b129515ad7	2026-01-03 09:15:04.24+00	\N	checked	\N	6	\N	2026-01-03 09:15:04.24+00	2026-01-03 09:15:04.24+00
3ea1975e-c435-4d1c-88af-90343a837468	7653bb90-1050-459b-bd5c-63b543ee8b85	a6de668b-ecfa-4842-97a5-3cc27b34e1f6	\N	\N	missed	\N	\N	\N	2026-01-03 09:15:04.24+00	2026-01-03 09:15:04.24+00
6f936733-30a0-4ad1-a367-0279adebdb6d	7653bb90-1050-459b-bd5c-63b543ee8b85	b470a0a0-fa44-468e-8b5e-102d68c08ed4	2026-01-02 09:15:04.24+00	\N	submitted	\N	6	\N	2026-01-03 09:15:04.24+00	2026-01-03 09:15:04.24+00
31e3c6e8-02cd-405c-bfe1-68aec5aefca9	7653bb90-1050-459b-bd5c-63b543ee8b85	acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	2026-01-03 09:15:04.24+00	\N	checked	\N	4	Needs more practice on key steps.	2026-01-03 09:15:04.24+00	2026-01-03 09:15:04.24+00
e6535dfd-0894-41aa-8013-081e6cc5b2cd	7653bb90-1050-459b-bd5c-63b543ee8b85	2286be2d-ff3b-4c8e-8c16-0b4bc6bebdc7	\N	\N	missed	\N	\N	\N	2026-01-03 09:15:04.24+00	2026-01-03 09:15:04.24+00
d3749904-8baa-476e-9115-48b24d599e0b	7653bb90-1050-459b-bd5c-63b543ee8b85	60498abe-fb45-4fce-b715-796c6ad2a7b1	\N	\N	missed	\N	\N	\N	2026-01-03 09:15:04.24+00	2026-01-03 09:15:04.24+00
0580d7cf-0db4-4aa9-9bde-2bda73ff4ed0	f69317f0-b80d-4f17-86eb-197d33698ffc	cdacd5ec-aa0b-4a66-8f17-0f767466513a	2026-02-08 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	10	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
47d3e417-6eeb-4569-879c-4e95ec9ee2f1	f69317f0-b80d-4f17-86eb-197d33698ffc	85079b8e-4704-49b1-84ed-2d3c501654ee	2026-02-08 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
93eca0b5-04ae-40e1-92c3-058f8e938b4b	f69317f0-b80d-4f17-86eb-197d33698ffc	67d4f333-220d-4a64-bcd2-8dc53a56624c	2026-02-09 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	10	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
24d636ab-2354-44c4-bbf9-f8e35e8debf1	f69317f0-b80d-4f17-86eb-197d33698ffc	345bb275-556d-4960-b7de-28922983a7b2	2026-02-08 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
b86e1679-4f22-4551-9f2f-eefcdccf75b0	f69317f0-b80d-4f17-86eb-197d33698ffc	355120e6-b04a-46f7-876a-b5d7aab3bde0	2026-02-10 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
28260531-34cf-44c6-8c3a-b942366f1b32	f69317f0-b80d-4f17-86eb-197d33698ffc	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	2026-02-10 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
08c55378-d8aa-4cf5-9443-fa0349b13515	f69317f0-b80d-4f17-86eb-197d33698ffc	c18f6551-43e9-4a77-a52e-954d93cee377	2026-02-10 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
0796f0e4-1613-4463-a916-96b98a18404d	f69317f0-b80d-4f17-86eb-197d33698ffc	d7e84df8-3a50-4db2-96a7-f478ff5f9764	2026-02-10 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
f372e9f3-2aa8-4bb0-9f75-f8ccff209328	f69317f0-b80d-4f17-86eb-197d33698ffc	b1965024-9f05-4ab8-a89c-9169ec08a541	2026-02-08 09:15:04.24+00	\N	submitted	\N	7	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
ae66f5a4-e647-4a11-8073-1772039cc627	f69317f0-b80d-4f17-86eb-197d33698ffc	dde039c1-6339-4f2b-91fd-54a185c68b52	2026-02-09 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
8b0f1b92-813a-4556-a3c9-fb766c4f17b7	f69317f0-b80d-4f17-86eb-197d33698ffc	e700842a-602b-4ecb-8df6-96e43d98e00e	2026-02-10 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
b49e9b23-666b-4734-9db3-ac4ec94f0796	f69317f0-b80d-4f17-86eb-197d33698ffc	e0f448c8-7d42-4d39-bbcd-de58daff9420	2026-02-08 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
96d8172e-bb3d-4a58-be5b-fcf8f84cc142	f69317f0-b80d-4f17-86eb-197d33698ffc	7b46e55e-46b4-4cfd-8809-b6e205a6e567	2026-02-09 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
6089a877-c229-49f7-b248-6b87d29ec243	f69317f0-b80d-4f17-86eb-197d33698ffc	772182f8-2921-4fe3-a427-8c86cca2f2db	2026-02-08 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
db027023-6b93-4942-a6b0-9abd4a623a44	f69317f0-b80d-4f17-86eb-197d33698ffc	9f6c81bf-ea4e-402f-96a1-968323555263	2026-02-10 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
7a853f9f-dcfc-4ce0-9f13-b2137506220e	f69317f0-b80d-4f17-86eb-197d33698ffc	15a117ff-1cb4-49cf-8fd5-845f9061f160	2026-02-09 09:15:04.24+00	\N	submitted	\N	7	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
05c5f5aa-c3fe-4640-8441-a7d2e9996eb4	f69317f0-b80d-4f17-86eb-197d33698ffc	e0633026-2d69-4e2f-9731-dc6e05038f24	2026-02-08 09:15:04.24+00	\N	submitted	\N	7	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
6248780c-61c6-4425-b330-d84e82f2c65f	f69317f0-b80d-4f17-86eb-197d33698ffc	f684fc32-dcc9-4b44-bf14-112cd8958129	2026-02-10 09:15:04.24+00	\N	submitted	\N	7	\N	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
9d5b3761-e8fe-4ed7-8101-58c2fa71b48d	f69317f0-b80d-4f17-86eb-197d33698ffc	4c7a3cbd-447c-4cbc-918d-8e923ce57b80	2026-02-10 09:15:04.24+00	\N	submitted	\N	4	Needs more practice on key steps.	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
495d8380-4797-4898-a32c-bec34a9ac650	f69317f0-b80d-4f17-86eb-197d33698ffc	acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	2026-02-08 09:15:04.24+00	\N	submitted	\N	3	Needs more practice on key steps.	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
36490a55-1813-496f-aca3-5a53a58186ec	f69317f0-b80d-4f17-86eb-197d33698ffc	2286be2d-ff3b-4c8e-8c16-0b4bc6bebdc7	2026-02-10 09:15:04.24+00	\N	submitted	\N	3	Needs more practice on key steps.	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
5a16ac98-8787-4493-ac8d-c2653310d982	f69317f0-b80d-4f17-86eb-197d33698ffc	cecbea1b-e71b-4995-97cc-6254e7815265	2026-02-08 09:15:04.24+00	\N	submitted	\N	5	Needs more practice on key steps.	2026-02-10 09:15:04.24+00	2026-02-10 09:15:04.24+00
d90a894a-5f2c-46b5-90b9-dbc4d97b3d5b	53da4d4d-6137-4bb3-8ee5-63e27e969f0a	cdacd5ec-aa0b-4a66-8f17-0f767466513a	2025-12-26 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2025-12-27 09:15:04.24+00	2025-12-27 09:15:04.24+00
da29f1ac-a25a-478a-86ef-d6d8dd8494be	53da4d4d-6137-4bb3-8ee5-63e27e969f0a	85079b8e-4704-49b1-84ed-2d3c501654ee	2025-12-25 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-27 09:15:04.24+00	2025-12-27 09:15:04.24+00
2b302051-0348-4d67-ba4b-e541737c2144	53da4d4d-6137-4bb3-8ee5-63e27e969f0a	67d4f333-220d-4a64-bcd2-8dc53a56624c	2025-12-28 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-27 09:15:04.24+00	2025-12-27 09:15:04.24+00
7d695da4-e7cd-4a34-a091-7561c6526d84	53da4d4d-6137-4bb3-8ee5-63e27e969f0a	345bb275-556d-4960-b7de-28922983a7b2	2025-12-25 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	10	\N	2025-12-27 09:15:04.24+00	2025-12-27 09:15:04.24+00
6e6bc498-3386-44b8-a198-d9b0a1f3636f	53da4d4d-6137-4bb3-8ee5-63e27e969f0a	355120e6-b04a-46f7-876a-b5d7aab3bde0	2025-12-26 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-27 09:15:04.24+00	2025-12-27 09:15:04.24+00
d8a8aebd-e8ea-4c03-8227-feb3a74169ef	53da4d4d-6137-4bb3-8ee5-63e27e969f0a	c18f6551-43e9-4a77-a52e-954d93cee377	2025-12-30 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-27 09:15:04.24+00	2025-12-27 09:15:04.24+00
44721b5f-2cb8-4f6b-b25f-3bfab8c8e2ac	53da4d4d-6137-4bb3-8ee5-63e27e969f0a	b1965024-9f05-4ab8-a89c-9169ec08a541	2025-12-29 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-27 09:15:04.24+00	2025-12-27 09:15:04.24+00
8241e022-31f1-47d0-9d9c-d7ef8ebcfe13	53da4d4d-6137-4bb3-8ee5-63e27e969f0a	dde039c1-6339-4f2b-91fd-54a185c68b52	\N	\N	missed	\N	\N	\N	2025-12-27 09:15:04.24+00	2025-12-27 09:15:04.24+00
a27239c7-f550-4f8d-bf66-ba7c5562bf5b	53da4d4d-6137-4bb3-8ee5-63e27e969f0a	e700842a-602b-4ecb-8df6-96e43d98e00e	2025-12-25 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-27 09:15:04.24+00	2025-12-27 09:15:04.24+00
596fad07-5d3e-461d-a8f0-472905949d3e	53da4d4d-6137-4bb3-8ee5-63e27e969f0a	e0f448c8-7d42-4d39-bbcd-de58daff9420	\N	\N	missed	\N	\N	\N	2025-12-27 09:15:04.24+00	2025-12-27 09:15:04.24+00
0a58ab0b-a1fa-4372-9744-f262b7156296	53da4d4d-6137-4bb3-8ee5-63e27e969f0a	97dfe15c-dcba-496a-9e58-2720c211d00a	2025-12-25 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-27 09:15:04.24+00	2025-12-27 09:15:04.24+00
59766755-a15d-4a37-b0ac-13160cea1619	53da4d4d-6137-4bb3-8ee5-63e27e969f0a	7b46e55e-46b4-4cfd-8809-b6e205a6e567	2025-12-25 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2025-12-27 09:15:04.24+00	2025-12-27 09:15:04.24+00
4efdf09f-9c90-4def-b24d-54a5ba7dfe49	53da4d4d-6137-4bb3-8ee5-63e27e969f0a	60277f16-d457-4dc1-958d-a312a8d9471b	2025-12-25 09:15:04.24+00	\N	checked	\N	6	\N	2025-12-27 09:15:04.24+00	2025-12-27 09:15:04.24+00
31e88c57-6825-4465-ad13-517f12cf4a62	53da4d4d-6137-4bb3-8ee5-63e27e969f0a	9f6c81bf-ea4e-402f-96a1-968323555263	2025-12-28 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-27 09:15:04.24+00	2025-12-27 09:15:04.24+00
8f19c6f8-7757-4c0c-a0f1-d660d40181e1	53da4d4d-6137-4bb3-8ee5-63e27e969f0a	15a117ff-1cb4-49cf-8fd5-845f9061f160	\N	\N	missed	\N	\N	\N	2025-12-27 09:15:04.24+00	2025-12-27 09:15:04.24+00
c0ae5461-1871-442b-be2f-ae5acc3006bf	53da4d4d-6137-4bb3-8ee5-63e27e969f0a	e0633026-2d69-4e2f-9731-dc6e05038f24	2025-12-26 09:15:04.24+00	\N	checked	\N	7	\N	2025-12-27 09:15:04.24+00	2025-12-27 09:15:04.24+00
234cf731-944f-4f9b-bebd-0e4d403d33f9	53da4d4d-6137-4bb3-8ee5-63e27e969f0a	63e27c91-167e-44c0-b455-ca85896b666c	2025-12-25 09:15:04.24+00	\N	submitted	\N	5	Needs more practice on key steps.	2025-12-27 09:15:04.24+00	2025-12-27 09:15:04.24+00
af0b6fa0-effc-4e96-ba89-59f99f242007	53da4d4d-6137-4bb3-8ee5-63e27e969f0a	f684fc32-dcc9-4b44-bf14-112cd8958129	2025-12-25 09:15:04.24+00	\N	checked	\N	7	\N	2025-12-27 09:15:04.24+00	2025-12-27 09:15:04.24+00
f2af872b-a181-4723-bdb1-59d906151615	53da4d4d-6137-4bb3-8ee5-63e27e969f0a	4c7a3cbd-447c-4cbc-918d-8e923ce57b80	2025-12-27 09:15:04.24+00	\N	submitted	\N	6	\N	2025-12-27 09:15:04.24+00	2025-12-27 09:15:04.24+00
cf36ef3c-94e7-4c03-9b44-cbcf2df1a3bc	53da4d4d-6137-4bb3-8ee5-63e27e969f0a	503b5c9c-042c-4813-9898-63b129515ad7	2025-12-26 09:15:04.24+00	\N	checked	\N	4	Needs more practice on key steps.	2025-12-27 09:15:04.24+00	2025-12-27 09:15:04.24+00
e9b3815c-aad8-43f0-94d0-3f9ef368b877	53da4d4d-6137-4bb3-8ee5-63e27e969f0a	a6de668b-ecfa-4842-97a5-3cc27b34e1f6	2025-12-26 09:15:04.24+00	\N	submitted	\N	3	Needs more practice on key steps.	2025-12-27 09:15:04.24+00	2025-12-27 09:15:04.24+00
9c50c35d-d45a-4e66-808a-94ab692455f1	53da4d4d-6137-4bb3-8ee5-63e27e969f0a	2286be2d-ff3b-4c8e-8c16-0b4bc6bebdc7	2025-12-30 09:15:04.24+00	\N	late	\N	\N	\N	2025-12-27 09:15:04.24+00	2025-12-27 09:15:04.24+00
eabe32ea-e624-4af3-b030-2e9ac9967cb3	53da4d4d-6137-4bb3-8ee5-63e27e969f0a	cecbea1b-e71b-4995-97cc-6254e7815265	2025-12-25 09:15:04.24+00	\N	submitted	\N	6	\N	2025-12-27 09:15:04.24+00	2025-12-27 09:15:04.24+00
7c175de3-2667-4cd7-90ce-30fc487a8f95	384992f0-8523-4f19-aa03-93e8ee03a86c	cdacd5ec-aa0b-4a66-8f17-0f767466513a	2026-01-09 09:15:04.24+00	\N	late	\N	\N	\N	2026-01-06 09:15:04.24+00	2026-01-06 09:15:04.24+00
f9b853ef-684e-466e-b896-d60aca592f75	384992f0-8523-4f19-aa03-93e8ee03a86c	85079b8e-4704-49b1-84ed-2d3c501654ee	2026-01-04 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	10	\N	2026-01-06 09:15:04.24+00	2026-01-06 09:15:04.24+00
8e0825a8-362d-49bc-978b-51455ea8c9b3	384992f0-8523-4f19-aa03-93e8ee03a86c	67d4f333-220d-4a64-bcd2-8dc53a56624c	2026-01-05 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	10	\N	2026-01-06 09:15:04.24+00	2026-01-06 09:15:04.24+00
ad5ed78f-3697-423f-8d1d-095042e86a29	384992f0-8523-4f19-aa03-93e8ee03a86c	345bb275-556d-4960-b7de-28922983a7b2	2026-01-06 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	9	\N	2026-01-06 09:15:04.24+00	2026-01-06 09:15:04.24+00
8d100de1-918c-4d02-907c-b7c574c38cef	384992f0-8523-4f19-aa03-93e8ee03a86c	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	2026-01-04 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-01-06 09:15:04.24+00	2026-01-06 09:15:04.24+00
da17bff1-a30a-447b-bd54-b6e85ac5b6cc	384992f0-8523-4f19-aa03-93e8ee03a86c	c18f6551-43e9-4a77-a52e-954d93cee377	2026-01-04 09:15:04.24+00	\N	checked	\N	7	\N	2026-01-06 09:15:04.24+00	2026-01-06 09:15:04.24+00
e577462a-f304-42ea-b4c9-0b6f3e51a05b	384992f0-8523-4f19-aa03-93e8ee03a86c	d7e84df8-3a50-4db2-96a7-f478ff5f9764	2026-01-08 09:15:04.24+00	\N	late	\N	\N	\N	2026-01-06 09:15:04.24+00	2026-01-06 09:15:04.24+00
473792b0-ef5c-4cb0-a333-8316342b70a6	384992f0-8523-4f19-aa03-93e8ee03a86c	b1965024-9f05-4ab8-a89c-9169ec08a541	2026-01-06 09:15:04.24+00	\N	checked	\N	7	\N	2026-01-06 09:15:04.24+00	2026-01-06 09:15:04.24+00
b6076ca1-c1ab-4e5d-a80a-cf62576b1c62	384992f0-8523-4f19-aa03-93e8ee03a86c	dde039c1-6339-4f2b-91fd-54a185c68b52	2026-01-07 09:15:04.24+00	\N	late	\N	\N	\N	2026-01-06 09:15:04.24+00	2026-01-06 09:15:04.24+00
3d080d9d-92f8-4b9a-b0e6-2683c1a82b43	384992f0-8523-4f19-aa03-93e8ee03a86c	e700842a-602b-4ecb-8df6-96e43d98e00e	2026-01-04 09:15:04.24+00	\N	checked	\N	7	\N	2026-01-06 09:15:04.24+00	2026-01-06 09:15:04.24+00
6b7d2ba7-46b7-4eac-aced-f5a3ea2eb98a	384992f0-8523-4f19-aa03-93e8ee03a86c	e0f448c8-7d42-4d39-bbcd-de58daff9420	2026-01-04 09:15:04.24+00	\N	checked	\N	7	\N	2026-01-06 09:15:04.24+00	2026-01-06 09:15:04.24+00
616f33c1-b4dd-4fca-87c3-760ccc90ae20	384992f0-8523-4f19-aa03-93e8ee03a86c	97dfe15c-dcba-496a-9e58-2720c211d00a	2026-01-04 09:15:04.24+00	\N	checked	{"summary": "Great work, keep practicing!"}	9	\N	2026-01-06 09:15:04.24+00	2026-01-06 09:15:04.24+00
00b7bbce-4a6e-48fe-9aa1-aa310d842084	384992f0-8523-4f19-aa03-93e8ee03a86c	7b46e55e-46b4-4cfd-8809-b6e205a6e567	2026-01-05 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2026-01-06 09:15:04.24+00	2026-01-06 09:15:04.24+00
3477955c-a337-4b9d-be51-166395b25ebe	384992f0-8523-4f19-aa03-93e8ee03a86c	772182f8-2921-4fe3-a427-8c86cca2f2db	2026-01-08 09:15:04.24+00	\N	late	\N	\N	\N	2026-01-06 09:15:04.24+00	2026-01-06 09:15:04.24+00
680f4b48-c17b-4cc5-9ddd-ca01a3fd85d3	384992f0-8523-4f19-aa03-93e8ee03a86c	9f6c81bf-ea4e-402f-96a1-968323555263	2026-01-05 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-01-06 09:15:04.24+00	2026-01-06 09:15:04.24+00
00925141-6908-47c0-8825-a0cbd8c31754	384992f0-8523-4f19-aa03-93e8ee03a86c	5835a0de-c500-4ad7-b0e2-76aa107db95c	2026-01-06 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2026-01-06 09:15:04.24+00	2026-01-06 09:15:04.24+00
83198a1a-4631-420b-b825-703725ad93f8	384992f0-8523-4f19-aa03-93e8ee03a86c	15a117ff-1cb4-49cf-8fd5-845f9061f160	2026-01-05 09:15:04.24+00	\N	submitted	\N	7	\N	2026-01-06 09:15:04.24+00	2026-01-06 09:15:04.24+00
a0e4aad2-bab3-4d38-833e-1cab54a3ab19	384992f0-8523-4f19-aa03-93e8ee03a86c	e0633026-2d69-4e2f-9731-dc6e05038f24	\N	\N	missed	\N	\N	\N	2026-01-06 09:15:04.24+00	2026-01-06 09:15:04.24+00
888cddf4-33fb-46c8-91b9-b69a604b4b3b	384992f0-8523-4f19-aa03-93e8ee03a86c	63e27c91-167e-44c0-b455-ca85896b666c	\N	\N	missed	\N	\N	\N	2026-01-06 09:15:04.24+00	2026-01-06 09:15:04.24+00
4291edea-756e-467f-b426-be36e81568e7	384992f0-8523-4f19-aa03-93e8ee03a86c	503b5c9c-042c-4813-9898-63b129515ad7	2026-01-04 09:15:04.24+00	\N	checked	\N	4	Needs more practice on key steps.	2026-01-06 09:15:04.24+00	2026-01-06 09:15:04.24+00
d43f88df-5aab-4a8d-aeb3-cd55d2f85d48	384992f0-8523-4f19-aa03-93e8ee03a86c	a6de668b-ecfa-4842-97a5-3cc27b34e1f6	2026-01-05 09:15:04.24+00	\N	submitted	\N	6	\N	2026-01-06 09:15:04.24+00	2026-01-06 09:15:04.24+00
f847ca7c-4268-4f39-80d0-dc8b775346b7	384992f0-8523-4f19-aa03-93e8ee03a86c	b470a0a0-fa44-468e-8b5e-102d68c08ed4	2026-01-05 09:15:04.24+00	\N	submitted	\N	6	\N	2026-01-06 09:15:04.24+00	2026-01-06 09:15:04.24+00
75750faf-b858-4d42-89ed-ac46f9eb940e	384992f0-8523-4f19-aa03-93e8ee03a86c	acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	2026-01-05 09:15:04.24+00	\N	submitted	\N	6	\N	2026-01-06 09:15:04.24+00	2026-01-06 09:15:04.24+00
aff8c432-e021-4b50-b3da-b5fd3206ad32	384992f0-8523-4f19-aa03-93e8ee03a86c	60498abe-fb45-4fce-b715-796c6ad2a7b1	2026-01-04 09:15:04.24+00	\N	submitted	\N	3	Needs more practice on key steps.	2026-01-06 09:15:04.24+00	2026-01-06 09:15:04.24+00
769370dc-c40a-47bc-9d75-81ebc8b1575a	384992f0-8523-4f19-aa03-93e8ee03a86c	cecbea1b-e71b-4995-97cc-6254e7815265	2026-01-05 09:15:04.24+00	\N	submitted	\N	5	Needs more practice on key steps.	2026-01-06 09:15:04.24+00	2026-01-06 09:15:04.24+00
3754c4e1-52b9-4340-bccf-11fe4a5ba578	e9b1095f-ccd3-41a5-ad1f-2f998f7298de	cdacd5ec-aa0b-4a66-8f17-0f767466513a	2026-02-05 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	10	\N	2026-02-06 09:15:04.24+00	2026-02-06 09:15:04.24+00
388ebc20-e381-40bb-a59a-aaf18b127e4f	e9b1095f-ccd3-41a5-ad1f-2f998f7298de	85079b8e-4704-49b1-84ed-2d3c501654ee	2026-02-06 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-06 09:15:04.24+00	2026-02-06 09:15:04.24+00
dbfa7585-9323-4ef3-8d52-c90acc66c37e	e9b1095f-ccd3-41a5-ad1f-2f998f7298de	67d4f333-220d-4a64-bcd2-8dc53a56624c	2026-02-05 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	10	\N	2026-02-06 09:15:04.24+00	2026-02-06 09:15:04.24+00
05fc4894-4655-40c5-bb5f-07b8487cd2d8	e9b1095f-ccd3-41a5-ad1f-2f998f7298de	345bb275-556d-4960-b7de-28922983a7b2	2026-02-06 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2026-02-06 09:15:04.24+00	2026-02-06 09:15:04.24+00
9eddd06f-59cd-4806-bde7-c50a4511465b	e9b1095f-ccd3-41a5-ad1f-2f998f7298de	355120e6-b04a-46f7-876a-b5d7aab3bde0	2026-02-05 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2026-02-06 09:15:04.24+00	2026-02-06 09:15:04.24+00
062fc822-ae14-49c8-9af6-8da98b247513	e9b1095f-ccd3-41a5-ad1f-2f998f7298de	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	2026-02-04 09:15:04.24+00	\N	submitted	\N	7	\N	2026-02-06 09:15:04.24+00	2026-02-06 09:15:04.24+00
5852e6a9-bed9-4d59-ae2d-59deb5e90e14	e9b1095f-ccd3-41a5-ad1f-2f998f7298de	d7e84df8-3a50-4db2-96a7-f478ff5f9764	2026-02-04 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	8	\N	2026-02-06 09:15:04.24+00	2026-02-06 09:15:04.24+00
ba09e7ad-3cd8-4808-a7a1-d4d321d157e2	e9b1095f-ccd3-41a5-ad1f-2f998f7298de	b1965024-9f05-4ab8-a89c-9169ec08a541	2026-02-06 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-06 09:15:04.24+00	2026-02-06 09:15:04.24+00
6199a88a-5645-41c9-bd6b-db583b1357f8	e9b1095f-ccd3-41a5-ad1f-2f998f7298de	dde039c1-6339-4f2b-91fd-54a185c68b52	2026-02-05 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-06 09:15:04.24+00	2026-02-06 09:15:04.24+00
82c0cb56-c720-425f-8bf5-9c28b939fb03	e9b1095f-ccd3-41a5-ad1f-2f998f7298de	60277f16-d457-4dc1-958d-a312a8d9471b	2026-02-04 09:15:04.24+00	\N	submitted	\N	7	\N	2026-02-06 09:15:04.24+00	2026-02-06 09:15:04.24+00
226326a3-6fea-4e09-a41d-9b54a7552df2	e9b1095f-ccd3-41a5-ad1f-2f998f7298de	772182f8-2921-4fe3-a427-8c86cca2f2db	2026-02-06 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2026-02-06 09:15:04.24+00	2026-02-06 09:15:04.24+00
471b30d4-a027-4824-b593-b0006fc24832	e9b1095f-ccd3-41a5-ad1f-2f998f7298de	5835a0de-c500-4ad7-b0e2-76aa107db95c	2026-02-06 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-06 09:15:04.24+00	2026-02-06 09:15:04.24+00
99203977-1db0-429a-b1a2-d16db6249f45	e9b1095f-ccd3-41a5-ad1f-2f998f7298de	15a117ff-1cb4-49cf-8fd5-845f9061f160	2026-02-05 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-06 09:15:04.24+00	2026-02-06 09:15:04.24+00
af66f36e-56d5-4e4c-9927-67fbe63da5ec	e9b1095f-ccd3-41a5-ad1f-2f998f7298de	e0633026-2d69-4e2f-9731-dc6e05038f24	2026-02-05 09:15:04.24+00	\N	submitted	{"summary": "Great work, keep practicing!"}	9	\N	2026-02-06 09:15:04.24+00	2026-02-06 09:15:04.24+00
7f4d5487-6a6c-4e9e-b8bf-4e895cb829a4	e9b1095f-ccd3-41a5-ad1f-2f998f7298de	63e27c91-167e-44c0-b455-ca85896b666c	2026-02-04 09:15:04.24+00	\N	submitted	\N	3	Needs more practice on key steps.	2026-02-06 09:15:04.24+00	2026-02-06 09:15:04.24+00
99b76371-cabf-48a7-acfd-29b558b6bdff	e9b1095f-ccd3-41a5-ad1f-2f998f7298de	f684fc32-dcc9-4b44-bf14-112cd8958129	2026-02-05 09:15:04.24+00	\N	submitted	\N	5	Needs more practice on key steps.	2026-02-06 09:15:04.24+00	2026-02-06 09:15:04.24+00
2fbff52e-82b0-43fe-8629-a1c0e7ae5966	e9b1095f-ccd3-41a5-ad1f-2f998f7298de	4c7a3cbd-447c-4cbc-918d-8e923ce57b80	2026-02-06 09:15:04.24+00	\N	submitted	\N	3	Needs more practice on key steps.	2026-02-06 09:15:04.24+00	2026-02-06 09:15:04.24+00
f210142a-0824-4f3b-8626-ddcae013cce8	e9b1095f-ccd3-41a5-ad1f-2f998f7298de	503b5c9c-042c-4813-9898-63b129515ad7	2026-02-04 09:15:04.24+00	\N	submitted	\N	4	Needs more practice on key steps.	2026-02-06 09:15:04.24+00	2026-02-06 09:15:04.24+00
dda25435-4243-481e-908c-dddf4ae64d7e	e9b1095f-ccd3-41a5-ad1f-2f998f7298de	a6de668b-ecfa-4842-97a5-3cc27b34e1f6	2026-02-06 09:15:04.24+00	\N	submitted	\N	4	Needs more practice on key steps.	2026-02-06 09:15:04.24+00	2026-02-06 09:15:04.24+00
78c7f9a1-17e0-45ac-b3cd-187e7b16e498	e9b1095f-ccd3-41a5-ad1f-2f998f7298de	b470a0a0-fa44-468e-8b5e-102d68c08ed4	2026-02-04 09:15:04.24+00	\N	submitted	\N	4	Needs more practice on key steps.	2026-02-06 09:15:04.24+00	2026-02-06 09:15:04.24+00
f1036af7-81d5-4720-9768-2d3e573cec0e	e9b1095f-ccd3-41a5-ad1f-2f998f7298de	2286be2d-ff3b-4c8e-8c16-0b4bc6bebdc7	2026-02-04 09:15:04.24+00	\N	submitted	\N	7	\N	2026-02-06 09:15:04.24+00	2026-02-06 09:15:04.24+00
ec14eb74-07f0-4bf6-9dbf-5c41540a21ef	e9b1095f-ccd3-41a5-ad1f-2f998f7298de	60498abe-fb45-4fce-b715-796c6ad2a7b1	2026-02-05 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-06 09:15:04.24+00	2026-02-06 09:15:04.24+00
20d38d05-56b6-4c05-97f8-185f33b4d2ab	e9b1095f-ccd3-41a5-ad1f-2f998f7298de	cecbea1b-e71b-4995-97cc-6254e7815265	2026-02-04 09:15:04.24+00	\N	submitted	\N	6	\N	2026-02-06 09:15:04.24+00	2026-02-06 09:15:04.24+00
\.


--
-- TOC entry 3929 (class 0 OID 24707)
-- Dependencies: 226
-- Data for Name: lesson_plans; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.lesson_plans (id, teacher_id, class_id, subject_id, date, topics, student_queries, weak_areas, ai_recommendation, status, completed_at, feedback_collected, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3930 (class 0 OID 24719)
-- Dependencies: 227
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.profiles (id, full_name, avatar_url, phone, created_at, updated_at) FROM stdin;
ec0eb6d5-25df-4e35-9940-bc34abcd8ed9	Ram Prasad Adhikari	\N	+977-9868990337	2025-12-02 09:15:04.24+00	2026-01-19 09:15:04.24+00
85d68757-04d1-4213-a3f5-8af479bceb4a	Sita Devi Kandel	\N	+977-9818207746	2025-12-05 09:15:04.24+00	2026-01-09 09:15:04.24+00
b9ec8689-5563-4d7d-a5b6-965e3d32b275	Krishna Raj Sharma	\N	+977-9889158204	2025-12-03 09:15:04.24+00	2026-01-12 09:15:04.24+00
836c6d73-d9ef-44c9-abb0-73c24cd900f2	Laxmi Kumari Thapa	\N	+977-9811805538	2025-12-05 09:15:04.24+00	2026-01-05 09:15:04.24+00
7fd08be2-a61e-4a2a-905c-b2fc005155c5	Hari Bahadur Gurung	\N	+977-9869951839	2025-12-01 09:15:04.24+00	2025-12-30 09:15:04.24+00
ac2ec10f-3a2c-4674-81e1-f72c983de087	Sunil Manandhar	\N	+977-9865309473	2025-11-30 09:15:04.24+00	2025-12-27 09:15:04.24+00
cdacd5ec-aa0b-4a66-8f17-0f767466513a	Aarav Sharma	\N	+977-9879724864	2025-12-01 09:15:04.24+00	2025-12-18 09:15:04.24+00
85079b8e-4704-49b1-84ed-2d3c501654ee	Pooja Adhikari	\N	+977-9863184061	2025-12-07 09:15:04.24+00	2026-01-18 09:15:04.24+00
67d4f333-220d-4a64-bcd2-8dc53a56624c	Sanjay Karki	\N	+977-9861793333	2025-12-01 09:15:04.24+00	2026-01-06 09:15:04.24+00
345bb275-556d-4960-b7de-28922983a7b2	Nisha Gurung	\N	+977-9836990644	2025-12-07 09:15:04.24+00	2026-01-08 09:15:04.24+00
355120e6-b04a-46f7-876a-b5d7aab3bde0	Prabin Shrestha	\N	+977-9814070015	2025-12-10 09:15:04.24+00	2026-01-16 09:15:04.24+00
4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	Shruti Khatri	\N	+977-9850441561	2025-12-01 09:15:04.24+00	2025-12-30 09:15:04.24+00
c18f6551-43e9-4a77-a52e-954d93cee377	Niraj Bhandari	\N	+977-9844915702	2025-12-01 09:15:04.24+00	2026-01-22 09:15:04.24+00
d7e84df8-3a50-4db2-96a7-f478ff5f9764	Sushma Rai	\N	+977-9855342193	2025-12-08 09:15:04.24+00	2026-01-22 09:15:04.24+00
b1965024-9f05-4ab8-a89c-9169ec08a541	Bikash Thapa	\N	+977-9887694505	2025-12-09 09:15:04.24+00	2025-12-27 09:15:04.24+00
dde039c1-6339-4f2b-91fd-54a185c68b52	Ritika Poudel	\N	+977-9843091930	2025-12-04 09:15:04.24+00	2025-12-29 09:15:04.24+00
e700842a-602b-4ecb-8df6-96e43d98e00e	Anil Joshi	\N	+977-9837805995	2025-12-04 09:15:04.24+00	2026-01-05 09:15:04.24+00
e0f448c8-7d42-4d39-bbcd-de58daff9420	Suyog Tamang	\N	+977-9886341372	2025-12-06 09:15:04.24+00	2026-01-04 09:15:04.24+00
97dfe15c-dcba-496a-9e58-2720c211d00a	Rojina Basnet	\N	+977-9863807783	2025-12-01 09:15:04.24+00	2026-01-14 09:15:04.24+00
7b46e55e-46b4-4cfd-8809-b6e205a6e567	Kiran Gautam	\N	+977-9877744087	2025-12-02 09:15:04.24+00	2026-01-03 09:15:04.24+00
60277f16-d457-4dc1-958d-a312a8d9471b	Anusha Lama	\N	+977-9844492087	2025-12-05 09:15:04.24+00	2026-01-23 09:15:04.24+00
772182f8-2921-4fe3-a427-8c86cca2f2db	Dipesh Acharya	\N	+977-9850132392	2025-12-08 09:15:04.24+00	2025-12-21 09:15:04.24+00
9f6c81bf-ea4e-402f-96a1-968323555263	Nirmala Khadka	\N	+977-9895909728	2025-12-08 09:15:04.24+00	2025-12-28 09:15:04.24+00
5835a0de-c500-4ad7-b0e2-76aa107db95c	Bibek Dahal	\N	+977-9883145710	2025-12-08 09:15:04.24+00	2025-12-20 09:15:04.24+00
15a117ff-1cb4-49cf-8fd5-845f9061f160	Isha Shahi	\N	+977-9819888095	2025-12-07 09:15:04.24+00	2025-12-22 09:15:04.24+00
e0633026-2d69-4e2f-9731-dc6e05038f24	Roshan Baral	\N	+977-9824889590	2025-12-01 09:15:04.24+00	2026-01-01 09:15:04.24+00
63e27c91-167e-44c0-b455-ca85896b666c	Manisha Ghimire	\N	+977-9862856833	2025-11-30 09:15:04.24+00	2025-12-26 09:15:04.24+00
f684fc32-dcc9-4b44-bf14-112cd8958129	Sagar Bhusal	\N	+977-9843346849	2025-12-02 09:15:04.24+00	2025-12-28 09:15:04.24+00
4c7a3cbd-447c-4cbc-918d-8e923ce57b80	Samikshya Maharjan	\N	+977-9881403231	2025-12-02 09:15:04.24+00	2025-12-24 09:15:04.24+00
503b5c9c-042c-4813-9898-63b129515ad7	Ujjwal Pandey	\N	+977-9815323356	2025-11-30 09:15:04.24+00	2026-01-10 09:15:04.24+00
a6de668b-ecfa-4842-97a5-3cc27b34e1f6	Sneha Regmi	\N	+977-9844794948	2025-12-08 09:15:04.24+00	2025-12-21 09:15:04.24+00
b470a0a0-fa44-468e-8b5e-102d68c08ed4	Ritesh Magar	\N	+977-9849373819	2025-12-05 09:15:04.24+00	2026-01-12 09:15:04.24+00
acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	Sabina KC	\N	+977-9828393172	2025-12-04 09:15:04.24+00	2025-12-29 09:15:04.24+00
2286be2d-ff3b-4c8e-8c16-0b4bc6bebdc7	Sanjeev Panta	\N	+977-9811936336	2025-12-01 09:15:04.24+00	2026-01-06 09:15:04.24+00
60498abe-fb45-4fce-b715-796c6ad2a7b1	Aashish Chaudhary	\N	+977-9858044146	2025-12-09 09:15:04.24+00	2025-12-24 09:15:04.24+00
cecbea1b-e71b-4995-97cc-6254e7815265	Lina Roka	\N	+977-9825141535	2025-12-02 09:15:04.24+00	2026-01-11 09:15:04.24+00
\.


--
-- TOC entry 3931 (class 0 OID 24728)
-- Dependencies: 228
-- Data for Name: resources; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.resources (id, subject_id, chapter, title, type, url, is_bookmarked, recommended, created_at) FROM stdin;
a7d39d15-92b0-48c1-87fc-7c4cb783a64e	4f254b63-c125-47b9-abb0-3066aca8adf1	Chapter 1	Mathematics Quick Revision Notes	pdf	#	f	t	2025-12-10 09:15:04.24+00
f1e968cd-6bb6-44f0-aa26-fedecf0ef895	4f254b63-c125-47b9-abb0-3066aca8adf1	Chapter 2	Mathematics Concept Video	video	#	t	t	2025-12-20 09:15:04.24+00
a9ebb871-5db4-47b4-8810-9d74a36ca97c	4f254b63-c125-47b9-abb0-3066aca8adf1	Chapter 3	Mathematics Practice Set	pdf	#	f	f	2025-12-30 09:15:04.24+00
12751e71-313e-4422-93d4-e11d2918bcbe	933ccbee-242b-44be-b6ab-729d5bd6d691	Chapter 1	Science Quick Revision Notes	pdf	#	f	t	2025-12-10 09:15:04.24+00
a72d05b2-e2f4-4513-a04b-47377b894d6d	933ccbee-242b-44be-b6ab-729d5bd6d691	Chapter 2	Science Concept Video	video	#	t	t	2025-12-20 09:15:04.24+00
1ccc5af8-c5a3-482f-8829-71d258f14164	933ccbee-242b-44be-b6ab-729d5bd6d691	Chapter 3	Science Practice Set	pdf	#	f	f	2025-12-30 09:15:04.24+00
adcf2512-2388-47f8-a877-266add917017	2061036e-3ae3-4a41-8a6e-be022c0c38b5	Chapter 1	English Quick Revision Notes	pdf	#	f	t	2025-12-10 09:15:04.24+00
a7fbe775-7bef-4005-9fc6-cd6f5f132d4d	2061036e-3ae3-4a41-8a6e-be022c0c38b5	Chapter 2	English Concept Video	video	#	t	t	2025-12-20 09:15:04.24+00
e3d247d4-8b1a-49ad-8a2d-d3ddd7e5f43b	2061036e-3ae3-4a41-8a6e-be022c0c38b5	Chapter 3	English Practice Set	pdf	#	f	f	2025-12-30 09:15:04.24+00
d4cb39bd-03a5-44f7-89f8-39c5635d32a5	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	Chapter 1	Nepali Quick Revision Notes	pdf	#	f	t	2025-12-10 09:15:04.24+00
825d11b9-783c-4a98-b6fe-0cc87303fe1a	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	Chapter 2	Nepali Concept Video	video	#	t	t	2025-12-20 09:15:04.24+00
a3800bd3-a9a0-4084-a215-3a4404421ae9	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	Chapter 3	Nepali Practice Set	pdf	#	f	f	2025-12-30 09:15:04.24+00
e981b5af-5108-4f49-8c86-2d5d7d49310e	fe69fe37-af8d-4db5-be75-5260099a06bc	Chapter 1	Social Studies Quick Revision Notes	pdf	#	f	t	2025-12-10 09:15:04.24+00
c246b657-6ca2-4375-8433-406a83a13e59	fe69fe37-af8d-4db5-be75-5260099a06bc	Chapter 2	Social Studies Concept Video	video	#	t	t	2025-12-20 09:15:04.24+00
351f100c-edee-453e-8903-04ea23766672	fe69fe37-af8d-4db5-be75-5260099a06bc	Chapter 3	Social Studies Practice Set	pdf	#	f	f	2025-12-30 09:15:04.24+00
b7a2e775-6ecf-41dc-8401-04b01c5950ed	3d83b951-f597-4f18-952b-0040470020bb	Chapter 1	Computer Science Quick Revision Notes	pdf	#	f	t	2025-12-10 09:15:04.24+00
38b25915-1ac2-45d6-93fb-dac9d5c167b0	3d83b951-f597-4f18-952b-0040470020bb	Chapter 2	Computer Science Concept Video	video	#	t	t	2025-12-20 09:15:04.24+00
3cf53e74-e392-4ea6-8a41-42fbf82d03f7	3d83b951-f597-4f18-952b-0040470020bb	Chapter 3	Computer Science Practice Set	pdf	#	f	f	2025-12-30 09:15:04.24+00
\.


--
-- TOC entry 3932 (class 0 OID 24739)
-- Dependencies: 229
-- Data for Name: schools; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.schools (id, name, address, type, contact_phone, contact_email, created_at, updated_at) FROM stdin;
94d11654-f1c3-4d68-a104-ac1cded8e13f	NeuraFix Secondary School		secondary			2025-11-30 09:15:04.24+00	2025-11-30 09:15:04.24+00
\.


--
-- TOC entry 3933 (class 0 OID 24750)
-- Dependencies: 230
-- Data for Name: student_learning_insights; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.student_learning_insights (id, student_id, subject_id, strengths, weaknesses, recommended_topics, progress_trend, last_updated) FROM stdin;
2b83b3fd-cd91-4088-8283-f4ba3973f0ae	cdacd5ec-aa0b-4a66-8f17-0f767466513a	4f254b63-c125-47b9-abb0-3066aca8adf1	{algebra,"linear equations"}	{"word problems","quadratic formula"}	{"concept map","revision set"}	improving	2026-01-09 09:15:04.24+00
7ab608c7-e0f3-42b1-8f8f-d48836be4aaf	cdacd5ec-aa0b-4a66-8f17-0f767466513a	933ccbee-242b-44be-b6ab-729d5bd6d691	{"lab skills","basic concepts"}	{numericals,"theory recall"}	{"practice quiz","daily recap"}	improving	2026-01-27 09:15:04.24+00
b0a53be7-9dad-4de1-b943-c0ec8f3c8940	cdacd5ec-aa0b-4a66-8f17-0f767466513a	2061036e-3ae3-4a41-8a6e-be022c0c38b5	{"grammar basics","reading comprehension"}	{"essay structure","tense usage"}	{"concept map","revision set"}	improving	2026-01-22 09:15:04.24+00
68457fcf-7dd3-4db1-8dca-4710a04d28ce	cdacd5ec-aa0b-4a66-8f17-0f767466513a	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	{"कविता विश्लेषण",व्याकरण}	{"विस्तृत उत्तर","शुद्ध लेखन"}	{"concept map","practice quiz"}	improving	2026-01-20 09:15:04.24+00
5c1a47e0-ca8c-47a7-a6bc-fd2d56f6d5ab	cdacd5ec-aa0b-4a66-8f17-0f767466513a	fe69fe37-af8d-4db5-be75-5260099a06bc	{civics,"history recall"}	{"case studies","current affairs"}	{"concept map","practice quiz"}	improving	2026-01-25 09:15:04.24+00
0345f329-5efb-4175-b0da-ae3969210ab1	cdacd5ec-aa0b-4a66-8f17-0f767466513a	3d83b951-f597-4f18-952b-0040470020bb	{"software tools","logic building"}	{"program flow",debugging}	{"daily recap","practice quiz"}	improving	2026-01-11 09:15:04.24+00
4d63dfd3-3ea0-4cda-9f47-798f10853da5	85079b8e-4704-49b1-84ed-2d3c501654ee	4f254b63-c125-47b9-abb0-3066aca8adf1	{algebra,"linear equations"}	{"word problems","quadratic formula"}	{"practice quiz","revision set"}	improving	2026-01-23 09:15:04.24+00
58bf85cd-c9e5-46d0-b240-3ddffea25f6a	85079b8e-4704-49b1-84ed-2d3c501654ee	933ccbee-242b-44be-b6ab-729d5bd6d691	{"basic concepts",observations}	{"theory recall",numericals}	{"concept map","daily recap"}	improving	2026-01-18 09:15:04.24+00
d0edb7c7-30c9-4779-adbd-e9b2cc09383b	85079b8e-4704-49b1-84ed-2d3c501654ee	2061036e-3ae3-4a41-8a6e-be022c0c38b5	{vocabulary,"grammar basics"}	{"essay structure","tense usage"}	{"practice quiz","revision set"}	improving	2026-01-18 09:15:04.24+00
8bfc9ac6-5b2c-4921-ba9e-795f807e0294	85079b8e-4704-49b1-84ed-2d3c501654ee	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	{"कविता विश्लेषण","निबन्ध लेखन"}	{"शुद्ध लेखन","विस्तृत उत्तर"}	{"revision set","concept map"}	improving	2026-01-26 09:15:04.24+00
a6f48e6e-79c4-48b7-97d3-d6eb7cb5eaa7	85079b8e-4704-49b1-84ed-2d3c501654ee	fe69fe37-af8d-4db5-be75-5260099a06bc	{civics,"map skills"}	{"case studies","current affairs"}	{"concept map","revision set"}	improving	2026-01-22 09:15:04.24+00
559cf11c-6ca0-4519-a5eb-1b65339e7e49	85079b8e-4704-49b1-84ed-2d3c501654ee	3d83b951-f597-4f18-952b-0040470020bb	{"software tools","html basics"}	{"program flow",debugging}	{"daily recap","revision set"}	improving	2026-01-10 09:15:04.24+00
3fcd3944-1110-4884-9a82-98087ba1aaf9	67d4f333-220d-4a64-bcd2-8dc53a56624c	4f254b63-c125-47b9-abb0-3066aca8adf1	{"linear equations","set theory"}	{"quadratic formula","word problems"}	{"daily recap","practice quiz"}	improving	2026-01-24 09:15:04.24+00
e8aaeec9-5e23-4522-877a-ec5e50847048	67d4f333-220d-4a64-bcd2-8dc53a56624c	933ccbee-242b-44be-b6ab-729d5bd6d691	{"lab skills","basic concepts"}	{"theory recall",numericals}	{"revision set","practice quiz"}	improving	2026-01-27 09:15:04.24+00
558c555f-ee03-435e-9769-7c5b0e6a4ce0	67d4f333-220d-4a64-bcd2-8dc53a56624c	2061036e-3ae3-4a41-8a6e-be022c0c38b5	{"grammar basics","reading comprehension"}	{"tense usage","essay structure"}	{"daily recap","revision set"}	improving	2026-01-16 09:15:04.24+00
be0d0ee1-ece3-49b9-a39b-7466a1e1be88	67d4f333-220d-4a64-bcd2-8dc53a56624c	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	{व्याकरण,"निबन्ध लेखन"}	{"विस्तृत उत्तर","शुद्ध लेखन"}	{"daily recap","concept map"}	improving	2026-01-16 09:15:04.24+00
a828425f-552d-4e00-a4ed-bb531698963a	67d4f333-220d-4a64-bcd2-8dc53a56624c	fe69fe37-af8d-4db5-be75-5260099a06bc	{"map skills","history recall"}	{"case studies","current affairs"}	{"daily recap","revision set"}	improving	2026-01-19 09:15:04.24+00
47f97da6-cd3b-480a-9130-168c563a7991	67d4f333-220d-4a64-bcd2-8dc53a56624c	3d83b951-f597-4f18-952b-0040470020bb	{"html basics","software tools"}	{"program flow",debugging}	{"practice quiz","concept map"}	improving	2026-01-11 09:15:04.24+00
eb117726-ae5e-4030-8be0-b3e05b8e503e	345bb275-556d-4960-b7de-28922983a7b2	4f254b63-c125-47b9-abb0-3066aca8adf1	{"linear equations",algebra}	{"word problems","quadratic formula"}	{"practice quiz","daily recap"}	improving	2026-01-20 09:15:04.24+00
1055ee05-5ab7-462b-8f16-178f154979b1	345bb275-556d-4960-b7de-28922983a7b2	933ccbee-242b-44be-b6ab-729d5bd6d691	{observations,"basic concepts"}	{"theory recall",numericals}	{"revision set","practice quiz"}	improving	2026-01-24 09:15:04.24+00
52a80352-6b06-484a-aea7-7a1ed5477cd7	345bb275-556d-4960-b7de-28922983a7b2	2061036e-3ae3-4a41-8a6e-be022c0c38b5	{"grammar basics","reading comprehension"}	{"tense usage","essay structure"}	{"revision set","concept map"}	improving	2026-01-25 09:15:04.24+00
6045667a-48c9-4146-9cbd-b08fc75b3e0f	345bb275-556d-4960-b7de-28922983a7b2	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	{"निबन्ध लेखन",व्याकरण}	{"शुद्ध लेखन","विस्तृत उत्तर"}	{"practice quiz","concept map"}	improving	2026-01-16 09:15:04.24+00
21aa9120-2ab7-45f2-a301-2f1250bd2f2d	345bb275-556d-4960-b7de-28922983a7b2	fe69fe37-af8d-4db5-be75-5260099a06bc	{"history recall",civics}	{"current affairs","case studies"}	{"practice quiz","revision set"}	improving	2026-01-16 09:15:04.24+00
2d963bdd-e8c4-44c6-829a-b9239474ab84	345bb275-556d-4960-b7de-28922983a7b2	3d83b951-f597-4f18-952b-0040470020bb	{"html basics","software tools"}	{debugging,"program flow"}	{"concept map","practice quiz"}	improving	2026-01-11 09:15:04.24+00
281553af-fc2c-4380-bda4-bfd84295fae2	355120e6-b04a-46f7-876a-b5d7aab3bde0	4f254b63-c125-47b9-abb0-3066aca8adf1	{algebra,"set theory"}	{"quadratic formula","word problems"}	{"concept map","daily recap"}	improving	2026-01-11 09:15:04.24+00
ce8c61b7-5592-46d8-83b6-1c8d1a8880bf	355120e6-b04a-46f7-876a-b5d7aab3bde0	933ccbee-242b-44be-b6ab-729d5bd6d691	{observations,"lab skills"}	{numericals,"theory recall"}	{"daily recap","revision set"}	improving	2026-01-13 09:15:04.24+00
f724ed92-4eb6-48bb-8762-738334db1678	355120e6-b04a-46f7-876a-b5d7aab3bde0	2061036e-3ae3-4a41-8a6e-be022c0c38b5	{"reading comprehension",vocabulary}	{"tense usage","essay structure"}	{"revision set","concept map"}	improving	2026-01-10 09:15:04.24+00
5c795686-91e5-4f17-b409-c5ab50520dd6	355120e6-b04a-46f7-876a-b5d7aab3bde0	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	{"निबन्ध लेखन","कविता विश्लेषण"}	{"विस्तृत उत्तर","शुद्ध लेखन"}	{"concept map","daily recap"}	improving	2026-01-27 09:15:04.24+00
75427ec5-5001-4c8d-8455-4f16813c224f	355120e6-b04a-46f7-876a-b5d7aab3bde0	fe69fe37-af8d-4db5-be75-5260099a06bc	{"map skills",civics}	{"current affairs","case studies"}	{"practice quiz","daily recap"}	improving	2026-01-13 09:15:04.24+00
e8ca36f1-f2fa-4673-9215-e5c14a13fddd	355120e6-b04a-46f7-876a-b5d7aab3bde0	3d83b951-f597-4f18-952b-0040470020bb	{"software tools","html basics"}	{debugging,"program flow"}	{"revision set","practice quiz"}	improving	2026-01-16 09:15:04.24+00
911da0d8-1844-4f5a-8cc9-c1bc0e999ac5	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	4f254b63-c125-47b9-abb0-3066aca8adf1	{"set theory","linear equations"}	{"word problems","quadratic formula"}	{"daily recap","concept map"}	stable	2026-01-23 09:15:04.24+00
4dae4df8-52fa-4708-896a-7e4e3a1db2de	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	933ccbee-242b-44be-b6ab-729d5bd6d691	{"basic concepts",observations}	{numericals,"theory recall"}	{"practice quiz","concept map"}	stable	2026-01-15 09:15:04.24+00
c2ef6f65-be3a-42d7-abab-1a9aab6c75fd	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	2061036e-3ae3-4a41-8a6e-be022c0c38b5	{"reading comprehension",vocabulary}	{"essay structure","tense usage"}	{"daily recap","concept map"}	stable	2026-01-09 09:15:04.24+00
ff0e7aea-39a7-4dbf-a55a-9b3621aa051f	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	{"कविता विश्लेषण","निबन्ध लेखन"}	{"शुद्ध लेखन","विस्तृत उत्तर"}	{"revision set","daily recap"}	stable	2026-01-23 09:15:04.24+00
5316e8ba-be7a-4646-8034-793a78e27b1d	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	fe69fe37-af8d-4db5-be75-5260099a06bc	{"map skills","history recall"}	{"case studies","current affairs"}	{"practice quiz","daily recap"}	stable	2026-01-20 09:15:04.24+00
df5e778e-41c1-49b4-a5da-452efdcce248	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	3d83b951-f597-4f18-952b-0040470020bb	{"html basics","software tools"}	{debugging,"program flow"}	{"concept map","revision set"}	stable	2026-01-10 09:15:04.24+00
11804861-d873-4ca4-8fb7-dea052fdd63c	c18f6551-43e9-4a77-a52e-954d93cee377	4f254b63-c125-47b9-abb0-3066aca8adf1	{"set theory","linear equations"}	{"quadratic formula","word problems"}	{"concept map","practice quiz"}	stable	2026-01-24 09:15:04.24+00
f16607d3-5508-4b43-a722-ea21229d64e0	c18f6551-43e9-4a77-a52e-954d93cee377	933ccbee-242b-44be-b6ab-729d5bd6d691	{observations,"lab skills"}	{numericals,"theory recall"}	{"daily recap","concept map"}	stable	2026-01-12 09:15:04.24+00
2cb0fb72-f1fb-47bd-9787-030e6e883362	c18f6551-43e9-4a77-a52e-954d93cee377	2061036e-3ae3-4a41-8a6e-be022c0c38b5	{vocabulary,"reading comprehension"}	{"tense usage","essay structure"}	{"daily recap","concept map"}	stable	2026-01-09 09:15:04.24+00
e8728013-b4d8-4614-ad7b-d6d68e2cf5d0	c18f6551-43e9-4a77-a52e-954d93cee377	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	{"कविता विश्लेषण","निबन्ध लेखन"}	{"शुद्ध लेखन","विस्तृत उत्तर"}	{"concept map","revision set"}	stable	2026-01-22 09:15:04.24+00
91a6b97a-1600-4f34-a885-b42e64965a14	c18f6551-43e9-4a77-a52e-954d93cee377	fe69fe37-af8d-4db5-be75-5260099a06bc	{civics,"history recall"}	{"case studies","current affairs"}	{"concept map","revision set"}	stable	2026-01-17 09:15:04.24+00
1d1aaa61-74d5-4113-872b-f9b9a49e9443	c18f6551-43e9-4a77-a52e-954d93cee377	3d83b951-f597-4f18-952b-0040470020bb	{"html basics","software tools"}	{debugging,"program flow"}	{"revision set","concept map"}	stable	2026-01-20 09:15:04.24+00
e28b38ac-1e0a-4eef-898b-16932ff38b68	d7e84df8-3a50-4db2-96a7-f478ff5f9764	4f254b63-c125-47b9-abb0-3066aca8adf1	{"set theory","linear equations"}	{"word problems","quadratic formula"}	{"revision set","daily recap"}	stable	2026-01-13 09:15:04.24+00
8b3d6a59-c098-40b0-b777-71e6fd46cc7b	d7e84df8-3a50-4db2-96a7-f478ff5f9764	933ccbee-242b-44be-b6ab-729d5bd6d691	{"lab skills","basic concepts"}	{numericals,"theory recall"}	{"daily recap","concept map"}	stable	2026-01-18 09:15:04.24+00
db255699-b8b8-43b3-a456-1b71ccb68e22	d7e84df8-3a50-4db2-96a7-f478ff5f9764	2061036e-3ae3-4a41-8a6e-be022c0c38b5	{vocabulary,"reading comprehension"}	{"essay structure","tense usage"}	{"revision set","daily recap"}	stable	2026-01-12 09:15:04.24+00
1f21b4b9-3c23-45ab-a8ed-783ff55bcfd1	d7e84df8-3a50-4db2-96a7-f478ff5f9764	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	{"कविता विश्लेषण",व्याकरण}	{"विस्तृत उत्तर","शुद्ध लेखन"}	{"daily recap","revision set"}	stable	2026-01-17 09:15:04.24+00
70dd25b6-f55a-40b1-a6a3-593998761884	d7e84df8-3a50-4db2-96a7-f478ff5f9764	fe69fe37-af8d-4db5-be75-5260099a06bc	{civics,"history recall"}	{"current affairs","case studies"}	{"revision set","daily recap"}	stable	2026-01-22 09:15:04.24+00
d9213a4a-7aaa-4425-9c88-5f39dd764989	d7e84df8-3a50-4db2-96a7-f478ff5f9764	3d83b951-f597-4f18-952b-0040470020bb	{"logic building","html basics"}	{"program flow",debugging}	{"practice quiz","daily recap"}	stable	2026-01-17 09:15:04.24+00
fe4476fb-752c-46cd-a7f8-b5372037a215	b1965024-9f05-4ab8-a89c-9169ec08a541	4f254b63-c125-47b9-abb0-3066aca8adf1	{"linear equations","set theory"}	{"quadratic formula","word problems"}	{"concept map","practice quiz"}	stable	2026-01-10 09:15:04.24+00
0e9adcd6-3adb-4a93-89e1-1ba3ec99197c	b1965024-9f05-4ab8-a89c-9169ec08a541	933ccbee-242b-44be-b6ab-729d5bd6d691	{observations,"basic concepts"}	{numericals,"theory recall"}	{"concept map","revision set"}	stable	2026-01-14 09:15:04.24+00
c0cd9909-7566-4739-9c74-9f86fceec0f3	b1965024-9f05-4ab8-a89c-9169ec08a541	2061036e-3ae3-4a41-8a6e-be022c0c38b5	{vocabulary,"grammar basics"}	{"essay structure","tense usage"}	{"daily recap","concept map"}	stable	2026-01-12 09:15:04.24+00
3b806501-5a19-4bc7-a71a-7823bb3ccbec	b1965024-9f05-4ab8-a89c-9169ec08a541	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	{व्याकरण,"निबन्ध लेखन"}	{"शुद्ध लेखन","विस्तृत उत्तर"}	{"daily recap","concept map"}	stable	2026-01-20 09:15:04.24+00
e9e9c19f-f2a2-45cf-b8d6-5329e3b5cbc7	b1965024-9f05-4ab8-a89c-9169ec08a541	fe69fe37-af8d-4db5-be75-5260099a06bc	{"map skills",civics}	{"case studies","current affairs"}	{"practice quiz","daily recap"}	stable	2026-01-25 09:15:04.24+00
1262287a-c9ec-47e3-ada6-218e7646c08f	b1965024-9f05-4ab8-a89c-9169ec08a541	3d83b951-f597-4f18-952b-0040470020bb	{"logic building","html basics"}	{debugging,"program flow"}	{"concept map","daily recap"}	stable	2026-01-19 09:15:04.24+00
74d83f67-620b-4c37-aeec-8f76a5509c50	dde039c1-6339-4f2b-91fd-54a185c68b52	4f254b63-c125-47b9-abb0-3066aca8adf1	{"set theory","linear equations"}	{"word problems","quadratic formula"}	{"concept map","revision set"}	stable	2026-01-24 09:15:04.24+00
fe4f5a16-9748-493b-b43b-93d9b5262901	dde039c1-6339-4f2b-91fd-54a185c68b52	933ccbee-242b-44be-b6ab-729d5bd6d691	{"lab skills",observations}	{"theory recall",numericals}	{"daily recap","revision set"}	stable	2026-01-22 09:15:04.24+00
4c7419bb-159f-4fd3-aed0-8b432d86087f	dde039c1-6339-4f2b-91fd-54a185c68b52	2061036e-3ae3-4a41-8a6e-be022c0c38b5	{"grammar basics","reading comprehension"}	{"essay structure","tense usage"}	{"revision set","practice quiz"}	stable	2026-01-25 09:15:04.24+00
044b968c-cc49-4bb1-bb1d-946378070c44	dde039c1-6339-4f2b-91fd-54a185c68b52	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	{व्याकरण,"निबन्ध लेखन"}	{"शुद्ध लेखन","विस्तृत उत्तर"}	{"practice quiz","concept map"}	stable	2026-01-16 09:15:04.24+00
87c67df1-6e4e-4225-a3ca-754077b30018	dde039c1-6339-4f2b-91fd-54a185c68b52	fe69fe37-af8d-4db5-be75-5260099a06bc	{"history recall","map skills"}	{"current affairs","case studies"}	{"concept map","revision set"}	stable	2026-01-14 09:15:04.24+00
499baf3e-c6f5-4f29-8d58-e926e429783c	dde039c1-6339-4f2b-91fd-54a185c68b52	3d83b951-f597-4f18-952b-0040470020bb	{"logic building","html basics"}	{"program flow",debugging}	{"daily recap","practice quiz"}	stable	2026-01-21 09:15:04.24+00
5f39068e-e4a8-4bb9-a5f1-378259041a9b	e700842a-602b-4ecb-8df6-96e43d98e00e	4f254b63-c125-47b9-abb0-3066aca8adf1	{algebra,"linear equations"}	{"quadratic formula","word problems"}	{"practice quiz","revision set"}	stable	2026-01-10 09:15:04.24+00
0e81d4d8-009d-4881-99a6-a4d6c3160ed4	e700842a-602b-4ecb-8df6-96e43d98e00e	933ccbee-242b-44be-b6ab-729d5bd6d691	{"lab skills","basic concepts"}	{numericals,"theory recall"}	{"concept map","practice quiz"}	stable	2026-01-14 09:15:04.24+00
52653fdd-aa50-4460-b113-39091d0fc7d4	e700842a-602b-4ecb-8df6-96e43d98e00e	2061036e-3ae3-4a41-8a6e-be022c0c38b5	{"grammar basics",vocabulary}	{"tense usage","essay structure"}	{"practice quiz","revision set"}	stable	2026-01-11 09:15:04.24+00
3e692d39-5999-4b6e-ace1-7d93a745995a	e700842a-602b-4ecb-8df6-96e43d98e00e	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	{"कविता विश्लेषण",व्याकरण}	{"शुद्ध लेखन","विस्तृत उत्तर"}	{"daily recap","revision set"}	stable	2026-01-13 09:15:04.24+00
5af01a80-4f9f-47fc-8a99-143c7b3392cf	e700842a-602b-4ecb-8df6-96e43d98e00e	fe69fe37-af8d-4db5-be75-5260099a06bc	{"map skills","history recall"}	{"case studies","current affairs"}	{"daily recap","revision set"}	stable	2026-01-13 09:15:04.24+00
ac67710e-704e-42a9-baf8-aff4619a3e5d	e700842a-602b-4ecb-8df6-96e43d98e00e	3d83b951-f597-4f18-952b-0040470020bb	{"software tools","logic building"}	{"program flow",debugging}	{"practice quiz","revision set"}	stable	2026-01-24 09:15:04.24+00
0315a396-5639-4fa1-9c27-62b136d88e87	e0f448c8-7d42-4d39-bbcd-de58daff9420	4f254b63-c125-47b9-abb0-3066aca8adf1	{"set theory","linear equations"}	{"quadratic formula","word problems"}	{"daily recap","concept map"}	stable	2026-01-13 09:15:04.24+00
28ed5207-33a5-4ff3-92ab-1df1b472b748	e0f448c8-7d42-4d39-bbcd-de58daff9420	933ccbee-242b-44be-b6ab-729d5bd6d691	{"lab skills",observations}	{"theory recall",numericals}	{"revision set","daily recap"}	stable	2026-01-24 09:15:04.24+00
ce3821c4-325d-4915-9629-70503a3bbfa3	e0f448c8-7d42-4d39-bbcd-de58daff9420	2061036e-3ae3-4a41-8a6e-be022c0c38b5	{vocabulary,"grammar basics"}	{"tense usage","essay structure"}	{"practice quiz","revision set"}	stable	2026-01-24 09:15:04.24+00
d138daf4-2805-4090-9990-0508d115c372	e0f448c8-7d42-4d39-bbcd-de58daff9420	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	{"निबन्ध लेखन",व्याकरण}	{"विस्तृत उत्तर","शुद्ध लेखन"}	{"revision set","practice quiz"}	stable	2026-01-14 09:15:04.24+00
6cd3cd6a-2bd8-46be-86c2-6711a44965a5	e0f448c8-7d42-4d39-bbcd-de58daff9420	fe69fe37-af8d-4db5-be75-5260099a06bc	{"history recall","map skills"}	{"case studies","current affairs"}	{"daily recap","practice quiz"}	stable	2026-01-21 09:15:04.24+00
5da4ef4b-80a3-48e0-ab58-8e70788a6be0	e0f448c8-7d42-4d39-bbcd-de58daff9420	3d83b951-f597-4f18-952b-0040470020bb	{"logic building","html basics"}	{debugging,"program flow"}	{"revision set","concept map"}	stable	2026-01-09 09:15:04.24+00
1ec8e844-9cbc-421f-a972-88546aa930e4	97dfe15c-dcba-496a-9e58-2720c211d00a	4f254b63-c125-47b9-abb0-3066aca8adf1	{"set theory",algebra}	{"quadratic formula","word problems"}	{"practice quiz","daily recap"}	stable	2026-01-26 09:15:04.24+00
9421707f-2600-46bf-bb4d-840385e9f5fb	97dfe15c-dcba-496a-9e58-2720c211d00a	933ccbee-242b-44be-b6ab-729d5bd6d691	{"lab skills","basic concepts"}	{"theory recall",numericals}	{"concept map","practice quiz"}	stable	2026-01-19 09:15:04.24+00
56989085-dcb3-49cb-934c-496b3c109b80	97dfe15c-dcba-496a-9e58-2720c211d00a	2061036e-3ae3-4a41-8a6e-be022c0c38b5	{"grammar basics",vocabulary}	{"tense usage","essay structure"}	{"practice quiz","daily recap"}	stable	2026-01-26 09:15:04.24+00
850705c1-7313-4cdf-9cef-521ef4e8c966	97dfe15c-dcba-496a-9e58-2720c211d00a	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	{"निबन्ध लेखन","कविता विश्लेषण"}	{"विस्तृत उत्तर","शुद्ध लेखन"}	{"concept map","practice quiz"}	stable	2026-01-11 09:15:04.24+00
a1ff5c8d-ca6e-46a0-b521-73cb5f70e954	97dfe15c-dcba-496a-9e58-2720c211d00a	fe69fe37-af8d-4db5-be75-5260099a06bc	{"map skills",civics}	{"case studies","current affairs"}	{"concept map","revision set"}	stable	2026-01-22 09:15:04.24+00
718214c2-e10e-4b52-bb03-f7464f40b228	97dfe15c-dcba-496a-9e58-2720c211d00a	3d83b951-f597-4f18-952b-0040470020bb	{"html basics","software tools"}	{debugging,"program flow"}	{"revision set","daily recap"}	stable	2026-01-21 09:15:04.24+00
32ba91ce-7ebe-4301-a98a-dce807eb9657	7b46e55e-46b4-4cfd-8809-b6e205a6e567	4f254b63-c125-47b9-abb0-3066aca8adf1	{"set theory","linear equations"}	{"word problems","quadratic formula"}	{"revision set","concept map"}	stable	2026-01-09 09:15:04.24+00
2151efb1-eb5e-44c1-9702-e05e61579d56	7b46e55e-46b4-4cfd-8809-b6e205a6e567	933ccbee-242b-44be-b6ab-729d5bd6d691	{"basic concepts","lab skills"}	{"theory recall",numericals}	{"concept map","daily recap"}	stable	2026-01-19 09:15:04.24+00
c9e3d4aa-da48-482c-be4c-d83226f7ccd6	7b46e55e-46b4-4cfd-8809-b6e205a6e567	2061036e-3ae3-4a41-8a6e-be022c0c38b5	{vocabulary,"grammar basics"}	{"essay structure","tense usage"}	{"concept map","practice quiz"}	stable	2026-01-21 09:15:04.24+00
45ebd3e4-e712-48b1-a594-e6b5272190cc	7b46e55e-46b4-4cfd-8809-b6e205a6e567	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	{"कविता विश्लेषण","निबन्ध लेखन"}	{"विस्तृत उत्तर","शुद्ध लेखन"}	{"revision set","practice quiz"}	stable	2026-01-20 09:15:04.24+00
13a49f02-8bf0-4871-b143-9c7835cb175a	7b46e55e-46b4-4cfd-8809-b6e205a6e567	fe69fe37-af8d-4db5-be75-5260099a06bc	{civics,"history recall"}	{"current affairs","case studies"}	{"concept map","revision set"}	stable	2026-01-20 09:15:04.24+00
2d00b36b-b6c6-4585-979f-5264173b2bd2	7b46e55e-46b4-4cfd-8809-b6e205a6e567	3d83b951-f597-4f18-952b-0040470020bb	{"software tools","logic building"}	{debugging,"program flow"}	{"concept map","revision set"}	stable	2026-01-09 09:15:04.24+00
0901c94d-c9b6-425e-8b4a-938cba02eb94	60277f16-d457-4dc1-958d-a312a8d9471b	4f254b63-c125-47b9-abb0-3066aca8adf1	{"linear equations",algebra}	{"quadratic formula","word problems"}	{"revision set","practice quiz"}	stable	2026-01-25 09:15:04.24+00
311d31ed-641c-425e-8577-b73587cc6b35	60277f16-d457-4dc1-958d-a312a8d9471b	933ccbee-242b-44be-b6ab-729d5bd6d691	{"basic concepts","lab skills"}	{"theory recall",numericals}	{"concept map","daily recap"}	stable	2026-01-23 09:15:04.24+00
6b6a0868-2650-4960-b517-b31c7b443300	60277f16-d457-4dc1-958d-a312a8d9471b	2061036e-3ae3-4a41-8a6e-be022c0c38b5	{"grammar basics","reading comprehension"}	{"essay structure","tense usage"}	{"practice quiz","daily recap"}	stable	2026-01-21 09:15:04.24+00
a1e6ad9f-0840-4bbc-bdf5-ebde660030de	60277f16-d457-4dc1-958d-a312a8d9471b	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	{"निबन्ध लेखन",व्याकरण}	{"शुद्ध लेखन","विस्तृत उत्तर"}	{"concept map","revision set"}	stable	2026-01-16 09:15:04.24+00
3184dec1-062a-46d9-b158-69b8e1e72a4e	60277f16-d457-4dc1-958d-a312a8d9471b	fe69fe37-af8d-4db5-be75-5260099a06bc	{"history recall","map skills"}	{"current affairs","case studies"}	{"practice quiz","daily recap"}	stable	2026-01-20 09:15:04.24+00
2af56f0e-ea9d-412a-aabb-db94027033cf	60277f16-d457-4dc1-958d-a312a8d9471b	3d83b951-f597-4f18-952b-0040470020bb	{"logic building","html basics"}	{debugging,"program flow"}	{"daily recap","concept map"}	stable	2026-01-20 09:15:04.24+00
ae57419a-3623-4b4c-bcb7-7e241761815c	772182f8-2921-4fe3-a427-8c86cca2f2db	4f254b63-c125-47b9-abb0-3066aca8adf1	{"linear equations","set theory"}	{"quadratic formula","word problems"}	{"revision set","daily recap"}	stable	2026-01-25 09:15:04.24+00
391b0eb7-b819-4771-ae6d-1f9abf6aaef4	772182f8-2921-4fe3-a427-8c86cca2f2db	933ccbee-242b-44be-b6ab-729d5bd6d691	{"basic concepts",observations}	{"theory recall",numericals}	{"revision set","concept map"}	stable	2026-01-14 09:15:04.24+00
72f498c4-b5a0-4f2e-8727-583fdf67b270	772182f8-2921-4fe3-a427-8c86cca2f2db	2061036e-3ae3-4a41-8a6e-be022c0c38b5	{"reading comprehension",vocabulary}	{"tense usage","essay structure"}	{"daily recap","revision set"}	stable	2026-01-18 09:15:04.24+00
7a45897f-24b4-44fd-a8ff-900ff0fc9ea0	772182f8-2921-4fe3-a427-8c86cca2f2db	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	{"निबन्ध लेखन","कविता विश्लेषण"}	{"शुद्ध लेखन","विस्तृत उत्तर"}	{"concept map","practice quiz"}	stable	2026-01-23 09:15:04.24+00
8d778e58-87c1-46b3-84ef-a4cc42ed0fbe	772182f8-2921-4fe3-a427-8c86cca2f2db	fe69fe37-af8d-4db5-be75-5260099a06bc	{"map skills",civics}	{"case studies","current affairs"}	{"revision set","daily recap"}	stable	2026-01-26 09:15:04.24+00
d1e0ec0d-debd-41cd-a462-ae61306bc91f	772182f8-2921-4fe3-a427-8c86cca2f2db	3d83b951-f597-4f18-952b-0040470020bb	{"software tools","html basics"}	{debugging,"program flow"}	{"revision set","concept map"}	stable	2026-01-20 09:15:04.24+00
3616eae0-106a-4f16-9e74-fb85c5e0447c	9f6c81bf-ea4e-402f-96a1-968323555263	4f254b63-c125-47b9-abb0-3066aca8adf1	{"set theory","linear equations"}	{"word problems","quadratic formula"}	{"concept map","practice quiz"}	stable	2026-01-20 09:15:04.24+00
32ce49c4-0414-4f0c-a55b-a58cad1b9e89	9f6c81bf-ea4e-402f-96a1-968323555263	933ccbee-242b-44be-b6ab-729d5bd6d691	{"basic concepts","lab skills"}	{"theory recall",numericals}	{"concept map","practice quiz"}	stable	2026-01-10 09:15:04.24+00
4062a234-b6d6-4d43-8b9f-c911a371f71c	9f6c81bf-ea4e-402f-96a1-968323555263	2061036e-3ae3-4a41-8a6e-be022c0c38b5	{vocabulary,"grammar basics"}	{"essay structure","tense usage"}	{"practice quiz","revision set"}	stable	2026-01-25 09:15:04.24+00
b94a6fce-603a-4ede-8e2a-7317a9ff6492	9f6c81bf-ea4e-402f-96a1-968323555263	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	{"निबन्ध लेखन","कविता विश्लेषण"}	{"शुद्ध लेखन","विस्तृत उत्तर"}	{"concept map","practice quiz"}	stable	2026-01-24 09:15:04.24+00
c939adf6-9558-47b7-ace5-319db6aa026f	9f6c81bf-ea4e-402f-96a1-968323555263	fe69fe37-af8d-4db5-be75-5260099a06bc	{civics,"history recall"}	{"case studies","current affairs"}	{"revision set","practice quiz"}	stable	2026-01-23 09:15:04.24+00
8db626cf-8068-4ba4-bf28-07b242e3cdf5	9f6c81bf-ea4e-402f-96a1-968323555263	3d83b951-f597-4f18-952b-0040470020bb	{"logic building","software tools"}	{debugging,"program flow"}	{"concept map","daily recap"}	stable	2026-01-24 09:15:04.24+00
3cd2c163-458e-4108-a963-4e7eb66571b6	5835a0de-c500-4ad7-b0e2-76aa107db95c	4f254b63-c125-47b9-abb0-3066aca8adf1	{"set theory",algebra}	{"quadratic formula","word problems"}	{"revision set","concept map"}	stable	2026-01-17 09:15:04.24+00
8707337a-4328-465a-ae7b-5b2d5b52bb2f	5835a0de-c500-4ad7-b0e2-76aa107db95c	933ccbee-242b-44be-b6ab-729d5bd6d691	{"basic concepts","lab skills"}	{numericals,"theory recall"}	{"daily recap","concept map"}	stable	2026-01-11 09:15:04.24+00
7feb6c70-24ff-42b4-b4a1-c692cd1b2a10	5835a0de-c500-4ad7-b0e2-76aa107db95c	2061036e-3ae3-4a41-8a6e-be022c0c38b5	{vocabulary,"grammar basics"}	{"essay structure","tense usage"}	{"daily recap","revision set"}	stable	2026-01-20 09:15:04.24+00
949d86a3-e0c0-44e9-a336-1b8ce996b85f	5835a0de-c500-4ad7-b0e2-76aa107db95c	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	{व्याकरण,"निबन्ध लेखन"}	{"विस्तृत उत्तर","शुद्ध लेखन"}	{"daily recap","practice quiz"}	stable	2026-01-24 09:15:04.24+00
e6064f7b-e254-4067-b8d7-eaff6078879f	5835a0de-c500-4ad7-b0e2-76aa107db95c	fe69fe37-af8d-4db5-be75-5260099a06bc	{"map skills","history recall"}	{"current affairs","case studies"}	{"practice quiz","daily recap"}	stable	2026-01-13 09:15:04.24+00
6334f22b-e7ce-4976-b715-6d753bbf449e	5835a0de-c500-4ad7-b0e2-76aa107db95c	3d83b951-f597-4f18-952b-0040470020bb	{"html basics","software tools"}	{"program flow",debugging}	{"daily recap","practice quiz"}	stable	2026-01-20 09:15:04.24+00
00199fc0-f750-40b9-83a4-53e02ad7e02a	15a117ff-1cb4-49cf-8fd5-845f9061f160	4f254b63-c125-47b9-abb0-3066aca8adf1	{algebra,"linear equations"}	{"word problems","quadratic formula"}	{"daily recap","practice quiz"}	stable	2026-01-21 09:15:04.24+00
67fae8a2-1274-47bd-8e81-09aeaf7e57fd	15a117ff-1cb4-49cf-8fd5-845f9061f160	933ccbee-242b-44be-b6ab-729d5bd6d691	{"lab skills","basic concepts"}	{"theory recall",numericals}	{"daily recap","concept map"}	stable	2026-01-26 09:15:04.24+00
97f43ca0-5055-42e9-b6ac-c52272649708	15a117ff-1cb4-49cf-8fd5-845f9061f160	2061036e-3ae3-4a41-8a6e-be022c0c38b5	{"reading comprehension","grammar basics"}	{"tense usage","essay structure"}	{"daily recap","concept map"}	stable	2026-01-25 09:15:04.24+00
1dad9c9d-5e5f-4bea-a572-676bd8c5cbb6	15a117ff-1cb4-49cf-8fd5-845f9061f160	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	{"कविता विश्लेषण","निबन्ध लेखन"}	{"विस्तृत उत्तर","शुद्ध लेखन"}	{"practice quiz","concept map"}	stable	2026-01-20 09:15:04.24+00
02b9f921-602b-4611-b27f-19abaa0d5f88	15a117ff-1cb4-49cf-8fd5-845f9061f160	fe69fe37-af8d-4db5-be75-5260099a06bc	{civics,"history recall"}	{"current affairs","case studies"}	{"concept map","daily recap"}	stable	2026-01-18 09:15:04.24+00
faa46499-f51f-4fc5-9e35-33fd81c4b4fa	15a117ff-1cb4-49cf-8fd5-845f9061f160	3d83b951-f597-4f18-952b-0040470020bb	{"software tools","html basics"}	{"program flow",debugging}	{"revision set","concept map"}	stable	2026-01-20 09:15:04.24+00
040bfcd4-348c-4b2d-81e4-f67db5ab513c	e0633026-2d69-4e2f-9731-dc6e05038f24	4f254b63-c125-47b9-abb0-3066aca8adf1	{"linear equations",algebra}	{"word problems","quadratic formula"}	{"practice quiz","daily recap"}	stable	2026-01-23 09:15:04.24+00
f8a8b2f8-5635-4ebd-8227-37f4d6812a88	e0633026-2d69-4e2f-9731-dc6e05038f24	933ccbee-242b-44be-b6ab-729d5bd6d691	{"lab skills","basic concepts"}	{numericals,"theory recall"}	{"concept map","revision set"}	stable	2026-01-25 09:15:04.24+00
2953f8cf-f5c8-4d9e-b447-790aa282aa93	e0633026-2d69-4e2f-9731-dc6e05038f24	2061036e-3ae3-4a41-8a6e-be022c0c38b5	{"reading comprehension","grammar basics"}	{"essay structure","tense usage"}	{"practice quiz","concept map"}	stable	2026-01-25 09:15:04.24+00
7ba02eaa-07bc-464a-8da0-79ac4d5a7074	e0633026-2d69-4e2f-9731-dc6e05038f24	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	{"निबन्ध लेखन","कविता विश्लेषण"}	{"शुद्ध लेखन","विस्तृत उत्तर"}	{"revision set","concept map"}	stable	2026-01-17 09:15:04.24+00
c896a7fb-4a2c-4241-9011-ee355900dd99	e0633026-2d69-4e2f-9731-dc6e05038f24	fe69fe37-af8d-4db5-be75-5260099a06bc	{civics,"history recall"}	{"current affairs","case studies"}	{"revision set","practice quiz"}	stable	2026-01-23 09:15:04.24+00
9423cb3d-c606-47ed-a745-9cc069897597	e0633026-2d69-4e2f-9731-dc6e05038f24	3d83b951-f597-4f18-952b-0040470020bb	{"logic building","html basics"}	{"program flow",debugging}	{"daily recap","practice quiz"}	stable	2026-01-20 09:15:04.24+00
64224199-3023-4c59-8991-602efa3ad4e0	63e27c91-167e-44c0-b455-ca85896b666c	4f254b63-c125-47b9-abb0-3066aca8adf1	{algebra,"set theory"}	{"word problems","quadratic formula"}	{"practice quiz","concept map"}	declining	2026-01-26 09:15:04.24+00
dc04673a-1935-496c-aeff-9f5f0423ece6	63e27c91-167e-44c0-b455-ca85896b666c	933ccbee-242b-44be-b6ab-729d5bd6d691	{"basic concepts","lab skills"}	{numericals,"theory recall"}	{"revision set","concept map"}	declining	2026-01-25 09:15:04.24+00
f1e0e550-a4e3-46e8-90cd-42b53c3af04b	63e27c91-167e-44c0-b455-ca85896b666c	2061036e-3ae3-4a41-8a6e-be022c0c38b5	{"reading comprehension",vocabulary}	{"essay structure","tense usage"}	{"concept map","practice quiz"}	declining	2026-01-17 09:15:04.24+00
8c521a54-5f07-43d8-9c32-faa256b5bddb	63e27c91-167e-44c0-b455-ca85896b666c	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	{"कविता विश्लेषण",व्याकरण}	{"विस्तृत उत्तर","शुद्ध लेखन"}	{"revision set","practice quiz"}	declining	2026-01-14 09:15:04.24+00
f455c002-64ef-4d93-b40f-d988e1b2a133	63e27c91-167e-44c0-b455-ca85896b666c	fe69fe37-af8d-4db5-be75-5260099a06bc	{civics,"history recall"}	{"case studies","current affairs"}	{"concept map","revision set"}	declining	2026-01-17 09:15:04.24+00
6a6d9080-0103-447e-aff0-3d4efbdfc328	63e27c91-167e-44c0-b455-ca85896b666c	3d83b951-f597-4f18-952b-0040470020bb	{"logic building","html basics"}	{debugging,"program flow"}	{"daily recap","concept map"}	declining	2026-01-18 09:15:04.24+00
7827fe48-4451-4c06-a99a-5826ebd7e746	f684fc32-dcc9-4b44-bf14-112cd8958129	4f254b63-c125-47b9-abb0-3066aca8adf1	{algebra,"linear equations"}	{"word problems","quadratic formula"}	{"practice quiz","concept map"}	declining	2026-01-13 09:15:04.24+00
49b8b411-93fd-4d27-b884-0d4706e98157	f684fc32-dcc9-4b44-bf14-112cd8958129	933ccbee-242b-44be-b6ab-729d5bd6d691	{observations,"lab skills"}	{"theory recall",numericals}	{"practice quiz","revision set"}	declining	2026-01-10 09:15:04.24+00
285826b4-1006-4f5e-bed3-1a249764fd3e	f684fc32-dcc9-4b44-bf14-112cd8958129	2061036e-3ae3-4a41-8a6e-be022c0c38b5	{"reading comprehension","grammar basics"}	{"tense usage","essay structure"}	{"practice quiz","daily recap"}	declining	2026-01-16 09:15:04.24+00
d120271d-ae83-43d7-9bd4-f88c957dfdd4	f684fc32-dcc9-4b44-bf14-112cd8958129	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	{"निबन्ध लेखन","कविता विश्लेषण"}	{"शुद्ध लेखन","विस्तृत उत्तर"}	{"daily recap","concept map"}	declining	2026-01-20 09:15:04.24+00
0b1d24a7-ba24-47a9-bf9b-ae728eeba59b	f684fc32-dcc9-4b44-bf14-112cd8958129	fe69fe37-af8d-4db5-be75-5260099a06bc	{civics,"map skills"}	{"current affairs","case studies"}	{"revision set","practice quiz"}	declining	2026-01-10 09:15:04.24+00
4f244726-2584-43c2-917d-812bf3a03d44	f684fc32-dcc9-4b44-bf14-112cd8958129	3d83b951-f597-4f18-952b-0040470020bb	{"html basics","logic building"}	{debugging,"program flow"}	{"practice quiz","concept map"}	declining	2026-01-23 09:15:04.24+00
4a930b63-9be1-41ae-89af-d8011625b2d5	4c7a3cbd-447c-4cbc-918d-8e923ce57b80	4f254b63-c125-47b9-abb0-3066aca8adf1	{"linear equations",algebra}	{"quadratic formula","word problems"}	{"daily recap","revision set"}	declining	2026-01-15 09:15:04.24+00
fe4ca990-3a1a-4941-a9a2-7ad584f73980	4c7a3cbd-447c-4cbc-918d-8e923ce57b80	933ccbee-242b-44be-b6ab-729d5bd6d691	{observations,"basic concepts"}	{"theory recall",numericals}	{"daily recap","revision set"}	declining	2026-01-23 09:15:04.24+00
4569cfd6-446f-4e92-be7f-ad1c55885e04	4c7a3cbd-447c-4cbc-918d-8e923ce57b80	2061036e-3ae3-4a41-8a6e-be022c0c38b5	{vocabulary,"reading comprehension"}	{"essay structure","tense usage"}	{"daily recap","practice quiz"}	declining	2026-01-20 09:15:04.24+00
78d05a6b-c0f3-47ea-a140-8816ada112b2	4c7a3cbd-447c-4cbc-918d-8e923ce57b80	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	{"कविता विश्लेषण",व्याकरण}	{"शुद्ध लेखन","विस्तृत उत्तर"}	{"revision set","daily recap"}	declining	2026-01-20 09:15:04.24+00
38d2e5ce-7877-4a2d-80a2-3dd6119228c7	4c7a3cbd-447c-4cbc-918d-8e923ce57b80	fe69fe37-af8d-4db5-be75-5260099a06bc	{"map skills",civics}	{"case studies","current affairs"}	{"daily recap","practice quiz"}	declining	2026-01-18 09:15:04.24+00
d6ad2e17-773f-43ae-b919-93e6b20599ec	4c7a3cbd-447c-4cbc-918d-8e923ce57b80	3d83b951-f597-4f18-952b-0040470020bb	{"html basics","logic building"}	{"program flow",debugging}	{"concept map","revision set"}	declining	2026-01-15 09:15:04.24+00
7bef62e0-5938-42b1-ab46-cc2713a97250	503b5c9c-042c-4813-9898-63b129515ad7	4f254b63-c125-47b9-abb0-3066aca8adf1	{"linear equations",algebra}	{"word problems","quadratic formula"}	{"revision set","concept map"}	declining	2026-01-11 09:15:04.24+00
b88d77da-a4d6-4772-8f82-b3435e35d3e3	503b5c9c-042c-4813-9898-63b129515ad7	933ccbee-242b-44be-b6ab-729d5bd6d691	{"basic concepts","lab skills"}	{"theory recall",numericals}	{"daily recap","revision set"}	declining	2026-01-20 09:15:04.24+00
8045b44d-5766-4e1e-9538-8bf40fcf8d33	503b5c9c-042c-4813-9898-63b129515ad7	2061036e-3ae3-4a41-8a6e-be022c0c38b5	{"grammar basics","reading comprehension"}	{"essay structure","tense usage"}	{"concept map","revision set"}	declining	2026-01-11 09:15:04.24+00
71a50fc8-c3f5-4cbf-870f-b36c18da16b4	503b5c9c-042c-4813-9898-63b129515ad7	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	{व्याकरण,"निबन्ध लेखन"}	{"शुद्ध लेखन","विस्तृत उत्तर"}	{"daily recap","practice quiz"}	declining	2026-01-19 09:15:04.24+00
048c538f-0fca-4a5c-9d80-e597bca5b527	503b5c9c-042c-4813-9898-63b129515ad7	fe69fe37-af8d-4db5-be75-5260099a06bc	{"history recall","map skills"}	{"case studies","current affairs"}	{"daily recap","revision set"}	declining	2026-01-11 09:15:04.24+00
b9dd38d4-465d-4e15-b977-53cd07daf08b	503b5c9c-042c-4813-9898-63b129515ad7	3d83b951-f597-4f18-952b-0040470020bb	{"software tools","html basics"}	{debugging,"program flow"}	{"concept map","practice quiz"}	declining	2026-01-18 09:15:04.24+00
57204132-dbc5-4aa7-ba5a-c932e00ae8c2	a6de668b-ecfa-4842-97a5-3cc27b34e1f6	4f254b63-c125-47b9-abb0-3066aca8adf1	{algebra,"linear equations"}	{"quadratic formula","word problems"}	{"revision set","daily recap"}	declining	2026-01-22 09:15:04.24+00
30471dc6-60ba-40c4-9875-6c4f65721697	a6de668b-ecfa-4842-97a5-3cc27b34e1f6	933ccbee-242b-44be-b6ab-729d5bd6d691	{"lab skills","basic concepts"}	{"theory recall",numericals}	{"concept map","practice quiz"}	declining	2026-01-10 09:15:04.24+00
2447bf4c-3fdb-4111-816b-25a70ddf9dda	a6de668b-ecfa-4842-97a5-3cc27b34e1f6	2061036e-3ae3-4a41-8a6e-be022c0c38b5	{"grammar basics",vocabulary}	{"essay structure","tense usage"}	{"daily recap","revision set"}	declining	2026-01-17 09:15:04.24+00
d1ac3799-25be-40ae-933d-e6a19992f383	a6de668b-ecfa-4842-97a5-3cc27b34e1f6	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	{"निबन्ध लेखन",व्याकरण}	{"विस्तृत उत्तर","शुद्ध लेखन"}	{"revision set","daily recap"}	declining	2026-01-17 09:15:04.24+00
24f88b47-21d0-4d3e-a114-b080544c2698	a6de668b-ecfa-4842-97a5-3cc27b34e1f6	fe69fe37-af8d-4db5-be75-5260099a06bc	{"map skills",civics}	{"current affairs","case studies"}	{"revision set","daily recap"}	declining	2026-01-24 09:15:04.24+00
53f511ce-e87a-4465-8d55-337b7542fc8c	a6de668b-ecfa-4842-97a5-3cc27b34e1f6	3d83b951-f597-4f18-952b-0040470020bb	{"html basics","software tools"}	{"program flow",debugging}	{"practice quiz","concept map"}	declining	2026-01-12 09:15:04.24+00
916e2685-d539-43d8-a481-f1f1882bdf5d	b470a0a0-fa44-468e-8b5e-102d68c08ed4	4f254b63-c125-47b9-abb0-3066aca8adf1	{"set theory",algebra}	{"word problems","quadratic formula"}	{"daily recap","revision set"}	declining	2026-01-20 09:15:04.24+00
d10cc312-a746-421a-a181-b5b464d9e4fe	b470a0a0-fa44-468e-8b5e-102d68c08ed4	933ccbee-242b-44be-b6ab-729d5bd6d691	{"lab skills",observations}	{numericals,"theory recall"}	{"concept map","revision set"}	declining	2026-01-15 09:15:04.24+00
7b4d28c6-16b8-4d1d-a6f9-0e57bca567c0	b470a0a0-fa44-468e-8b5e-102d68c08ed4	2061036e-3ae3-4a41-8a6e-be022c0c38b5	{"grammar basics",vocabulary}	{"essay structure","tense usage"}	{"practice quiz","revision set"}	declining	2026-01-23 09:15:04.24+00
e930645a-833f-4c2d-9106-b74987a64b03	b470a0a0-fa44-468e-8b5e-102d68c08ed4	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	{"निबन्ध लेखन","कविता विश्लेषण"}	{"विस्तृत उत्तर","शुद्ध लेखन"}	{"daily recap","practice quiz"}	declining	2026-01-14 09:15:04.24+00
36b6ef8a-3f8b-4b65-8257-5b60a4a5cdd9	b470a0a0-fa44-468e-8b5e-102d68c08ed4	fe69fe37-af8d-4db5-be75-5260099a06bc	{"map skills",civics}	{"case studies","current affairs"}	{"daily recap","practice quiz"}	declining	2026-01-16 09:15:04.24+00
eda9b466-ed75-4f7e-9dbe-0e0e14aa062f	b470a0a0-fa44-468e-8b5e-102d68c08ed4	3d83b951-f597-4f18-952b-0040470020bb	{"logic building","software tools"}	{debugging,"program flow"}	{"concept map","practice quiz"}	declining	2026-01-27 09:15:04.24+00
57e33b5e-7857-4309-b250-3b42e0f9be15	acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	4f254b63-c125-47b9-abb0-3066aca8adf1	{"linear equations",algebra}	{"quadratic formula","word problems"}	{"concept map","revision set"}	declining	2026-01-22 09:15:04.24+00
adaeef7a-6409-453d-938a-8d99015cbd48	acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	933ccbee-242b-44be-b6ab-729d5bd6d691	{"lab skills",observations}	{numericals,"theory recall"}	{"daily recap","practice quiz"}	declining	2026-01-19 09:15:04.24+00
6b02cd9a-f065-4f11-934e-e22d36e49fb1	acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	2061036e-3ae3-4a41-8a6e-be022c0c38b5	{"reading comprehension","grammar basics"}	{"essay structure","tense usage"}	{"daily recap","concept map"}	declining	2026-01-23 09:15:04.24+00
db7114ab-5550-4808-83e4-319e87f86481	acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	{"कविता विश्लेषण","निबन्ध लेखन"}	{"शुद्ध लेखन","विस्तृत उत्तर"}	{"concept map","daily recap"}	declining	2026-01-25 09:15:04.24+00
0cb4369d-278e-42cc-83fe-d4e9938f4f6a	acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	fe69fe37-af8d-4db5-be75-5260099a06bc	{"history recall",civics}	{"current affairs","case studies"}	{"practice quiz","revision set"}	declining	2026-01-12 09:15:04.24+00
ef6b60ce-c4b0-4b43-aa4b-51bdd2cdb2ad	acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	3d83b951-f597-4f18-952b-0040470020bb	{"software tools","logic building"}	{debugging,"program flow"}	{"revision set","daily recap"}	declining	2026-01-10 09:15:04.24+00
3fe9e9ee-9a30-417a-a3ae-829eb736c15f	2286be2d-ff3b-4c8e-8c16-0b4bc6bebdc7	4f254b63-c125-47b9-abb0-3066aca8adf1	{"set theory",algebra}	{"word problems","quadratic formula"}	{"concept map","revision set"}	declining	2026-01-11 09:15:04.24+00
34482e19-b3e0-4955-9fee-17649712cc6f	2286be2d-ff3b-4c8e-8c16-0b4bc6bebdc7	933ccbee-242b-44be-b6ab-729d5bd6d691	{"basic concepts","lab skills"}	{"theory recall",numericals}	{"concept map","revision set"}	declining	2026-01-18 09:15:04.24+00
3d8229ad-b7b3-45c3-b366-1bd62b8cada5	2286be2d-ff3b-4c8e-8c16-0b4bc6bebdc7	2061036e-3ae3-4a41-8a6e-be022c0c38b5	{"grammar basics",vocabulary}	{"essay structure","tense usage"}	{"revision set","practice quiz"}	declining	2026-01-16 09:15:04.24+00
a8bad21f-988e-4930-9c46-6966db5f2781	2286be2d-ff3b-4c8e-8c16-0b4bc6bebdc7	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	{व्याकरण,"कविता विश्लेषण"}	{"शुद्ध लेखन","विस्तृत उत्तर"}	{"concept map","revision set"}	declining	2026-01-11 09:15:04.24+00
936b5bc0-8fe3-4f1a-bef6-3aa80682bd98	2286be2d-ff3b-4c8e-8c16-0b4bc6bebdc7	fe69fe37-af8d-4db5-be75-5260099a06bc	{"history recall","map skills"}	{"case studies","current affairs"}	{"daily recap","concept map"}	declining	2026-01-27 09:15:04.24+00
b6027ab0-3974-4729-a0be-8e8c7a748bee	2286be2d-ff3b-4c8e-8c16-0b4bc6bebdc7	3d83b951-f597-4f18-952b-0040470020bb	{"html basics","logic building"}	{"program flow",debugging}	{"daily recap","revision set"}	declining	2026-01-11 09:15:04.24+00
04d0c83c-0c8b-48c0-b818-389d720f9796	60498abe-fb45-4fce-b715-796c6ad2a7b1	4f254b63-c125-47b9-abb0-3066aca8adf1	{"linear equations",algebra}	{"word problems","quadratic formula"}	{"practice quiz","concept map"}	declining	2026-01-17 09:15:04.24+00
05744bf1-7233-4058-9212-931131c66ad1	60498abe-fb45-4fce-b715-796c6ad2a7b1	933ccbee-242b-44be-b6ab-729d5bd6d691	{observations,"basic concepts"}	{numericals,"theory recall"}	{"concept map","practice quiz"}	declining	2026-01-15 09:15:04.24+00
ca8f2386-1a77-4c89-8f77-7e3be872caed	60498abe-fb45-4fce-b715-796c6ad2a7b1	2061036e-3ae3-4a41-8a6e-be022c0c38b5	{vocabulary,"reading comprehension"}	{"tense usage","essay structure"}	{"revision set","practice quiz"}	declining	2026-01-15 09:15:04.24+00
0cbf20f6-1ab2-4c6e-a832-f78e70cac8a1	60498abe-fb45-4fce-b715-796c6ad2a7b1	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	{"निबन्ध लेखन","कविता विश्लेषण"}	{"शुद्ध लेखन","विस्तृत उत्तर"}	{"revision set","daily recap"}	declining	2026-01-13 09:15:04.24+00
15de988e-b174-4276-b32b-30de0608c25e	60498abe-fb45-4fce-b715-796c6ad2a7b1	fe69fe37-af8d-4db5-be75-5260099a06bc	{civics,"history recall"}	{"current affairs","case studies"}	{"practice quiz","revision set"}	declining	2026-01-15 09:15:04.24+00
1ea08519-f2ae-46a2-813b-815b766c6362	60498abe-fb45-4fce-b715-796c6ad2a7b1	3d83b951-f597-4f18-952b-0040470020bb	{"logic building","software tools"}	{debugging,"program flow"}	{"daily recap","concept map"}	declining	2026-01-26 09:15:04.24+00
b623a928-f17e-4195-b9ca-85eedf209121	cecbea1b-e71b-4995-97cc-6254e7815265	4f254b63-c125-47b9-abb0-3066aca8adf1	{"linear equations",algebra}	{"quadratic formula","word problems"}	{"revision set","concept map"}	declining	2026-01-26 09:15:04.24+00
6040570e-be8f-40fa-8c06-23ffad342063	cecbea1b-e71b-4995-97cc-6254e7815265	933ccbee-242b-44be-b6ab-729d5bd6d691	{observations,"basic concepts"}	{numericals,"theory recall"}	{"practice quiz","revision set"}	declining	2026-01-23 09:15:04.24+00
0029908f-936d-4d9d-9267-c580f7cc3fa9	cecbea1b-e71b-4995-97cc-6254e7815265	2061036e-3ae3-4a41-8a6e-be022c0c38b5	{"reading comprehension","grammar basics"}	{"tense usage","essay structure"}	{"revision set","practice quiz"}	declining	2026-01-20 09:15:04.24+00
d8d2b9a4-7688-4303-a7c3-b2a7f6a3cdd2	cecbea1b-e71b-4995-97cc-6254e7815265	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	{व्याकरण,"कविता विश्लेषण"}	{"शुद्ध लेखन","विस्तृत उत्तर"}	{"daily recap","revision set"}	declining	2026-01-26 09:15:04.24+00
d9425902-89a3-4066-8078-f6ab39ee2b67	cecbea1b-e71b-4995-97cc-6254e7815265	fe69fe37-af8d-4db5-be75-5260099a06bc	{civics,"map skills"}	{"case studies","current affairs"}	{"daily recap","practice quiz"}	declining	2026-01-18 09:15:04.24+00
2441e708-1462-491e-95ed-00c0a9131291	cecbea1b-e71b-4995-97cc-6254e7815265	3d83b951-f597-4f18-952b-0040470020bb	{"logic building","software tools"}	{debugging,"program flow"}	{"daily recap","revision set"}	declining	2026-01-14 09:15:04.24+00
\.


--
-- TOC entry 3934 (class 0 OID 24761)
-- Dependencies: 231
-- Data for Name: student_notes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.student_notes (id, student_id, subject_id, chapter, topic, content, images, status, verified_by, verified_at, created_at, updated_at) FROM stdin;
5170c7c1-ed80-4fcc-b22d-827dde76610a	cdacd5ec-aa0b-4a66-8f17-0f767466513a	933ccbee-242b-44be-b6ab-729d5bd6d691	Chapter 5	Summary notes	Summary notes prepared by student.	\N	verified	85d68757-04d1-4213-a3f5-8af479bceb4a	2026-01-14 09:15:04.24+00	2026-01-13 09:15:04.24+00	2026-01-14 09:15:04.24+00
57379507-d571-4962-a9e8-f688105f517d	cdacd5ec-aa0b-4a66-8f17-0f767466513a	fe69fe37-af8d-4db5-be75-5260099a06bc	Chapter 1	Exercises	Summary notes prepared by student.	\N	verified	7fd08be2-a61e-4a2a-905c-b2fc005155c5	2025-12-21 09:15:04.24+00	2025-12-20 09:15:04.24+00	2025-12-22 09:15:04.24+00
4cdedc01-2c55-4d08-b01d-f3134bcde2b2	85079b8e-4704-49b1-84ed-2d3c501654ee	fe69fe37-af8d-4db5-be75-5260099a06bc	Chapter 2	Exercises	Summary notes prepared by student.	\N	verified	7fd08be2-a61e-4a2a-905c-b2fc005155c5	2026-01-03 09:15:04.24+00	2026-01-02 09:15:04.24+00	2026-01-05 09:15:04.24+00
7e67ac40-dfc8-40cc-864b-dc2ca0091f7c	85079b8e-4704-49b1-84ed-2d3c501654ee	3d83b951-f597-4f18-952b-0040470020bb	Chapter 3	Exercises	Summary notes prepared by student.	\N	verified	ac2ec10f-3a2c-4674-81e1-f72c983de087	2026-01-08 09:15:04.24+00	2026-01-07 09:15:04.24+00	2026-01-10 09:15:04.24+00
71bc2f01-6269-4290-8963-07d0b29b66f9	67d4f333-220d-4a64-bcd2-8dc53a56624c	2061036e-3ae3-4a41-8a6e-be022c0c38b5	Chapter 3	Examples	Summary notes prepared by student.	\N	verified	b9ec8689-5563-4d7d-a5b6-965e3d32b275	2026-01-04 09:15:04.24+00	2026-01-03 09:15:04.24+00	2026-01-04 09:15:04.24+00
b9f2ad8d-9d44-4eda-b98c-54e535f2cad7	67d4f333-220d-4a64-bcd2-8dc53a56624c	fe69fe37-af8d-4db5-be75-5260099a06bc	Chapter 1	Key concepts	Summary notes prepared by student.	\N	verified	7fd08be2-a61e-4a2a-905c-b2fc005155c5	2026-01-05 09:15:04.24+00	2026-01-04 09:15:04.24+00	2026-01-07 09:15:04.24+00
e1cc1a03-a27b-4d1d-b84f-7cd674e1a4e6	345bb275-556d-4960-b7de-28922983a7b2	3d83b951-f597-4f18-952b-0040470020bb	Chapter 5	Exercises	Summary notes prepared by student.	\N	verified	ac2ec10f-3a2c-4674-81e1-f72c983de087	2026-01-03 09:15:04.24+00	2026-01-02 09:15:04.24+00	2026-01-03 09:15:04.24+00
130ab507-9bbf-4fae-be5d-8718656c9de9	345bb275-556d-4960-b7de-28922983a7b2	2061036e-3ae3-4a41-8a6e-be022c0c38b5	Chapter 6	Exercises	Summary notes prepared by student.	\N	verified	b9ec8689-5563-4d7d-a5b6-965e3d32b275	2026-01-07 09:15:04.24+00	2026-01-06 09:15:04.24+00	2026-01-07 09:15:04.24+00
86bf7a3d-8d22-4038-8ca8-ee54e23ea593	355120e6-b04a-46f7-876a-b5d7aab3bde0	4f254b63-c125-47b9-abb0-3066aca8adf1	Chapter 3	Examples	Summary notes prepared by student.	\N	verified	ec0eb6d5-25df-4e35-9940-bc34abcd8ed9	2025-12-29 09:15:04.24+00	2025-12-28 09:15:04.24+00	2025-12-31 09:15:04.24+00
b3e41bf1-ac05-4316-986a-18c2a1c562b9	355120e6-b04a-46f7-876a-b5d7aab3bde0	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	Chapter 3	Examples	Summary notes prepared by student.	\N	verified	836c6d73-d9ef-44c9-abb0-73c24cd900f2	2025-12-21 09:15:04.24+00	2025-12-20 09:15:04.24+00	2025-12-22 09:15:04.24+00
8f615a24-b42f-4327-8c6e-9cf88160913b	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	933ccbee-242b-44be-b6ab-729d5bd6d691	Chapter 6	Exercises	Summary notes prepared by student.	\N	verified	85d68757-04d1-4213-a3f5-8af479bceb4a	2025-12-22 09:15:04.24+00	2025-12-21 09:15:04.24+00	2025-12-24 09:15:04.24+00
d1319dde-afc8-4184-9bf4-448f10bc23d5	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	4f254b63-c125-47b9-abb0-3066aca8adf1	Chapter 3	Key concepts	Summary notes prepared by student.	\N	completed	\N	\N	2025-12-24 09:15:04.24+00	2025-12-26 09:15:04.24+00
1d54c101-9e99-4d7f-8a43-a84913b1c562	c18f6551-43e9-4a77-a52e-954d93cee377	3d83b951-f597-4f18-952b-0040470020bb	Chapter 2	Summary notes	Summary notes prepared by student.	\N	completed	\N	\N	2026-01-11 09:15:04.24+00	2026-01-13 09:15:04.24+00
f336f882-3a8b-4982-9a12-1327925212a4	c18f6551-43e9-4a77-a52e-954d93cee377	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	Chapter 4	Summary notes	Summary notes prepared by student.	\N	verified	836c6d73-d9ef-44c9-abb0-73c24cd900f2	2026-01-06 09:15:04.24+00	2026-01-05 09:15:04.24+00	2026-01-08 09:15:04.24+00
1ca9b061-ac5e-45ef-9c60-91a6bea2f07a	d7e84df8-3a50-4db2-96a7-f478ff5f9764	4f254b63-c125-47b9-abb0-3066aca8adf1	Chapter 2	Examples	Summary notes prepared by student.	\N	verified	ec0eb6d5-25df-4e35-9940-bc34abcd8ed9	2026-01-15 09:15:04.24+00	2026-01-14 09:15:04.24+00	2026-01-15 09:15:04.24+00
b270e264-658c-46e5-8e09-92f16c79d2cf	d7e84df8-3a50-4db2-96a7-f478ff5f9764	fe69fe37-af8d-4db5-be75-5260099a06bc	Chapter 6	Key concepts	Summary notes prepared by student.	\N	completed	\N	\N	2025-12-23 09:15:04.24+00	2025-12-24 09:15:04.24+00
0e3a148d-9e13-4d45-8b90-4a0e789d4863	b1965024-9f05-4ab8-a89c-9169ec08a541	4f254b63-c125-47b9-abb0-3066aca8adf1	Chapter 5	Exercises	Summary notes prepared by student.	\N	completed	\N	\N	2025-12-21 09:15:04.24+00	2025-12-23 09:15:04.24+00
35ecfcd4-95fd-40c9-bf9b-2cbb03d2eb8b	b1965024-9f05-4ab8-a89c-9169ec08a541	2061036e-3ae3-4a41-8a6e-be022c0c38b5	Chapter 5	Examples	Summary notes prepared by student.	\N	verified	b9ec8689-5563-4d7d-a5b6-965e3d32b275	2025-12-26 09:15:04.24+00	2025-12-25 09:15:04.24+00	2025-12-26 09:15:04.24+00
723bcdc0-c871-42f6-973e-2783977d4f00	dde039c1-6339-4f2b-91fd-54a185c68b52	2061036e-3ae3-4a41-8a6e-be022c0c38b5	Chapter 1	Key concepts	Summary notes prepared by student.	\N	verified	b9ec8689-5563-4d7d-a5b6-965e3d32b275	2025-12-22 09:15:04.24+00	2025-12-21 09:15:04.24+00	2025-12-23 09:15:04.24+00
935ec79b-26b7-497f-9969-a1cbb2b8877c	dde039c1-6339-4f2b-91fd-54a185c68b52	fe69fe37-af8d-4db5-be75-5260099a06bc	Chapter 5	Examples	Summary notes prepared by student.	\N	verified	7fd08be2-a61e-4a2a-905c-b2fc005155c5	2026-01-06 09:15:04.24+00	2026-01-05 09:15:04.24+00	2026-01-08 09:15:04.24+00
7fc0a2f3-f678-4d3d-a7e7-64f2e99e4188	e700842a-602b-4ecb-8df6-96e43d98e00e	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	Chapter 2	Examples	Summary notes prepared by student.	\N	completed	\N	\N	2026-01-06 09:15:04.24+00	2026-01-07 09:15:04.24+00
98effd34-a1a2-44f8-87d2-6a92b4091990	e700842a-602b-4ecb-8df6-96e43d98e00e	4f254b63-c125-47b9-abb0-3066aca8adf1	Chapter 6	Summary notes	Summary notes prepared by student.	\N	verified	ec0eb6d5-25df-4e35-9940-bc34abcd8ed9	2025-12-31 09:15:04.24+00	2025-12-30 09:15:04.24+00	2026-01-01 09:15:04.24+00
414fb1a1-2cb5-4af4-a930-a96cd0a7ed90	e0f448c8-7d42-4d39-bbcd-de58daff9420	933ccbee-242b-44be-b6ab-729d5bd6d691	Chapter 6	Summary notes	Summary notes prepared by student.	\N	completed	\N	\N	2026-01-01 09:15:04.24+00	2026-01-04 09:15:04.24+00
4f92d7c2-2c30-4af8-a4ec-7aaa73ad6777	e0f448c8-7d42-4d39-bbcd-de58daff9420	4f254b63-c125-47b9-abb0-3066aca8adf1	Chapter 2	Summary notes	Summary notes prepared by student.	\N	verified	ec0eb6d5-25df-4e35-9940-bc34abcd8ed9	2026-01-14 09:15:04.24+00	2026-01-13 09:15:04.24+00	2026-01-16 09:15:04.24+00
f1e90a30-2f07-42da-8775-2812b1bc1d21	97dfe15c-dcba-496a-9e58-2720c211d00a	2061036e-3ae3-4a41-8a6e-be022c0c38b5	Chapter 6	Summary notes	Summary notes prepared by student.	\N	completed	\N	\N	2026-01-04 09:15:04.24+00	2026-01-07 09:15:04.24+00
97ce8cba-6aff-404a-8c3d-5b5d5b8e67ff	97dfe15c-dcba-496a-9e58-2720c211d00a	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	Chapter 2	Key concepts	Summary notes prepared by student.	\N	completed	\N	\N	2025-12-28 09:15:04.24+00	2025-12-31 09:15:04.24+00
cf7108cb-5c5d-4350-b7d6-88c371274ebc	7b46e55e-46b4-4cfd-8809-b6e205a6e567	3d83b951-f597-4f18-952b-0040470020bb	Chapter 3	Key concepts	Summary notes prepared by student.	\N	completed	\N	\N	2026-01-13 09:15:04.24+00	2026-01-16 09:15:04.24+00
82f465d1-2ae2-4a85-927e-0c4633c9dbf6	7b46e55e-46b4-4cfd-8809-b6e205a6e567	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	Chapter 3	Key concepts	Summary notes prepared by student.	\N	verified	836c6d73-d9ef-44c9-abb0-73c24cd900f2	2026-01-06 09:15:04.24+00	2026-01-05 09:15:04.24+00	2026-01-06 09:15:04.24+00
6ae02509-e1c1-4899-bc1a-f8e35dcc42a6	60277f16-d457-4dc1-958d-a312a8d9471b	3d83b951-f597-4f18-952b-0040470020bb	Chapter 1	Key concepts	Summary notes prepared by student.	\N	completed	\N	\N	2026-01-03 09:15:04.24+00	2026-01-05 09:15:04.24+00
580989ba-486a-449e-9540-7364dfae3c59	60277f16-d457-4dc1-958d-a312a8d9471b	933ccbee-242b-44be-b6ab-729d5bd6d691	Chapter 1	Examples	Summary notes prepared by student.	\N	verified	85d68757-04d1-4213-a3f5-8af479bceb4a	2026-01-14 09:15:04.24+00	2026-01-13 09:15:04.24+00	2026-01-14 09:15:04.24+00
1b12306e-9a01-4406-a260-cfaa583d7b96	772182f8-2921-4fe3-a427-8c86cca2f2db	4f254b63-c125-47b9-abb0-3066aca8adf1	Chapter 2	Key concepts	Summary notes prepared by student.	\N	completed	\N	\N	2026-01-04 09:15:04.24+00	2026-01-07 09:15:04.24+00
d0cc2d0f-c647-4e4d-83cc-e307cfa85f50	772182f8-2921-4fe3-a427-8c86cca2f2db	2061036e-3ae3-4a41-8a6e-be022c0c38b5	Chapter 2	Key concepts	Summary notes prepared by student.	\N	verified	b9ec8689-5563-4d7d-a5b6-965e3d32b275	2025-12-23 09:15:04.24+00	2025-12-22 09:15:04.24+00	2025-12-25 09:15:04.24+00
ccf2d451-74be-4d12-b244-477dc7b22e37	9f6c81bf-ea4e-402f-96a1-968323555263	2061036e-3ae3-4a41-8a6e-be022c0c38b5	Chapter 5	Examples	Summary notes prepared by student.	\N	completed	\N	\N	2025-12-24 09:15:04.24+00	2025-12-27 09:15:04.24+00
c7386594-971b-423b-8afa-5bce52a7fce8	9f6c81bf-ea4e-402f-96a1-968323555263	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	Chapter 2	Key concepts	Summary notes prepared by student.	\N	completed	\N	\N	2026-01-06 09:15:04.24+00	2026-01-07 09:15:04.24+00
143ccf3a-88a4-46a7-9c22-6d3cbdbf2db2	5835a0de-c500-4ad7-b0e2-76aa107db95c	933ccbee-242b-44be-b6ab-729d5bd6d691	Chapter 1	Summary notes	Summary notes prepared by student.	\N	completed	\N	\N	2026-01-10 09:15:04.24+00	2026-01-13 09:15:04.24+00
08f9b6be-0bb6-421d-9981-51ebeaca1cd6	5835a0de-c500-4ad7-b0e2-76aa107db95c	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	Chapter 2	Examples	Summary notes prepared by student.	\N	completed	\N	\N	2025-12-21 09:15:04.24+00	2025-12-23 09:15:04.24+00
6f5bdb01-eb05-42d1-930c-057cb3e55c94	15a117ff-1cb4-49cf-8fd5-845f9061f160	3d83b951-f597-4f18-952b-0040470020bb	Chapter 3	Exercises	Summary notes prepared by student.	\N	verified	ac2ec10f-3a2c-4674-81e1-f72c983de087	2026-01-07 09:15:04.24+00	2026-01-06 09:15:04.24+00	2026-01-09 09:15:04.24+00
c51794b9-dd6e-404c-8333-657d7c145749	15a117ff-1cb4-49cf-8fd5-845f9061f160	4f254b63-c125-47b9-abb0-3066aca8adf1	Chapter 1	Examples	Summary notes prepared by student.	\N	verified	ec0eb6d5-25df-4e35-9940-bc34abcd8ed9	2026-01-07 09:15:04.24+00	2026-01-06 09:15:04.24+00	2026-01-07 09:15:04.24+00
912953e1-fbd0-4ec8-92b1-81a609541781	e0633026-2d69-4e2f-9731-dc6e05038f24	fe69fe37-af8d-4db5-be75-5260099a06bc	Chapter 2	Examples	Summary notes prepared by student.	\N	verified	7fd08be2-a61e-4a2a-905c-b2fc005155c5	2026-01-11 09:15:04.24+00	2026-01-10 09:15:04.24+00	2026-01-11 09:15:04.24+00
cc227058-8c65-4bb1-9870-319d23e67efb	e0633026-2d69-4e2f-9731-dc6e05038f24	2061036e-3ae3-4a41-8a6e-be022c0c38b5	Chapter 3	Examples	Summary notes prepared by student.	\N	verified	b9ec8689-5563-4d7d-a5b6-965e3d32b275	2026-01-03 09:15:04.24+00	2026-01-02 09:15:04.24+00	2026-01-03 09:15:04.24+00
fd666632-491c-46d4-b817-298446215d3b	63e27c91-167e-44c0-b455-ca85896b666c	933ccbee-242b-44be-b6ab-729d5bd6d691	Chapter 4	Exercises	Summary notes prepared by student.	\N	pending	\N	\N	2026-01-04 09:15:04.24+00	2026-01-06 09:15:04.24+00
78deabad-c236-44cb-9ea7-4c79f74da3eb	63e27c91-167e-44c0-b455-ca85896b666c	fe69fe37-af8d-4db5-be75-5260099a06bc	Chapter 5	Exercises	Summary notes prepared by student.	\N	pending	\N	\N	2026-01-11 09:15:04.24+00	2026-01-13 09:15:04.24+00
fb5c0575-585c-479f-9e73-6664b0887982	f684fc32-dcc9-4b44-bf14-112cd8958129	2061036e-3ae3-4a41-8a6e-be022c0c38b5	Chapter 2	Summary notes	Summary notes prepared by student.	\N	pending	\N	\N	2026-01-12 09:15:04.24+00	2026-01-15 09:15:04.24+00
8974661d-5e2a-4231-8066-ec1406489d63	f684fc32-dcc9-4b44-bf14-112cd8958129	933ccbee-242b-44be-b6ab-729d5bd6d691	Chapter 3	Summary notes	Summary notes prepared by student.	\N	pending	\N	\N	2025-12-27 09:15:04.24+00	2025-12-29 09:15:04.24+00
fe6c9f66-cce6-4112-bdb1-48ca613b097d	4c7a3cbd-447c-4cbc-918d-8e923ce57b80	933ccbee-242b-44be-b6ab-729d5bd6d691	Chapter 5	Summary notes	Summary notes prepared by student.	\N	pending	\N	\N	2026-01-12 09:15:04.24+00	2026-01-14 09:15:04.24+00
e3253156-7a82-45e6-8029-8a93f08927c8	4c7a3cbd-447c-4cbc-918d-8e923ce57b80	3d83b951-f597-4f18-952b-0040470020bb	Chapter 6	Summary notes	Summary notes prepared by student.	\N	pending	\N	\N	2025-12-26 09:15:04.24+00	2025-12-29 09:15:04.24+00
8b771fcd-24ea-4e54-a784-b2268b9f0c55	503b5c9c-042c-4813-9898-63b129515ad7	4f254b63-c125-47b9-abb0-3066aca8adf1	Chapter 6	Examples	Summary notes prepared by student.	\N	pending	\N	\N	2026-01-01 09:15:04.24+00	2026-01-03 09:15:04.24+00
b75b2066-864c-49cf-8b14-0c18b7c25c65	503b5c9c-042c-4813-9898-63b129515ad7	3d83b951-f597-4f18-952b-0040470020bb	Chapter 6	Key concepts	Summary notes prepared by student.	\N	pending	\N	\N	2025-12-21 09:15:04.24+00	2025-12-23 09:15:04.24+00
0a3b817f-4890-480e-9b69-4e32ddb58b0b	a6de668b-ecfa-4842-97a5-3cc27b34e1f6	933ccbee-242b-44be-b6ab-729d5bd6d691	Chapter 3	Exercises	Summary notes prepared by student.	\N	pending	\N	\N	2026-01-06 09:15:04.24+00	2026-01-07 09:15:04.24+00
962c6a51-f8c2-4ee4-97a7-12b1b4a040d4	a6de668b-ecfa-4842-97a5-3cc27b34e1f6	fe69fe37-af8d-4db5-be75-5260099a06bc	Chapter 1	Examples	Summary notes prepared by student.	\N	pending	\N	\N	2026-01-03 09:15:04.24+00	2026-01-04 09:15:04.24+00
fa93d6d6-91b1-4c54-a374-ca3c8a1bce3f	b470a0a0-fa44-468e-8b5e-102d68c08ed4	fe69fe37-af8d-4db5-be75-5260099a06bc	Chapter 5	Summary notes	Summary notes prepared by student.	\N	pending	\N	\N	2025-12-24 09:15:04.24+00	2025-12-26 09:15:04.24+00
d6d96e4a-9df7-4ade-878c-25da17cf587b	b470a0a0-fa44-468e-8b5e-102d68c08ed4	933ccbee-242b-44be-b6ab-729d5bd6d691	Chapter 2	Exercises	Summary notes prepared by student.	\N	pending	\N	\N	2026-01-12 09:15:04.24+00	2026-01-13 09:15:04.24+00
c6c0a653-8fef-471d-a73a-0b4934a53d65	acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	2061036e-3ae3-4a41-8a6e-be022c0c38b5	Chapter 6	Key concepts	Summary notes prepared by student.	\N	pending	\N	\N	2025-12-21 09:15:04.24+00	2025-12-24 09:15:04.24+00
2f874d12-a3bc-4016-bf55-aab558c8d1b0	acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	fe69fe37-af8d-4db5-be75-5260099a06bc	Chapter 4	Key concepts	Summary notes prepared by student.	\N	pending	\N	\N	2025-12-27 09:15:04.24+00	2025-12-30 09:15:04.24+00
1e9d2cc5-17ad-4c37-b6e7-03b3aefe973c	2286be2d-ff3b-4c8e-8c16-0b4bc6bebdc7	3d83b951-f597-4f18-952b-0040470020bb	Chapter 3	Exercises	Summary notes prepared by student.	\N	pending	\N	\N	2026-01-06 09:15:04.24+00	2026-01-07 09:15:04.24+00
b2180198-a0ed-43fa-b419-c8901ca29bfa	2286be2d-ff3b-4c8e-8c16-0b4bc6bebdc7	fe69fe37-af8d-4db5-be75-5260099a06bc	Chapter 3	Exercises	Summary notes prepared by student.	\N	pending	\N	\N	2026-01-10 09:15:04.24+00	2026-01-12 09:15:04.24+00
b81c57c0-528d-449c-aaee-02488d689167	60498abe-fb45-4fce-b715-796c6ad2a7b1	4f254b63-c125-47b9-abb0-3066aca8adf1	Chapter 4	Examples	Summary notes prepared by student.	\N	pending	\N	\N	2025-12-30 09:15:04.24+00	2025-12-31 09:15:04.24+00
dbbdb807-751f-4465-b439-90d8a1a25eb8	60498abe-fb45-4fce-b715-796c6ad2a7b1	933ccbee-242b-44be-b6ab-729d5bd6d691	Chapter 5	Key concepts	Summary notes prepared by student.	\N	pending	\N	\N	2025-12-31 09:15:04.24+00	2026-01-03 09:15:04.24+00
00fb2c05-4670-4c83-bef5-69c60f95717b	cecbea1b-e71b-4995-97cc-6254e7815265	933ccbee-242b-44be-b6ab-729d5bd6d691	Chapter 3	Summary notes	Summary notes prepared by student.	\N	pending	\N	\N	2026-01-08 09:15:04.24+00	2026-01-09 09:15:04.24+00
31e94835-3815-4efa-a748-6b64b0ff5b5d	cecbea1b-e71b-4995-97cc-6254e7815265	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	Chapter 3	Examples	Summary notes prepared by student.	\N	pending	\N	\N	2025-12-26 09:15:04.24+00	2025-12-29 09:15:04.24+00
\.


--
-- TOC entry 3935 (class 0 OID 24772)
-- Dependencies: 232
-- Data for Name: student_profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.student_profiles (id, user_id, class_id, roll_number, learning_style, goals, interests, parent_contact, address, streak_days, total_points, created_at, updated_at, learning_profile) FROM stdin;
9ce853d7-630c-4ca4-92a4-28615ac6bf4a	cdacd5ec-aa0b-4a66-8f17-0f767466513a	06dff094-078a-4f29-9cd8-bbfbb60e7b96	1	visual	{"Prepare for SEE and score 3.6+ GPA","Improve consistency and avoid missing assignments"}	{coding,dance}	+977-9810561000	Kathmandu	23	2018	2025-12-02 09:15:04.24+00	2026-01-02 09:15:04.24+00	{"strengths": ["quick recall", "problem solving", "consistent practice"], "studyGoal": "Improve consistency and avoid missing assignments", "weakPoints": ["silly mistakes under speed"], "deviceAccess": "shared smartphone", "learningPace": "fast", "supportNeeds": ["step-by-step examples", "concept revision"], "noteTakingStyle": "cornell", "languagePreference": "Nepali", "motivationTriggers": ["project work", "peer competition"], "preferredStudyTime": "Night (8-10 PM)", "tutoringPreference": "small group", "confidenceBySubject": {"math": 80, "nepali": 88, "social": 95, "english": 85, "science": 95, "computer": 95}, "attentionSpanMinutes": 35}
b1b53c27-8f4f-47f5-938d-59a66dae5c80	85079b8e-4704-49b1-84ed-2d3c501654ee	06dff094-078a-4f29-9cd8-bbfbb60e7b96	2	reading	{"Prepare for SEE and score 3.6+ GPA","Strengthen fundamentals for +2 science entrance"}	{dance,music}	+977-9887644165	Bhaktapur	25	2053	2025-11-30 09:15:04.24+00	2026-01-03 09:15:04.24+00	{"strengths": ["quick recall", "problem solving", "consistent practice"], "studyGoal": "Strengthen fundamentals for +2 science entrance", "weakPoints": ["silly mistakes under speed"], "deviceAccess": "shared smartphone", "learningPace": "fast", "supportNeeds": ["extra practice sets", "step-by-step examples"], "noteTakingStyle": "flashcards", "languagePreference": "English", "motivationTriggers": ["peer competition", "parent check-ins"], "preferredStudyTime": "Afternoon (2-4 PM)", "tutoringPreference": "1:1", "confidenceBySubject": {"math": 95, "nepali": 95, "social": 95, "english": 95, "science": 84, "computer": 95}, "attentionSpanMinutes": 48}
70cde32e-354a-444e-8c2d-dabb896905d1	67d4f333-220d-4a64-bcd2-8dc53a56624c	06dff094-078a-4f29-9cd8-bbfbb60e7b96	3	reading	{"Strengthen fundamentals for +2 science entrance","Build confidence in problem solving"}	{football,debate}	+977-9876669792	Chitwan	28	2095	2025-11-30 09:15:04.24+00	2025-12-29 09:15:04.24+00	{"strengths": ["quick recall", "problem solving", "consistent practice"], "studyGoal": "Strengthen fundamentals for +2 science entrance", "weakPoints": ["silly mistakes under speed"], "deviceAccess": "personal smartphone", "learningPace": "needs reinforcement", "supportNeeds": ["frequent feedback", "step-by-step examples"], "noteTakingStyle": "outline", "languagePreference": "Nepali", "motivationTriggers": ["short quizzes", "reward points"], "preferredStudyTime": "Early Morning (6-8 AM)", "tutoringPreference": "small group", "confidenceBySubject": {"math": 93, "nepali": 95, "social": 95, "english": 87, "science": 95, "computer": 91}, "attentionSpanMinutes": 50}
51614129-6e9d-4cf8-a796-e5295a4cb48f	345bb275-556d-4960-b7de-28922983a7b2	06dff094-078a-4f29-9cd8-bbfbb60e7b96	4	visual	{"Improve consistency and avoid missing assignments","Strengthen fundamentals for +2 science entrance"}	{debate,coding}	+977-9818341380	Kathmandu	20	2239	2025-12-06 09:15:04.24+00	2026-01-06 09:15:04.24+00	{"strengths": ["quick recall", "problem solving", "consistent practice"], "studyGoal": "Strengthen fundamentals for +2 science entrance", "weakPoints": ["silly mistakes under speed"], "deviceAccess": "laptop at home", "learningPace": "needs reinforcement", "supportNeeds": ["frequent feedback", "extra practice sets"], "noteTakingStyle": "cornell", "languagePreference": "Nepali", "motivationTriggers": ["reward points", "parent check-ins"], "preferredStudyTime": "Afternoon (2-4 PM)", "tutoringPreference": "small group", "confidenceBySubject": {"math": 95, "nepali": 95, "social": 93, "english": 95, "science": 85, "computer": 89}, "attentionSpanMinutes": 31}
9a6ce9f4-08de-41bf-a240-4c8ff78de556	355120e6-b04a-46f7-876a-b5d7aab3bde0	06dff094-078a-4f29-9cd8-bbfbb60e7b96	5	auditory	{"Build confidence in problem solving","Improve consistency and avoid missing assignments"}	{cricket,debate}	+977-9847850569	Pokhara	34	2137	2025-12-02 09:15:04.24+00	2026-01-07 09:15:04.24+00	{"strengths": ["quick recall", "problem solving", "consistent practice"], "studyGoal": "Prepare for SEE and score 3.6+ GPA", "weakPoints": ["silly mistakes under speed"], "deviceAccess": "shared smartphone", "learningPace": "fast", "supportNeeds": ["concept revision", "step-by-step examples"], "noteTakingStyle": "outline", "languagePreference": "Nepali", "motivationTriggers": ["short quizzes", "peer competition"], "preferredStudyTime": "Afternoon (2-4 PM)", "tutoringPreference": "guided self-study", "confidenceBySubject": {"math": 87, "nepali": 83, "social": 91, "english": 83, "science": 95, "computer": 89}, "attentionSpanMinutes": 44}
6d26b4a9-89a4-4df3-87e8-9791070bccb1	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	06dff094-078a-4f29-9cd8-bbfbb60e7b96	6	reading	{"Prepare for SEE and score 3.6+ GPA","Strengthen fundamentals for +2 science entrance"}	{coding,"science fairs"}	+977-9888110406	Bhaktapur	23	1663	2025-12-01 09:15:04.24+00	2026-01-10 09:15:04.24+00	{"strengths": ["steady progress", "good class participation"], "studyGoal": "Prepare for SEE and score 3.6+ GPA", "weakPoints": ["exam pressure", "needs revision"], "deviceAccess": "laptop at home", "learningPace": "steady", "supportNeeds": ["visual aids", "concept revision"], "noteTakingStyle": "outline", "languagePreference": "Mix", "motivationTriggers": ["peer competition", "short quizzes"], "preferredStudyTime": "Early Morning (6-8 AM)", "tutoringPreference": "1:1", "confidenceBySubject": {"math": 70, "nepali": 82, "social": 74, "english": 86, "science": 71, "computer": 83}, "attentionSpanMinutes": 42}
e2c231e6-a284-4691-968c-995dfc53d799	c18f6551-43e9-4a77-a52e-954d93cee377	06dff094-078a-4f29-9cd8-bbfbb60e7b96	7	visual	{"Prepare for SEE and score 3.6+ GPA","Improve consistency and avoid missing assignments"}	{dance,music}	+977-9872065021	Lalitpur	23	1541	2025-11-30 09:15:04.24+00	2025-12-30 09:15:04.24+00	{"strengths": ["steady progress", "good class participation"], "studyGoal": "Build confidence in problem solving", "weakPoints": ["exam pressure", "needs revision"], "deviceAccess": "personal smartphone", "learningPace": "fast", "supportNeeds": ["frequent feedback", "concept revision"], "noteTakingStyle": "cornell", "languagePreference": "English", "motivationTriggers": ["reward points", "short quizzes"], "preferredStudyTime": "Early Morning (6-8 AM)", "tutoringPreference": "1:1", "confidenceBySubject": {"math": 69, "nepali": 75, "social": 78, "english": 67, "science": 67, "computer": 83}, "attentionSpanMinutes": 34}
930d98b9-4d45-4f90-8aec-ce32d7349fd9	d7e84df8-3a50-4db2-96a7-f478ff5f9764	06dff094-078a-4f29-9cd8-bbfbb60e7b96	8	auditory	{"Prepare for SEE and score 3.6+ GPA","Improve consistency and avoid missing assignments"}	{drawing,dance}	+977-9826856208	Lalitpur	21	1907	2025-12-04 09:15:04.24+00	2025-12-28 09:15:04.24+00	{"strengths": ["steady progress", "good class participation"], "studyGoal": "Prepare for SEE and score 3.6+ GPA", "weakPoints": ["exam pressure", "needs revision"], "deviceAccess": "laptop at home", "learningPace": "fast", "supportNeeds": ["frequent feedback", "step-by-step examples"], "noteTakingStyle": "flashcards", "languagePreference": "English", "motivationTriggers": ["short quizzes", "project work"], "preferredStudyTime": "Evening (6-8 PM)", "tutoringPreference": "small group", "confidenceBySubject": {"math": 75, "nepali": 88, "social": 92, "english": 78, "science": 71, "computer": 92}, "attentionSpanMinutes": 41}
217ad355-0a77-4270-ad0d-f2a90c803ee6	b1965024-9f05-4ab8-a89c-9169ec08a541	06dff094-078a-4f29-9cd8-bbfbb60e7b96	9	kinesthetic	{"Prepare for SEE and score 3.6+ GPA","Strengthen fundamentals for +2 science entrance"}	{dance,cricket}	+977-9873615006	Lalitpur	25	1881	2025-12-07 09:15:04.24+00	2026-01-23 09:15:04.24+00	{"strengths": ["steady progress", "good class participation"], "studyGoal": "Improve consistency and avoid missing assignments", "weakPoints": ["exam pressure", "needs revision"], "deviceAccess": "shared smartphone", "learningPace": "fast", "supportNeeds": ["frequent feedback", "step-by-step examples"], "noteTakingStyle": "flashcards", "languagePreference": "English", "motivationTriggers": ["reward points", "parent check-ins"], "preferredStudyTime": "Afternoon (2-4 PM)", "tutoringPreference": "1:1", "confidenceBySubject": {"math": 82, "nepali": 92, "social": 93, "english": 83, "science": 93, "computer": 80}, "attentionSpanMinutes": 44}
2ff96b0b-a19b-425c-be42-af3a94fe8523	dde039c1-6339-4f2b-91fd-54a185c68b52	06dff094-078a-4f29-9cd8-bbfbb60e7b96	10	reading	{"Build confidence in problem solving","Strengthen fundamentals for +2 science entrance"}	{debate,music}	+977-9869755357	Bhaktapur	21	2028	2025-12-03 09:15:04.24+00	2026-01-17 09:15:04.24+00	{"strengths": ["steady progress", "good class participation"], "studyGoal": "Prepare for SEE and score 3.6+ GPA", "weakPoints": ["exam pressure", "needs revision"], "deviceAccess": "shared smartphone", "learningPace": "steady", "supportNeeds": ["step-by-step examples", "visual aids"], "noteTakingStyle": "outline", "languagePreference": "English", "motivationTriggers": ["reward points", "project work"], "preferredStudyTime": "Evening (6-8 PM)", "tutoringPreference": "1:1", "confidenceBySubject": {"math": 91, "nepali": 93, "social": 93, "english": 77, "science": 77, "computer": 86}, "attentionSpanMinutes": 51}
8df41773-2683-4b6b-b736-f3384ff693e3	e700842a-602b-4ecb-8df6-96e43d98e00e	06dff094-078a-4f29-9cd8-bbfbb60e7b96	11	auditory	{"Improve consistency and avoid missing assignments","Build confidence in problem solving"}	{football,"science fairs"}	+977-9833736718	Kathmandu	20	1473	2025-12-06 09:15:04.24+00	2026-01-07 09:15:04.24+00	{"strengths": ["steady progress", "good class participation"], "studyGoal": "Strengthen fundamentals for +2 science entrance", "weakPoints": ["exam pressure", "needs revision"], "deviceAccess": "personal smartphone", "learningPace": "needs reinforcement", "supportNeeds": ["step-by-step examples", "frequent feedback"], "noteTakingStyle": "cornell", "languagePreference": "English", "motivationTriggers": ["parent check-ins", "short quizzes"], "preferredStudyTime": "Evening (6-8 PM)", "tutoringPreference": "1:1", "confidenceBySubject": {"math": 70, "nepali": 76, "social": 66, "english": 68, "science": 57, "computer": 68}, "attentionSpanMinutes": 38}
93e8dc90-4752-49bd-92e3-2b1c904167d7	e0f448c8-7d42-4d39-bbcd-de58daff9420	06dff094-078a-4f29-9cd8-bbfbb60e7b96	12	visual	{"Strengthen fundamentals for +2 science entrance","Build confidence in problem solving"}	{"science fairs",football}	+977-9867552497	Kathmandu	24	1682	2025-12-03 09:15:04.24+00	2026-01-09 09:15:04.24+00	{"strengths": ["steady progress", "good class participation"], "studyGoal": "Build confidence in problem solving", "weakPoints": ["exam pressure", "needs revision"], "deviceAccess": "shared smartphone", "learningPace": "needs reinforcement", "supportNeeds": ["step-by-step examples", "visual aids"], "noteTakingStyle": "mind-map", "languagePreference": "English", "motivationTriggers": ["reward points", "project work"], "preferredStudyTime": "Early Morning (6-8 AM)", "tutoringPreference": "guided self-study", "confidenceBySubject": {"math": 65, "nepali": 69, "social": 73, "english": 63, "science": 57, "computer": 80}, "attentionSpanMinutes": 29}
35c14e09-eba8-48be-9d4b-a64553789938	97dfe15c-dcba-496a-9e58-2720c211d00a	06dff094-078a-4f29-9cd8-bbfbb60e7b96	13	reading	{"Prepare for SEE and score 3.6+ GPA","Improve consistency and avoid missing assignments"}	{debate,coding}	+977-9851016362	Chitwan	14	1632	2025-12-06 09:15:04.24+00	2026-01-18 09:15:04.24+00	{"strengths": ["steady progress", "good class participation"], "studyGoal": "Build confidence in problem solving", "weakPoints": ["exam pressure", "needs revision"], "deviceAccess": "personal smartphone", "learningPace": "needs reinforcement", "supportNeeds": ["concept revision", "extra practice sets"], "noteTakingStyle": "cornell", "languagePreference": "Mix", "motivationTriggers": ["short quizzes", "project work"], "preferredStudyTime": "Early Morning (6-8 AM)", "tutoringPreference": "small group", "confidenceBySubject": {"math": 57, "nepali": 70, "social": 75, "english": 77, "science": 56, "computer": 70}, "attentionSpanMinutes": 44}
8f3968fe-6c6b-421b-92b5-791489a43d55	7b46e55e-46b4-4cfd-8809-b6e205a6e567	06dff094-078a-4f29-9cd8-bbfbb60e7b96	14	auditory	{"Build confidence in problem solving","Improve consistency and avoid missing assignments"}	{football,cricket}	+977-9858201308	Pokhara	25	1675	2025-11-30 09:15:04.24+00	2026-01-17 09:15:04.24+00	{"strengths": ["steady progress", "good class participation"], "studyGoal": "Strengthen fundamentals for +2 science entrance", "weakPoints": ["exam pressure", "needs revision"], "deviceAccess": "shared smartphone", "learningPace": "needs reinforcement", "supportNeeds": ["visual aids", "step-by-step examples"], "noteTakingStyle": "outline", "languagePreference": "Mix", "motivationTriggers": ["short quizzes", "reward points"], "preferredStudyTime": "Early Morning (6-8 AM)", "tutoringPreference": "small group", "confidenceBySubject": {"math": 70, "nepali": 63, "social": 64, "english": 64, "science": 62, "computer": 74}, "attentionSpanMinutes": 27}
335c2813-7be5-4dfd-b8fc-5dea3d8eb5d2	60277f16-d457-4dc1-958d-a312a8d9471b	06dff094-078a-4f29-9cd8-bbfbb60e7b96	15	auditory	{"Strengthen fundamentals for +2 science entrance","Improve consistency and avoid missing assignments"}	{football,dance}	+977-9848561754	Kathmandu	13	1746	2025-12-05 09:15:04.24+00	2026-01-21 09:15:04.24+00	{"strengths": ["steady progress", "good class participation"], "studyGoal": "Strengthen fundamentals for +2 science entrance", "weakPoints": ["exam pressure", "needs revision"], "deviceAccess": "shared smartphone", "learningPace": "fast", "supportNeeds": ["concept revision", "visual aids"], "noteTakingStyle": "flashcards", "languagePreference": "English", "motivationTriggers": ["peer competition", "short quizzes"], "preferredStudyTime": "Early Morning (6-8 AM)", "tutoringPreference": "guided self-study", "confidenceBySubject": {"math": 89, "nepali": 73, "social": 85, "english": 83, "science": 81, "computer": 76}, "attentionSpanMinutes": 27}
eb7cb875-0ea5-46c0-b76f-d375facc1526	772182f8-2921-4fe3-a427-8c86cca2f2db	06dff094-078a-4f29-9cd8-bbfbb60e7b96	16	reading	{"Strengthen fundamentals for +2 science entrance","Improve consistency and avoid missing assignments"}	{football,music}	+977-9871922932	Lalitpur	16	1827	2025-11-30 09:15:04.24+00	2025-12-29 09:15:04.24+00	{"strengths": ["steady progress", "good class participation"], "studyGoal": "Build confidence in problem solving", "weakPoints": ["exam pressure", "needs revision"], "deviceAccess": "personal smartphone", "learningPace": "fast", "supportNeeds": ["extra practice sets", "visual aids"], "noteTakingStyle": "cornell", "languagePreference": "English", "motivationTriggers": ["short quizzes", "project work"], "preferredStudyTime": "Evening (6-8 PM)", "tutoringPreference": "small group", "confidenceBySubject": {"math": 68, "nepali": 75, "social": 76, "english": 82, "science": 64, "computer": 75}, "attentionSpanMinutes": 40}
a5d1924c-af4c-4724-aef4-e252fee00ce9	9f6c81bf-ea4e-402f-96a1-968323555263	06dff094-078a-4f29-9cd8-bbfbb60e7b96	17	kinesthetic	{"Prepare for SEE and score 3.6+ GPA","Improve consistency and avoid missing assignments"}	{football,"science fairs"}	+977-9884012902	Chitwan	10	1783	2025-12-05 09:15:04.24+00	2026-01-16 09:15:04.24+00	{"strengths": ["steady progress", "good class participation"], "studyGoal": "Improve consistency and avoid missing assignments", "weakPoints": ["exam pressure", "needs revision"], "deviceAccess": "shared smartphone", "learningPace": "needs reinforcement", "supportNeeds": ["visual aids", "step-by-step examples"], "noteTakingStyle": "outline", "languagePreference": "Mix", "motivationTriggers": ["short quizzes", "reward points"], "preferredStudyTime": "Night (8-10 PM)", "tutoringPreference": "1:1", "confidenceBySubject": {"math": 71, "nepali": 84, "social": 73, "english": 82, "science": 75, "computer": 75}, "attentionSpanMinutes": 51}
42a06f6c-a464-48ea-9d60-13200006dc9c	5835a0de-c500-4ad7-b0e2-76aa107db95c	06dff094-078a-4f29-9cd8-bbfbb60e7b96	18	visual	{"Build confidence in problem solving","Improve consistency and avoid missing assignments"}	{dance,cricket}	+977-9812112804	Bhaktapur	14	1528	2025-12-03 09:15:04.24+00	2026-01-01 09:15:04.24+00	{"strengths": ["steady progress", "good class participation"], "studyGoal": "Improve consistency and avoid missing assignments", "weakPoints": ["exam pressure", "needs revision"], "deviceAccess": "shared smartphone", "learningPace": "fast", "supportNeeds": ["step-by-step examples", "visual aids"], "noteTakingStyle": "outline", "languagePreference": "English", "motivationTriggers": ["short quizzes", "project work"], "preferredStudyTime": "Afternoon (2-4 PM)", "tutoringPreference": "guided self-study", "confidenceBySubject": {"math": 64, "nepali": 78, "social": 76, "english": 62, "science": 65, "computer": 73}, "attentionSpanMinutes": 39}
ca834345-6c29-46f9-a754-d0e17454567e	15a117ff-1cb4-49cf-8fd5-845f9061f160	06dff094-078a-4f29-9cd8-bbfbb60e7b96	19	visual	{"Build confidence in problem solving","Prepare for SEE and score 3.6+ GPA"}	{dance,reading}	+977-9872884694	Chitwan	17	1826	2025-12-05 09:15:04.24+00	2026-01-09 09:15:04.24+00	{"strengths": ["steady progress", "good class participation"], "studyGoal": "Prepare for SEE and score 3.6+ GPA", "weakPoints": ["exam pressure", "needs revision"], "deviceAccess": "shared smartphone", "learningPace": "fast", "supportNeeds": ["concept revision", "extra practice sets"], "noteTakingStyle": "mind-map", "languagePreference": "Nepali", "motivationTriggers": ["reward points", "short quizzes"], "preferredStudyTime": "Afternoon (2-4 PM)", "tutoringPreference": "guided self-study", "confidenceBySubject": {"math": 68, "nepali": 84, "social": 81, "english": 77, "science": 82, "computer": 76}, "attentionSpanMinutes": 46}
565ddf00-35fb-4e20-82a3-fc9d20ef72e6	e0633026-2d69-4e2f-9731-dc6e05038f24	06dff094-078a-4f29-9cd8-bbfbb60e7b96	20	kinesthetic	{"Prepare for SEE and score 3.6+ GPA","Build confidence in problem solving"}	{"science fairs",coding}	+977-9876469193	Kathmandu	14	1664	2025-12-01 09:15:04.24+00	2025-12-30 09:15:04.24+00	{"strengths": ["steady progress", "good class participation"], "studyGoal": "Build confidence in problem solving", "weakPoints": ["exam pressure", "needs revision"], "deviceAccess": "laptop at home", "learningPace": "steady", "supportNeeds": ["step-by-step examples", "frequent feedback"], "noteTakingStyle": "cornell", "languagePreference": "Nepali", "motivationTriggers": ["parent check-ins", "short quizzes"], "preferredStudyTime": "Early Morning (6-8 AM)", "tutoringPreference": "guided self-study", "confidenceBySubject": {"math": 73, "nepali": 81, "social": 75, "english": 71, "science": 78, "computer": 79}, "attentionSpanMinutes": 31}
38985e7b-a87e-49bd-9be3-453c6eef96bd	63e27c91-167e-44c0-b455-ca85896b666c	06dff094-078a-4f29-9cd8-bbfbb60e7b96	21	visual	{"Strengthen fundamentals for +2 science entrance","Improve consistency and avoid missing assignments"}	{coding,"science fairs"}	+977-9819271699	Lalitpur	6	1601	2025-12-04 09:15:04.24+00	2026-01-14 09:15:04.24+00	{"strengths": ["curious in class", "improves with guidance"], "studyGoal": "Build confidence in problem solving", "weakPoints": ["concept retention", "time management"], "deviceAccess": "laptop at home", "learningPace": "fast", "supportNeeds": ["extra practice sets", "concept revision"], "noteTakingStyle": "cornell", "languagePreference": "Nepali", "motivationTriggers": ["project work", "short quizzes"], "preferredStudyTime": "Early Morning (6-8 AM)", "tutoringPreference": "small group", "confidenceBySubject": {"math": 65, "nepali": 60, "social": 62, "english": 53, "science": 52, "computer": 72}, "attentionSpanMinutes": 47}
2756b3c1-3e29-431c-b7ea-2d597fa7b3bf	f684fc32-dcc9-4b44-bf14-112cd8958129	06dff094-078a-4f29-9cd8-bbfbb60e7b96	22	visual	{"Strengthen fundamentals for +2 science entrance","Build confidence in problem solving"}	{cricket,"science fairs"}	+977-9835797789	Chitwan	4	1334	2025-12-02 09:15:04.24+00	2026-01-04 09:15:04.24+00	{"strengths": ["curious in class", "improves with guidance"], "studyGoal": "Build confidence in problem solving", "weakPoints": ["concept retention", "time management"], "deviceAccess": "laptop at home", "learningPace": "steady", "supportNeeds": ["frequent feedback", "concept revision"], "noteTakingStyle": "flashcards", "languagePreference": "Mix", "motivationTriggers": ["reward points", "project work"], "preferredStudyTime": "Evening (6-8 PM)", "tutoringPreference": "1:1", "confidenceBySubject": {"math": 56, "nepali": 57, "social": 71, "english": 71, "science": 59, "computer": 59}, "attentionSpanMinutes": 27}
91601e39-084e-4fe2-b140-df6c9aad6314	4c7a3cbd-447c-4cbc-918d-8e923ce57b80	06dff094-078a-4f29-9cd8-bbfbb60e7b96	23	kinesthetic	{"Prepare for SEE and score 3.6+ GPA","Strengthen fundamentals for +2 science entrance"}	{drawing,coding}	+977-9891539386	Chitwan	10	989	2025-12-08 09:15:04.24+00	2026-01-10 09:15:04.24+00	{"strengths": ["curious in class", "improves with guidance"], "studyGoal": "Improve consistency and avoid missing assignments", "weakPoints": ["concept retention", "time management"], "deviceAccess": "laptop at home", "learningPace": "fast", "supportNeeds": ["concept revision", "frequent feedback"], "noteTakingStyle": "flashcards", "languagePreference": "Nepali", "motivationTriggers": ["parent check-ins", "short quizzes"], "preferredStudyTime": "Evening (6-8 PM)", "tutoringPreference": "guided self-study", "confidenceBySubject": {"math": 50, "nepali": 40, "social": 41, "english": 36, "science": 54, "computer": 48}, "attentionSpanMinutes": 20}
f9cded2e-7df8-48d5-9df9-80fede20240e	503b5c9c-042c-4813-9898-63b129515ad7	06dff094-078a-4f29-9cd8-bbfbb60e7b96	24	visual	{"Build confidence in problem solving","Improve consistency and avoid missing assignments"}	{debate,football}	+977-9848043579	Chitwan	10	1377	2025-12-02 09:15:04.24+00	2026-01-20 09:15:04.24+00	{"strengths": ["curious in class", "improves with guidance"], "studyGoal": "Improve consistency and avoid missing assignments", "weakPoints": ["concept retention", "time management"], "deviceAccess": "personal smartphone", "learningPace": "steady", "supportNeeds": ["extra practice sets", "frequent feedback"], "noteTakingStyle": "outline", "languagePreference": "Nepali", "motivationTriggers": ["parent check-ins", "reward points"], "preferredStudyTime": "Early Morning (6-8 AM)", "tutoringPreference": "1:1", "confidenceBySubject": {"math": 66, "nepali": 71, "social": 74, "english": 63, "science": 65, "computer": 67}, "attentionSpanMinutes": 33}
4ddc0b0d-4cce-43c2-9dc4-9ee7a395a6c9	a6de668b-ecfa-4842-97a5-3cc27b34e1f6	06dff094-078a-4f29-9cd8-bbfbb60e7b96	25	auditory	{"Strengthen fundamentals for +2 science entrance","Improve consistency and avoid missing assignments"}	{coding,reading}	+977-9888009575	Pokhara	8	1180	2025-11-30 09:15:04.24+00	2026-01-19 09:15:04.24+00	{"strengths": ["curious in class", "improves with guidance"], "studyGoal": "Improve consistency and avoid missing assignments", "weakPoints": ["concept retention", "time management"], "deviceAccess": "shared smartphone", "learningPace": "fast", "supportNeeds": ["visual aids", "extra practice sets"], "noteTakingStyle": "cornell", "languagePreference": "Mix", "motivationTriggers": ["peer competition", "project work"], "preferredStudyTime": "Early Morning (6-8 AM)", "tutoringPreference": "1:1", "confidenceBySubject": {"math": 49, "nepali": 63, "social": 62, "english": 63, "science": 64, "computer": 60}, "attentionSpanMinutes": 39}
18633d98-770f-4284-9315-d24dbfcfbc76	b470a0a0-fa44-468e-8b5e-102d68c08ed4	06dff094-078a-4f29-9cd8-bbfbb60e7b96	26	auditory	{"Strengthen fundamentals for +2 science entrance","Build confidence in problem solving"}	{dance,reading}	+977-9862259841	Kathmandu	10	1445	2025-12-07 09:15:04.24+00	2026-01-18 09:15:04.24+00	{"strengths": ["curious in class", "improves with guidance"], "studyGoal": "Strengthen fundamentals for +2 science entrance", "weakPoints": ["concept retention", "time management"], "deviceAccess": "personal smartphone", "learningPace": "steady", "supportNeeds": ["frequent feedback", "concept revision"], "noteTakingStyle": "cornell", "languagePreference": "English", "motivationTriggers": ["short quizzes", "reward points"], "preferredStudyTime": "Evening (6-8 PM)", "tutoringPreference": "1:1", "confidenceBySubject": {"math": 51, "nepali": 60, "social": 65, "english": 60, "science": 45, "computer": 63}, "attentionSpanMinutes": 27}
b99d8d66-932d-490f-bd9a-0b2beae87b3c	acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	06dff094-078a-4f29-9cd8-bbfbb60e7b96	27	visual	{"Build confidence in problem solving","Prepare for SEE and score 3.6+ GPA"}	{music,"science fairs"}	+977-9867344252	Lalitpur	10	1614	2025-12-01 09:15:04.24+00	2026-01-19 09:15:04.24+00	{"strengths": ["curious in class", "improves with guidance"], "studyGoal": "Improve consistency and avoid missing assignments", "weakPoints": ["concept retention", "time management"], "deviceAccess": "shared smartphone", "learningPace": "fast", "supportNeeds": ["step-by-step examples", "frequent feedback"], "noteTakingStyle": "outline", "languagePreference": "Nepali", "motivationTriggers": ["project work", "parent check-ins"], "preferredStudyTime": "Afternoon (2-4 PM)", "tutoringPreference": "1:1", "confidenceBySubject": {"math": 69, "nepali": 57, "social": 68, "english": 54, "science": 63, "computer": 60}, "attentionSpanMinutes": 27}
482e1958-d5c0-4882-82f1-cdcbd3f24d32	2286be2d-ff3b-4c8e-8c16-0b4bc6bebdc7	06dff094-078a-4f29-9cd8-bbfbb60e7b96	28	visual	{"Prepare for SEE and score 3.6+ GPA","Strengthen fundamentals for +2 science entrance"}	{drawing,music}	+977-9898452519	Lalitpur	5	1403	2025-11-30 09:15:04.24+00	2026-01-05 09:15:04.24+00	{"strengths": ["curious in class", "improves with guidance"], "studyGoal": "Build confidence in problem solving", "weakPoints": ["concept retention", "time management"], "deviceAccess": "laptop at home", "learningPace": "steady", "supportNeeds": ["concept revision", "frequent feedback"], "noteTakingStyle": "cornell", "languagePreference": "English", "motivationTriggers": ["reward points", "project work"], "preferredStudyTime": "Afternoon (2-4 PM)", "tutoringPreference": "1:1", "confidenceBySubject": {"math": 48, "nepali": 52, "social": 52, "english": 62, "science": 53, "computer": 63}, "attentionSpanMinutes": 29}
8a98c804-77c7-4c00-af30-3c6ea5ec312f	60498abe-fb45-4fce-b715-796c6ad2a7b1	06dff094-078a-4f29-9cd8-bbfbb60e7b96	29	visual	{"Strengthen fundamentals for +2 science entrance","Improve consistency and avoid missing assignments"}	{football,cricket}	+977-9865433853	Chitwan	7	1246	2025-12-01 09:15:04.24+00	2026-01-09 09:15:04.24+00	{"strengths": ["curious in class", "improves with guidance"], "studyGoal": "Improve consistency and avoid missing assignments", "weakPoints": ["concept retention", "time management"], "deviceAccess": "personal smartphone", "learningPace": "needs reinforcement", "supportNeeds": ["frequent feedback", "concept revision"], "noteTakingStyle": "flashcards", "languagePreference": "English", "motivationTriggers": ["peer competition", "short quizzes"], "preferredStudyTime": "Night (8-10 PM)", "tutoringPreference": "small group", "confidenceBySubject": {"math": 58, "nepali": 55, "social": 66, "english": 56, "science": 62, "computer": 64}, "attentionSpanMinutes": 50}
ea505276-ae51-4cf2-89e1-842eb774fbe4	cecbea1b-e71b-4995-97cc-6254e7815265	06dff094-078a-4f29-9cd8-bbfbb60e7b96	30	visual	{"Prepare for SEE and score 3.6+ GPA","Improve consistency and avoid missing assignments"}	{"science fairs",football}	+977-9851688461	Bhaktapur	8	1382	2025-11-30 09:15:04.24+00	2026-01-11 09:15:04.24+00	{"strengths": ["curious in class", "improves with guidance"], "studyGoal": "Prepare for SEE and score 3.6+ GPA", "weakPoints": ["concept retention", "time management"], "deviceAccess": "laptop at home", "learningPace": "needs reinforcement", "supportNeeds": ["visual aids", "concept revision"], "noteTakingStyle": "mind-map", "languagePreference": "Nepali", "motivationTriggers": ["short quizzes", "project work"], "preferredStudyTime": "Afternoon (2-4 PM)", "tutoringPreference": "small group", "confidenceBySubject": {"math": 60, "nepali": 49, "social": 60, "english": 59, "science": 60, "computer": 60}, "attentionSpanMinutes": 22}
\.


--
-- TOC entry 3936 (class 0 OID 24786)
-- Dependencies: 233
-- Data for Name: student_queries; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.student_queries (id, student_id, teacher_id, subject_id, query_text, topic, source, status, asked_at, addressed_at, student_feedback, added_to_portfolio, created_at) FROM stdin;
\.


--
-- TOC entry 3947 (class 0 OID 33096)
-- Dependencies: 244
-- Data for Name: subject_textbook_embeddings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.subject_textbook_embeddings (id, subject_id, chapter, topic, chunk_index, content, embedding, metadata, created_at) FROM stdin;
\.


--
-- TOC entry 3937 (class 0 OID 24799)
-- Dependencies: 234
-- Data for Name: subjects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.subjects (id, name, name_nepali, code, grade_level, description, icon, color, created_at) FROM stdin;
4f254b63-c125-47b9-abb0-3066aca8adf1	Mathematics	गणित	math	10	Basic and advanced mathematics	calculator	math	2026-01-29 09:15:04.768338+00
933ccbee-242b-44be-b6ab-729d5bd6d691	Science	विज्ञान	science	10	Natural and physical sciences	flask	science	2026-01-29 09:15:04.768338+00
2061036e-3ae3-4a41-8a6e-be022c0c38b5	English	अंग्रेजी	english	10	English language and literature	book-open	english	2026-01-29 09:15:04.768338+00
225eace1-cdc2-4bd9-a94b-6dc51863bfd2	Nepali	नेपाली	nepali	10	Nepali language and literature	languages	nepali	2026-01-29 09:15:04.768338+00
fe69fe37-af8d-4db5-be75-5260099a06bc	Social Studies	सामाजिक अध्ययन	social	10	History, geography, and civics	globe	social	2026-01-29 09:15:04.768338+00
3d83b951-f597-4f18-952b-0040470020bb	Computer Science	कम्प्युटर विज्ञान	computer	10	Computer fundamentals and programming	laptop	computer	2026-01-29 09:15:04.768338+00
\.


--
-- TOC entry 3938 (class 0 OID 24812)
-- Dependencies: 235
-- Data for Name: teacher_assessments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.teacher_assessments (id, teacher_id, subject_id, title, total_questions, duration, scheduled_date, completed_at, score, status, created_at) FROM stdin;
\.


--
-- TOC entry 3939 (class 0 OID 24824)
-- Dependencies: 236
-- Data for Name: teacher_class_assignments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.teacher_class_assignments (id, teacher_id, class_id, subject_id, academic_year, created_at) FROM stdin;
3e869106-18a8-45dc-9690-fdc63eb4d1c7	ec0eb6d5-25df-4e35-9940-bc34abcd8ed9	06dff094-078a-4f29-9cd8-bbfbb60e7b96	4f254b63-c125-47b9-abb0-3066aca8adf1	2025-2026	2025-11-30 09:15:04.24+00
c352a06f-a45c-48bb-ab68-566b592f6fc3	85d68757-04d1-4213-a3f5-8af479bceb4a	06dff094-078a-4f29-9cd8-bbfbb60e7b96	933ccbee-242b-44be-b6ab-729d5bd6d691	2025-2026	2025-11-30 09:15:04.24+00
bbf37366-a275-4a2f-9626-cbed24b74bde	b9ec8689-5563-4d7d-a5b6-965e3d32b275	06dff094-078a-4f29-9cd8-bbfbb60e7b96	2061036e-3ae3-4a41-8a6e-be022c0c38b5	2025-2026	2025-11-30 09:15:04.24+00
29672014-d5a1-45af-9d60-0f7579faff2a	836c6d73-d9ef-44c9-abb0-73c24cd900f2	06dff094-078a-4f29-9cd8-bbfbb60e7b96	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	2025-2026	2025-11-30 09:15:04.24+00
bdc4d381-cf2f-43ef-b832-cb1035cafecb	7fd08be2-a61e-4a2a-905c-b2fc005155c5	06dff094-078a-4f29-9cd8-bbfbb60e7b96	fe69fe37-af8d-4db5-be75-5260099a06bc	2025-2026	2025-11-30 09:15:04.24+00
a0fda811-9059-4e86-a045-45403526508e	ac2ec10f-3a2c-4674-81e1-f72c983de087	06dff094-078a-4f29-9cd8-bbfbb60e7b96	3d83b951-f597-4f18-952b-0040470020bb	2025-2026	2025-11-30 09:15:04.24+00
\.


--
-- TOC entry 3940 (class 0 OID 24836)
-- Dependencies: 237
-- Data for Name: teacher_portfolio; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.teacher_portfolio (id, teacher_id, metric_type, value, date, details, created_at) FROM stdin;
\.


--
-- TOC entry 3941 (class 0 OID 24846)
-- Dependencies: 238
-- Data for Name: teacher_profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.teacher_profiles (id, user_id, school_id, employee_id, qualification, subjects_taught, years_experience, join_date, created_at, updated_at) FROM stdin;
ecf51346-613c-4040-9103-949e1c287249	ec0eb6d5-25df-4e35-9940-bc34abcd8ed9	94d11654-f1c3-4d68-a104-ac1cded8e13f	T-1001	M.Ed. Mathematics	{Mathematics}	12	2025-11-30	2025-11-30 09:15:04.24+00	2025-12-13 09:15:04.24+00
511c48c4-5b09-4743-b232-009a435b995d	85d68757-04d1-4213-a3f5-8af479bceb4a	94d11654-f1c3-4d68-a104-ac1cded8e13f	T-1002	M.Sc. Physics	{Science}	9	2025-11-30	2025-11-30 09:15:04.24+00	2026-01-02 09:15:04.24+00
3efb8eba-39eb-4944-a41f-ee1ec03535b5	b9ec8689-5563-4d7d-a5b6-965e3d32b275	94d11654-f1c3-4d68-a104-ac1cded8e13f	T-1003	M.A. English	{English}	10	2025-11-30	2025-11-30 09:15:04.24+00	2025-12-11 09:15:04.24+00
92e965e9-c056-4196-822d-39a46206f757	836c6d73-d9ef-44c9-abb0-73c24cd900f2	94d11654-f1c3-4d68-a104-ac1cded8e13f	T-1004	M.A. Nepali	{Nepali}	11	2025-11-30	2025-11-30 09:15:04.24+00	2025-12-24 09:15:04.24+00
e2dab178-21fc-4c2c-85bd-71ae68108ae5	7fd08be2-a61e-4a2a-905c-b2fc005155c5	94d11654-f1c3-4d68-a104-ac1cded8e13f	T-1005	M.Ed. Social Studies	{"Social Studies"}	14	2025-11-30	2025-11-30 09:15:04.24+00	2025-12-19 09:15:04.24+00
b533b0fb-c6b1-43e7-b434-0ac6ac9a61cc	ac2ec10f-3a2c-4674-81e1-f72c983de087	94d11654-f1c3-4d68-a104-ac1cded8e13f	T-1006	M.Sc. Computer Science	{"Computer Science"}	7	2025-11-30	2025-11-30 09:15:04.24+00	2025-12-25 09:15:04.24+00
\.


--
-- TOC entry 3942 (class 0 OID 24859)
-- Dependencies: 239
-- Data for Name: test_results; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.test_results (id, test_id, student_id, score, percentage, grade, topic_scores, weak_areas, completed_at) FROM stdin;
ccdfac58-c430-41db-b8af-34572471c760	77fa0072-3173-4ebf-9e17-60e71a282f0b	cdacd5ec-aa0b-4a66-8f17-0f767466513a	87	87.00	A	{"application": 77, "fundamentals": 87}	{}	2025-12-18 09:15:04.24+00
59aa558f-b887-4a2d-9bb7-6c6bbe33db8f	77fa0072-3173-4ebf-9e17-60e71a282f0b	85079b8e-4704-49b1-84ed-2d3c501654ee	78	78.00	B	{"application": 68, "fundamentals": 78}	{}	2025-12-18 09:15:04.24+00
14e59881-0de3-45dd-9c1d-a2ae764246e7	77fa0072-3173-4ebf-9e17-60e71a282f0b	67d4f333-220d-4a64-bcd2-8dc53a56624c	88	88.00	A	{"application": 78, "fundamentals": 88}	{}	2025-12-18 09:15:04.24+00
1302151a-c7d8-486f-919d-0f123d1e8c19	77fa0072-3173-4ebf-9e17-60e71a282f0b	345bb275-556d-4960-b7de-28922983a7b2	91	91.00	A	{"application": 81, "fundamentals": 91}	{}	2025-12-20 09:15:04.24+00
136191c8-70cd-4afa-953e-e6196f3dc290	77fa0072-3173-4ebf-9e17-60e71a282f0b	355120e6-b04a-46f7-876a-b5d7aab3bde0	78	78.00	B	{"application": 68, "fundamentals": 78}	{}	2025-12-20 09:15:04.24+00
51c7471d-aee5-41d5-af61-a0504a821f8c	77fa0072-3173-4ebf-9e17-60e71a282f0b	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	69	69.00	C	{"application": 59, "fundamentals": 69}	{}	2025-12-18 09:15:04.24+00
33c2ab46-8bd8-4180-bf3a-6e1f68f5f3a7	77fa0072-3173-4ebf-9e17-60e71a282f0b	c18f6551-43e9-4a77-a52e-954d93cee377	68	68.00	C	{"application": 58, "fundamentals": 68}	{}	2025-12-19 09:15:04.24+00
533a8531-2bcb-472a-ae60-fb6fc099316b	77fa0072-3173-4ebf-9e17-60e71a282f0b	d7e84df8-3a50-4db2-96a7-f478ff5f9764	60	60.00	C	{"application": 50, "fundamentals": 60}	{}	2025-12-20 09:15:04.24+00
c7bfe617-73bf-402d-872d-eb5ded5f22e7	77fa0072-3173-4ebf-9e17-60e71a282f0b	b1965024-9f05-4ab8-a89c-9169ec08a541	74	74.00	B	{"application": 64, "fundamentals": 74}	{}	2025-12-20 09:15:04.24+00
cb9b4ce3-4236-4247-983b-26d12373cb06	77fa0072-3173-4ebf-9e17-60e71a282f0b	dde039c1-6339-4f2b-91fd-54a185c68b52	63	63.00	C	{"application": 53, "fundamentals": 63}	{}	2025-12-19 09:15:04.24+00
76385efd-ab7d-4b99-858e-c0a8a70cfe65	77fa0072-3173-4ebf-9e17-60e71a282f0b	e700842a-602b-4ecb-8df6-96e43d98e00e	80	80.00	B	{"application": 70, "fundamentals": 80}	{}	2025-12-20 09:15:04.24+00
621eeea2-1361-45e5-b456-9b2838fd5e70	77fa0072-3173-4ebf-9e17-60e71a282f0b	e0f448c8-7d42-4d39-bbcd-de58daff9420	69	69.00	C	{"application": 59, "fundamentals": 69}	{}	2025-12-20 09:15:04.24+00
995f6ae2-2b48-4d7e-bec4-6ea39151aa33	77fa0072-3173-4ebf-9e17-60e71a282f0b	97dfe15c-dcba-496a-9e58-2720c211d00a	69	69.00	C	{"application": 59, "fundamentals": 69}	{}	2025-12-18 09:15:04.24+00
ed930c00-9ea8-46c4-aaa7-b176b5419a2d	77fa0072-3173-4ebf-9e17-60e71a282f0b	7b46e55e-46b4-4cfd-8809-b6e205a6e567	69	69.00	C	{"application": 59, "fundamentals": 69}	{}	2025-12-19 09:15:04.24+00
ff7b83cb-9c96-4585-951b-34ecd8fd3ffc	77fa0072-3173-4ebf-9e17-60e71a282f0b	60277f16-d457-4dc1-958d-a312a8d9471b	72	72.00	B	{"application": 62, "fundamentals": 72}	{}	2025-12-19 09:15:04.24+00
3c63ea39-906f-4066-80c0-649dd3cbb528	77fa0072-3173-4ebf-9e17-60e71a282f0b	772182f8-2921-4fe3-a427-8c86cca2f2db	64	64.00	C	{"application": 54, "fundamentals": 64}	{}	2025-12-18 09:15:04.24+00
422c12db-66a3-4752-9fd5-537236a5fbff	77fa0072-3173-4ebf-9e17-60e71a282f0b	9f6c81bf-ea4e-402f-96a1-968323555263	78	78.00	B	{"application": 68, "fundamentals": 78}	{}	2025-12-18 09:15:04.24+00
006fb65a-fa90-4f6d-a75a-30c6d2f63ffb	77fa0072-3173-4ebf-9e17-60e71a282f0b	5835a0de-c500-4ad7-b0e2-76aa107db95c	63	63.00	C	{"application": 53, "fundamentals": 63}	{}	2025-12-19 09:15:04.24+00
f32d5567-eb95-4153-ada0-c63a1e93fecc	77fa0072-3173-4ebf-9e17-60e71a282f0b	15a117ff-1cb4-49cf-8fd5-845f9061f160	82	82.00	B	{"application": 72, "fundamentals": 82}	{}	2025-12-18 09:15:04.24+00
ba2c4f86-7a41-4f47-a6e3-bb123b424b66	77fa0072-3173-4ebf-9e17-60e71a282f0b	e0633026-2d69-4e2f-9731-dc6e05038f24	61	61.00	C	{"application": 51, "fundamentals": 61}	{}	2025-12-19 09:15:04.24+00
8badf04c-0ad9-4762-8981-204cb0355a17	77fa0072-3173-4ebf-9e17-60e71a282f0b	63e27c91-167e-44c0-b455-ca85896b666c	60	60.00	C	{"application": 50, "fundamentals": 60}	{}	2025-12-20 09:15:04.24+00
5b9fe6ab-2933-48b8-8c66-472dd828012d	77fa0072-3173-4ebf-9e17-60e71a282f0b	f684fc32-dcc9-4b44-bf14-112cd8958129	62	62.00	C	{"application": 52, "fundamentals": 62}	{}	2025-12-20 09:15:04.24+00
2ca858bd-e16a-4b6f-8920-a8d60a49b169	77fa0072-3173-4ebf-9e17-60e71a282f0b	4c7a3cbd-447c-4cbc-918d-8e923ce57b80	48	48.00	D	{"application": 38, "fundamentals": 48}	{"concept clarity","time management"}	2025-12-19 09:15:04.24+00
4bb5036f-4990-4f40-81a8-c97a40bdc88b	77fa0072-3173-4ebf-9e17-60e71a282f0b	503b5c9c-042c-4813-9898-63b129515ad7	65	65.00	C	{"application": 55, "fundamentals": 65}	{}	2025-12-20 09:15:04.24+00
91f42410-d8ff-4aa7-a6a0-6fe9f7ab24ce	77fa0072-3173-4ebf-9e17-60e71a282f0b	a6de668b-ecfa-4842-97a5-3cc27b34e1f6	49	49.00	D	{"application": 39, "fundamentals": 49}	{"concept clarity","time management"}	2025-12-19 09:15:04.24+00
55dedb74-8a6c-4a46-81c8-b3548ea8c1d7	77fa0072-3173-4ebf-9e17-60e71a282f0b	b470a0a0-fa44-468e-8b5e-102d68c08ed4	65	65.00	C	{"application": 55, "fundamentals": 65}	{}	2025-12-20 09:15:04.24+00
095402f2-4423-4444-8258-8256f6420834	77fa0072-3173-4ebf-9e17-60e71a282f0b	acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	40	40.00	D	{"application": 30, "fundamentals": 40}	{"concept clarity","time management"}	2025-12-19 09:15:04.24+00
7581be9d-e7bb-4af2-b7f6-2d92fb3a3316	77fa0072-3173-4ebf-9e17-60e71a282f0b	2286be2d-ff3b-4c8e-8c16-0b4bc6bebdc7	55	55.00	C	{"application": 45, "fundamentals": 55}	{"concept clarity","time management"}	2025-12-19 09:15:04.24+00
f05510d2-b746-4213-8081-dad43673a28e	77fa0072-3173-4ebf-9e17-60e71a282f0b	60498abe-fb45-4fce-b715-796c6ad2a7b1	61	61.00	C	{"application": 51, "fundamentals": 61}	{}	2025-12-18 09:15:04.24+00
d588f285-0693-4251-84a6-18e235543a1c	77fa0072-3173-4ebf-9e17-60e71a282f0b	cecbea1b-e71b-4995-97cc-6254e7815265	37	37.00	D	{"application": 27, "fundamentals": 37}	{"concept clarity","time management"}	2025-12-18 09:15:04.24+00
81360366-9f19-48c3-8e96-43ee3acd19d0	9986972f-72d5-48cb-9d85-0b74c2a77e24	cdacd5ec-aa0b-4a66-8f17-0f767466513a	85	85.00	A	{"application": 75, "fundamentals": 85}	{}	2025-12-24 09:15:04.24+00
3ab2f113-8572-4552-87e9-58f0062561f7	9986972f-72d5-48cb-9d85-0b74c2a77e24	85079b8e-4704-49b1-84ed-2d3c501654ee	96	96.00	A	{"application": 86, "fundamentals": 96}	{}	2025-12-22 09:15:04.24+00
ea586110-92b7-4540-afea-73c086570ce7	9986972f-72d5-48cb-9d85-0b74c2a77e24	67d4f333-220d-4a64-bcd2-8dc53a56624c	83	83.00	B	{"application": 73, "fundamentals": 83}	{}	2025-12-24 09:15:04.24+00
1131b04b-1288-4318-a81b-94470b6b3727	9986972f-72d5-48cb-9d85-0b74c2a77e24	345bb275-556d-4960-b7de-28922983a7b2	85	85.00	A	{"application": 75, "fundamentals": 85}	{}	2025-12-22 09:15:04.24+00
e2872150-ccc6-4aa1-99b9-5d7068c3d53c	9986972f-72d5-48cb-9d85-0b74c2a77e24	355120e6-b04a-46f7-876a-b5d7aab3bde0	87	87.00	A	{"application": 77, "fundamentals": 87}	{}	2025-12-23 09:15:04.24+00
e01ad3a9-895a-40f9-be40-05ade800c089	9986972f-72d5-48cb-9d85-0b74c2a77e24	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	78	78.00	B	{"application": 68, "fundamentals": 78}	{}	2025-12-22 09:15:04.24+00
24ab7d6a-a50b-435b-a4c8-5732b53324ae	9986972f-72d5-48cb-9d85-0b74c2a77e24	c18f6551-43e9-4a77-a52e-954d93cee377	66	66.00	C	{"application": 56, "fundamentals": 66}	{}	2025-12-22 09:15:04.24+00
37709f4f-1507-4b7b-aa42-b6bdb0fd7bf5	9986972f-72d5-48cb-9d85-0b74c2a77e24	d7e84df8-3a50-4db2-96a7-f478ff5f9764	62	62.00	C	{"application": 52, "fundamentals": 62}	{}	2025-12-23 09:15:04.24+00
768ad169-df95-4a32-807a-b91dcb929949	9986972f-72d5-48cb-9d85-0b74c2a77e24	b1965024-9f05-4ab8-a89c-9169ec08a541	69	69.00	C	{"application": 59, "fundamentals": 69}	{}	2025-12-22 09:15:04.24+00
17e4e8e3-7f3d-467b-93cf-5ebd2c838563	9986972f-72d5-48cb-9d85-0b74c2a77e24	dde039c1-6339-4f2b-91fd-54a185c68b52	65	65.00	C	{"application": 55, "fundamentals": 65}	{}	2025-12-24 09:15:04.24+00
9ea48983-7e13-4d4b-a675-7fddbc3e4095	9986972f-72d5-48cb-9d85-0b74c2a77e24	e700842a-602b-4ecb-8df6-96e43d98e00e	77	77.00	B	{"application": 67, "fundamentals": 77}	{}	2025-12-24 09:15:04.24+00
7a606dd9-1b58-4a9f-8e9d-725752db27bc	9986972f-72d5-48cb-9d85-0b74c2a77e24	e0f448c8-7d42-4d39-bbcd-de58daff9420	64	64.00	C	{"application": 54, "fundamentals": 64}	{}	2025-12-22 09:15:04.24+00
426fd415-b273-41a7-a96e-ff70e0309fe6	9986972f-72d5-48cb-9d85-0b74c2a77e24	97dfe15c-dcba-496a-9e58-2720c211d00a	66	66.00	C	{"application": 56, "fundamentals": 66}	{}	2025-12-23 09:15:04.24+00
014b7914-4ec9-42de-acbc-f8c139362ea5	9986972f-72d5-48cb-9d85-0b74c2a77e24	7b46e55e-46b4-4cfd-8809-b6e205a6e567	62	62.00	C	{"application": 52, "fundamentals": 62}	{}	2025-12-23 09:15:04.24+00
9b4272e3-b51b-498b-ac50-f662f4947758	9986972f-72d5-48cb-9d85-0b74c2a77e24	60277f16-d457-4dc1-958d-a312a8d9471b	73	73.00	B	{"application": 63, "fundamentals": 73}	{}	2025-12-23 09:15:04.24+00
a9f99707-25b1-48ec-8330-f583b663a335	9986972f-72d5-48cb-9d85-0b74c2a77e24	772182f8-2921-4fe3-a427-8c86cca2f2db	76	76.00	B	{"application": 66, "fundamentals": 76}	{}	2025-12-22 09:15:04.24+00
010883e1-84ac-47d8-a549-cd0d632f00a6	9986972f-72d5-48cb-9d85-0b74c2a77e24	9f6c81bf-ea4e-402f-96a1-968323555263	75	75.00	B	{"application": 65, "fundamentals": 75}	{}	2025-12-24 09:15:04.24+00
4d2ca502-cf1c-4822-b304-db8dffddc53f	9986972f-72d5-48cb-9d85-0b74c2a77e24	5835a0de-c500-4ad7-b0e2-76aa107db95c	67	67.00	C	{"application": 57, "fundamentals": 67}	{}	2025-12-23 09:15:04.24+00
0abcabcd-7900-4ed3-abc0-155f1c796ac7	9986972f-72d5-48cb-9d85-0b74c2a77e24	15a117ff-1cb4-49cf-8fd5-845f9061f160	69	69.00	C	{"application": 59, "fundamentals": 69}	{}	2025-12-22 09:15:04.24+00
30fe4d88-ebd9-4a76-b969-178887e8abe8	9986972f-72d5-48cb-9d85-0b74c2a77e24	e0633026-2d69-4e2f-9731-dc6e05038f24	68	68.00	C	{"application": 58, "fundamentals": 68}	{}	2025-12-24 09:15:04.24+00
7481c849-5d9b-41ac-9618-f71e0d893335	9986972f-72d5-48cb-9d85-0b74c2a77e24	63e27c91-167e-44c0-b455-ca85896b666c	41	41.00	D	{"application": 31, "fundamentals": 41}	{"concept clarity","time management"}	2025-12-24 09:15:04.24+00
3d7270f5-b4da-4efa-8a12-d13fc034b0a9	9986972f-72d5-48cb-9d85-0b74c2a77e24	f684fc32-dcc9-4b44-bf14-112cd8958129	53	53.00	D	{"application": 43, "fundamentals": 53}	{"concept clarity","time management"}	2025-12-24 09:15:04.24+00
af48e190-8708-4136-a77a-e700345c7b79	9986972f-72d5-48cb-9d85-0b74c2a77e24	4c7a3cbd-447c-4cbc-918d-8e923ce57b80	43	43.00	D	{"application": 33, "fundamentals": 43}	{"concept clarity","time management"}	2025-12-24 09:15:04.24+00
cef8399e-fc7f-4a02-b626-2a7c9cbfbe46	9986972f-72d5-48cb-9d85-0b74c2a77e24	503b5c9c-042c-4813-9898-63b129515ad7	57	57.00	C	{"application": 47, "fundamentals": 57}	{"concept clarity","time management"}	2025-12-23 09:15:04.24+00
bd2e3bc3-39d5-4f31-a19b-8fc45fdb88af	9986972f-72d5-48cb-9d85-0b74c2a77e24	a6de668b-ecfa-4842-97a5-3cc27b34e1f6	51	51.00	D	{"application": 41, "fundamentals": 51}	{"concept clarity","time management"}	2025-12-24 09:15:04.24+00
3b806faa-a7f7-4fb9-9bf0-1ab80b86d23c	9986972f-72d5-48cb-9d85-0b74c2a77e24	b470a0a0-fa44-468e-8b5e-102d68c08ed4	51	51.00	D	{"application": 41, "fundamentals": 51}	{"concept clarity","time management"}	2025-12-24 09:15:04.24+00
f9f267cf-be45-42c2-8b9a-34aa37b7fab4	9986972f-72d5-48cb-9d85-0b74c2a77e24	acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	43	43.00	D	{"application": 33, "fundamentals": 43}	{"concept clarity","time management"}	2025-12-23 09:15:04.24+00
76ba438b-6581-4eeb-83f7-783e600034b9	9986972f-72d5-48cb-9d85-0b74c2a77e24	2286be2d-ff3b-4c8e-8c16-0b4bc6bebdc7	64	64.00	C	{"application": 54, "fundamentals": 64}	{}	2025-12-23 09:15:04.24+00
3d817280-1f48-48d0-bbfb-a660f3ff9228	9986972f-72d5-48cb-9d85-0b74c2a77e24	60498abe-fb45-4fce-b715-796c6ad2a7b1	52	52.00	D	{"application": 42, "fundamentals": 52}	{"concept clarity","time management"}	2025-12-23 09:15:04.24+00
be27ff1b-9968-461a-9d25-f187c9dd1534	9986972f-72d5-48cb-9d85-0b74c2a77e24	cecbea1b-e71b-4995-97cc-6254e7815265	59	59.00	C	{"application": 49, "fundamentals": 59}	{"concept clarity","time management"}	2025-12-22 09:15:04.24+00
1f385937-4efb-4366-ad29-434d1d06285e	334e4f81-db3b-49ae-a26e-c044dd9fcd33	cdacd5ec-aa0b-4a66-8f17-0f767466513a	85	85.00	A	{"application": 75, "fundamentals": 85}	{}	2025-12-28 09:15:04.24+00
6b9fc979-608b-40b5-a416-78c43c5dc0a7	334e4f81-db3b-49ae-a26e-c044dd9fcd33	85079b8e-4704-49b1-84ed-2d3c501654ee	82	82.00	B	{"application": 72, "fundamentals": 82}	{}	2025-12-26 09:15:04.24+00
e16b15f6-5126-4e72-afa8-91abf207d0e7	334e4f81-db3b-49ae-a26e-c044dd9fcd33	67d4f333-220d-4a64-bcd2-8dc53a56624c	82	82.00	B	{"application": 72, "fundamentals": 82}	{}	2025-12-28 09:15:04.24+00
ee3e3d2f-55e1-48d2-99b9-48ba7e5c6f02	334e4f81-db3b-49ae-a26e-c044dd9fcd33	345bb275-556d-4960-b7de-28922983a7b2	82	82.00	B	{"application": 72, "fundamentals": 82}	{}	2025-12-28 09:15:04.24+00
79934db8-91f8-4539-b338-5efc03811ce4	334e4f81-db3b-49ae-a26e-c044dd9fcd33	355120e6-b04a-46f7-876a-b5d7aab3bde0	78	78.00	B	{"application": 68, "fundamentals": 78}	{}	2025-12-28 09:15:04.24+00
0df1fef5-3a60-4cc0-b3b7-800ac0872d73	334e4f81-db3b-49ae-a26e-c044dd9fcd33	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	61	61.00	C	{"application": 51, "fundamentals": 61}	{}	2025-12-28 09:15:04.24+00
d2a3b34b-8f35-47f0-b7be-5a0a0da48248	334e4f81-db3b-49ae-a26e-c044dd9fcd33	c18f6551-43e9-4a77-a52e-954d93cee377	72	72.00	B	{"application": 62, "fundamentals": 72}	{}	2025-12-28 09:15:04.24+00
9490fdda-ba81-4278-8536-d02f39839286	334e4f81-db3b-49ae-a26e-c044dd9fcd33	d7e84df8-3a50-4db2-96a7-f478ff5f9764	81	81.00	B	{"application": 71, "fundamentals": 81}	{}	2025-12-28 09:15:04.24+00
572fe6d3-5779-4c0a-888b-bbfc1a75722b	334e4f81-db3b-49ae-a26e-c044dd9fcd33	b1965024-9f05-4ab8-a89c-9169ec08a541	67	67.00	C	{"application": 57, "fundamentals": 67}	{}	2025-12-27 09:15:04.24+00
c5f4cf81-8a4d-4a12-805c-b3c530322d17	334e4f81-db3b-49ae-a26e-c044dd9fcd33	dde039c1-6339-4f2b-91fd-54a185c68b52	62	62.00	C	{"application": 52, "fundamentals": 62}	{}	2025-12-27 09:15:04.24+00
fc3d47cb-074b-4b7a-9844-0add2d574c7d	334e4f81-db3b-49ae-a26e-c044dd9fcd33	e700842a-602b-4ecb-8df6-96e43d98e00e	82	82.00	B	{"application": 72, "fundamentals": 82}	{}	2025-12-28 09:15:04.24+00
6af9fbf7-21d4-4fd6-9a3a-9f4185fa08a1	334e4f81-db3b-49ae-a26e-c044dd9fcd33	e0f448c8-7d42-4d39-bbcd-de58daff9420	65	65.00	C	{"application": 55, "fundamentals": 65}	{}	2025-12-27 09:15:04.24+00
c50ef086-61c7-4227-b859-5f2b005f7116	334e4f81-db3b-49ae-a26e-c044dd9fcd33	97dfe15c-dcba-496a-9e58-2720c211d00a	72	72.00	B	{"application": 62, "fundamentals": 72}	{}	2025-12-26 09:15:04.24+00
c2d5639f-1aeb-4d78-9a5e-7aa9d195100d	334e4f81-db3b-49ae-a26e-c044dd9fcd33	7b46e55e-46b4-4cfd-8809-b6e205a6e567	70	70.00	B	{"application": 60, "fundamentals": 70}	{}	2025-12-26 09:15:04.24+00
25332222-1c5a-4d91-93e3-4ce92cf4ec04	334e4f81-db3b-49ae-a26e-c044dd9fcd33	60277f16-d457-4dc1-958d-a312a8d9471b	73	73.00	B	{"application": 63, "fundamentals": 73}	{}	2025-12-27 09:15:04.24+00
fe75297f-2d8f-4ec2-b87a-82147ca10517	334e4f81-db3b-49ae-a26e-c044dd9fcd33	772182f8-2921-4fe3-a427-8c86cca2f2db	74	74.00	B	{"application": 64, "fundamentals": 74}	{}	2025-12-26 09:15:04.24+00
ae18ae55-c97d-40a0-82f3-8467898ad3c0	334e4f81-db3b-49ae-a26e-c044dd9fcd33	9f6c81bf-ea4e-402f-96a1-968323555263	79	79.00	B	{"application": 69, "fundamentals": 79}	{}	2025-12-27 09:15:04.24+00
f72de473-0fcf-4b9e-b044-4fe4c33241de	334e4f81-db3b-49ae-a26e-c044dd9fcd33	5835a0de-c500-4ad7-b0e2-76aa107db95c	81	81.00	B	{"application": 71, "fundamentals": 81}	{}	2025-12-28 09:15:04.24+00
734f489e-3065-4e21-9f00-0e8a7fb4fc8c	334e4f81-db3b-49ae-a26e-c044dd9fcd33	15a117ff-1cb4-49cf-8fd5-845f9061f160	66	66.00	C	{"application": 56, "fundamentals": 66}	{}	2025-12-26 09:15:04.24+00
fcdfd94b-6449-43ec-bd51-bc2aeb0aac6d	334e4f81-db3b-49ae-a26e-c044dd9fcd33	e0633026-2d69-4e2f-9731-dc6e05038f24	69	69.00	C	{"application": 59, "fundamentals": 69}	{}	2025-12-26 09:15:04.24+00
ed5e2acf-5e2a-478c-8f18-ad2166218a50	334e4f81-db3b-49ae-a26e-c044dd9fcd33	63e27c91-167e-44c0-b455-ca85896b666c	60	60.00	C	{"application": 50, "fundamentals": 60}	{}	2025-12-26 09:15:04.24+00
679ae26f-df89-4d5d-a649-865548760938	334e4f81-db3b-49ae-a26e-c044dd9fcd33	f684fc32-dcc9-4b44-bf14-112cd8958129	46	46.00	D	{"application": 36, "fundamentals": 46}	{"concept clarity","time management"}	2025-12-28 09:15:04.24+00
d6d69394-e5e7-4fb3-864a-912b1fa89a46	334e4f81-db3b-49ae-a26e-c044dd9fcd33	4c7a3cbd-447c-4cbc-918d-8e923ce57b80	63	63.00	C	{"application": 53, "fundamentals": 63}	{}	2025-12-27 09:15:04.24+00
ce1eabd5-ce86-451c-8b21-907c2137d80d	334e4f81-db3b-49ae-a26e-c044dd9fcd33	503b5c9c-042c-4813-9898-63b129515ad7	43	43.00	D	{"application": 33, "fundamentals": 43}	{"concept clarity","time management"}	2025-12-28 09:15:04.24+00
56b04545-d7aa-4d2c-99c7-8b46c4f8b35f	334e4f81-db3b-49ae-a26e-c044dd9fcd33	a6de668b-ecfa-4842-97a5-3cc27b34e1f6	65	65.00	C	{"application": 55, "fundamentals": 65}	{}	2025-12-28 09:15:04.24+00
9afd2f88-1896-4ba1-923e-385154411d9c	334e4f81-db3b-49ae-a26e-c044dd9fcd33	b470a0a0-fa44-468e-8b5e-102d68c08ed4	59	59.00	C	{"application": 49, "fundamentals": 59}	{"concept clarity","time management"}	2025-12-27 09:15:04.24+00
934d3c55-a7dc-4a5a-8214-9f231ca18dc2	334e4f81-db3b-49ae-a26e-c044dd9fcd33	acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	43	43.00	D	{"application": 33, "fundamentals": 43}	{"concept clarity","time management"}	2025-12-28 09:15:04.24+00
a8366547-1455-437f-8647-eab7f5d7ba5b	334e4f81-db3b-49ae-a26e-c044dd9fcd33	2286be2d-ff3b-4c8e-8c16-0b4bc6bebdc7	62	62.00	C	{"application": 52, "fundamentals": 62}	{}	2025-12-26 09:15:04.24+00
48bf1412-eb4b-45b9-b744-70b24fdeddf1	334e4f81-db3b-49ae-a26e-c044dd9fcd33	60498abe-fb45-4fce-b715-796c6ad2a7b1	50	50.00	D	{"application": 40, "fundamentals": 50}	{"concept clarity","time management"}	2025-12-26 09:15:04.24+00
b9121dd6-18cd-48ab-a56b-20bd6889d316	334e4f81-db3b-49ae-a26e-c044dd9fcd33	cecbea1b-e71b-4995-97cc-6254e7815265	45	45.00	D	{"application": 35, "fundamentals": 45}	{"concept clarity","time management"}	2025-12-26 09:15:04.24+00
46790505-abb1-4e51-825d-0d539918fcdf	31365729-778d-486f-a362-89b5f3f174dd	cdacd5ec-aa0b-4a66-8f17-0f767466513a	95	95.00	A	{"application": 85, "fundamentals": 95}	{}	2026-01-01 09:15:04.24+00
2e34128d-5bc9-481a-9180-4c0ee452a890	31365729-778d-486f-a362-89b5f3f174dd	85079b8e-4704-49b1-84ed-2d3c501654ee	86	86.00	A	{"application": 76, "fundamentals": 86}	{}	2025-12-30 09:15:04.24+00
f582ab7b-e87b-4c41-a63d-8d6bfdbc5ab3	31365729-778d-486f-a362-89b5f3f174dd	67d4f333-220d-4a64-bcd2-8dc53a56624c	94	94.00	A	{"application": 84, "fundamentals": 94}	{}	2025-12-31 09:15:04.24+00
097422d3-6790-4202-984b-99bddbc0401a	31365729-778d-486f-a362-89b5f3f174dd	345bb275-556d-4960-b7de-28922983a7b2	86	86.00	A	{"application": 76, "fundamentals": 86}	{}	2025-12-30 09:15:04.24+00
c4fffede-65e4-49e1-867b-4ac1db66c9df	31365729-778d-486f-a362-89b5f3f174dd	355120e6-b04a-46f7-876a-b5d7aab3bde0	80	80.00	B	{"application": 70, "fundamentals": 80}	{}	2025-12-30 09:15:04.24+00
4c42a2a7-d0b8-47eb-a8ab-fd9865d6e411	31365729-778d-486f-a362-89b5f3f174dd	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	65	65.00	C	{"application": 55, "fundamentals": 65}	{}	2025-12-31 09:15:04.24+00
cd850f13-6815-40f6-895f-ebacc5a07f9b	31365729-778d-486f-a362-89b5f3f174dd	c18f6551-43e9-4a77-a52e-954d93cee377	62	62.00	C	{"application": 52, "fundamentals": 62}	{}	2026-01-01 09:15:04.24+00
13ce507a-657f-4fce-bb71-644bc8d220eb	31365729-778d-486f-a362-89b5f3f174dd	d7e84df8-3a50-4db2-96a7-f478ff5f9764	67	67.00	C	{"application": 57, "fundamentals": 67}	{}	2025-12-30 09:15:04.24+00
746404c0-7414-4603-a88c-d124ccee0d07	31365729-778d-486f-a362-89b5f3f174dd	b1965024-9f05-4ab8-a89c-9169ec08a541	63	63.00	C	{"application": 53, "fundamentals": 63}	{}	2025-12-31 09:15:04.24+00
6858265b-9cf9-447e-b00a-aeff29ef2c7f	31365729-778d-486f-a362-89b5f3f174dd	dde039c1-6339-4f2b-91fd-54a185c68b52	73	73.00	B	{"application": 63, "fundamentals": 73}	{}	2025-12-30 09:15:04.24+00
e58e174c-8d6d-4f57-b9f8-c0a54a7b0124	31365729-778d-486f-a362-89b5f3f174dd	e700842a-602b-4ecb-8df6-96e43d98e00e	66	66.00	C	{"application": 56, "fundamentals": 66}	{}	2026-01-01 09:15:04.24+00
0c2d6c1b-46a2-4569-9c72-72aae0e05957	31365729-778d-486f-a362-89b5f3f174dd	e0f448c8-7d42-4d39-bbcd-de58daff9420	66	66.00	C	{"application": 56, "fundamentals": 66}	{}	2025-12-31 09:15:04.24+00
7b764c98-3b75-40e2-9544-f8610057b6ed	31365729-778d-486f-a362-89b5f3f174dd	97dfe15c-dcba-496a-9e58-2720c211d00a	67	67.00	C	{"application": 57, "fundamentals": 67}	{}	2025-12-30 09:15:04.24+00
5386b1cc-e4c0-46fe-9924-b85c3223996c	31365729-778d-486f-a362-89b5f3f174dd	7b46e55e-46b4-4cfd-8809-b6e205a6e567	71	71.00	B	{"application": 61, "fundamentals": 71}	{}	2025-12-31 09:15:04.24+00
68a7570c-5c3d-42a9-b264-1618d4db745a	31365729-778d-486f-a362-89b5f3f174dd	60277f16-d457-4dc1-958d-a312a8d9471b	62	62.00	C	{"application": 52, "fundamentals": 62}	{}	2025-12-30 09:15:04.24+00
e9462298-a1c5-4571-a659-ea58e2ddeb78	31365729-778d-486f-a362-89b5f3f174dd	772182f8-2921-4fe3-a427-8c86cca2f2db	74	74.00	B	{"application": 64, "fundamentals": 74}	{}	2026-01-01 09:15:04.24+00
86f8db3e-e696-4c4c-b55b-5d10e1592238	31365729-778d-486f-a362-89b5f3f174dd	9f6c81bf-ea4e-402f-96a1-968323555263	64	64.00	C	{"application": 54, "fundamentals": 64}	{}	2025-12-31 09:15:04.24+00
c8184926-9ded-43ec-aa2d-d924e851001a	31365729-778d-486f-a362-89b5f3f174dd	5835a0de-c500-4ad7-b0e2-76aa107db95c	69	69.00	C	{"application": 59, "fundamentals": 69}	{}	2025-12-31 09:15:04.24+00
20f837ed-40a1-4517-b0b1-161f2539805d	31365729-778d-486f-a362-89b5f3f174dd	15a117ff-1cb4-49cf-8fd5-845f9061f160	75	75.00	B	{"application": 65, "fundamentals": 75}	{}	2025-12-31 09:15:04.24+00
2c160dfb-dd82-4573-8f3a-35f03f0d1fe9	31365729-778d-486f-a362-89b5f3f174dd	e0633026-2d69-4e2f-9731-dc6e05038f24	67	67.00	C	{"application": 57, "fundamentals": 67}	{}	2025-12-30 09:15:04.24+00
612e12a0-32ae-427c-b55b-c01ce9e28d85	31365729-778d-486f-a362-89b5f3f174dd	63e27c91-167e-44c0-b455-ca85896b666c	48	48.00	D	{"application": 38, "fundamentals": 48}	{"concept clarity","time management"}	2025-12-31 09:15:04.24+00
a6aeb748-1599-4e8f-807e-be86e578e8fa	31365729-778d-486f-a362-89b5f3f174dd	f684fc32-dcc9-4b44-bf14-112cd8958129	57	57.00	C	{"application": 47, "fundamentals": 57}	{"concept clarity","time management"}	2026-01-01 09:15:04.24+00
010cbc91-bcfb-4050-b77d-d276c8339ae5	31365729-778d-486f-a362-89b5f3f174dd	4c7a3cbd-447c-4cbc-918d-8e923ce57b80	61	61.00	C	{"application": 51, "fundamentals": 61}	{}	2025-12-30 09:15:04.24+00
91dfad0d-d3ab-4b8e-bc01-ff7e4966bf84	31365729-778d-486f-a362-89b5f3f174dd	503b5c9c-042c-4813-9898-63b129515ad7	52	52.00	D	{"application": 42, "fundamentals": 52}	{"concept clarity","time management"}	2026-01-01 09:15:04.24+00
50a7bb6a-b8f1-4da6-9509-52031a35e8d0	31365729-778d-486f-a362-89b5f3f174dd	a6de668b-ecfa-4842-97a5-3cc27b34e1f6	45	45.00	D	{"application": 35, "fundamentals": 45}	{"concept clarity","time management"}	2025-12-31 09:15:04.24+00
b25a8500-1b64-426a-97f2-70dae7084855	31365729-778d-486f-a362-89b5f3f174dd	b470a0a0-fa44-468e-8b5e-102d68c08ed4	61	61.00	C	{"application": 51, "fundamentals": 61}	{}	2025-12-30 09:15:04.24+00
91e2a3fe-da77-4646-a4da-6b1d5d1b407c	31365729-778d-486f-a362-89b5f3f174dd	acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	39	39.00	D	{"application": 29, "fundamentals": 39}	{"concept clarity","time management"}	2025-12-30 09:15:04.24+00
30081725-adda-4803-9d8d-316ee4ddbc11	31365729-778d-486f-a362-89b5f3f174dd	2286be2d-ff3b-4c8e-8c16-0b4bc6bebdc7	47	47.00	D	{"application": 37, "fundamentals": 47}	{"concept clarity","time management"}	2026-01-01 09:15:04.24+00
8fc9fb24-c713-4c76-a0ab-a78a7c29ea71	31365729-778d-486f-a362-89b5f3f174dd	60498abe-fb45-4fce-b715-796c6ad2a7b1	39	39.00	D	{"application": 29, "fundamentals": 39}	{"concept clarity","time management"}	2025-12-30 09:15:04.24+00
156c6880-edbe-4a0a-a3b6-cb512a4450a0	31365729-778d-486f-a362-89b5f3f174dd	cecbea1b-e71b-4995-97cc-6254e7815265	41	41.00	D	{"application": 31, "fundamentals": 41}	{"concept clarity","time management"}	2026-01-01 09:15:04.24+00
50b7525b-4e80-43c5-a142-862f78a92236	0c44f5ba-2374-44c3-bbc6-607c17e2d9b0	cdacd5ec-aa0b-4a66-8f17-0f767466513a	85	85.00	A	{"application": 75, "fundamentals": 85}	{}	2026-01-05 09:15:04.24+00
11109258-f82a-4e31-a356-bca7e5bd44ab	0c44f5ba-2374-44c3-bbc6-607c17e2d9b0	85079b8e-4704-49b1-84ed-2d3c501654ee	95	95.00	A	{"application": 85, "fundamentals": 95}	{}	2026-01-04 09:15:04.24+00
3faae5de-7462-41f1-99f0-354b6faebc12	0c44f5ba-2374-44c3-bbc6-607c17e2d9b0	67d4f333-220d-4a64-bcd2-8dc53a56624c	92	92.00	A	{"application": 82, "fundamentals": 92}	{}	2026-01-05 09:15:04.24+00
3784b958-ea7d-4151-afa4-dda4b186db0d	0c44f5ba-2374-44c3-bbc6-607c17e2d9b0	345bb275-556d-4960-b7de-28922983a7b2	81	81.00	B	{"application": 71, "fundamentals": 81}	{}	2026-01-03 09:15:04.24+00
b591c267-6602-4a99-8aa6-6d40d67a1657	0c44f5ba-2374-44c3-bbc6-607c17e2d9b0	355120e6-b04a-46f7-876a-b5d7aab3bde0	90	90.00	A	{"application": 80, "fundamentals": 90}	{}	2026-01-05 09:15:04.24+00
ba085679-631b-439d-90ec-3a8460e5a910	0c44f5ba-2374-44c3-bbc6-607c17e2d9b0	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	62	62.00	C	{"application": 52, "fundamentals": 62}	{}	2026-01-05 09:15:04.24+00
5e3e6468-1722-41bd-8c13-ec6bdf4fcb70	0c44f5ba-2374-44c3-bbc6-607c17e2d9b0	c18f6551-43e9-4a77-a52e-954d93cee377	64	64.00	C	{"application": 54, "fundamentals": 64}	{}	2026-01-03 09:15:04.24+00
6420bfde-044b-4315-bd74-ac42e6cb3f76	0c44f5ba-2374-44c3-bbc6-607c17e2d9b0	d7e84df8-3a50-4db2-96a7-f478ff5f9764	68	68.00	C	{"application": 58, "fundamentals": 68}	{}	2026-01-05 09:15:04.24+00
862e211d-6056-4b19-8608-559dae6f5e99	0c44f5ba-2374-44c3-bbc6-607c17e2d9b0	b1965024-9f05-4ab8-a89c-9169ec08a541	79	79.00	B	{"application": 69, "fundamentals": 79}	{}	2026-01-03 09:15:04.24+00
0b605c21-8218-4eba-b679-cf1a51d3e62a	0c44f5ba-2374-44c3-bbc6-607c17e2d9b0	dde039c1-6339-4f2b-91fd-54a185c68b52	69	69.00	C	{"application": 59, "fundamentals": 69}	{}	2026-01-05 09:15:04.24+00
08421497-376c-4559-9a76-ad6abdd1dc6e	0c44f5ba-2374-44c3-bbc6-607c17e2d9b0	e700842a-602b-4ecb-8df6-96e43d98e00e	75	75.00	B	{"application": 65, "fundamentals": 75}	{}	2026-01-03 09:15:04.24+00
1717f4c3-e7c9-4cf9-95e7-ce544c9a01d3	0c44f5ba-2374-44c3-bbc6-607c17e2d9b0	e0f448c8-7d42-4d39-bbcd-de58daff9420	72	72.00	B	{"application": 62, "fundamentals": 72}	{}	2026-01-03 09:15:04.24+00
1bf210ae-74ab-46b3-bc07-e7150c89e800	0c44f5ba-2374-44c3-bbc6-607c17e2d9b0	97dfe15c-dcba-496a-9e58-2720c211d00a	81	81.00	B	{"application": 71, "fundamentals": 81}	{}	2026-01-05 09:15:04.24+00
4c78f835-cd29-4aad-b1e9-d00acbfebba3	0c44f5ba-2374-44c3-bbc6-607c17e2d9b0	7b46e55e-46b4-4cfd-8809-b6e205a6e567	71	71.00	B	{"application": 61, "fundamentals": 71}	{}	2026-01-03 09:15:04.24+00
b1b7fd3e-4eb5-46dc-afc9-54100860f0f5	0c44f5ba-2374-44c3-bbc6-607c17e2d9b0	60277f16-d457-4dc1-958d-a312a8d9471b	73	73.00	B	{"application": 63, "fundamentals": 73}	{}	2026-01-03 09:15:04.24+00
68898a32-a3b1-4947-90bb-f6ae1de2a04b	0c44f5ba-2374-44c3-bbc6-607c17e2d9b0	772182f8-2921-4fe3-a427-8c86cca2f2db	77	77.00	B	{"application": 67, "fundamentals": 77}	{}	2026-01-05 09:15:04.24+00
597b554a-a548-439f-89b4-ec1733633bca	0c44f5ba-2374-44c3-bbc6-607c17e2d9b0	9f6c81bf-ea4e-402f-96a1-968323555263	61	61.00	C	{"application": 51, "fundamentals": 61}	{}	2026-01-03 09:15:04.24+00
e80553f5-6920-44b2-bf1d-37111712f0d2	0c44f5ba-2374-44c3-bbc6-607c17e2d9b0	5835a0de-c500-4ad7-b0e2-76aa107db95c	65	65.00	C	{"application": 55, "fundamentals": 65}	{}	2026-01-03 09:15:04.24+00
5d5430f9-93c7-4fae-9267-7ad5611bc97a	0c44f5ba-2374-44c3-bbc6-607c17e2d9b0	15a117ff-1cb4-49cf-8fd5-845f9061f160	82	82.00	B	{"application": 72, "fundamentals": 82}	{}	2026-01-03 09:15:04.24+00
24722605-86d2-4da4-a33c-cb9e154c597d	0c44f5ba-2374-44c3-bbc6-607c17e2d9b0	e0633026-2d69-4e2f-9731-dc6e05038f24	72	72.00	B	{"application": 62, "fundamentals": 72}	{}	2026-01-05 09:15:04.24+00
31587058-5faf-4fd0-8d98-d5d38f8041ee	0c44f5ba-2374-44c3-bbc6-607c17e2d9b0	63e27c91-167e-44c0-b455-ca85896b666c	63	63.00	C	{"application": 53, "fundamentals": 63}	{}	2026-01-03 09:15:04.24+00
77892372-dfb2-4bc6-b159-73109f824de1	0c44f5ba-2374-44c3-bbc6-607c17e2d9b0	f684fc32-dcc9-4b44-bf14-112cd8958129	65	65.00	C	{"application": 55, "fundamentals": 65}	{}	2026-01-04 09:15:04.24+00
14e15bb4-4743-4f0d-b4ee-fbcce525fda9	0c44f5ba-2374-44c3-bbc6-607c17e2d9b0	4c7a3cbd-447c-4cbc-918d-8e923ce57b80	58	58.00	C	{"application": 48, "fundamentals": 58}	{"concept clarity","time management"}	2026-01-04 09:15:04.24+00
6114586a-e6ec-4540-87f1-53fbc4e276c1	0c44f5ba-2374-44c3-bbc6-607c17e2d9b0	503b5c9c-042c-4813-9898-63b129515ad7	57	57.00	C	{"application": 47, "fundamentals": 57}	{"concept clarity","time management"}	2026-01-03 09:15:04.24+00
50c77fc3-237a-4968-a5cc-0a8d84289ff2	0c44f5ba-2374-44c3-bbc6-607c17e2d9b0	a6de668b-ecfa-4842-97a5-3cc27b34e1f6	53	53.00	D	{"application": 43, "fundamentals": 53}	{"concept clarity","time management"}	2026-01-04 09:15:04.24+00
53a193a1-bd82-4f65-b0e4-f7820f523eb6	0c44f5ba-2374-44c3-bbc6-607c17e2d9b0	b470a0a0-fa44-468e-8b5e-102d68c08ed4	57	57.00	C	{"application": 47, "fundamentals": 57}	{"concept clarity","time management"}	2026-01-05 09:15:04.24+00
ab711b33-6f48-4f82-8233-0b3a10c39064	0c44f5ba-2374-44c3-bbc6-607c17e2d9b0	acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	56	56.00	C	{"application": 46, "fundamentals": 56}	{"concept clarity","time management"}	2026-01-04 09:15:04.24+00
dd3921ec-604c-4aa1-9e84-cc427da14c98	0c44f5ba-2374-44c3-bbc6-607c17e2d9b0	2286be2d-ff3b-4c8e-8c16-0b4bc6bebdc7	57	57.00	C	{"application": 47, "fundamentals": 57}	{"concept clarity","time management"}	2026-01-03 09:15:04.24+00
097271b3-68ed-4102-8480-438ca88fd1fe	0c44f5ba-2374-44c3-bbc6-607c17e2d9b0	60498abe-fb45-4fce-b715-796c6ad2a7b1	51	51.00	D	{"application": 41, "fundamentals": 51}	{"concept clarity","time management"}	2026-01-03 09:15:04.24+00
dcd20a22-a792-4753-b872-e103971f9c38	0c44f5ba-2374-44c3-bbc6-607c17e2d9b0	cecbea1b-e71b-4995-97cc-6254e7815265	36	36.00	D	{"application": 26, "fundamentals": 36}	{"concept clarity","time management"}	2026-01-05 09:15:04.24+00
a0b417b2-3efb-4ea5-ae61-80a5c082f5d4	687d869f-d531-4d86-9f26-ff0dfe5a2b5e	cdacd5ec-aa0b-4a66-8f17-0f767466513a	95	95.00	A	{"application": 85, "fundamentals": 95}	{}	2026-01-09 09:15:04.24+00
3fc323df-97ab-4c91-aa14-1d26fe456205	687d869f-d531-4d86-9f26-ff0dfe5a2b5e	85079b8e-4704-49b1-84ed-2d3c501654ee	80	80.00	B	{"application": 70, "fundamentals": 80}	{}	2026-01-07 09:15:04.24+00
1cf52993-941d-42f4-beff-8e3af0bd7231	687d869f-d531-4d86-9f26-ff0dfe5a2b5e	67d4f333-220d-4a64-bcd2-8dc53a56624c	85	85.00	A	{"application": 75, "fundamentals": 85}	{}	2026-01-09 09:15:04.24+00
182901bb-9977-490f-b915-e29904fe696d	687d869f-d531-4d86-9f26-ff0dfe5a2b5e	345bb275-556d-4960-b7de-28922983a7b2	84	84.00	B	{"application": 74, "fundamentals": 84}	{}	2026-01-09 09:15:04.24+00
179e2911-8b1f-4a3f-be3f-7e44b2f0670d	687d869f-d531-4d86-9f26-ff0dfe5a2b5e	355120e6-b04a-46f7-876a-b5d7aab3bde0	85	85.00	A	{"application": 75, "fundamentals": 85}	{}	2026-01-07 09:15:04.24+00
3935cc3f-1e22-484d-ba02-9e20eb0c354c	687d869f-d531-4d86-9f26-ff0dfe5a2b5e	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	77	77.00	B	{"application": 67, "fundamentals": 77}	{}	2026-01-08 09:15:04.24+00
05c3bc6c-4d0b-4a1b-b38d-3177c04aea80	687d869f-d531-4d86-9f26-ff0dfe5a2b5e	c18f6551-43e9-4a77-a52e-954d93cee377	65	65.00	C	{"application": 55, "fundamentals": 65}	{}	2026-01-07 09:15:04.24+00
f62cbe9d-f14e-43a7-8d0e-10d42a9f4d6c	687d869f-d531-4d86-9f26-ff0dfe5a2b5e	d7e84df8-3a50-4db2-96a7-f478ff5f9764	73	73.00	B	{"application": 63, "fundamentals": 73}	{}	2026-01-07 09:15:04.24+00
bc2bb529-d370-43fe-b199-96b782c5b53e	687d869f-d531-4d86-9f26-ff0dfe5a2b5e	b1965024-9f05-4ab8-a89c-9169ec08a541	68	68.00	C	{"application": 58, "fundamentals": 68}	{}	2026-01-08 09:15:04.24+00
b5daa34d-ec43-46af-bcdf-85fbe4d24a36	687d869f-d531-4d86-9f26-ff0dfe5a2b5e	dde039c1-6339-4f2b-91fd-54a185c68b52	69	69.00	C	{"application": 59, "fundamentals": 69}	{}	2026-01-07 09:15:04.24+00
ae5e33c6-fe57-491b-bd29-c19587b1dadd	687d869f-d531-4d86-9f26-ff0dfe5a2b5e	e700842a-602b-4ecb-8df6-96e43d98e00e	77	77.00	B	{"application": 67, "fundamentals": 77}	{}	2026-01-09 09:15:04.24+00
faa11d25-18b0-4851-9ce2-ae1805051a53	687d869f-d531-4d86-9f26-ff0dfe5a2b5e	e0f448c8-7d42-4d39-bbcd-de58daff9420	70	70.00	B	{"application": 60, "fundamentals": 70}	{}	2026-01-08 09:15:04.24+00
fa60b513-c7bd-4079-87d3-a82a11195c65	687d869f-d531-4d86-9f26-ff0dfe5a2b5e	97dfe15c-dcba-496a-9e58-2720c211d00a	66	66.00	C	{"application": 56, "fundamentals": 66}	{}	2026-01-09 09:15:04.24+00
7122a309-6e73-4072-99e8-3d10551949e4	687d869f-d531-4d86-9f26-ff0dfe5a2b5e	7b46e55e-46b4-4cfd-8809-b6e205a6e567	71	71.00	B	{"application": 61, "fundamentals": 71}	{}	2026-01-08 09:15:04.24+00
1dd0e55a-84ac-414e-8a44-0a1a5f7bea12	687d869f-d531-4d86-9f26-ff0dfe5a2b5e	60277f16-d457-4dc1-958d-a312a8d9471b	75	75.00	B	{"application": 65, "fundamentals": 75}	{}	2026-01-07 09:15:04.24+00
7e46a883-402c-4502-b6fd-a3a2300dc1e9	687d869f-d531-4d86-9f26-ff0dfe5a2b5e	772182f8-2921-4fe3-a427-8c86cca2f2db	81	81.00	B	{"application": 71, "fundamentals": 81}	{}	2026-01-07 09:15:04.24+00
53942b7d-6e3b-4671-b2f2-3e2c6c37b5ee	687d869f-d531-4d86-9f26-ff0dfe5a2b5e	9f6c81bf-ea4e-402f-96a1-968323555263	64	64.00	C	{"application": 54, "fundamentals": 64}	{}	2026-01-07 09:15:04.24+00
29f198c4-3c7f-4596-a04d-076451b6dcf1	687d869f-d531-4d86-9f26-ff0dfe5a2b5e	5835a0de-c500-4ad7-b0e2-76aa107db95c	68	68.00	C	{"application": 58, "fundamentals": 68}	{}	2026-01-09 09:15:04.24+00
4986dfc3-b544-4a35-909a-febf6b7c42d7	687d869f-d531-4d86-9f26-ff0dfe5a2b5e	15a117ff-1cb4-49cf-8fd5-845f9061f160	79	79.00	B	{"application": 69, "fundamentals": 79}	{}	2026-01-09 09:15:04.24+00
cdf43b03-f60a-4d5d-9d94-345bafc9a1ef	687d869f-d531-4d86-9f26-ff0dfe5a2b5e	e0633026-2d69-4e2f-9731-dc6e05038f24	79	79.00	B	{"application": 69, "fundamentals": 79}	{}	2026-01-08 09:15:04.24+00
6f563696-6e01-4539-960b-f65557f4c83e	687d869f-d531-4d86-9f26-ff0dfe5a2b5e	63e27c91-167e-44c0-b455-ca85896b666c	58	58.00	C	{"application": 48, "fundamentals": 58}	{"concept clarity","time management"}	2026-01-07 09:15:04.24+00
65b3535f-7af5-41a3-afb6-97bec382e409	687d869f-d531-4d86-9f26-ff0dfe5a2b5e	f684fc32-dcc9-4b44-bf14-112cd8958129	48	48.00	D	{"application": 38, "fundamentals": 48}	{"concept clarity","time management"}	2026-01-08 09:15:04.24+00
a2649adf-9f6e-4c6a-8c4c-6feeac677436	687d869f-d531-4d86-9f26-ff0dfe5a2b5e	4c7a3cbd-447c-4cbc-918d-8e923ce57b80	46	46.00	D	{"application": 36, "fundamentals": 46}	{"concept clarity","time management"}	2026-01-07 09:15:04.24+00
44644101-5516-4b71-86bd-8c288fd8c31d	687d869f-d531-4d86-9f26-ff0dfe5a2b5e	503b5c9c-042c-4813-9898-63b129515ad7	64	64.00	C	{"application": 54, "fundamentals": 64}	{}	2026-01-07 09:15:04.24+00
0590997c-aecc-4c31-912a-99385d52e24d	687d869f-d531-4d86-9f26-ff0dfe5a2b5e	a6de668b-ecfa-4842-97a5-3cc27b34e1f6	42	42.00	D	{"application": 32, "fundamentals": 42}	{"concept clarity","time management"}	2026-01-07 09:15:04.24+00
5590541e-1b42-492d-a353-8a23dcc28937	687d869f-d531-4d86-9f26-ff0dfe5a2b5e	b470a0a0-fa44-468e-8b5e-102d68c08ed4	47	47.00	D	{"application": 37, "fundamentals": 47}	{"concept clarity","time management"}	2026-01-09 09:15:04.24+00
3edb4720-f30d-4922-8c03-b62f045366a4	687d869f-d531-4d86-9f26-ff0dfe5a2b5e	acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	57	57.00	C	{"application": 47, "fundamentals": 57}	{"concept clarity","time management"}	2026-01-09 09:15:04.24+00
b040f513-ab51-4285-a48d-5f2f772405bc	687d869f-d531-4d86-9f26-ff0dfe5a2b5e	2286be2d-ff3b-4c8e-8c16-0b4bc6bebdc7	59	59.00	C	{"application": 49, "fundamentals": 59}	{"concept clarity","time management"}	2026-01-07 09:15:04.24+00
76936e84-c64b-4ebd-bd6c-158506288da7	687d869f-d531-4d86-9f26-ff0dfe5a2b5e	60498abe-fb45-4fce-b715-796c6ad2a7b1	47	47.00	D	{"application": 37, "fundamentals": 47}	{"concept clarity","time management"}	2026-01-08 09:15:04.24+00
79ba1259-89fe-445b-9c69-44e40b58f09c	687d869f-d531-4d86-9f26-ff0dfe5a2b5e	cecbea1b-e71b-4995-97cc-6254e7815265	56	56.00	C	{"application": 46, "fundamentals": 56}	{"concept clarity","time management"}	2026-01-09 09:15:04.24+00
\.


--
-- TOC entry 3943 (class 0 OID 24870)
-- Dependencies: 240
-- Data for Name: tests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tests (id, class_id, subject_id, teacher_id, title, chapter, type, total_questions, total_marks, duration, scheduled_date, status, created_at) FROM stdin;
77fa0072-3173-4ebf-9e17-60e71a282f0b	06dff094-078a-4f29-9cd8-bbfbb60e7b96	4f254b63-c125-47b9-abb0-3066aca8adf1	ec0eb6d5-25df-4e35-9940-bc34abcd8ed9	Mathematics Unit Test	Unit 1	unit	20	100	60	2025-12-18 09:15:04.24+00	completed	2025-12-12 09:15:04.24+00
c53726df-cbfc-476e-97ba-c653e21b4eca	06dff094-078a-4f29-9cd8-bbfbb60e7b96	4f254b63-c125-47b9-abb0-3066aca8adf1	ec0eb6d5-25df-4e35-9940-bc34abcd8ed9	Mathematics Weekly Quiz	Unit 2	quiz	10	50	30	2026-02-05 09:15:04.24+00	upcoming	2026-01-26 09:15:04.24+00
9986972f-72d5-48cb-9d85-0b74c2a77e24	06dff094-078a-4f29-9cd8-bbfbb60e7b96	933ccbee-242b-44be-b6ab-729d5bd6d691	85d68757-04d1-4213-a3f5-8af479bceb4a	Science Unit Test	Unit 2	unit	20	100	60	2025-12-22 09:15:04.24+00	completed	2025-12-16 09:15:04.24+00
0d775756-b750-4904-ae90-a43c8355f19f	06dff094-078a-4f29-9cd8-bbfbb60e7b96	933ccbee-242b-44be-b6ab-729d5bd6d691	85d68757-04d1-4213-a3f5-8af479bceb4a	Science Weekly Quiz	Unit 3	quiz	10	50	30	2026-02-06 09:15:04.24+00	upcoming	2026-01-26 09:15:04.24+00
334e4f81-db3b-49ae-a26e-c044dd9fcd33	06dff094-078a-4f29-9cd8-bbfbb60e7b96	2061036e-3ae3-4a41-8a6e-be022c0c38b5	b9ec8689-5563-4d7d-a5b6-965e3d32b275	English Unit Test	Unit 3	unit	20	100	60	2025-12-26 09:15:04.24+00	completed	2025-12-20 09:15:04.24+00
cda6b208-233a-420b-bff1-4bfd6223e28c	06dff094-078a-4f29-9cd8-bbfbb60e7b96	2061036e-3ae3-4a41-8a6e-be022c0c38b5	b9ec8689-5563-4d7d-a5b6-965e3d32b275	English Weekly Quiz	Unit 4	quiz	10	50	30	2026-02-07 09:15:04.24+00	upcoming	2026-01-26 09:15:04.24+00
31365729-778d-486f-a362-89b5f3f174dd	06dff094-078a-4f29-9cd8-bbfbb60e7b96	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	836c6d73-d9ef-44c9-abb0-73c24cd900f2	Nepali Unit Test	Unit 4	unit	20	100	60	2025-12-30 09:15:04.24+00	completed	2025-12-24 09:15:04.24+00
f6858f98-5a3f-4f3e-b3b8-ee6c329738d9	06dff094-078a-4f29-9cd8-bbfbb60e7b96	225eace1-cdc2-4bd9-a94b-6dc51863bfd2	836c6d73-d9ef-44c9-abb0-73c24cd900f2	Nepali Weekly Quiz	Unit 5	quiz	10	50	30	2026-02-08 09:15:04.24+00	upcoming	2026-01-26 09:15:04.24+00
0c44f5ba-2374-44c3-bbc6-607c17e2d9b0	06dff094-078a-4f29-9cd8-bbfbb60e7b96	fe69fe37-af8d-4db5-be75-5260099a06bc	7fd08be2-a61e-4a2a-905c-b2fc005155c5	Social Studies Unit Test	Unit 5	unit	20	100	60	2026-01-03 09:15:04.24+00	completed	2025-12-28 09:15:04.24+00
fae8f4ee-b3be-434c-b9be-ebbae7fac4bd	06dff094-078a-4f29-9cd8-bbfbb60e7b96	fe69fe37-af8d-4db5-be75-5260099a06bc	7fd08be2-a61e-4a2a-905c-b2fc005155c5	Social Studies Weekly Quiz	Unit 6	quiz	10	50	30	2026-02-09 09:15:04.24+00	upcoming	2026-01-26 09:15:04.24+00
687d869f-d531-4d86-9f26-ff0dfe5a2b5e	06dff094-078a-4f29-9cd8-bbfbb60e7b96	3d83b951-f597-4f18-952b-0040470020bb	ac2ec10f-3a2c-4674-81e1-f72c983de087	Computer Science Unit Test	Unit 6	unit	20	100	60	2026-01-07 09:15:04.24+00	completed	2026-01-01 09:15:04.24+00
d7212f8f-5872-49a0-82b6-1b4c90d9a7be	06dff094-078a-4f29-9cd8-bbfbb60e7b96	3d83b951-f597-4f18-952b-0040470020bb	ac2ec10f-3a2c-4674-81e1-f72c983de087	Computer Science Weekly Quiz	Unit 7	quiz	10	50	30	2026-02-10 09:15:04.24+00	upcoming	2026-01-26 09:15:04.24+00
\.


--
-- TOC entry 3944 (class 0 OID 24884)
-- Dependencies: 241
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_roles (id, user_id, role, created_at) FROM stdin;
d0aabc8f-064c-47b0-a791-968593dedd6f	ec0eb6d5-25df-4e35-9940-bc34abcd8ed9	teacher	2025-11-30 09:15:04.24+00
25e80ac7-f23a-4711-8c05-74fbd2fab879	85d68757-04d1-4213-a3f5-8af479bceb4a	teacher	2025-11-30 09:15:04.24+00
57e0af34-7964-48f7-8bcc-0c0e72e5b1b4	b9ec8689-5563-4d7d-a5b6-965e3d32b275	teacher	2025-11-30 09:15:04.24+00
14e804ac-d471-4f6b-b071-ef2704efda81	836c6d73-d9ef-44c9-abb0-73c24cd900f2	teacher	2025-11-30 09:15:04.24+00
996b6561-c99e-4902-807b-4ef72e43deeb	7fd08be2-a61e-4a2a-905c-b2fc005155c5	teacher	2025-11-30 09:15:04.24+00
80758b35-5a1c-424d-99a7-a03a6db7efda	ac2ec10f-3a2c-4674-81e1-f72c983de087	teacher	2025-11-30 09:15:04.24+00
bc0f829f-3d6d-4ac6-b2ba-bb87736a9e34	cdacd5ec-aa0b-4a66-8f17-0f767466513a	student	2025-11-30 09:15:04.24+00
83f6f531-e526-4f25-ace1-65232445d9d7	85079b8e-4704-49b1-84ed-2d3c501654ee	student	2025-11-30 09:15:04.24+00
46062a89-c43e-4516-8e69-3ba51ae3e73d	67d4f333-220d-4a64-bcd2-8dc53a56624c	student	2025-11-30 09:15:04.24+00
8a981a12-28b4-4b1f-b1e0-06489d716423	345bb275-556d-4960-b7de-28922983a7b2	student	2025-11-30 09:15:04.24+00
5a5d07e9-5ece-4c2a-9ff2-229c39b7bb13	355120e6-b04a-46f7-876a-b5d7aab3bde0	student	2025-11-30 09:15:04.24+00
9909b60b-637e-4c4a-bc37-b5d912de9d27	4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	student	2025-11-30 09:15:04.24+00
28c18057-e7b2-4834-9b7b-2d47dcf27e0b	c18f6551-43e9-4a77-a52e-954d93cee377	student	2025-11-30 09:15:04.24+00
8099979d-6f82-41d7-96bf-e12c246b3ba3	d7e84df8-3a50-4db2-96a7-f478ff5f9764	student	2025-11-30 09:15:04.24+00
3e2c06d0-e7de-4e53-a9cc-1826f5b0564c	b1965024-9f05-4ab8-a89c-9169ec08a541	student	2025-11-30 09:15:04.24+00
98dca579-e52b-4719-be65-961ea64c443a	dde039c1-6339-4f2b-91fd-54a185c68b52	student	2025-11-30 09:15:04.24+00
c9656f10-dc1b-4cc7-b767-ae5ba7c5d128	e700842a-602b-4ecb-8df6-96e43d98e00e	student	2025-11-30 09:15:04.24+00
e406f8ab-3f08-4872-a4af-6d0572114dd4	e0f448c8-7d42-4d39-bbcd-de58daff9420	student	2025-11-30 09:15:04.24+00
029633c4-aba4-4943-af66-31443d79efdc	97dfe15c-dcba-496a-9e58-2720c211d00a	student	2025-11-30 09:15:04.24+00
3cbd0c91-2d8d-4c42-9726-a214086bbd6a	7b46e55e-46b4-4cfd-8809-b6e205a6e567	student	2025-11-30 09:15:04.24+00
78276bd1-7cf8-4d4c-acc2-6612fa8a5a57	60277f16-d457-4dc1-958d-a312a8d9471b	student	2025-11-30 09:15:04.24+00
23b2d270-a396-48f1-91f7-50ce5dc8855c	772182f8-2921-4fe3-a427-8c86cca2f2db	student	2025-11-30 09:15:04.24+00
d80c4297-bcde-486d-930f-72d7a6e217d0	9f6c81bf-ea4e-402f-96a1-968323555263	student	2025-11-30 09:15:04.24+00
cca91e31-c7b7-417e-a934-c78a5af8d5e3	5835a0de-c500-4ad7-b0e2-76aa107db95c	student	2025-11-30 09:15:04.24+00
554afb6d-c38a-4539-a1a5-dba84c185012	15a117ff-1cb4-49cf-8fd5-845f9061f160	student	2025-11-30 09:15:04.24+00
3a96a992-83d5-46aa-a9d6-534aeb2389fb	e0633026-2d69-4e2f-9731-dc6e05038f24	student	2025-11-30 09:15:04.24+00
ed2f60b4-c6b8-4325-9ef5-b57af14fa7be	63e27c91-167e-44c0-b455-ca85896b666c	student	2025-11-30 09:15:04.24+00
e837201a-e3bc-4e3c-8710-36e1198978e9	f684fc32-dcc9-4b44-bf14-112cd8958129	student	2025-11-30 09:15:04.24+00
8ee8fd39-1861-47b5-8131-f06c2539416d	4c7a3cbd-447c-4cbc-918d-8e923ce57b80	student	2025-11-30 09:15:04.24+00
c7c5989e-66e4-4874-afcd-285c353c0911	503b5c9c-042c-4813-9898-63b129515ad7	student	2025-11-30 09:15:04.24+00
33767f2b-679a-4cfc-a1a1-dac693d23c40	a6de668b-ecfa-4842-97a5-3cc27b34e1f6	student	2025-11-30 09:15:04.24+00
4ecbc707-8b02-4dc0-8ce6-7c5187a60e4a	b470a0a0-fa44-468e-8b5e-102d68c08ed4	student	2025-11-30 09:15:04.24+00
72abf601-2b14-4e9d-a405-7ce2398e6b21	acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	student	2025-11-30 09:15:04.24+00
a9805e1d-5ae2-43cb-bd84-fd10e980d05a	2286be2d-ff3b-4c8e-8c16-0b4bc6bebdc7	student	2025-11-30 09:15:04.24+00
21a74988-35af-4852-a3f9-f7f70542e340	60498abe-fb45-4fce-b715-796c6ad2a7b1	student	2025-11-30 09:15:04.24+00
0b80703a-7046-4d18-b4a3-ef38ac569d48	cecbea1b-e71b-4995-97cc-6254e7815265	student	2025-11-30 09:15:04.24+00
\.


--
-- TOC entry 3945 (class 0 OID 24894)
-- Dependencies: 242
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, password) FROM stdin;
ec0eb6d5-25df-4e35-9940-bc34abcd8ed9	ram.prasad.adhikari@hamroguru.edu.np	$2a$10$JjZnAsLOPQQ79QjnuyUikePbHSTQ5dlFiyzFfI1PW21VHY4BiimGO
85d68757-04d1-4213-a3f5-8af479bceb4a	sita.devi.kandel@hamroguru.edu.np	$2a$10$JjZnAsLOPQQ79QjnuyUikePbHSTQ5dlFiyzFfI1PW21VHY4BiimGO
b9ec8689-5563-4d7d-a5b6-965e3d32b275	krishna.raj.sharma@hamroguru.edu.np	$2a$10$JjZnAsLOPQQ79QjnuyUikePbHSTQ5dlFiyzFfI1PW21VHY4BiimGO
836c6d73-d9ef-44c9-abb0-73c24cd900f2	laxmi.kumari.thapa@hamroguru.edu.np	$2a$10$JjZnAsLOPQQ79QjnuyUikePbHSTQ5dlFiyzFfI1PW21VHY4BiimGO
7fd08be2-a61e-4a2a-905c-b2fc005155c5	hari.bahadur.gurung@hamroguru.edu.np	$2a$10$JjZnAsLOPQQ79QjnuyUikePbHSTQ5dlFiyzFfI1PW21VHY4BiimGO
ac2ec10f-3a2c-4674-81e1-f72c983de087	sunil.manandhar@hamroguru.edu.np	$2a$10$JjZnAsLOPQQ79QjnuyUikePbHSTQ5dlFiyzFfI1PW21VHY4BiimGO
cdacd5ec-aa0b-4a66-8f17-0f767466513a	aarav.sharma.1@student.hamroguru.edu.np	$2a$10$rb72Nt0VXzbg5Hr8nZR9fepI2njgqp5gN9uZwDydw/.FtBfE/3QzO
85079b8e-4704-49b1-84ed-2d3c501654ee	pooja.adhikari.2@student.hamroguru.edu.np	$2a$10$rb72Nt0VXzbg5Hr8nZR9fepI2njgqp5gN9uZwDydw/.FtBfE/3QzO
67d4f333-220d-4a64-bcd2-8dc53a56624c	sanjay.karki.3@student.hamroguru.edu.np	$2a$10$rb72Nt0VXzbg5Hr8nZR9fepI2njgqp5gN9uZwDydw/.FtBfE/3QzO
345bb275-556d-4960-b7de-28922983a7b2	nisha.gurung.4@student.hamroguru.edu.np	$2a$10$rb72Nt0VXzbg5Hr8nZR9fepI2njgqp5gN9uZwDydw/.FtBfE/3QzO
355120e6-b04a-46f7-876a-b5d7aab3bde0	prabin.shrestha.5@student.hamroguru.edu.np	$2a$10$rb72Nt0VXzbg5Hr8nZR9fepI2njgqp5gN9uZwDydw/.FtBfE/3QzO
4a34d49f-39f0-4ca0-b02b-ae3ff0925c65	shruti.khatri.6@student.hamroguru.edu.np	$2a$10$rb72Nt0VXzbg5Hr8nZR9fepI2njgqp5gN9uZwDydw/.FtBfE/3QzO
c18f6551-43e9-4a77-a52e-954d93cee377	niraj.bhandari.7@student.hamroguru.edu.np	$2a$10$rb72Nt0VXzbg5Hr8nZR9fepI2njgqp5gN9uZwDydw/.FtBfE/3QzO
d7e84df8-3a50-4db2-96a7-f478ff5f9764	sushma.rai.8@student.hamroguru.edu.np	$2a$10$rb72Nt0VXzbg5Hr8nZR9fepI2njgqp5gN9uZwDydw/.FtBfE/3QzO
b1965024-9f05-4ab8-a89c-9169ec08a541	bikash.thapa.9@student.hamroguru.edu.np	$2a$10$rb72Nt0VXzbg5Hr8nZR9fepI2njgqp5gN9uZwDydw/.FtBfE/3QzO
dde039c1-6339-4f2b-91fd-54a185c68b52	ritika.poudel.10@student.hamroguru.edu.np	$2a$10$rb72Nt0VXzbg5Hr8nZR9fepI2njgqp5gN9uZwDydw/.FtBfE/3QzO
e700842a-602b-4ecb-8df6-96e43d98e00e	anil.joshi.11@student.hamroguru.edu.np	$2a$10$rb72Nt0VXzbg5Hr8nZR9fepI2njgqp5gN9uZwDydw/.FtBfE/3QzO
e0f448c8-7d42-4d39-bbcd-de58daff9420	suyog.tamang.12@student.hamroguru.edu.np	$2a$10$rb72Nt0VXzbg5Hr8nZR9fepI2njgqp5gN9uZwDydw/.FtBfE/3QzO
97dfe15c-dcba-496a-9e58-2720c211d00a	rojina.basnet.13@student.hamroguru.edu.np	$2a$10$rb72Nt0VXzbg5Hr8nZR9fepI2njgqp5gN9uZwDydw/.FtBfE/3QzO
7b46e55e-46b4-4cfd-8809-b6e205a6e567	kiran.gautam.14@student.hamroguru.edu.np	$2a$10$rb72Nt0VXzbg5Hr8nZR9fepI2njgqp5gN9uZwDydw/.FtBfE/3QzO
60277f16-d457-4dc1-958d-a312a8d9471b	anusha.lama.15@student.hamroguru.edu.np	$2a$10$rb72Nt0VXzbg5Hr8nZR9fepI2njgqp5gN9uZwDydw/.FtBfE/3QzO
772182f8-2921-4fe3-a427-8c86cca2f2db	dipesh.acharya.16@student.hamroguru.edu.np	$2a$10$rb72Nt0VXzbg5Hr8nZR9fepI2njgqp5gN9uZwDydw/.FtBfE/3QzO
9f6c81bf-ea4e-402f-96a1-968323555263	nirmala.khadka.17@student.hamroguru.edu.np	$2a$10$rb72Nt0VXzbg5Hr8nZR9fepI2njgqp5gN9uZwDydw/.FtBfE/3QzO
5835a0de-c500-4ad7-b0e2-76aa107db95c	bibek.dahal.18@student.hamroguru.edu.np	$2a$10$rb72Nt0VXzbg5Hr8nZR9fepI2njgqp5gN9uZwDydw/.FtBfE/3QzO
15a117ff-1cb4-49cf-8fd5-845f9061f160	isha.shahi.19@student.hamroguru.edu.np	$2a$10$rb72Nt0VXzbg5Hr8nZR9fepI2njgqp5gN9uZwDydw/.FtBfE/3QzO
e0633026-2d69-4e2f-9731-dc6e05038f24	roshan.baral.20@student.hamroguru.edu.np	$2a$10$rb72Nt0VXzbg5Hr8nZR9fepI2njgqp5gN9uZwDydw/.FtBfE/3QzO
63e27c91-167e-44c0-b455-ca85896b666c	manisha.ghimire.21@student.hamroguru.edu.np	$2a$10$rb72Nt0VXzbg5Hr8nZR9fepI2njgqp5gN9uZwDydw/.FtBfE/3QzO
f684fc32-dcc9-4b44-bf14-112cd8958129	sagar.bhusal.22@student.hamroguru.edu.np	$2a$10$rb72Nt0VXzbg5Hr8nZR9fepI2njgqp5gN9uZwDydw/.FtBfE/3QzO
4c7a3cbd-447c-4cbc-918d-8e923ce57b80	samikshya.maharjan.23@student.hamroguru.edu.np	$2a$10$rb72Nt0VXzbg5Hr8nZR9fepI2njgqp5gN9uZwDydw/.FtBfE/3QzO
503b5c9c-042c-4813-9898-63b129515ad7	ujjwal.pandey.24@student.hamroguru.edu.np	$2a$10$rb72Nt0VXzbg5Hr8nZR9fepI2njgqp5gN9uZwDydw/.FtBfE/3QzO
a6de668b-ecfa-4842-97a5-3cc27b34e1f6	sneha.regmi.25@student.hamroguru.edu.np	$2a$10$rb72Nt0VXzbg5Hr8nZR9fepI2njgqp5gN9uZwDydw/.FtBfE/3QzO
b470a0a0-fa44-468e-8b5e-102d68c08ed4	ritesh.magar.26@student.hamroguru.edu.np	$2a$10$rb72Nt0VXzbg5Hr8nZR9fepI2njgqp5gN9uZwDydw/.FtBfE/3QzO
acf2f6d1-d266-4c92-83e9-f8e7a85cbcd8	sabina.kc.27@student.hamroguru.edu.np	$2a$10$rb72Nt0VXzbg5Hr8nZR9fepI2njgqp5gN9uZwDydw/.FtBfE/3QzO
2286be2d-ff3b-4c8e-8c16-0b4bc6bebdc7	sanjeev.panta.28@student.hamroguru.edu.np	$2a$10$rb72Nt0VXzbg5Hr8nZR9fepI2njgqp5gN9uZwDydw/.FtBfE/3QzO
60498abe-fb45-4fce-b715-796c6ad2a7b1	aashish.chaudhary.29@student.hamroguru.edu.np	$2a$10$rb72Nt0VXzbg5Hr8nZR9fepI2njgqp5gN9uZwDydw/.FtBfE/3QzO
cecbea1b-e71b-4995-97cc-6254e7815265	lina.roka.30@student.hamroguru.edu.np	$2a$10$rb72Nt0VXzbg5Hr8nZR9fepI2njgqp5gN9uZwDydw/.FtBfE/3QzO
\.


--
-- TOC entry 3946 (class 0 OID 24904)
-- Dependencies: 243
-- Data for Name: webhook_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.webhook_logs (id, webhook_type, payload, response, status, created_at) FROM stdin;
\.


--
-- TOC entry 3958 (class 0 OID 0)
-- Dependencies: 219
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: -
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 3, true);


--
-- TOC entry 3959 (class 0 OID 0)
-- Dependencies: 245
-- Name: chat_memory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chat_memory_id_seq', 4, true);


--
-- TOC entry 3664 (class 2606 OID 24585)
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: -
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3666 (class 2606 OID 24656)
-- Name: ai_tutor_sessions ai_tutor_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_tutor_sessions
    ADD CONSTRAINT ai_tutor_sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 3736 (class 2606 OID 40968)
-- Name: chat_memory chat_memory_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_memory
    ADD CONSTRAINT chat_memory_pkey PRIMARY KEY (id);


--
-- TOC entry 3668 (class 2606 OID 24668)
-- Name: classes classes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_pkey PRIMARY KEY (id);


--
-- TOC entry 3670 (class 2606 OID 24670)
-- Name: classes classes_school_id_grade_section_academic_year_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_school_id_grade_section_academic_year_unique UNIQUE (school_id, grade, section, academic_year);


--
-- TOC entry 3672 (class 2606 OID 24682)
-- Name: daily_doses daily_doses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_doses
    ADD CONSTRAINT daily_doses_pkey PRIMARY KEY (id);


--
-- TOC entry 3674 (class 2606 OID 24692)
-- Name: homework_assignments homework_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homework_assignments
    ADD CONSTRAINT homework_assignments_pkey PRIMARY KEY (id);


--
-- TOC entry 3676 (class 2606 OID 24706)
-- Name: homework_submissions homework_submissions_assignment_id_student_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homework_submissions
    ADD CONSTRAINT homework_submissions_assignment_id_student_id_unique UNIQUE (assignment_id, student_id);


--
-- TOC entry 3678 (class 2606 OID 24704)
-- Name: homework_submissions homework_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homework_submissions
    ADD CONSTRAINT homework_submissions_pkey PRIMARY KEY (id);


--
-- TOC entry 3680 (class 2606 OID 24718)
-- Name: lesson_plans lesson_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_plans
    ADD CONSTRAINT lesson_plans_pkey PRIMARY KEY (id);


--
-- TOC entry 3682 (class 2606 OID 24727)
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- TOC entry 3684 (class 2606 OID 24738)
-- Name: resources resources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_pkey PRIMARY KEY (id);


--
-- TOC entry 3686 (class 2606 OID 24749)
-- Name: schools schools_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_pkey PRIMARY KEY (id);


--
-- TOC entry 3688 (class 2606 OID 24758)
-- Name: student_learning_insights student_learning_insights_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_learning_insights
    ADD CONSTRAINT student_learning_insights_pkey PRIMARY KEY (id);


--
-- TOC entry 3690 (class 2606 OID 24760)
-- Name: student_learning_insights student_learning_insights_student_id_subject_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_learning_insights
    ADD CONSTRAINT student_learning_insights_student_id_subject_id_unique UNIQUE (student_id, subject_id);


--
-- TOC entry 3692 (class 2606 OID 24771)
-- Name: student_notes student_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_notes
    ADD CONSTRAINT student_notes_pkey PRIMARY KEY (id);


--
-- TOC entry 3694 (class 2606 OID 24783)
-- Name: student_profiles student_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_profiles
    ADD CONSTRAINT student_profiles_pkey PRIMARY KEY (id);


--
-- TOC entry 3696 (class 2606 OID 24785)
-- Name: student_profiles student_profiles_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_profiles
    ADD CONSTRAINT student_profiles_user_id_unique UNIQUE (user_id);


--
-- TOC entry 3698 (class 2606 OID 24798)
-- Name: student_queries student_queries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_queries
    ADD CONSTRAINT student_queries_pkey PRIMARY KEY (id);


--
-- TOC entry 3732 (class 2606 OID 33104)
-- Name: subject_textbook_embeddings subject_textbook_embeddings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subject_textbook_embeddings
    ADD CONSTRAINT subject_textbook_embeddings_pkey PRIMARY KEY (id);


--
-- TOC entry 3734 (class 2606 OID 33106)
-- Name: subject_textbook_embeddings subject_textbook_embeddings_subject_id_chunk_index_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subject_textbook_embeddings
    ADD CONSTRAINT subject_textbook_embeddings_subject_id_chunk_index_unique UNIQUE (subject_id, chunk_index);


--
-- TOC entry 3700 (class 2606 OID 24811)
-- Name: subjects subjects_code_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_code_unique UNIQUE (code);


--
-- TOC entry 3702 (class 2606 OID 24809)
-- Name: subjects subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_pkey PRIMARY KEY (id);


--
-- TOC entry 3704 (class 2606 OID 24823)
-- Name: teacher_assessments teacher_assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_assessments
    ADD CONSTRAINT teacher_assessments_pkey PRIMARY KEY (id);


--
-- TOC entry 3706 (class 2606 OID 24833)
-- Name: teacher_class_assignments teacher_class_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_class_assignments
    ADD CONSTRAINT teacher_class_assignments_pkey PRIMARY KEY (id);


--
-- TOC entry 3708 (class 2606 OID 24835)
-- Name: teacher_class_assignments teacher_class_assignments_teacher_id_class_id_subject_id_academ; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_class_assignments
    ADD CONSTRAINT teacher_class_assignments_teacher_id_class_id_subject_id_academ UNIQUE (teacher_id, class_id, subject_id, academic_year);


--
-- TOC entry 3710 (class 2606 OID 24845)
-- Name: teacher_portfolio teacher_portfolio_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_portfolio
    ADD CONSTRAINT teacher_portfolio_pkey PRIMARY KEY (id);


--
-- TOC entry 3712 (class 2606 OID 24856)
-- Name: teacher_profiles teacher_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_profiles
    ADD CONSTRAINT teacher_profiles_pkey PRIMARY KEY (id);


--
-- TOC entry 3714 (class 2606 OID 24858)
-- Name: teacher_profiles teacher_profiles_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_profiles
    ADD CONSTRAINT teacher_profiles_user_id_unique UNIQUE (user_id);


--
-- TOC entry 3716 (class 2606 OID 24867)
-- Name: test_results test_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_results
    ADD CONSTRAINT test_results_pkey PRIMARY KEY (id);


--
-- TOC entry 3718 (class 2606 OID 24869)
-- Name: test_results test_results_test_id_student_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_results
    ADD CONSTRAINT test_results_test_id_student_id_unique UNIQUE (test_id, student_id);


--
-- TOC entry 3720 (class 2606 OID 24883)
-- Name: tests tests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tests
    ADD CONSTRAINT tests_pkey PRIMARY KEY (id);


--
-- TOC entry 3722 (class 2606 OID 24891)
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- TOC entry 3724 (class 2606 OID 24893)
-- Name: user_roles user_roles_user_id_role_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_unique UNIQUE (user_id, role);


--
-- TOC entry 3726 (class 2606 OID 24903)
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- TOC entry 3728 (class 2606 OID 24901)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3730 (class 2606 OID 24913)
-- Name: webhook_logs webhook_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webhook_logs
    ADD CONSTRAINT webhook_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 3737 (class 2606 OID 24914)
-- Name: ai_tutor_sessions ai_tutor_sessions_student_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_tutor_sessions
    ADD CONSTRAINT ai_tutor_sessions_student_id_users_id_fk FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3738 (class 2606 OID 24919)
-- Name: ai_tutor_sessions ai_tutor_sessions_subject_id_subjects_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_tutor_sessions
    ADD CONSTRAINT ai_tutor_sessions_subject_id_subjects_id_fk FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE;


--
-- TOC entry 3739 (class 2606 OID 24924)
-- Name: classes classes_school_id_schools_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_school_id_schools_id_fk FOREIGN KEY (school_id) REFERENCES public.schools(id) ON DELETE CASCADE;


--
-- TOC entry 3740 (class 2606 OID 24934)
-- Name: daily_doses daily_doses_subject_id_subjects_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_doses
    ADD CONSTRAINT daily_doses_subject_id_subjects_id_fk FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE;


--
-- TOC entry 3741 (class 2606 OID 24929)
-- Name: daily_doses daily_doses_teacher_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_doses
    ADD CONSTRAINT daily_doses_teacher_id_users_id_fk FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3742 (class 2606 OID 24939)
-- Name: homework_assignments homework_assignments_class_id_classes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homework_assignments
    ADD CONSTRAINT homework_assignments_class_id_classes_id_fk FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;


--
-- TOC entry 3743 (class 2606 OID 24944)
-- Name: homework_assignments homework_assignments_subject_id_subjects_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homework_assignments
    ADD CONSTRAINT homework_assignments_subject_id_subjects_id_fk FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE;


--
-- TOC entry 3744 (class 2606 OID 24949)
-- Name: homework_assignments homework_assignments_teacher_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homework_assignments
    ADD CONSTRAINT homework_assignments_teacher_id_users_id_fk FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3745 (class 2606 OID 24954)
-- Name: homework_submissions homework_submissions_assignment_id_homework_assignments_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homework_submissions
    ADD CONSTRAINT homework_submissions_assignment_id_homework_assignments_id_fk FOREIGN KEY (assignment_id) REFERENCES public.homework_assignments(id) ON DELETE CASCADE;


--
-- TOC entry 3746 (class 2606 OID 24959)
-- Name: homework_submissions homework_submissions_student_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homework_submissions
    ADD CONSTRAINT homework_submissions_student_id_users_id_fk FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3747 (class 2606 OID 24969)
-- Name: lesson_plans lesson_plans_class_id_classes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_plans
    ADD CONSTRAINT lesson_plans_class_id_classes_id_fk FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;


--
-- TOC entry 3748 (class 2606 OID 24974)
-- Name: lesson_plans lesson_plans_subject_id_subjects_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_plans
    ADD CONSTRAINT lesson_plans_subject_id_subjects_id_fk FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE;


--
-- TOC entry 3749 (class 2606 OID 24964)
-- Name: lesson_plans lesson_plans_teacher_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_plans
    ADD CONSTRAINT lesson_plans_teacher_id_users_id_fk FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3750 (class 2606 OID 24979)
-- Name: profiles profiles_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_users_id_fk FOREIGN KEY (id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3751 (class 2606 OID 24984)
-- Name: resources resources_subject_id_subjects_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_subject_id_subjects_id_fk FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE;


--
-- TOC entry 3752 (class 2606 OID 24989)
-- Name: student_learning_insights student_learning_insights_student_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_learning_insights
    ADD CONSTRAINT student_learning_insights_student_id_users_id_fk FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3753 (class 2606 OID 24994)
-- Name: student_learning_insights student_learning_insights_subject_id_subjects_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_learning_insights
    ADD CONSTRAINT student_learning_insights_subject_id_subjects_id_fk FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE;


--
-- TOC entry 3754 (class 2606 OID 24999)
-- Name: student_notes student_notes_student_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_notes
    ADD CONSTRAINT student_notes_student_id_users_id_fk FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3755 (class 2606 OID 25004)
-- Name: student_notes student_notes_subject_id_subjects_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_notes
    ADD CONSTRAINT student_notes_subject_id_subjects_id_fk FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE;


--
-- TOC entry 3756 (class 2606 OID 25009)
-- Name: student_notes student_notes_verified_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_notes
    ADD CONSTRAINT student_notes_verified_by_users_id_fk FOREIGN KEY (verified_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3757 (class 2606 OID 25019)
-- Name: student_profiles student_profiles_class_id_classes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_profiles
    ADD CONSTRAINT student_profiles_class_id_classes_id_fk FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE SET NULL;


--
-- TOC entry 3758 (class 2606 OID 25014)
-- Name: student_profiles student_profiles_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_profiles
    ADD CONSTRAINT student_profiles_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3759 (class 2606 OID 25024)
-- Name: student_queries student_queries_student_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_queries
    ADD CONSTRAINT student_queries_student_id_users_id_fk FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3760 (class 2606 OID 25034)
-- Name: student_queries student_queries_subject_id_subjects_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_queries
    ADD CONSTRAINT student_queries_subject_id_subjects_id_fk FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE;


--
-- TOC entry 3761 (class 2606 OID 25029)
-- Name: student_queries student_queries_teacher_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_queries
    ADD CONSTRAINT student_queries_teacher_id_users_id_fk FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3776 (class 2606 OID 33107)
-- Name: subject_textbook_embeddings subject_textbook_embeddings_subject_id_subjects_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subject_textbook_embeddings
    ADD CONSTRAINT subject_textbook_embeddings_subject_id_subjects_id_fk FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE;


--
-- TOC entry 3762 (class 2606 OID 25044)
-- Name: teacher_assessments teacher_assessments_subject_id_subjects_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_assessments
    ADD CONSTRAINT teacher_assessments_subject_id_subjects_id_fk FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE;


--
-- TOC entry 3763 (class 2606 OID 25039)
-- Name: teacher_assessments teacher_assessments_teacher_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_assessments
    ADD CONSTRAINT teacher_assessments_teacher_id_users_id_fk FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3764 (class 2606 OID 25054)
-- Name: teacher_class_assignments teacher_class_assignments_class_id_classes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_class_assignments
    ADD CONSTRAINT teacher_class_assignments_class_id_classes_id_fk FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;


--
-- TOC entry 3765 (class 2606 OID 25059)
-- Name: teacher_class_assignments teacher_class_assignments_subject_id_subjects_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_class_assignments
    ADD CONSTRAINT teacher_class_assignments_subject_id_subjects_id_fk FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE;


--
-- TOC entry 3766 (class 2606 OID 25049)
-- Name: teacher_class_assignments teacher_class_assignments_teacher_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_class_assignments
    ADD CONSTRAINT teacher_class_assignments_teacher_id_users_id_fk FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3767 (class 2606 OID 25064)
-- Name: teacher_portfolio teacher_portfolio_teacher_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_portfolio
    ADD CONSTRAINT teacher_portfolio_teacher_id_users_id_fk FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3768 (class 2606 OID 25074)
-- Name: teacher_profiles teacher_profiles_school_id_schools_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_profiles
    ADD CONSTRAINT teacher_profiles_school_id_schools_id_fk FOREIGN KEY (school_id) REFERENCES public.schools(id) ON DELETE SET NULL;


--
-- TOC entry 3769 (class 2606 OID 25069)
-- Name: teacher_profiles teacher_profiles_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_profiles
    ADD CONSTRAINT teacher_profiles_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3770 (class 2606 OID 25084)
-- Name: test_results test_results_student_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_results
    ADD CONSTRAINT test_results_student_id_users_id_fk FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3771 (class 2606 OID 25079)
-- Name: test_results test_results_test_id_tests_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_results
    ADD CONSTRAINT test_results_test_id_tests_id_fk FOREIGN KEY (test_id) REFERENCES public.tests(id) ON DELETE CASCADE;


--
-- TOC entry 3772 (class 2606 OID 25089)
-- Name: tests tests_class_id_classes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tests
    ADD CONSTRAINT tests_class_id_classes_id_fk FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;


--
-- TOC entry 3773 (class 2606 OID 25094)
-- Name: tests tests_subject_id_subjects_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tests
    ADD CONSTRAINT tests_subject_id_subjects_id_fk FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE;


--
-- TOC entry 3774 (class 2606 OID 25099)
-- Name: tests tests_teacher_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tests
    ADD CONSTRAINT tests_teacher_id_users_id_fk FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3775 (class 2606 OID 25104)
-- Name: user_roles user_roles_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2026-01-29 23:20:19

--
-- PostgreSQL database dump complete
--

\unrestrict U8wzZmDSf1eUbpyOGzvENgpe1da9fdERQ34voSdG75c44GZfZMb1lsUfcZoYCz5


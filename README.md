# NeuraFix Secondary School - Class 10 Education Platform

## Overview

This project is a production-ready education platform focused on a single, real-world deployment: **NeuraFix Secondary School, Class 10 (Section A)**. The current scope is intentionally tight so we can harden the core flows—student learning, teacher onboarding, subject assignment, and class-level synchronization—before expanding to multiple classes and schools.

## Current Scope

- **School:** NeuraFix Secondary School  
- **Class:** 10-A  
- **Users:** Students and teachers only  
- **Focus:** Core learning loop (subjects, homework, tests, notes, AI tutor)  
- **Synchronization:** Teacher subject registration is reflected on student views

## Core Features

- **Teacher registration with subject selection**  
  Teachers must choose the subject they teach during signup. This subject assignment is used throughout the platform.

- **Student dashboard is synced with teacher assignments**  
  Students see the correct teacher name for each subject based on the teacher’s registration and class assignment.

- **Dynamic UI components**  
  Subject cards, class labels, teacher names, and task counts are data-driven—not hardcoded.

- **Class-level routing for subject content**  
  Homework, notes, tests, and resources are scoped to Class 10-A.

## System Architecture

### High-Level Architecture

```
React Frontend (Student & Teacher Interfaces)
        ↓
   Express API Server
        ↓
 PostgreSQL (Drizzle ORM)
```

### Frontend Layer (React)

#### Student Interface

-   Ask questions via text or image
-   Receive personalized explanations
-   Submit homework and receive feedback
-   Track learning progress

#### Teacher Interface

-   Register with subject specialization
-   View class-level performance and assignments
-   Track student progress for assigned subjects

React is used to ensure scalability, responsiveness, and separation of concerns between UI and intelligence.

### Backend Layer (Express + Drizzle)

- REST API for student and teacher experiences
- Subject, homework, notes, tests, and AI tutor endpoints
- Authenticated user roles for students and teachers

### Data Layer (PostgreSQL)

PostgreSQL is used for:

-   Student and teacher profiles
-   Homework submissions, marks, and feedback
-   Progress analytics and difficulty tracking
-   Subjects and teacher-class assignments

The schema is designed for secure data handling, relational integrity, and future scalability.

## Security & Data Handling

-   Role-based access for students and teachers
-   Centralized data storage with controlled read/write operations
-   Designed to comply with privacy and educational data standards

## Roadmap (Planned Expansion)

- Multiple classes per school
- Multiple schools per deployment
- Admin role and governance workflows
- Region-specific and multilingual adaptations

The architecture is intentionally modular, allowing the platform to scale from a single classroom to a full multi-school deployment.

## Branding

- School branding in the UI: **NeuraFix Secondary School**
- Class label: **Class 10-A**

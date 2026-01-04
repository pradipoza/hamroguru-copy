export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_tutor_sessions: {
        Row: {
          created_at: string
          ended_at: string | null
          id: string
          messages: Json[] | null
          session_summary: string | null
          student_id: string
          subject_id: string
          topics_discussed: string[] | null
          understanding_level: Json | null
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          id?: string
          messages?: Json[] | null
          session_summary?: string | null
          student_id: string
          subject_id: string
          topics_discussed?: string[] | null
          understanding_level?: Json | null
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          id?: string
          messages?: Json[] | null
          session_summary?: string | null
          student_id?: string
          subject_id?: string
          topics_discussed?: string[] | null
          understanding_level?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_tutor_sessions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          academic_year: string
          created_at: string
          grade: number
          id: string
          school_id: string | null
          section: string
          updated_at: string
        }
        Insert: {
          academic_year?: string
          created_at?: string
          grade: number
          id?: string
          school_id?: string | null
          section?: string
          updated_at?: string
        }
        Update: {
          academic_year?: string
          created_at?: string
          grade?: number
          id?: string
          school_id?: string | null
          section?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_doses: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          content: string | null
          created_at: string
          date: string
          description: string | null
          estimated_time: number | null
          id: string
          source: string | null
          subject_id: string
          teacher_id: string
          title: string
          topics: string[] | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          content?: string | null
          created_at?: string
          date?: string
          description?: string | null
          estimated_time?: number | null
          id?: string
          source?: string | null
          subject_id: string
          teacher_id: string
          title: string
          topics?: string[] | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          content?: string | null
          created_at?: string
          date?: string
          description?: string | null
          estimated_time?: number | null
          id?: string
          source?: string | null
          subject_id?: string
          teacher_id?: string
          title?: string
          topics?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_doses_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          content: string
          embedding: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          content: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Update: {
          content?: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      homework_assignments: {
        Row: {
          chapter: string | null
          class_id: string
          created_at: string
          description: string | null
          due_date: string
          id: string
          subject_id: string
          teacher_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          chapter?: string | null
          class_id: string
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          subject_id: string
          teacher_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          chapter?: string | null
          class_id?: string
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          subject_id?: string
          teacher_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "homework_assignments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homework_assignments_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      homework_submissions: {
        Row: {
          ai_feedback: Json | null
          assignment_id: string
          created_at: string
          id: string
          images: string[] | null
          score: number | null
          status: Database["public"]["Enums"]["homework_status"]
          student_id: string
          submitted_at: string | null
          teacher_feedback: string | null
          updated_at: string
        }
        Insert: {
          ai_feedback?: Json | null
          assignment_id: string
          created_at?: string
          id?: string
          images?: string[] | null
          score?: number | null
          status?: Database["public"]["Enums"]["homework_status"]
          student_id: string
          submitted_at?: string | null
          teacher_feedback?: string | null
          updated_at?: string
        }
        Update: {
          ai_feedback?: Json | null
          assignment_id?: string
          created_at?: string
          id?: string
          images?: string[] | null
          score?: number | null
          status?: Database["public"]["Enums"]["homework_status"]
          student_id?: string
          submitted_at?: string | null
          teacher_feedback?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "homework_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "homework_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_plans: {
        Row: {
          ai_recommendation: string | null
          class_id: string
          completed_at: string | null
          created_at: string
          date: string
          feedback_collected: boolean | null
          id: string
          status: Database["public"]["Enums"]["lesson_status"]
          student_queries: Json[] | null
          subject_id: string
          teacher_id: string
          topics: string[] | null
          updated_at: string
          weak_areas: string[] | null
        }
        Insert: {
          ai_recommendation?: string | null
          class_id: string
          completed_at?: string | null
          created_at?: string
          date: string
          feedback_collected?: boolean | null
          id?: string
          status?: Database["public"]["Enums"]["lesson_status"]
          student_queries?: Json[] | null
          subject_id: string
          teacher_id: string
          topics?: string[] | null
          updated_at?: string
          weak_areas?: string[] | null
        }
        Update: {
          ai_recommendation?: string | null
          class_id?: string
          completed_at?: string | null
          created_at?: string
          date?: string
          feedback_collected?: boolean | null
          id?: string
          status?: Database["public"]["Enums"]["lesson_status"]
          student_queries?: Json[] | null
          subject_id?: string
          teacher_id?: string
          topics?: string[] | null
          updated_at?: string
          weak_areas?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_plans_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_plans_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          chapter: string | null
          created_at: string
          id: string
          is_bookmarked: boolean | null
          recommended: boolean | null
          subject_id: string
          title: string
          type: string
          url: string | null
        }
        Insert: {
          chapter?: string | null
          created_at?: string
          id?: string
          is_bookmarked?: boolean | null
          recommended?: boolean | null
          subject_id: string
          title: string
          type: string
          url?: string | null
        }
        Update: {
          chapter?: string | null
          created_at?: string
          id?: string
          is_bookmarked?: boolean | null
          recommended?: boolean | null
          subject_id?: string
          title?: string
          type?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resources_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          address: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          id: string
          name: string
          type: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          name: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          name?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      student_learning_insights: {
        Row: {
          id: string
          last_updated: string | null
          progress_trend: string | null
          recommended_topics: string[] | null
          strengths: string[] | null
          student_id: string
          subject_id: string
          weaknesses: string[] | null
        }
        Insert: {
          id?: string
          last_updated?: string | null
          progress_trend?: string | null
          recommended_topics?: string[] | null
          strengths?: string[] | null
          student_id: string
          subject_id: string
          weaknesses?: string[] | null
        }
        Update: {
          id?: string
          last_updated?: string | null
          progress_trend?: string | null
          recommended_topics?: string[] | null
          strengths?: string[] | null
          student_id?: string
          subject_id?: string
          weaknesses?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "student_learning_insights_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      student_notes: {
        Row: {
          chapter: string
          content: string | null
          created_at: string
          id: string
          images: string[] | null
          status: Database["public"]["Enums"]["note_status"]
          student_id: string
          subject_id: string
          topic: string
          updated_at: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          chapter: string
          content?: string | null
          created_at?: string
          id?: string
          images?: string[] | null
          status?: Database["public"]["Enums"]["note_status"]
          student_id: string
          subject_id: string
          topic: string
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          chapter?: string
          content?: string | null
          created_at?: string
          id?: string
          images?: string[] | null
          status?: Database["public"]["Enums"]["note_status"]
          student_id?: string
          subject_id?: string
          topic?: string
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_notes_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      student_profiles: {
        Row: {
          address: string | null
          class_id: string | null
          created_at: string
          goals: string[] | null
          id: string
          interests: string[] | null
          learning_style: string | null
          parent_contact: string | null
          roll_number: number | null
          streak_days: number | null
          total_points: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          class_id?: string | null
          created_at?: string
          goals?: string[] | null
          id?: string
          interests?: string[] | null
          learning_style?: string | null
          parent_contact?: string | null
          roll_number?: number | null
          streak_days?: number | null
          total_points?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          class_id?: string | null
          created_at?: string
          goals?: string[] | null
          id?: string
          interests?: string[] | null
          learning_style?: string | null
          parent_contact?: string | null
          roll_number?: number | null
          streak_days?: number | null
          total_points?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      student_queries: {
        Row: {
          added_to_portfolio: boolean | null
          addressed_at: string | null
          asked_at: string | null
          created_at: string
          id: string
          query_text: string
          source: string | null
          status: Database["public"]["Enums"]["query_status"]
          student_feedback: Database["public"]["Enums"]["feedback_type"] | null
          student_id: string
          subject_id: string
          teacher_id: string | null
          topic: string | null
        }
        Insert: {
          added_to_portfolio?: boolean | null
          addressed_at?: string | null
          asked_at?: string | null
          created_at?: string
          id?: string
          query_text: string
          source?: string | null
          status?: Database["public"]["Enums"]["query_status"]
          student_feedback?: Database["public"]["Enums"]["feedback_type"] | null
          student_id: string
          subject_id: string
          teacher_id?: string | null
          topic?: string | null
        }
        Update: {
          added_to_portfolio?: boolean | null
          addressed_at?: string | null
          asked_at?: string | null
          created_at?: string
          id?: string
          query_text?: string
          source?: string | null
          status?: Database["public"]["Enums"]["query_status"]
          student_feedback?: Database["public"]["Enums"]["feedback_type"] | null
          student_id?: string
          subject_id?: string
          teacher_id?: string | null
          topic?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_queries_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          code: string
          color: string | null
          created_at: string
          description: string | null
          grade_level: number | null
          icon: string | null
          id: string
          name: string
          name_nepali: string | null
        }
        Insert: {
          code: string
          color?: string | null
          created_at?: string
          description?: string | null
          grade_level?: number | null
          icon?: string | null
          id?: string
          name: string
          name_nepali?: string | null
        }
        Update: {
          code?: string
          color?: string | null
          created_at?: string
          description?: string | null
          grade_level?: number | null
          icon?: string | null
          id?: string
          name?: string
          name_nepali?: string | null
        }
        Relationships: []
      }
      teacher_assessments: {
        Row: {
          completed_at: string | null
          created_at: string
          duration: number | null
          id: string
          scheduled_date: string | null
          score: number | null
          status: Database["public"]["Enums"]["test_status"]
          subject_id: string
          teacher_id: string
          title: string
          total_questions: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          duration?: number | null
          id?: string
          scheduled_date?: string | null
          score?: number | null
          status?: Database["public"]["Enums"]["test_status"]
          subject_id: string
          teacher_id: string
          title: string
          total_questions?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          duration?: number | null
          id?: string
          scheduled_date?: string | null
          score?: number | null
          status?: Database["public"]["Enums"]["test_status"]
          subject_id?: string
          teacher_id?: string
          title?: string
          total_questions?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_assessments_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_class_assignments: {
        Row: {
          academic_year: string
          class_id: string
          created_at: string
          id: string
          subject_id: string
          teacher_id: string
        }
        Insert: {
          academic_year?: string
          class_id: string
          created_at?: string
          id?: string
          subject_id: string
          teacher_id: string
        }
        Update: {
          academic_year?: string
          class_id?: string
          created_at?: string
          id?: string
          subject_id?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_class_assignments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_class_assignments_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_portfolio: {
        Row: {
          created_at: string
          date: string
          details: Json | null
          id: string
          metric_type: string
          teacher_id: string
          value: number | null
        }
        Insert: {
          created_at?: string
          date?: string
          details?: Json | null
          id?: string
          metric_type: string
          teacher_id: string
          value?: number | null
        }
        Update: {
          created_at?: string
          date?: string
          details?: Json | null
          id?: string
          metric_type?: string
          teacher_id?: string
          value?: number | null
        }
        Relationships: []
      }
      teacher_profiles: {
        Row: {
          created_at: string
          employee_id: string | null
          id: string
          join_date: string | null
          qualification: string | null
          school_id: string | null
          subjects_taught: string[] | null
          updated_at: string
          user_id: string
          years_experience: number | null
        }
        Insert: {
          created_at?: string
          employee_id?: string | null
          id?: string
          join_date?: string | null
          qualification?: string | null
          school_id?: string | null
          subjects_taught?: string[] | null
          updated_at?: string
          user_id: string
          years_experience?: number | null
        }
        Update: {
          created_at?: string
          employee_id?: string | null
          id?: string
          join_date?: string | null
          qualification?: string | null
          school_id?: string | null
          subjects_taught?: string[] | null
          updated_at?: string
          user_id?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_profiles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      test_results: {
        Row: {
          completed_at: string | null
          grade: string | null
          id: string
          percentage: number | null
          score: number | null
          student_id: string
          test_id: string
          topic_scores: Json | null
          weak_areas: string[] | null
        }
        Insert: {
          completed_at?: string | null
          grade?: string | null
          id?: string
          percentage?: number | null
          score?: number | null
          student_id: string
          test_id: string
          topic_scores?: Json | null
          weak_areas?: string[] | null
        }
        Update: {
          completed_at?: string | null
          grade?: string | null
          id?: string
          percentage?: number | null
          score?: number | null
          student_id?: string
          test_id?: string
          topic_scores?: Json | null
          weak_areas?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "test_results_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      tests: {
        Row: {
          chapter: string | null
          class_id: string
          created_at: string
          duration: number | null
          id: string
          scheduled_date: string | null
          status: Database["public"]["Enums"]["test_status"]
          subject_id: string
          teacher_id: string | null
          title: string
          total_marks: number | null
          total_questions: number | null
          type: string | null
        }
        Insert: {
          chapter?: string | null
          class_id: string
          created_at?: string
          duration?: number | null
          id?: string
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["test_status"]
          subject_id: string
          teacher_id?: string | null
          title: string
          total_marks?: number | null
          total_questions?: number | null
          type?: string | null
        }
        Update: {
          chapter?: string | null
          class_id?: string
          created_at?: string
          duration?: number | null
          id?: string
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["test_status"]
          subject_id?: string
          teacher_id?: string | null
          title?: string
          total_marks?: number | null
          total_questions?: number | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tests_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tests_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          created_at: string
          id: string
          payload: Json | null
          response: Json | null
          status: string | null
          webhook_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          payload?: Json | null
          response?: Json | null
          status?: string | null
          webhook_type: string
        }
        Update: {
          created_at?: string
          id?: string
          payload?: Json | null
          response?: Json | null
          status?: string | null
          webhook_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      match_documents: {
        Args: { filter?: Json; query_embedding: string }
        Returns: {
          content: string
          id: string
          metadata: Json
          similarity: number
        }[]
      }
    }
    Enums: {
      app_role: "student" | "teacher" | "admin"
      feedback_type: "understood" | "still_confused" | "not_addressed"
      homework_status:
        | "pending"
        | "submitted"
        | "checked"
        | "reviewed"
        | "late"
        | "missed"
      lesson_status: "upcoming" | "completed" | "missed"
      note_status: "pending" | "completed" | "verified"
      query_status: "pending" | "addressed" | "not_addressed"
      test_status: "upcoming" | "available" | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["student", "teacher", "admin"],
      feedback_type: ["understood", "still_confused", "not_addressed"],
      homework_status: [
        "pending",
        "submitted",
        "checked",
        "reviewed",
        "late",
        "missed",
      ],
      lesson_status: ["upcoming", "completed", "missed"],
      note_status: ["pending", "completed", "verified"],
      query_status: ["pending", "addressed", "not_addressed"],
      test_status: ["upcoming", "available", "completed"],
    },
  },
} as const

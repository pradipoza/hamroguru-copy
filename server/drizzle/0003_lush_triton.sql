CREATE TABLE "chat_memory" (
	"id" integer PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"message" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"subject" text
);
--> statement-breakpoint
CREATE TABLE "personalized_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assignment_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"personalized_content" jsonb NOT NULL,
	"questions" jsonb NOT NULL,
	"difficulty" text DEFAULT 'medium',
	"estimated_time" integer DEFAULT 30,
	"learning_objectives" text[],
	"personalized_instructions" text,
	"status" text DEFAULT 'ready',
	"generated_at" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "personalized_assignments_assignment_id_student_id_unique" UNIQUE("assignment_id","student_id")
);
--> statement-breakpoint
ALTER TABLE "personalized_assignments" ADD CONSTRAINT "personalized_assignments_assignment_id_homework_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."homework_assignments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personalized_assignments" ADD CONSTRAINT "personalized_assignments_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
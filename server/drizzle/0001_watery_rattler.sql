CREATE TABLE "subject_textbook_embeddings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject_id" uuid NOT NULL,
	"chapter" text,
	"topic" text,
	"chunk_index" integer NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subject_textbook_embeddings_subject_id_chunk_index_unique" UNIQUE("subject_id","chunk_index")
);
--> statement-breakpoint
ALTER TABLE "subject_textbook_embeddings" ADD CONSTRAINT "subject_textbook_embeddings_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;
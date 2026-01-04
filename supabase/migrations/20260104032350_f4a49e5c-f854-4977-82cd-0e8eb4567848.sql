-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create documents table for n8n Supabase Vector Store compatibility
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  embedding VECTOR(1536)
);

-- Create index for vector similarity search
CREATE INDEX documents_embedding_idx ON public.documents 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create index for metadata filtering
CREATE INDEX documents_metadata_idx ON public.documents USING GIN (metadata);

-- Enable RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read documents
CREATE POLICY "Authenticated users can read documents"
ON public.documents FOR SELECT
TO authenticated
USING (true);

-- Policy: Service role can manage all documents (for n8n to insert via service key)
CREATE POLICY "Service role can manage documents"
ON public.documents FOR ALL
USING (true)
WITH CHECK (true);

-- Create match_documents function for similarity search (n8n compatible)
CREATE OR REPLACE FUNCTION public.match_documents (
  query_embedding VECTOR(1536),
  filter JSONB DEFAULT '{}'
) RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
) LANGUAGE plpgsql AS $$
#variable_conflict use_column
BEGIN
  RETURN QUERY
  SELECT
    id,
    content,
    metadata,
    1 - (documents.embedding <=> query_embedding) AS similarity
  FROM public.documents
  WHERE metadata @> filter
  ORDER BY documents.embedding <=> query_embedding;
END;
$$;

-- Insert Class 10 Science textbook metadata document as placeholder
INSERT INTO public.documents (content, metadata) VALUES 
('Class 10 Science Textbook - Nepal Curriculum. This is a placeholder for the full textbook content that will be uploaded via n8n.', 
 '{"subject": "science", "grade_level": 10, "source": "textbook", "language": "english", "curriculum": "nepal"}'::jsonb);
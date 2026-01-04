-- Fix match_documents function with proper search_path
CREATE OR REPLACE FUNCTION public.match_documents (
  query_embedding VECTOR(1536),
  filter JSONB DEFAULT '{}'
) RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
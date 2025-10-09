-- Add content_type, source_url, and metadata columns to oopsies table
ALTER TABLE oopsies ADD COLUMN IF NOT EXISTS content_type text DEFAULT 'image';
ALTER TABLE oopsies ADD COLUMN IF NOT EXISTS source_url text;
ALTER TABLE oopsies ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Add index for content_type for faster filtering
CREATE INDEX IF NOT EXISTS idx_oopsies_content_type ON oopsies(content_type);

-- Add comment to document the columns
COMMENT ON COLUMN oopsies.content_type IS 'Type of content: image, video, article, social';
COMMENT ON COLUMN oopsies.source_url IS 'Original URL for non-image submissions';
COMMENT ON COLUMN oopsies.metadata IS 'Extracted metadata from URL (title, description, thumbnail, embedUrl, etc.)';
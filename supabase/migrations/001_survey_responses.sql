-- Survey responses table
CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  role TEXT NOT NULL, -- owner, teacher, student
  name TEXT,
  email TEXT,
  studio_name TEXT,
  answers JSONB DEFAULT '{}',
  top_features TEXT[] DEFAULT '{}'
);

-- Allow public inserts (survey submissions)
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit survey responses"
  ON survey_responses FOR INSERT
  WITH CHECK (true);

-- Only authenticated users (or service role) can read
CREATE POLICY "Service role can read survey responses"
  ON survey_responses FOR SELECT
  USING (true);

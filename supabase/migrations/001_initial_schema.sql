-- Career Document Generator - Initial Schema
-- Run this in Supabase SQL Editor or via CLI migrations

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum types
CREATE TYPE company_visibility AS ENUM ('public', 'private');
CREATE TYPE role_level AS ENUM ('lead', 'partial', 'operate', 'collab');
CREATE TYPE risk_level AS ENUM ('green', 'yellow', 'red');
CREATE TYPE job_source_type AS ENUM ('saved', 'site', 'url', 'paste');
CREATE TYPE document_type AS ENUM ('career_report', 'cover_letter');

-- Experiences table
CREATE TABLE experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    start_month VARCHAR(7) NOT NULL, -- YYYY-MM format
    end_month VARCHAR(7), -- YYYY-MM format, nullable for ongoing
    ongoing BOOLEAN NOT NULL DEFAULT FALSE,
    company TEXT NOT NULL,
    company_visibility company_visibility NOT NULL DEFAULT 'public',
    project_name TEXT NOT NULL,
    raw_notes TEXT NOT NULL DEFAULT '',
    one_liner TEXT NOT NULL DEFAULT '',
    tags TEXT[] NOT NULL DEFAULT '{}',
    keywords TEXT[] NOT NULL DEFAULT '{}',
    role_level role_level NOT NULL DEFAULT 'collab',
    risk_level risk_level NOT NULL DEFAULT 'green',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Jobs table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    source_type job_source_type NOT NULL,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    url TEXT,
    raw_text TEXT NOT NULL DEFAULT '',
    structured JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Job questions table (for cover letter questions)
CREATE TABLE job_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_title TEXT NOT NULL,
    char_limit INTEGER,
    order_idx INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    doc_type document_type NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    content_md TEXT NOT NULL DEFAULT '',
    meta JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Document QC table
CREATE TABLE document_qc (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    pass BOOLEAN NOT NULL DEFAULT FALSE,
    report JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_experiences_user_id ON experiences(user_id);
CREATE INDEX idx_experiences_created_at ON experiences(created_at DESC);
CREATE INDEX idx_jobs_user_id ON jobs(user_id);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX idx_job_questions_job_id ON job_questions(job_id);
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_job_id ON documents(job_id);
CREATE INDEX idx_document_qc_document_id ON document_qc(document_id);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_experiences_updated_at
    BEFORE UPDATE ON experiences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_qc ENABLE ROW LEVEL SECURITY;

-- Experiences policies
CREATE POLICY "Users can view own experiences"
    ON experiences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own experiences"
    ON experiences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own experiences"
    ON experiences FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own experiences"
    ON experiences FOR DELETE
    USING (auth.uid() = user_id);

-- Jobs policies
CREATE POLICY "Users can view own jobs"
    ON jobs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own jobs"
    ON jobs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own jobs"
    ON jobs FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own jobs"
    ON jobs FOR DELETE
    USING (auth.uid() = user_id);

-- Job questions policies
CREATE POLICY "Users can view own job questions"
    ON job_questions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own job questions"
    ON job_questions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own job questions"
    ON job_questions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own job questions"
    ON job_questions FOR DELETE
    USING (auth.uid() = user_id);

-- Documents policies
CREATE POLICY "Users can view own documents"
    ON documents FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
    ON documents FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents"
    ON documents FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
    ON documents FOR DELETE
    USING (auth.uid() = user_id);

-- Document QC policies (based on document ownership)
CREATE POLICY "Users can view QC for own documents"
    ON document_qc FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM documents
            WHERE documents.id = document_qc.document_id
            AND documents.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert QC for own documents"
    ON document_qc FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM documents
            WHERE documents.id = document_qc.document_id
            AND documents.user_id = auth.uid()
        )
    );

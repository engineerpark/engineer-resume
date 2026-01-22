// Database types for Supabase

export type CompanyVisibility = 'public' | 'private';
export type RoleLevel = 'lead' | 'partial' | 'operate' | 'collab';
export type RiskLevel = 'green' | 'yellow' | 'red';
export type JobSourceType = 'saved' | 'site' | 'url' | 'paste';
export type DocumentType = 'career_report' | 'cover_letter';

export interface Experience {
  id: string;
  user_id: string;
  start_month: string; // YYYY-MM format
  end_month: string | null;
  ongoing: boolean;
  company: string;
  company_visibility: CompanyVisibility;
  project_name: string;
  raw_notes: string;
  one_liner: string;
  tags: string[];
  keywords: string[];
  role_level: RoleLevel;
  risk_level: RiskLevel;
  created_at: string;
}

export interface Job {
  id: string;
  user_id: string;
  source_type: JobSourceType;
  title: string;
  company: string;
  url: string | null;
  raw_text: string;
  structured: JobStructured | null;
  created_at: string;
}

export interface JobStructured {
  requirements: {
    must: string[];
    preferred: string[];
  };
  responsibilities: string[];
  questions?: JobQuestion[];
  length_rules?: {
    min_chars?: number;
    max_chars?: number;
    page_limit?: number;
  };
}

export interface JobQuestion {
  id: string;
  job_id: string;
  user_id: string;
  question_title: string;
  char_limit: number | null;
  order_idx: number;
}

export interface Document {
  id: string;
  user_id: string;
  job_id: string;
  doc_type: DocumentType;
  content: string;
  content_md: string;
  meta: DocumentMeta;
  created_at: string;
}

export interface DocumentMeta {
  char_count: number;
  traceability?: TraceabilityItem[];
  risk_flags?: string[];
  sections?: {
    [key: string]: {
      char_count: number;
      experience_ids: string[];
    };
  };
}

export interface TraceabilityItem {
  requirement: string;
  experience_id: string;
  experience_summary: string;
}

export interface DocumentQC {
  id: string;
  document_id: string;
  pass: boolean;
  report: QCReport;
  created_at: string;
}

export interface QCReport {
  issues: string[];
  suggestions: string[];
  char_count_by_section: { [key: string]: number };
  overall_score?: number;
}

// Input types for creating/updating
export interface ExperienceInput {
  start_month: string;
  end_month?: string | null;
  ongoing: boolean;
  company: string;
  company_visibility: CompanyVisibility;
  project_name: string;
  raw_notes: string;
}

export interface JobInput {
  source_type: JobSourceType;
  title: string;
  company: string;
  url?: string | null;
  raw_text: string;
}

// AI Pipeline result types
export interface StructuredExperience {
  one_liner: string;
  tags: string[];
  keywords: string[];
  role_level: RoleLevel;
  risk_level: RiskLevel;
}

export interface ParsedJob {
  raw_text: string;
  title?: string;
  company?: string;
}

export interface CareerReportResult {
  content: string;
  content_md: string;
  traceability: TraceabilityItem[];
  risk_flags: string[];
  char_count: number;
}

export interface CoverLetterAnswerResult {
  answer: string;
  char_count: number;
  risk_flags: string[];
}

export interface QCResult {
  pass: boolean;
  issues: string[];
  suggestions: string[];
  char_count_by_section: { [key: string]: number };
}

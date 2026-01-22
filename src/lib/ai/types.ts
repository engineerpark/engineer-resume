// AI Pipeline Types
// These interfaces define the contract for AI functions
// MVP uses placeholder implementations; swap to real models later

import type {
  StructuredExperience,
  ParsedJob,
  JobStructured,
  CareerReportResult,
  CoverLetterAnswerResult,
  QCResult,
  Experience,
} from '@/types/database';

export interface ExperienceMeta {
  startMonth: string;
  endMonth: string | null;
  ongoing: boolean;
  company: string;
  projectName: string;
}

export interface AIStructureExperienceInput {
  meta: ExperienceMeta;
  rawNotes: string;
}

export interface AIStructureJobInput {
  rawText: string;
}

export interface AICareerReportInput {
  jobStructured: JobStructured;
  selectedExperiences: Experience[];
  lengthRule?: {
    minChars?: number;
    maxChars?: number;
    pageLimit?: number;
  };
}

export interface AICoverLetterAnswerInput {
  question: string;
  selectedExperiences: Experience[];
  charLimit: number | null;
}

export interface AIQCInput {
  docContent: string;
  constraints: {
    charLimit?: number;
    requiredKeywords?: string[];
    mustMentionRequirements?: string[];
  };
}

// AI Service Interface
export interface AIService {
  structureExperience(input: AIStructureExperienceInput): Promise<StructuredExperience>;
  parseJobFromUrl(url: string): Promise<ParsedJob>;
  structureJob(input: AIStructureJobInput): Promise<JobStructured>;
  generateCareerReport(input: AICareerReportInput): Promise<CareerReportResult>;
  generateCoverLetterAnswer(input: AICoverLetterAnswerInput): Promise<CoverLetterAnswerResult>;
  qcDocument(input: AIQCInput): Promise<QCResult>;
}

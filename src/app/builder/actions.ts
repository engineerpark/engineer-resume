'use server';

import { createServerSupabaseClient, getUser } from '@/lib/supabase/server';
import { aiService } from '@/lib/ai';
import type {
  Experience,
  Job,
  Document,
  CareerReportResult,
  CoverLetterAnswerResult,
  QCResult,
} from '@/types/database';
import { revalidatePath } from 'next/cache';

// Generate career report
export async function generateCareerReport(
  jobId: string,
  experienceIds: string[]
): Promise<{ success: boolean; result?: CareerReportResult; error?: string }> {
  const user = await getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const supabase = createServerSupabaseClient();

    // Get job
    const { data: job } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .eq('user_id', user.id)
      .single();

    if (!job || !job.structured) {
      return { success: false, error: 'Job not found or not structured' };
    }

    // Get experiences
    const { data: experiences } = await supabase
      .from('experiences')
      .select('*')
      .in('id', experienceIds)
      .eq('user_id', user.id);

    if (!experiences || experiences.length === 0) {
      return { success: false, error: 'No experiences found' };
    }

    // Generate report
    const result = await aiService.generateCareerReport({
      jobStructured: job.structured,
      selectedExperiences: experiences,
      lengthRule: job.structured.length_rules,
    });

    return { success: true, result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Generation failed',
    };
  }
}

// Save document
export async function saveDocument(
  jobId: string,
  docType: 'career_report' | 'cover_letter',
  content: string,
  contentMd: string,
  meta: Record<string, unknown>
): Promise<{ success: boolean; id?: string; error?: string }> {
  const user = await getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        job_id: jobId,
        doc_type: docType,
        content,
        content_md: contentMd,
        meta,
      })
      .select('id')
      .single();

    if (error) throw new Error(error.message);

    revalidatePath('/builder');
    return { success: true, id: data.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Save failed',
    };
  }
}

// Generate cover letter answer
export async function generateCoverLetterAnswer(
  question: string,
  experienceIds: string[],
  charLimit: number | null
): Promise<{ success: boolean; result?: CoverLetterAnswerResult; error?: string }> {
  const user = await getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const supabase = createServerSupabaseClient();

    // Get experiences
    const { data: experiences } = await supabase
      .from('experiences')
      .select('*')
      .in('id', experienceIds)
      .eq('user_id', user.id);

    if (!experiences || experiences.length === 0) {
      return { success: false, error: 'No experiences selected' };
    }

    // Generate answer
    const result = await aiService.generateCoverLetterAnswer({
      question,
      selectedExperiences: experiences,
      charLimit,
    });

    return { success: true, result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Generation failed',
    };
  }
}

// QC document
export async function qcDocumentAction(
  content: string,
  charLimit?: number
): Promise<{ success: boolean; result?: QCResult; error?: string }> {
  try {
    const result = await aiService.qcDocument({
      docContent: content,
      constraints: {
        charLimit,
      },
    });

    return { success: true, result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'QC failed',
    };
  }
}

'use server';

import { createServerSupabaseClient, getUser } from '@/lib/supabase/server';
import { aiService } from '@/lib/ai';
import type { Job, JobInput, JobStructured, JobQuestion } from '@/types/database';
import { revalidatePath } from 'next/cache';
import { siteJobs } from '@/lib/data/siteJobs';

export async function getJobs(): Promise<Job[]> {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getJob(id: string): Promise<Job | null> {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }
  return data;
}

export async function getJobQuestions(jobId: string): Promise<JobQuestion[]> {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('job_questions')
    .select('*')
    .eq('job_id', jobId)
    .eq('user_id', user.id)
    .order('order_idx', { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

// Parse job from URL - server-side fetch with fallback
export async function parseJobFromUrl(
  url: string
): Promise<{ success: boolean; rawText?: string; title?: string; company?: string; error?: string }> {
  try {
    // Validate URL
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { success: false, error: '유효하지 않은 URL입니다' };
    }

    // Attempt to fetch the page (best effort)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CareerDocBot/1.0)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        error: '공고를 자동으로 불러오지 못했습니다. 직접 JD를 붙여넣기 해주세요.',
      };
    }

    const html = await response.text();

    // Basic text extraction (remove scripts, styles, tags)
    let text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, '\n')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();

    // If too short, parsing likely failed
    if (text.length < 100) {
      return {
        success: false,
        error: '공고를 자동으로 불러오지 못했습니다. 직접 JD를 붙여넣기 해주세요.',
      };
    }

    // Trim to reasonable length
    if (text.length > 10000) {
      text = text.slice(0, 10000);
    }

    // Try to extract title from meta or title tag
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : undefined;

    return {
      success: true,
      rawText: text,
      title,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        error: '요청 시간이 초과되었습니다. 직접 JD를 붙여넣기 해주세요.',
      };
    }
    return {
      success: false,
      error: '공고를 자동으로 불러오지 못했습니다. 직접 JD를 붙여넣기 해주세요.',
    };
  }
}

// Structure job text using AI
export async function structureJobAction(rawText: string): Promise<JobStructured> {
  return aiService.structureJob({ rawText });
}

// Create job from input
export async function createJob(
  input: JobInput
): Promise<{ success: boolean; id?: string; error?: string }> {
  const user = await getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    // Structure the job
    const structured = await structureJobAction(input.raw_text);

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        user_id: user.id,
        source_type: input.source_type,
        title: input.title,
        company: input.company,
        url: input.url || null,
        raw_text: input.raw_text,
        structured,
      })
      .select('id')
      .single();

    if (error) throw new Error(error.message);

    // If there are questions in structured, create job_questions
    if (structured.questions && structured.questions.length > 0) {
      const questions = structured.questions.map((q, idx) => ({
        job_id: data.id,
        user_id: user.id,
        question_title: q.title,
        char_limit: q.char_limit || null,
        order_idx: idx,
      }));

      await supabase.from('job_questions').insert(questions);
    }

    revalidatePath('/jobs');
    return { success: true, id: data.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Save a site job to user's saved jobs
export async function saveSiteJob(
  siteJobId: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  const siteJob = siteJobs.find((j) => j.id === siteJobId);
  if (!siteJob) {
    return { success: false, error: 'Job not found' };
  }

  return createJob({
    source_type: 'site',
    title: siteJob.title,
    company: siteJob.company,
    raw_text: siteJob.raw_text,
  });
}

// Add question to a job
export async function addJobQuestion(
  jobId: string,
  questionTitle: string,
  charLimit: number | null
): Promise<{ success: boolean; error?: string }> {
  const user = await getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const supabase = createServerSupabaseClient();

    // Get current max order_idx
    const { data: existing } = await supabase
      .from('job_questions')
      .select('order_idx')
      .eq('job_id', jobId)
      .order('order_idx', { ascending: false })
      .limit(1);

    const nextIdx = existing && existing.length > 0 ? existing[0].order_idx + 1 : 0;

    const { error } = await supabase.from('job_questions').insert({
      job_id: jobId,
      user_id: user.id,
      question_title: questionTitle,
      char_limit: charLimit,
      order_idx: nextIdx,
    });

    if (error) throw new Error(error.message);

    revalidatePath(`/jobs/${jobId}`);
    revalidatePath('/builder/cover-letter');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Delete question
export async function deleteJobQuestion(
  questionId: string
): Promise<{ success: boolean; error?: string }> {
  const user = await getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase
      .from('job_questions')
      .delete()
      .eq('id', questionId)
      .eq('user_id', user.id);

    if (error) throw new Error(error.message);

    revalidatePath('/builder/cover-letter');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Delete job
export async function deleteJob(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const user = await getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw new Error(error.message);

    revalidatePath('/jobs');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

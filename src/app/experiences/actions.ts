'use server';

import { createServerSupabaseClient, getUser } from '@/lib/supabase/server';
import { aiService } from '@/lib/ai';
import type { Experience, ExperienceInput, StructuredExperience } from '@/types/database';
import { revalidatePath } from 'next/cache';
import { mockExperiences } from '@/lib/data/mockExperiences';

// Use mock data for demo
const USE_MOCK_DATA = true;

export async function getExperiences(): Promise<Experience[]> {
  if (USE_MOCK_DATA) {
    return mockExperiences;
  }

  const user = await getUser();
  if (!user) throw new Error('Unauthorized');

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('user_id', user.id)
    .order('start_month', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getExperience(id: string): Promise<Experience | null> {
  if (USE_MOCK_DATA) {
    return mockExperiences.find(e => e.id === id) || null;
  }

  const user = await getUser();
  if (!user) throw new Error('Unauthorized');

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('experiences')
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

export async function structureExperienceAction(
  input: ExperienceInput
): Promise<StructuredExperience> {
  const structured = await aiService.structureExperience({
    meta: {
      startMonth: input.start_month,
      endMonth: input.end_month || null,
      ongoing: input.ongoing,
      company: input.company,
      projectName: input.project_name,
    },
    rawNotes: input.raw_notes,
  });

  return structured;
}

export async function createExperience(
  input: ExperienceInput
): Promise<{ success: boolean; id?: string; error?: string }> {
  if (USE_MOCK_DATA) {
    // In mock mode, just return success (data won't persist)
    return { success: true, id: 'mock-' + Date.now() };
  }

  const user = await getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const structured = await structureExperienceAction(input);

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('experiences')
      .insert({
        user_id: user.id,
        start_month: input.start_month,
        end_month: input.end_month || null,
        ongoing: input.ongoing,
        company: input.company,
        company_visibility: input.company_visibility,
        project_name: input.project_name,
        raw_notes: input.raw_notes,
        one_liner: structured.one_liner,
        tags: structured.tags,
        keywords: structured.keywords,
        role_level: structured.role_level,
        risk_level: structured.risk_level,
      })
      .select('id')
      .single();

    if (error) throw new Error(error.message);

    revalidatePath('/experiences');
    return { success: true, id: data.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function updateExperience(
  id: string,
  input: Partial<ExperienceInput>
): Promise<{ success: boolean; error?: string }> {
  if (USE_MOCK_DATA) {
    return { success: true };
  }

  const user = await getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const supabase = createServerSupabaseClient();

    const { data: existing } = await supabase
      .from('experiences')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!existing) return { success: false, error: 'Experience not found' };

    const merged = {
      start_month: input.start_month ?? existing.start_month,
      end_month: input.end_month ?? existing.end_month,
      ongoing: input.ongoing ?? existing.ongoing,
      company: input.company ?? existing.company,
      company_visibility: input.company_visibility ?? existing.company_visibility,
      project_name: input.project_name ?? existing.project_name,
      raw_notes: input.raw_notes ?? existing.raw_notes,
    };

    let structuredFields = {};
    if (
      input.raw_notes !== undefined ||
      input.company !== undefined ||
      input.project_name !== undefined
    ) {
      const structured = await aiService.structureExperience({
        meta: {
          startMonth: merged.start_month,
          endMonth: merged.end_month,
          ongoing: merged.ongoing,
          company: merged.company,
          projectName: merged.project_name,
        },
        rawNotes: merged.raw_notes,
      });
      structuredFields = {
        one_liner: structured.one_liner,
        tags: structured.tags,
        keywords: structured.keywords,
        role_level: structured.role_level,
        risk_level: structured.risk_level,
      };
    }

    const { error } = await supabase
      .from('experiences')
      .update({
        ...merged,
        ...structuredFields,
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw new Error(error.message);

    revalidatePath('/experiences');
    revalidatePath(`/experiences/${id}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function deleteExperience(
  id: string
): Promise<{ success: boolean; error?: string }> {
  if (USE_MOCK_DATA) {
    return { success: true };
  }

  const user = await getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw new Error(error.message);

    revalidatePath('/experiences');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

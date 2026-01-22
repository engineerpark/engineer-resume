'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Experience, ExperienceInput, CompanyVisibility } from '@/types/database';
import { createExperience, updateExperience } from '@/app/experiences/actions';

interface ExperienceFormProps {
  experience?: Experience;
}

export function ExperienceForm({ experience }: ExperienceFormProps) {
  const router = useRouter();
  const isEdit = !!experience;

  // Step management
  const [step, setStep] = useState<1 | 2>(1);

  // Form state
  const [startMonth, setStartMonth] = useState(experience?.start_month || '');
  const [endMonth, setEndMonth] = useState(experience?.end_month || '');
  const [ongoing, setOngoing] = useState(experience?.ongoing || false);
  const [company, setCompany] = useState(experience?.company || '');
  const [companyVisibility, setCompanyVisibility] = useState<CompanyVisibility>(
    experience?.company_visibility || 'public'
  );
  const [projectName, setProjectName] = useState(experience?.project_name || '');
  const [rawNotes, setRawNotes] = useState(experience?.raw_notes || '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isStep1Valid = startMonth && company && projectName;
  const isStep2Valid = rawNotes.trim().length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (!isStep1Valid) {
        setError('필수 항목을 입력해주세요');
        return;
      }
      setStep(2);
      setError(null);
      return;
    }

    if (!isStep2Valid) {
      setError('경험 내용을 10자 이상 입력해주세요');
      return;
    }

    setLoading(true);
    setError(null);

    const input: ExperienceInput = {
      start_month: startMonth,
      end_month: ongoing ? null : endMonth || null,
      ongoing,
      company,
      company_visibility: companyVisibility,
      project_name: projectName,
      raw_notes: rawNotes,
    };

    try {
      if (isEdit) {
        const result = await updateExperience(experience.id, input);
        if (!result.success) throw new Error(result.error);
      } else {
        const result = await createExperience(input);
        if (!result.success) throw new Error(result.error);
      }
      router.push('/experiences');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 중 오류가 발생했습니다');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => setStep(1)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
            step === 1 ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <span className="w-6 h-6 rounded-full bg-current bg-opacity-20 flex items-center justify-center text-sm">
            1
          </span>
          <span className="text-sm font-medium">기본정보</span>
        </button>
        <div className="h-px w-8 bg-gray-300" />
        <button
          type="button"
          onClick={() => isStep1Valid && setStep(2)}
          disabled={!isStep1Valid}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
            step === 2 ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:bg-gray-100'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <span className="w-6 h-6 rounded-full bg-current bg-opacity-20 flex items-center justify-center text-sm">
            2
          </span>
          <span className="text-sm font-medium">상세내용</span>
        </button>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">기본 정보</h2>

          {/* Period */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">시작 시점 *</label>
              <input
                type="month"
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">종료 시점</label>
              <input
                type="month"
                value={endMonth}
                onChange={(e) => setEndMonth(e.target.value)}
                className="input"
                disabled={ongoing}
              />
            </div>
          </div>

          {/* Ongoing checkbox */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={ongoing}
              onChange={(e) => {
                setOngoing(e.target.checked);
                if (e.target.checked) setEndMonth('');
              }}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">현재 진행 중</span>
          </label>

          {/* Company */}
          <div>
            <label className="label">회사명 *</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="input"
              placeholder="예: 삼성전자"
              required
            />
          </div>

          {/* Company visibility */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                checked={companyVisibility === 'public'}
                onChange={() => setCompanyVisibility('public')}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">회사명 공개</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                checked={companyVisibility === 'private'}
                onChange={() => setCompanyVisibility('private')}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">회사명 비공개</span>
            </label>
          </div>

          {/* Project name */}
          <div>
            <label className="label">프로젝트명 *</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="input"
              placeholder="예: 반도체 공정 자동화 설계"
              required
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">경험 상세 내용</h2>
          <p className="text-sm text-gray-600">
            담당 업무, 성과, 사용 기술 등을 자유롭게 작성해주세요.
            태그/키워드가 자동으로 추출됩니다.
          </p>

          {/* Summary of step 1 */}
          <div className="bg-gray-50 rounded-lg p-3 text-sm">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-600">
              <span><strong>회사:</strong> {company}</span>
              <span><strong>프로젝트:</strong> {projectName}</span>
              <span><strong>기간:</strong> {startMonth} ~ {ongoing ? '현재' : endMonth || '현재'}</span>
            </div>
          </div>

          {/* Raw notes */}
          <div>
            <label className="label">경험 메모 *</label>
            <textarea
              value={rawNotes}
              onChange={(e) => setRawNotes(e.target.value)}
              className="textarea h-48"
              placeholder={`예시:
- PLC 기반 자동화 시스템 설계 총괄
- 생산성 30% 향상 달성
- SCADA 시스템 구축 및 HMI 개발
- 팀원 5명과 협업, 프로젝트 일정 관리`}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {rawNotes.length}자 (최소 10자)
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            <strong>Tip:</strong> 구체적인 수치(%, 억원, 건 등)와 기술 키워드를 포함하면
            더 정확한 태그가 추출됩니다.
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between pt-4 border-t border-gray-200">
        {step === 2 ? (
          <button
            type="button"
            onClick={() => setStep(1)}
            className="btn-secondary"
          >
            이전
          </button>
        ) : (
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          disabled={loading || (step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)}
          className="btn-primary"
        >
          {loading ? '저장 중...' : step === 1 ? '다음' : isEdit ? '수정하기' : '저장하기'}
        </button>
      </div>
    </form>
  );
}

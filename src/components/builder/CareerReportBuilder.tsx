'use client';

import { useState, useMemo } from 'react';
import type { Job, Experience, CareerReportResult } from '@/types/database';
import { JobCard } from '@/components/jobs/JobCard';
import { ExperienceCard } from '@/components/experiences/ExperienceCard';
import { generateCareerReport, qcDocumentAction } from '@/app/builder/actions';
import { DocumentOutput } from './DocumentOutput';
import Link from 'next/link';

interface CareerReportBuilderProps {
  jobs: Job[];
  experiences: Experience[];
  initialJobId?: string;
}

type Step = 'select-job' | 'select-experiences' | 'result';

export function CareerReportBuilder({
  jobs,
  experiences,
  initialJobId,
}: CareerReportBuilderProps) {
  const [step, setStep] = useState<Step>(initialJobId ? 'select-experiences' : 'select-job');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(initialJobId || null);
  const [selectedExpIds, setSelectedExpIds] = useState<Set<string>>(new Set());
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<CareerReportResult | null>(null);
  const [qcResult, setQcResult] = useState<{ pass: boolean; issues: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedJob = useMemo(
    () => jobs.find((j) => j.id === selectedJobId),
    [jobs, selectedJobId]
  );

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId);
    setStep('select-experiences');
  };

  const toggleExperience = (id: string) => {
    setSelectedExpIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleGenerate = async () => {
    if (!selectedJobId || selectedExpIds.size === 0) return;

    setGenerating(true);
    setError(null);

    const genResult = await generateCareerReport(
      selectedJobId,
      Array.from(selectedExpIds)
    );

    if (genResult.success && genResult.result) {
      setResult(genResult.result);

      // Run QC
      const qc = await qcDocumentAction(
        genResult.result.content,
        selectedJob?.structured?.length_rules?.max_chars
      );
      if (qc.success && qc.result) {
        setQcResult(qc.result);
      }

      setStep('result');
    } else {
      setError(genResult.error || '생성 실패');
    }

    setGenerating(false);
  };

  if (jobs.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-600 mb-4">저장된 공고가 없습니다</p>
        <Link href="/jobs" className="btn-primary">
          공고 추가하기
        </Link>
      </div>
    );
  }

  if (experiences.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-600 mb-4">등록된 경험이 없습니다</p>
        <Link href="/experiences/new" className="btn-primary">
          경험 추가하기
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setStep('select-job')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
            step === 'select-job'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <span className="w-6 h-6 rounded-full bg-current bg-opacity-20 flex items-center justify-center text-sm">
            1
          </span>
          <span className="text-sm font-medium">공고 선택</span>
        </button>
        <div className="h-px w-8 bg-gray-300" />
        <button
          onClick={() => selectedJobId && setStep('select-experiences')}
          disabled={!selectedJobId}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg disabled:opacity-50 ${
            step === 'select-experiences'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <span className="w-6 h-6 rounded-full bg-current bg-opacity-20 flex items-center justify-center text-sm">
            2
          </span>
          <span className="text-sm font-medium">경험 선택</span>
        </button>
        <div className="h-px w-8 bg-gray-300" />
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
            step === 'result' ? 'bg-primary-100 text-primary-700' : 'text-gray-400'
          }`}
        >
          <span className="w-6 h-6 rounded-full bg-current bg-opacity-20 flex items-center justify-center text-sm">
            3
          </span>
          <span className="text-sm font-medium">결과</span>
        </div>
      </div>

      {/* Step 1: Select Job */}
      {step === 'select-job' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            경력기술서를 작성할 공고를 선택하세요
          </h2>
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              selectable
              selected={selectedJobId === job.id}
              onSelect={() => handleJobSelect(job.id)}
            />
          ))}
        </div>
      )}

      {/* Step 2: Select Experiences */}
      {step === 'select-experiences' && selectedJob && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Job info + Selected experiences */}
          <div className="lg:col-span-1 space-y-4">
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-2">선택된 공고</h3>
              <p className="text-sm text-gray-600">{selectedJob.company}</p>
              <p className="font-medium">{selectedJob.title}</p>
              <button
                onClick={() => setStep('select-job')}
                className="text-sm text-primary-600 hover:underline mt-2"
              >
                변경
              </button>
            </div>

            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-2">
                선택된 경험 ({selectedExpIds.size}개)
              </h3>
              {selectedExpIds.size === 0 ? (
                <p className="text-sm text-gray-500">
                  오른쪽에서 경험을 선택하세요
                </p>
              ) : (
                <div className="space-y-2">
                  {experiences
                    .filter((e) => selectedExpIds.has(e.id))
                    .map((exp) => (
                      <div
                        key={exp.id}
                        className="flex items-center justify-between bg-gray-50 rounded p-2"
                      >
                        <div className="text-sm">
                          <p className="font-medium">{exp.project_name}</p>
                          <p className="text-gray-500">{exp.company}</p>
                        </div>
                        <button
                          onClick={() => toggleExperience(exp.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={generating || selectedExpIds.size === 0}
              className="btn-primary w-full"
            >
              {generating ? '생성 중...' : '경력기술서 생성'}
            </button>
          </div>

          {/* Right: Experience list */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              포함할 경험을 선택하세요
            </h2>
            {experiences.map((exp) => (
              <ExperienceCard
                key={exp.id}
                experience={exp}
                selectable
                selected={selectedExpIds.has(exp.id)}
                onToggle={toggleExperience}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Result */}
      {step === 'result' && result && (
        <DocumentOutput
          content={result.content}
          contentMd={result.content_md}
          charCount={result.char_count}
          traceability={result.traceability}
          riskFlags={result.risk_flags}
          qcPass={qcResult?.pass}
          qcIssues={qcResult?.issues}
          maxChars={selectedJob?.structured?.length_rules?.max_chars}
          onBack={() => setStep('select-experiences')}
        />
      )}
    </div>
  );
}

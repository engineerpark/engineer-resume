'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Job, Experience, JobQuestion, CoverLetterAnswerResult } from '@/types/database';
import { JobCard } from '@/components/jobs/JobCard';
import { addJobQuestion, deleteJobQuestion, getJobQuestions } from '@/app/jobs/actions';
import { generateCoverLetterAnswer, qcDocumentAction } from '@/app/builder/actions';
import { QuestionCard } from './QuestionCard';
import { ExperienceSelectorPanel } from './ExperienceSelectorPanel';
import Link from 'next/link';

interface CoverLetterBuilderProps {
  jobs: Job[];
  experiences: Experience[];
  initialJobId?: string;
  initialQuestions: JobQuestion[];
}

type Step = 'select-job' | 'questions' | 'result';

interface QuestionAnswer {
  questionId: string;
  question: string;
  charLimit: number | null;
  selectedExpIds: Set<string>;
  answer: string;
  charCount: number;
  riskFlags: string[];
  generating: boolean;
  qcPass?: boolean;
}

export function CoverLetterBuilder({
  jobs,
  experiences,
  initialJobId,
  initialQuestions,
}: CoverLetterBuilderProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(initialJobId ? 'questions' : 'select-job');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(initialJobId || null);
  const [questions, setQuestions] = useState<JobQuestion[]>(initialQuestions);
  const [answers, setAnswers] = useState<Map<string, QuestionAnswer>>(
    new Map(
      initialQuestions.map((q) => [
        q.id,
        {
          questionId: q.id,
          question: q.question_title,
          charLimit: q.char_limit,
          selectedExpIds: new Set(),
          answer: '',
          charCount: 0,
          riskFlags: [],
          generating: false,
        },
      ])
    )
  );

  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(
    initialQuestions[0]?.id || null
  );
  const [showExpPanel, setShowExpPanel] = useState(false);

  // For adding new questions
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionLimit, setNewQuestionLimit] = useState<string>('');
  const [addingQuestion, setAddingQuestion] = useState(false);

  const selectedJob = useMemo(
    () => jobs.find((j) => j.id === selectedJobId),
    [jobs, selectedJobId]
  );

  const handleJobSelect = async (jobId: string) => {
    setSelectedJobId(jobId);

    // Load questions for this job
    try {
      const loadedQuestions = await getJobQuestions(jobId);
      setQuestions(loadedQuestions);
      setAnswers(
        new Map(
          loadedQuestions.map((q) => [
            q.id,
            {
              questionId: q.id,
              question: q.question_title,
              charLimit: q.char_limit,
              selectedExpIds: new Set(),
              answer: '',
              charCount: 0,
              riskFlags: [],
              generating: false,
            },
          ])
        )
      );
      setActiveQuestionId(loadedQuestions[0]?.id || null);
    } catch {
      setQuestions([]);
      setAnswers(new Map());
    }

    setStep('questions');
    router.push(`/builder/cover-letter?job=${jobId}`);
  };

  const handleAddQuestion = async () => {
    if (!selectedJobId || !newQuestionTitle.trim()) return;

    setAddingQuestion(true);
    const result = await addJobQuestion(
      selectedJobId,
      newQuestionTitle.trim(),
      newQuestionLimit ? parseInt(newQuestionLimit) : null
    );

    if (result.success) {
      // Reload questions
      const updated = await getJobQuestions(selectedJobId);
      setQuestions(updated);

      // Add to answers map
      const newQ = updated.find((q) => q.question_title === newQuestionTitle.trim());
      if (newQ) {
        setAnswers((prev) => {
          const next = new Map(prev);
          next.set(newQ.id, {
            questionId: newQ.id,
            question: newQ.question_title,
            charLimit: newQ.char_limit,
            selectedExpIds: new Set(),
            answer: '',
            charCount: 0,
            riskFlags: [],
            generating: false,
          });
          return next;
        });
        setActiveQuestionId(newQ.id);
      }

      setNewQuestionTitle('');
      setNewQuestionLimit('');
    }
    setAddingQuestion(false);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('이 문항을 삭제하시겠습니까?')) return;

    const result = await deleteJobQuestion(questionId);
    if (result.success) {
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
      setAnswers((prev) => {
        const next = new Map(prev);
        next.delete(questionId);
        return next;
      });
      if (activeQuestionId === questionId) {
        setActiveQuestionId(questions.find((q) => q.id !== questionId)?.id || null);
      }
    }
  };

  const toggleExperienceForQuestion = useCallback((questionId: string, expId: string) => {
    setAnswers((prev) => {
      const next = new Map(prev);
      const qa = next.get(questionId);
      if (qa) {
        const newSet = new Set(qa.selectedExpIds);
        if (newSet.has(expId)) {
          newSet.delete(expId);
        } else {
          newSet.add(expId);
        }
        next.set(questionId, { ...qa, selectedExpIds: newSet });
      }
      return next;
    });
  }, []);

  const handleGenerateAnswer = async (questionId: string) => {
    const qa = answers.get(questionId);
    if (!qa || qa.selectedExpIds.size === 0) return;

    setAnswers((prev) => {
      const next = new Map(prev);
      next.set(questionId, { ...qa, generating: true });
      return next;
    });

    const result = await generateCoverLetterAnswer(
      qa.question,
      Array.from(qa.selectedExpIds),
      qa.charLimit
    );

    if (result.success && result.result) {
      // Run QC
      const qc = await qcDocumentAction(result.result.answer, qa.charLimit || undefined);

      setAnswers((prev) => {
        const next = new Map(prev);
        next.set(questionId, {
          ...qa,
          answer: result.result!.answer,
          charCount: result.result!.char_count,
          riskFlags: result.result!.risk_flags,
          generating: false,
          qcPass: qc.result?.pass,
        });
        return next;
      });
    } else {
      setAnswers((prev) => {
        const next = new Map(prev);
        next.set(questionId, { ...qa, generating: false });
        return next;
      });
    }
  };

  const activeAnswer = activeQuestionId ? answers.get(activeQuestionId) : null;

  // Export all answers
  const exportAll = () => {
    let text = '';
    questions.forEach((q, idx) => {
      const ans = answers.get(q.id);
      text += `문항 ${idx + 1}: ${q.question_title}\n`;
      if (q.char_limit) text += `(${q.char_limit}자 제한)\n`;
      text += '\n';
      text += ans?.answer || '(답변 없음)';
      text += '\n\n---\n\n';
    });

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cover-letter.txt';
    a.click();
    URL.revokeObjectURL(url);
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
      {/* Step 1: Select Job */}
      {step === 'select-job' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            자기소개서를 작성할 공고를 선택하세요
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

      {/* Step 2: Questions */}
      {step === 'questions' && selectedJob && (
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">{selectedJob.company}</p>
              <p className="font-semibold">{selectedJob.title}</p>
              <button
                onClick={() => setStep('select-job')}
                className="text-sm text-primary-600 hover:underline"
              >
                공고 변경
              </button>
            </div>
            <button onClick={exportAll} className="btn-outline text-sm">
              전체 내보내기
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Question list */}
            <div className="lg:col-span-2 space-y-4">
              {questions.length === 0 ? (
                <div className="card text-center py-8">
                  <p className="text-gray-600 mb-2">등록된 문항이 없습니다</p>
                  <p className="text-sm text-gray-500">
                    아래에서 문항을 추가하세요
                  </p>
                </div>
              ) : (
                questions.map((q) => {
                  const qa = answers.get(q.id);
                  return (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      answer={qa}
                      experiences={experiences}
                      isActive={activeQuestionId === q.id}
                      onSelect={() => setActiveQuestionId(q.id)}
                      onToggleExperience={(expId) => toggleExperienceForQuestion(q.id, expId)}
                      onGenerate={() => handleGenerateAnswer(q.id)}
                      onDelete={() => handleDeleteQuestion(q.id)}
                      onManageExperiences={() => {
                        setActiveQuestionId(q.id);
                        setShowExpPanel(true);
                      }}
                    />
                  );
                })
              )}

              {/* Add question form */}
              <div className="card">
                <h3 className="font-medium text-gray-900 mb-3">문항 추가</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newQuestionTitle}
                    onChange={(e) => setNewQuestionTitle(e.target.value)}
                    className="input"
                    placeholder="문항 내용을 입력하세요"
                  />
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={newQuestionLimit}
                      onChange={(e) => setNewQuestionLimit(e.target.value)}
                      className="input w-32"
                      placeholder="글자수"
                    />
                    <button
                      onClick={handleAddQuestion}
                      disabled={addingQuestion || !newQuestionTitle.trim()}
                      className="btn-primary"
                    >
                      {addingQuestion ? '추가 중...' : '추가'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Experience panel toggle */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <button
                  onClick={() => setShowExpPanel(!showExpPanel)}
                  className="btn-secondary w-full mb-4"
                >
                  경험 선택 패널 {showExpPanel ? '닫기' : '열기'}
                </button>

                {showExpPanel && activeQuestionId && activeAnswer && (
                  <ExperienceSelectorPanel
                    experiences={experiences}
                    selectedIds={activeAnswer.selectedExpIds}
                    onToggle={(expId) => toggleExperienceForQuestion(activeQuestionId, expId)}
                    questionTitle={activeAnswer.question}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

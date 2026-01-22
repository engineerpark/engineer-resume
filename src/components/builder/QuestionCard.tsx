'use client';

import type { JobQuestion, Experience } from '@/types/database';
import { useState } from 'react';

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

interface QuestionCardProps {
  question: JobQuestion;
  answer?: QuestionAnswer;
  experiences: Experience[];
  isActive: boolean;
  onSelect: () => void;
  onToggleExperience: (expId: string) => void;
  onGenerate: () => void;
  onDelete: () => void;
  onManageExperiences: () => void;
}

export function QuestionCard({
  question,
  answer,
  experiences,
  isActive,
  onSelect,
  onToggleExperience,
  onGenerate,
  onDelete,
  onManageExperiences,
}: QuestionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedExps = experiences.filter(
    (e) => answer?.selectedExpIds.has(e.id)
  );

  const handleCopy = async () => {
    if (answer?.answer) {
      await navigator.clipboard.writeText(answer.answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isOverLimit = answer?.charLimit
    ? answer.charCount > answer.charLimit
    : false;

  return (
    <div
      className={`card border-2 transition-colors ${
        isActive ? 'border-primary-500' : 'border-transparent'
      }`}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
              문항 {question.order_idx + 1}
            </span>
            {question.char_limit && (
              <span className="text-xs text-gray-500">
                ({question.char_limit}자)
              </span>
            )}
            {answer?.qcPass !== undefined && (
              <span
                className={`text-xs px-2 py-0.5 rounded ${
                  answer.qcPass
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {answer.qcPass ? 'PASS' : 'FAIL'}
              </span>
            )}
          </div>
          <h3 className="font-medium text-gray-900 mt-1">
            {question.question_title}
          </h3>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-gray-400 hover:text-red-500 p-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Selected experiences chips - always visible */}
      <div className="mt-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500">선택된 경험:</span>
          {selectedExps.length === 0 ? (
            <span className="text-xs text-gray-400">없음</span>
          ) : (
            selectedExps.map((exp) => (
              <span
                key={exp.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-xs"
              >
                {exp.project_name.length > 15
                  ? exp.project_name.slice(0, 15) + '...'
                  : exp.project_name}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleExperience(exp.id);
                  }}
                  className="hover:text-primary-900"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            ))
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onManageExperiences();
            }}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs hover:bg-gray-200"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            경험 추가
          </button>
        </div>
      </div>

      {/* Generate button */}
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onGenerate();
          }}
          disabled={answer?.generating || selectedExps.length === 0}
          className="btn-primary text-sm"
        >
          {answer?.generating ? '생성 중...' : '이 문항 채우기'}
        </button>
        {answer?.answer && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="text-sm text-primary-600 hover:underline"
          >
            {expanded ? '답변 접기' : '답변 보기'}
          </button>
        )}
      </div>

      {/* Answer display */}
      {expanded && answer?.answer && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-sm ${isOverLimit ? 'text-red-600' : 'text-gray-600'}`}
            >
              {answer.charCount}자
              {answer.charLimit && ` / ${answer.charLimit}자`}
              {isOverLimit && ` (${answer.charCount - answer.charLimit!}자 초과)`}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
              className="text-sm text-primary-600 hover:underline"
            >
              {copied ? '복사됨!' : '복사'}
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 max-h-48 overflow-y-auto">
            <p className="text-sm text-gray-800 whitespace-pre-wrap">
              {answer.answer}
            </p>
          </div>
          {answer.riskFlags.length > 0 && (
            <div className="mt-2 text-xs text-yellow-700">
              {answer.riskFlags.map((flag, i) => (
                <p key={i}>{flag}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

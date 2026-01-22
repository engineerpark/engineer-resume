'use client';

import type { Job } from '@/types/database';
import { deleteJob } from '@/app/jobs/actions';
import { useState } from 'react';
import Link from 'next/link';

interface JobCardProps {
  job: Job;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

const sourceLabels: Record<string, string> = {
  saved: '저장됨',
  site: 'Site',
  url: 'URL',
  paste: '직접입력',
};

export function JobCard({ job, selectable = false, selected = false, onSelect }: JobCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleDelete = async () => {
    if (!confirm('이 공고를 삭제하시겠습니까?')) return;
    setDeleting(true);
    const result = await deleteJob(job.id);
    if (!result.success) {
      alert(result.error || '삭제 실패');
      setDeleting(false);
    }
  };

  const structured = job.structured;

  return (
    <div
      className={`card ${selectable && selected ? 'ring-2 ring-primary-500' : ''} ${
        selectable ? 'cursor-pointer' : ''
      }`}
      onClick={selectable ? onSelect : undefined}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
              {sourceLabels[job.source_type]}
            </span>
            <span className="font-semibold text-gray-900">{job.company}</span>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mt-1">{job.title}</h3>
        </div>
        {selectable && (
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
              selected
                ? 'bg-primary-600 border-primary-600 text-white'
                : 'border-gray-300'
            }`}
          >
            {selected && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Requirements preview */}
      {structured && (
        <div className="mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="text-sm text-primary-600 hover:underline"
          >
            {expanded ? '접기' : '요구사항 보기'}
          </button>

          {expanded && (
            <div className="mt-3 space-y-3 text-sm">
              {structured.requirements.must.length > 0 && (
                <div>
                  <p className="font-medium text-gray-700 mb-1">필수 요건</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-0.5">
                    {structured.requirements.must.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
              {structured.requirements.preferred.length > 0 && (
                <div>
                  <p className="font-medium text-gray-700 mb-1">우대 사항</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-0.5">
                    {structured.requirements.preferred.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
              {structured.questions && structured.questions.length > 0 && (
                <div>
                  <p className="font-medium text-gray-700 mb-1">자기소개서 문항</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-0.5">
                    {structured.questions.map((q, i) => (
                      <li key={i}>
                        {q.title}
                        {q.char_limit && (
                          <span className="text-gray-400 ml-1">({q.char_limit}자)</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      {!selectable && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            {new Date(job.created_at).toLocaleDateString('ko-KR')}
          </span>
          <div className="flex gap-3">
            <Link
              href={`/builder/career-report?job=${job.id}`}
              className="text-sm text-primary-600 hover:underline"
            >
              경력기술서
            </Link>
            <Link
              href={`/builder/cover-letter?job=${job.id}`}
              className="text-sm text-primary-600 hover:underline"
            >
              자기소개서
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              삭제
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

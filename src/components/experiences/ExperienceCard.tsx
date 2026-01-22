'use client';

import type { Experience } from '@/types/database';
import Link from 'next/link';
import { deleteExperience } from '@/app/experiences/actions';
import { useState } from 'react';

interface ExperienceCardProps {
  experience: Experience;
  selectable?: boolean;
  selected?: boolean;
  onToggle?: (id: string) => void;
  compact?: boolean;
}

const roleLevelLabels: Record<string, string> = {
  lead: 'Lead/PM',
  partial: '담당',
  operate: '운영',
  collab: '협업',
};

const riskLevelEmoji: Record<string, string> = {
  green: '🟢',
  yellow: '🟡',
  red: '🔴',
};

export function ExperienceCard({
  experience,
  selectable = false,
  selected = false,
  onToggle,
  compact = false,
}: ExperienceCardProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('이 경험을 삭제하시겠습니까?')) return;
    setDeleting(true);
    const result = await deleteExperience(experience.id);
    if (!result.success) {
      alert(result.error || '삭제 실패');
      setDeleting(false);
    }
  };

  const formatPeriod = () => {
    const start = experience.start_month;
    const end = experience.ongoing ? '현재' : experience.end_month || '현재';
    return `${start} ~ ${end}`;
  };

  const cardContent = (
    <>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900">
              {experience.company_visibility === 'private' ? '(비공개)' : experience.company}
            </span>
            <span className="text-sm text-gray-500">{formatPeriod()}</span>
            <span className="text-sm">{riskLevelEmoji[experience.risk_level]}</span>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mt-1">
            {experience.project_name}
          </h3>
        </div>
        {selectable && (
          <button
            onClick={() => onToggle?.(experience.id)}
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
              selected
                ? 'bg-primary-600 border-primary-600 text-white'
                : 'border-gray-300 hover:border-primary-400'
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
          </button>
        )}
      </div>

      {/* One-liner */}
      <p className="text-gray-600 text-sm mt-2">{experience.one_liner}</p>

      {/* Tags */}
      {experience.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {experience.tags.map((tag) => (
            <span key={tag} className="chip chip-blue">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Keywords */}
      {!compact && experience.keywords.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {experience.keywords.slice(0, 5).map((keyword) => (
            <span key={keyword} className="chip chip-gray">
              {keyword}
            </span>
          ))}
          {experience.keywords.length > 5 && (
            <span className="chip chip-gray">+{experience.keywords.length - 5}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <span
          className={`text-xs font-medium px-2 py-1 rounded ${
            experience.role_level === 'lead'
              ? 'bg-purple-100 text-purple-700'
              : experience.role_level === 'partial'
              ? 'bg-blue-100 text-blue-700'
              : experience.role_level === 'operate'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {roleLevelLabels[experience.role_level]}
        </span>

        {!selectable && (
          <div className="flex gap-2">
            <Link
              href={`/experiences/${experience.id}/edit`}
              className="text-sm text-gray-600 hover:text-primary-600"
            >
              수정
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              삭제
            </button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div
      className={`card ${selectable && selected ? 'ring-2 ring-primary-500' : ''} ${
        selectable ? 'cursor-pointer' : ''
      }`}
      onClick={selectable ? () => onToggle?.(experience.id) : undefined}
    >
      {cardContent}
    </div>
  );
}

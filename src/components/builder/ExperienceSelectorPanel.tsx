'use client';

import type { Experience } from '@/types/database';

interface ExperienceSelectorPanelProps {
  experiences: Experience[];
  selectedIds: Set<string>;
  onToggle: (expId: string) => void;
  questionTitle: string;
}

const riskEmoji: Record<string, string> = {
  green: '🟢',
  yellow: '🟡',
  red: '🔴',
};

const roleLevelLabels: Record<string, string> = {
  lead: 'Lead',
  partial: '담당',
  operate: '운영',
  collab: '협업',
};

export function ExperienceSelectorPanel({
  experiences,
  selectedIds,
  onToggle,
  questionTitle,
}: ExperienceSelectorPanelProps) {
  return (
    <div className="card max-h-[70vh] overflow-y-auto">
      <div className="sticky top-0 bg-white pb-3 border-b border-gray-200 mb-3">
        <h3 className="font-semibold text-gray-900 text-sm">경험 선택</h3>
        <p className="text-xs text-gray-500 mt-1 truncate" title={questionTitle}>
          {questionTitle}
        </p>
        <p className="text-xs text-primary-600 mt-1">
          {selectedIds.size}개 선택됨
        </p>
      </div>

      <div className="space-y-2">
        {experiences.map((exp) => {
          const isSelected = selectedIds.has(exp.id);
          return (
            <button
              key={exp.id}
              onClick={() => onToggle(exp.id)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{exp.company}</span>
                    <span className="text-xs">{riskEmoji[exp.risk_level]}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {exp.project_name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {exp.start_month} ~ {exp.ongoing ? '현재' : exp.end_month || '현재'}
                  </p>
                </div>
                <div
                  className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center ${
                    isSelected
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'border-gray-300'
                  }`}
                >
                  {isSelected && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>

              {/* Tags preview */}
              {exp.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {exp.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Keywords preview */}
              {exp.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {exp.keywords.slice(0, 3).map((kw) => (
                    <span
                      key={kw}
                      className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}

              {/* Role level */}
              <div className="mt-2">
                <span
                  className={`text-xs px-1.5 py-0.5 rounded ${
                    exp.role_level === 'lead'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {roleLevelLabels[exp.role_level]}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

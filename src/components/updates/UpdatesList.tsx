'use client';

interface Update {
  id: string;
  date: string;
  version: string;
  title: string;
  description: string;
  type: 'feature' | 'improvement' | 'bugfix' | 'release' | 'beta';
  details: string[];
}

interface UpdatesListProps {
  updates: Update[];
}

const typeStyles = {
  feature: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    label: '새 기능',
  },
  improvement: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    label: '개선',
  },
  bugfix: {
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    label: '버그 수정',
  },
  release: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    label: '출시',
  },
  beta: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    label: '베타',
  },
};

export function UpdatesList({ updates }: UpdatesListProps) {
  return (
    <div className="space-y-6">
      {updates.map((update, index) => {
        const style = typeStyles[update.type];
        const isLatest = index === 0;

        return (
          <div
            key={update.id}
            className={`bg-white rounded-xl border ${
              isLatest ? 'border-primary-200 ring-2 ring-primary-100' : 'border-gray-200'
            } p-6`}
          >
            {/* Header */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {isLatest && (
                <span className="px-2.5 py-1 text-xs font-medium bg-primary-600 text-white rounded-full">
                  NEW
                </span>
              )}
              <span className={`px-2.5 py-1 text-xs font-medium ${style.bg} ${style.text} rounded-full`}>
                {style.label}
              </span>
              <span className="text-sm font-mono text-gray-500">{update.version}</span>
              <span className="text-sm text-gray-400">{update.date}</span>
            </div>

            {/* Title & Description */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {update.title}
            </h3>
            <p className="text-gray-600 mb-4">{update.description}</p>

            {/* Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">변경사항</h4>
              <ul className="space-y-1.5">
                {update.details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 mt-0.5 text-primary-500 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}

'use client';

import type { SiteJob } from '@/lib/data/siteJobs';
import { saveSiteJob } from '@/app/jobs/actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SiteJobCardProps {
  job: SiteJob;
  isSaved: boolean;
}

export function SiteJobCard({ job, isSaved }: SiteJobCardProps) {
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setSaving(true);
    const result = await saveSiteJob(job.id);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || '저장 실패');
    }
    setSaving(false);
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{job.company}</span>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mt-1">{job.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{job.summary}</p>
        </div>
        {isSaved ? (
          <span className="flex-shrink-0 text-sm text-green-600 font-medium px-3 py-1 bg-green-50 rounded">
            저장됨
          </span>
        ) : (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-shrink-0 btn-primary text-sm"
          >
            {saving ? '저장 중...' : '저장하기'}
          </button>
        )}
      </div>

      {/* Preview */}
      <div className="mt-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-primary-600 hover:underline"
        >
          {expanded ? '접기' : '상세보기'}
        </button>

        {expanded && (
          <div className="mt-3 space-y-3 text-sm">
            {job.structured.requirements.must.length > 0 && (
              <div>
                <p className="font-medium text-gray-700 mb-1">필수 요건</p>
                <ul className="list-disc list-inside text-gray-600 space-y-0.5">
                  {job.structured.requirements.must.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
            {job.structured.requirements.preferred.length > 0 && (
              <div>
                <p className="font-medium text-gray-700 mb-1">우대 사항</p>
                <ul className="list-disc list-inside text-gray-600 space-y-0.5">
                  {job.structured.requirements.preferred.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
            {job.structured.responsibilities.length > 0 && (
              <div>
                <p className="font-medium text-gray-700 mb-1">담당 업무</p>
                <ul className="list-disc list-inside text-gray-600 space-y-0.5">
                  {job.structured.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
            {job.structured.questions && job.structured.questions.length > 0 && (
              <div>
                <p className="font-medium text-gray-700 mb-1">자기소개서 문항</p>
                <ul className="list-disc list-inside text-gray-600 space-y-0.5">
                  {job.structured.questions.map((q, i) => (
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
    </div>
  );
}

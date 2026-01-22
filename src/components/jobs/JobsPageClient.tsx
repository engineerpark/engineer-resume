'use client';

import { useState } from 'react';
import type { Job } from '@/types/database';
import type { SiteJob } from '@/lib/data/siteJobs';
import { JobCard } from './JobCard';
import { SiteJobCard } from './SiteJobCard';
import { JobAddForm } from './JobAddForm';

type Tab = 'saved' | 'site' | 'add';

interface JobsPageClientProps {
  savedJobs: Job[];
  siteJobs: SiteJob[];
}

export function JobsPageClient({ savedJobs, siteJobs }: JobsPageClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>('saved');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'saved', label: `관심공고 (${savedJobs.length})` },
    { id: 'site', label: 'Site Jobs' },
    { id: 'add', label: 'URL/직접입력' },
  ];

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab.id
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'saved' && (
        <div>
          {savedJobs.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600 mb-4">저장된 공고가 없습니다</p>
              <button
                onClick={() => setActiveTab('site')}
                className="btn-primary"
              >
                Site Jobs 둘러보기
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {savedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'site' && (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            샘플 채용공고입니다. 저장하기를 눌러 관심공고에 추가하세요.
          </p>
          <div className="space-y-4">
            {siteJobs.map((job) => (
              <SiteJobCard
                key={job.id}
                job={job}
                isSaved={savedJobs.some(
                  (j) => j.source_type === 'site' && j.title === job.title && j.company === job.company
                )}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'add' && <JobAddForm />}
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import type { Job } from '@/types/database';
import type { SiteJob } from '@/lib/data/siteJobs';
import { JobCard } from './JobCard';
import { SiteJobCard } from './SiteJobCard';
import { JobAddForm } from './JobAddForm';
import { JobFilters, JobFilterState } from './JobFilters';

type Tab = 'saved' | 'site' | 'add';

interface JobsPageClientProps {
  savedJobs: Job[];
  siteJobs: SiteJob[];
}

export function JobsPageClient({ savedJobs, siteJobs }: JobsPageClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>('saved');
  const [filters, setFilters] = useState<JobFilterState>({
    status: 'all',
    industry: '',
    keyword: '',
    sortBy: 'latest',
  });

  // Combine all jobs for filtering
  const allJobs = useMemo(() => {
    return [...savedJobs, ...siteJobs.map(sj => ({
      id: sj.id,
      title: sj.title,
      company: sj.company,
      created_at: new Date().toISOString(),
      source_type: 'site' as const,
      raw_text: sj.raw_text,
      structured: sj.structured,
      user_id: '',
      url: null,
    }))];
  }, [savedJobs, siteJobs]);

  // Filter jobs
  const filteredSavedJobs = useMemo(() => {
    let result = [...savedJobs];

    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      result = result.filter(
        job => job.title.toLowerCase().includes(keyword) ||
               job.company.toLowerCase().includes(keyword)
      );
    }

    // Sort
    if (filters.sortBy === 'latest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (filters.sortBy === 'company') {
      result.sort((a, b) => a.company.localeCompare(b.company));
    }

    return result;
  }, [savedJobs, filters]);

  const filteredSiteJobs = useMemo(() => {
    let result = [...siteJobs];

    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      result = result.filter(
        job => job.title.toLowerCase().includes(keyword) ||
               job.company.toLowerCase().includes(keyword)
      );
    }

    if (filters.industry) {
      result = result.filter(job =>
        job.title.includes(filters.industry) ||
        job.company.includes(filters.industry) ||
        job.raw_text.includes(filters.industry)
      );
    }

    return result;
  }, [siteJobs, filters]);

  // Calculate stats
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return {
      total: allJobs.length,
      active: allJobs.length, // All are active in demo
      todayAdded: allJobs.filter(j => j.created_at?.startsWith(today)).length,
    };
  }, [allJobs]);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'saved', label: `관심공고 (${savedJobs.length})` },
    { id: 'site', label: `사이트 공고 (${siteJobs.length})` },
    { id: 'add', label: '공고 추가' },
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <JobFilters
        filters={filters}
        onFilterChange={setFilters}
        stats={stats}
      />

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-4">
          {activeTab === 'saved' && (
            <div>
              {filteredSavedJobs.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500 mb-4">
                    {filters.keyword ? '검색 결과가 없습니다' : '저장된 공고가 없습니다'}
                  </p>
                  <button
                    onClick={() => setActiveTab('site')}
                    className="text-primary-600 hover:underline"
                  >
                    사이트 공고 둘러보기
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSavedJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'site' && (
            <div>
              {filteredSiteJobs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">검색 결과가 없습니다</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSiteJobs.map((job) => (
                    <SiteJobCard
                      key={job.id}
                      job={job}
                      isSaved={savedJobs.some(
                        (j) => j.source_type === 'site' && j.title === job.title && j.company === job.company
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'add' && <JobAddForm />}
        </div>
      </div>
    </div>
  );
}

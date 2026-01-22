'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Document {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  docType: 'career_report' | 'cover_letter';
  title: string;
  status: 'draft' | 'submitted' | 'rejected';
  submittedAt: string | null;
  charCount: number;
}

interface DocumentsListProps {
  documents: Document[];
}

export function DocumentsList({ documents }: DocumentsListProps) {
  const [filter, setFilter] = useState<'all' | 'draft' | 'submitted'>('all');
  const [selectedCompany, setSelectedCompany] = useState<string>('');

  const companies = Array.from(new Set(documents.map(d => d.company)));

  const filteredDocs = documents.filter(doc => {
    if (filter !== 'all' && doc.status !== filter) return false;
    if (selectedCompany && doc.company !== selectedCompany) return false;
    return true;
  });

  // Group by company and job
  const grouped = filteredDocs.reduce((acc, doc) => {
    const key = `${doc.company}-${doc.jobId}`;
    if (!acc[key]) {
      acc[key] = {
        company: doc.company,
        jobId: doc.jobId,
        jobTitle: doc.jobTitle,
        documents: [],
      };
    }
    acc[key].documents.push(doc);
    return acc;
  }, {} as Record<string, { company: string; jobId: string; jobTitle: string; documents: Document[] }>);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden">
          {[
            { value: 'all', label: '전체' },
            { value: 'submitted', label: '제출완료' },
            { value: 'draft', label: '작성중' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value as typeof filter)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                filter === option.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <select
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
          className="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white"
        >
          <option value="">전체 회사</option>
          {companies.map(company => (
            <option key={company} value={company}>{company}</option>
          ))}
        </select>
      </div>

      {/* Document Groups */}
      {Object.values(grouped).length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500">작성된 서류가 없습니다</p>
          <Link href="/builder/career-report" className="inline-block mt-4 text-primary-600 hover:underline">
            서류 작성하러 가기
          </Link>
        </div>
      ) : (
        Object.values(grouped).map((group) => (
          <div
            key={`${group.company}-${group.jobId}`}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            {/* Group Header */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-gray-900">{group.company}</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-gray-600">{group.jobTitle}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {group.documents.length}개 서류
                </span>
              </div>
            </div>

            {/* Documents */}
            <div className="divide-y divide-gray-100">
              {group.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      doc.docType === 'career_report' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      <svg
                        className={`w-5 h-5 ${
                          doc.docType === 'career_report' ? 'text-blue-600' : 'text-green-600'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>

                    {/* Info */}
                    <div>
                      <p className="font-medium text-gray-900">{doc.title}</p>
                      <p className="text-sm text-gray-500">
                        {doc.charCount.toLocaleString()}자
                        {doc.submittedAt && ` · ${formatDate(doc.submittedAt)}`}
                      </p>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      doc.status === 'submitted'
                        ? 'bg-green-100 text-green-700'
                        : doc.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {doc.status === 'submitted' ? '제출완료' : doc.status === 'draft' ? '작성중' : '반려'}
                    </span>

                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>

                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

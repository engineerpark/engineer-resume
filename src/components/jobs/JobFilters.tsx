'use client';

import { useState } from 'react';

export interface JobFilterState {
  status: 'all' | 'active' | 'closed';
  industry: string;
  keyword: string;
  sortBy: 'latest' | 'deadline' | 'company';
}

interface JobFiltersProps {
  filters: JobFilterState;
  onFilterChange: (filters: JobFilterState) => void;
  stats: {
    total: number;
    active: number;
    todayAdded: number;
  };
}

const industries = [
  '전체',
  '반도체',
  '자동차',
  '화학/에너지',
  '전기/전자',
  '기계',
  '건설/플랜트',
  'IT/소프트웨어',
];

export function JobFilters({ filters, onFilterChange, stats }: JobFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (key: keyof JobFilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
      {/* Stats Bar */}
      <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">전체</span>
          <span className="text-lg font-bold text-gray-900">{stats.total}건</span>
        </div>
        <div className="h-4 w-px bg-gray-200" />
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-sm text-gray-500">접수중</span>
          <span className="text-lg font-bold text-green-600">{stats.active}건</span>
        </div>
        <div className="h-4 w-px bg-gray-200" />
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full" />
          <span className="text-sm text-gray-500">오늘등록</span>
          <span className="text-lg font-bold text-blue-600">{stats.todayAdded}건</span>
        </div>
      </div>

      {/* Main Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
        <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden">
          {[
            { value: 'all', label: '전체' },
            { value: 'active', label: '접수중' },
            { value: 'closed', label: '마감' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleChange('status', option.value)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                filters.status === option.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Industry Filter */}
        <select
          value={filters.industry}
          onChange={(e) => handleChange('industry', e.target.value)}
          className="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {industries.map((ind) => (
            <option key={ind} value={ind === '전체' ? '' : ind}>
              {ind}
            </option>
          ))}
        </select>

        {/* Keyword Search */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <input
              type="text"
              value={filters.keyword}
              onChange={(e) => handleChange('keyword', e.target.value)}
              placeholder="회사명, 포지션 검색..."
              className="w-full px-4 py-2 pl-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Sort */}
        <select
          value={filters.sortBy}
          onChange={(e) => handleChange('sortBy', e.target.value as JobFilterState['sortBy'])}
          className="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="latest">최신순</option>
          <option value="deadline">마감임박순</option>
          <option value="company">회사명순</option>
        </select>

        {/* Advanced toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          상세필터
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">경력</label>
            <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg">
              <option>전체</option>
              <option>신입</option>
              <option>경력 3년 이상</option>
              <option>경력 5년 이상</option>
              <option>경력 10년 이상</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">지역</label>
            <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg">
              <option>전체</option>
              <option>서울</option>
              <option>경기</option>
              <option>인천</option>
              <option>충청</option>
              <option>경상</option>
              <option>전라</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">고용형태</label>
            <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg">
              <option>전체</option>
              <option>정규직</option>
              <option>계약직</option>
              <option>인턴</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">학력</label>
            <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg">
              <option>전체</option>
              <option>학사</option>
              <option>석사</option>
              <option>박사</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

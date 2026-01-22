'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface SidebarCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  items: {
    href: string;
    label: string;
    badge?: number;
  }[];
}

const categories: SidebarCategory[] = [
  {
    id: 'jobs',
    label: '채용공고',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    items: [
      { href: '/jobs', label: '전체 공고' },
      { href: '/jobs/saved', label: '저장한 공고' },
      { href: '/jobs/site', label: '사이트 공고' },
    ],
  },
  {
    id: 'experiences',
    label: '경험관리',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    items: [
      { href: '/experiences', label: '경험노트' },
      { href: '/experiences/new', label: '경험 추가' },
    ],
  },
  {
    id: 'builder',
    label: '서류작성',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    items: [
      { href: '/builder/career-report', label: '경력기술서' },
      { href: '/builder/cover-letter', label: '자기소개서' },
    ],
  },
  {
    id: 'documents',
    label: '제출서류',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
    items: [
      { href: '/documents', label: '제출 현황' },
      { href: '/documents/history', label: '제출 이력' },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['jobs', 'experiences', 'builder', 'documents'])
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <Link href="/" className="text-xl font-bold text-primary-600">
            공대 전화기
          </Link>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-4rem)]">
          {/* Home link */}
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              pathname === '/'
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="font-medium">홈</span>
          </Link>

          {/* Categories */}
          {categories.map((category) => (
            <div key={category.id} className="space-y-1">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  {category.icon}
                  <span className="font-medium">{category.label}</span>
                </div>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    expandedCategories.has(category.id) ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {expandedCategories.has(category.id) && (
                <div className="ml-8 space-y-1">
                  {category.items.map((item) => {
                    const isActive = pathname === item.href ||
                      (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                          isActive
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <span>{item.label}</span>
                        {item.badge !== undefined && (
                          <span className="px-2 py-0.5 text-xs bg-primary-100 text-primary-700 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {/* Update News Link */}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <Link
              href="/updates"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                pathname === '/updates'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="font-medium">업데이트 소식</span>
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}

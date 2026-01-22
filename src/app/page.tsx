import Link from 'next/link';
import { mockExperiences } from '@/lib/data/mockExperiences';
import { mockJobs } from '@/lib/data/mockJobs';
import { siteJobs } from '@/lib/data/siteJobs';

export default async function HomePage() {
  // Stats
  const expCount = mockExperiences.length;
  const jobCount = mockJobs.length + siteJobs.length;
  const docCount = 5; // Mock

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">공대 전화기</h1>
        <p className="text-primary-100 mb-4">
          전기/전자/화학/기계 공학 경력직을 위한 경력기술서 & 자기소개서 생성기
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/builder/career-report"
            className="px-4 py-2 bg-white text-primary-700 rounded-lg font-medium hover:bg-primary-50 transition-colors"
          >
            경력기술서 작성
          </Link>
          <Link
            href="/builder/cover-letter"
            className="px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-400 transition-colors"
          >
            자기소개서 작성
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">내 경험</p>
              <p className="text-xl font-bold text-gray-900">{expCount}개</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">채용공고</p>
              <p className="text-xl font-bold text-gray-900">{jobCount}개</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">제출서류</p>
              <p className="text-xl font-bold text-gray-900">{docCount}건</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">AI 생성</p>
              <p className="text-xl font-bold text-gray-900">GPT-4</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/experiences"
          className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary-300 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">경험노트</h3>
          <p className="text-sm text-gray-500">프로젝트 경험을 정리하고 태그/키워드 추출</p>
        </Link>

        <Link
          href="/jobs"
          className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary-300 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">채용공고</h3>
          <p className="text-sm text-gray-500">공고 저장 및 요구사항 분석</p>
        </Link>

        <Link
          href="/builder/career-report"
          className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary-300 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">경력기술서</h3>
          <p className="text-sm text-gray-500">공고에 맞는 경력기술서 생성</p>
        </Link>

        <Link
          href="/builder/cover-letter"
          className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary-300 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-orange-200 transition-colors">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">자기소개서</h3>
          <p className="text-sm text-gray-500">문항별 AI 답변 생성</p>
        </Link>
      </div>

      {/* Recent Updates */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">최근 업데이트</h2>
          <Link href="/updates" className="text-sm text-primary-600 hover:underline">
            전체보기
          </Link>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">NEW</span>
            <div>
              <p className="font-medium text-gray-900 text-sm">LangChain AI 연동</p>
              <p className="text-xs text-gray-500">GPT-4를 활용한 자기소개서 AI 생성 기능 추가</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">개선</span>
            <div>
              <p className="font-medium text-gray-900 text-sm">UI/UX 전면 개편</p>
              <p className="text-xs text-gray-500">사이드바 네비게이션, 필터 시스템, 통계 대시보드</p>
            </div>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">사용 방법</h2>
        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              1
            </div>
            <div>
              <p className="font-medium text-gray-900">경험노트 작성</p>
              <p className="text-sm text-gray-500">프로젝트 경험을 입력하면 AI가 자동으로 태그와 키워드를 추출합니다.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              2
            </div>
            <div>
              <p className="font-medium text-gray-900">채용공고 등록</p>
              <p className="text-sm text-gray-500">지원할 채용공고를 URL 또는 텍스트로 등록하면 요구사항이 자동 분석됩니다.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              3
            </div>
            <div>
              <p className="font-medium text-gray-900">서류 생성</p>
              <p className="text-sm text-gray-500">공고를 선택하고 관련 경험을 선택하면 AI가 맞춤형 서류를 생성합니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

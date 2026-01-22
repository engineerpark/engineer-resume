import Link from 'next/link';
import { getUser } from '@/lib/supabase/server';

export default async function HomePage() {
  const user = await getUser();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          공대 전화기
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          전기/전자/화학/기계 공학 경력직을 위한
        </p>
        <p className="text-xl text-gray-600 mb-8">
          경력기술서 & 자기소개서 생성기
        </p>

        {user ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <Link href="/experiences" className="card hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  경험노트
                </h2>
                <p className="text-gray-600 text-sm">
                  프로젝트 경험을 정리하고 태그/키워드를 추출하세요
                </p>
              </Link>

              <Link href="/jobs" className="card hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  공고관리
                </h2>
                <p className="text-gray-600 text-sm">
                  채용공고를 저장하고 요구사항을 분석하세요
                </p>
              </Link>

              <Link href="/builder/career-report" className="card hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  경력기술서 만들기
                </h2>
                <p className="text-gray-600 text-sm">
                  공고에 맞는 경력기술서를 생성하세요
                </p>
              </Link>

              <Link href="/builder/cover-letter" className="card hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  자기소개서 만들기
                </h2>
                <p className="text-gray-600 text-sm">
                  문항별로 경험을 선택해 답변을 생성하세요
                </p>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-gray-600">
              서비스를 이용하려면 로그인이 필요합니다
            </p>
            <Link href="/login" className="btn-primary inline-block">
              시작하기
            </Link>
          </div>
        )}
      </div>

      <div className="mt-12 border-t border-gray-200 pt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">사용 방법</h2>
        <div className="space-y-4 text-sm text-gray-600">
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-medium">1</span>
            <p><strong>경험노트</strong>에서 프로젝트 경험을 입력하면 자동으로 태그와 키워드가 추출됩니다.</p>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-medium">2</span>
            <p><strong>공고관리</strong>에서 지원할 채용공고를 저장하거나 URL/텍스트로 추가합니다.</p>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-medium">3</span>
            <p><strong>경력기술서/자기소개서</strong> 빌더에서 공고를 선택하고, 관련 경험을 선택해 문서를 생성합니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

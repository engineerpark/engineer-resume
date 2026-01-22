import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-gray-600 mb-6">페이지를 찾을 수 없습니다</p>
      <Link href="/" className="btn-primary">
        홈으로 돌아가기
      </Link>
    </div>
  );
}

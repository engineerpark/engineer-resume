'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">오류가 발생했습니다</h1>
      <p className="text-gray-600 mb-6">
        {error.message || '알 수 없는 오류가 발생했습니다'}
      </p>
      <button onClick={reset} className="btn-primary">
        다시 시도
      </button>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const supabase = createClient();

  const handleSocialLogin = async (provider: 'google' | 'kakao' | 'github') => {
    setLoading(provider);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
        },
      });
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다');
      setLoading(null);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          로그인
        </h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          소셜 계정으로 간편하게 시작하세요
        </p>

        <div className="space-y-3">
          {/* Google Login */}
          <button
            onClick={() => handleSocialLogin('google')}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-gray-700 font-medium">
              {loading === 'google' ? '로그인 중...' : 'Google로 계속하기'}
            </span>
          </button>

          {/* Kakao Login */}
          <button
            onClick={() => handleSocialLogin('kakao')}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#FEE500] rounded-lg hover:bg-[#FDD800] transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#000000">
              <path d="M12 3C6.48 3 2 6.48 2 10.5c0 2.55 1.64 4.8 4.12 6.12-.18.65-.65 2.35-.75 2.73-.12.47.17.47.36.34.15-.1 2.37-1.57 3.36-2.21.62.1 1.26.15 1.91.15 5.52 0 10-3.48 10-7.78S17.52 3 12 3z" />
            </svg>
            <span className="text-gray-900 font-medium">
              {loading === 'kakao' ? '로그인 중...' : '카카오로 계속하기'}
            </span>
          </button>

          {/* GitHub Login */}
          <button
            onClick={() => handleSocialLogin('github')}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
              />
            </svg>
            <span className="font-medium">
              {loading === 'github' ? '로그인 중...' : 'GitHub로 계속하기'}
            </span>
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <p className="mt-6 text-xs text-gray-500 text-center">
          로그인 시 서비스 이용약관에 동의하는 것으로 간주됩니다
        </p>
      </div>
    </div>
  );
}

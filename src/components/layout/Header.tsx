'use client';

import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

interface HeaderProps {
  onMenuToggle: () => void;
  jobStats?: {
    todayCount: number;
    activeCount: number;
  };
}

export function Header({ onMenuToggle, jobStats }: HeaderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
      {/* Left: Menu button and stats */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Job Stats */}
        {jobStats && (
          <div className="hidden sm:flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
              <span className="text-blue-600 font-medium">오늘등록</span>
              <span className="text-blue-700 font-bold">{jobStats.todayCount}건</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
              <span className="text-green-600 font-medium">접수중</span>
              <span className="text-green-700 font-bold">{jobStats.activeCount}건</span>
            </div>
          </div>
        )}
      </div>

      {/* Right: User menu */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User */}
        {loading ? (
          <div className="w-20 h-8 bg-gray-100 rounded animate-pulse" />
        ) : user ? (
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-700">
                {user.email?.split('@')[0]}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}

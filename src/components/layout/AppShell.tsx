'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { mockJobs } from '@/lib/data/mockJobs';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jobStats, setJobStats] = useState({ todayCount: 0, activeCount: 0 });

  useEffect(() => {
    // Calculate job stats from mock data
    const today = new Date().toISOString().split('T')[0];
    const todayCount = mockJobs.filter(
      (job) => job.created_at.startsWith(today)
    ).length;

    // For demo, show all jobs as "active"
    const activeCount = mockJobs.length;

    setJobStats({ todayCount, activeCount });
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          jobStats={jobStats}
        />

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

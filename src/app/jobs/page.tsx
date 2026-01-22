import { getJobs } from './actions';
import { JobsPageClient } from '@/components/jobs/JobsPageClient';
import { siteJobs } from '@/lib/data/siteJobs';

export default async function JobsPage() {
  const savedJobs = await getJobs();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">공고관리</h1>
        <p className="text-sm text-gray-600 mt-1">
          채용공고를 저장하고 요구사항을 분석하세요
        </p>
      </div>

      <JobsPageClient savedJobs={savedJobs} siteJobs={siteJobs} />
    </div>
  );
}

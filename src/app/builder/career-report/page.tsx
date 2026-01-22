import { getJobs } from '@/app/jobs/actions';
import { getExperiences } from '@/app/experiences/actions';
import { CareerReportBuilder } from '@/components/builder/CareerReportBuilder';

export default async function CareerReportPage({
  searchParams,
}: {
  searchParams: { job?: string };
}) {
  const jobs = await getJobs();
  const experiences = await getExperiences();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">경력기술서 만들기</h1>
        <p className="text-sm text-gray-600 mt-1">
          공고를 선택하고 관련 경험을 선택해 경력기술서를 생성하세요
        </p>
      </div>

      <CareerReportBuilder
        jobs={jobs}
        experiences={experiences}
        initialJobId={searchParams.job}
      />
    </div>
  );
}

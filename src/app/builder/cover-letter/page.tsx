import { getJobs, getJobQuestions } from '@/app/jobs/actions';
import { getExperiences } from '@/app/experiences/actions';
import { CoverLetterBuilder } from '@/components/builder/CoverLetterBuilder';

export default async function CoverLetterPage({
  searchParams,
}: {
  searchParams: { job?: string };
}) {
  const jobs = await getJobs();
  const experiences = await getExperiences();

  // If job is selected, get its questions
  let questions: Awaited<ReturnType<typeof getJobQuestions>> = [];
  if (searchParams.job) {
    try {
      questions = await getJobQuestions(searchParams.job);
    } catch {
      // Job might not exist
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">자기소개서 만들기</h1>
        <p className="text-sm text-gray-600 mt-1">
          문항별로 경험을 선택해 답변을 생성하세요
        </p>
      </div>

      <CoverLetterBuilder
        jobs={jobs}
        experiences={experiences}
        initialJobId={searchParams.job}
        initialQuestions={questions}
      />
    </div>
  );
}

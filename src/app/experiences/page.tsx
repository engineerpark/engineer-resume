import { getExperiences } from './actions';
import { ExperienceList } from '@/components/experiences/ExperienceList';
import Link from 'next/link';

export default async function ExperiencesPage() {
  const experiences = await getExperiences();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">경험노트</h1>
          <p className="text-sm text-gray-600 mt-1">
            프로젝트 경험을 입력하면 태그/키워드가 자동 추출됩니다
          </p>
        </div>
        <Link href="/experiences/new" className="btn-primary">
          경험 추가
        </Link>
      </div>

      {experiences.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">아직 등록된 경험이 없습니다</p>
          <Link href="/experiences/new" className="btn-primary">
            첫 경험 추가하기
          </Link>
        </div>
      ) : (
        <ExperienceList experiences={experiences} />
      )}
    </div>
  );
}

import { getExperience } from '../../actions';
import { ExperienceForm } from '@/components/experiences/ExperienceForm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string };
}

export default async function EditExperiencePage({ params }: Props) {
  const experience = await getExperience(params.id);

  if (!experience) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/experiences" className="text-sm text-gray-600 hover:text-primary-600">
          ← 경험노트로 돌아가기
        </Link>
      </div>
      <div className="card">
        <h1 className="text-xl font-bold text-gray-900 mb-6">경험 수정</h1>
        <ExperienceForm experience={experience} />
      </div>
    </div>
  );
}

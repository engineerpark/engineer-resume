import { ExperienceForm } from '@/components/experiences/ExperienceForm';
import Link from 'next/link';

export default function NewExperiencePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/experiences" className="text-sm text-gray-600 hover:text-primary-600">
          ← 경험노트로 돌아가기
        </Link>
      </div>
      <div className="card">
        <h1 className="text-xl font-bold text-gray-900 mb-6">새 경험 추가</h1>
        <ExperienceForm />
      </div>
    </div>
  );
}

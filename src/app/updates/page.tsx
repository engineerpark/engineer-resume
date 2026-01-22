import { UpdatesList } from '@/components/updates/UpdatesList';

// Mock update data
const updates = [
  {
    id: '1',
    date: '2024-01-22',
    version: 'v1.2.0',
    title: 'LangChain AI 연동',
    description: '자기소개서 작성 시 GPT-4를 활용한 AI 생성 기능이 추가되었습니다.',
    type: 'feature' as const,
    details: [
      'OpenAI GPT-4o-mini 모델 연동',
      '글자수 제한에 맞는 자동 생성',
      '경험 기반 맞춤형 답변 생성',
    ],
  },
  {
    id: '2',
    date: '2024-01-22',
    version: 'v1.1.0',
    title: 'UI/UX 전면 개편',
    description: '사이드바 네비게이션과 필터 시스템이 추가되었습니다.',
    type: 'improvement' as const,
    details: [
      '접이식 사이드바 메뉴',
      '채용공고 필터 기능',
      '실시간 공고 현황 표시',
      '반응형 모바일 지원',
    ],
  },
  {
    id: '3',
    date: '2024-01-21',
    version: 'v1.0.0',
    title: 'MVP 출시',
    description: '공대 전화기 서비스가 정식 출시되었습니다.',
    type: 'release' as const,
    details: [
      '경험노트 관리 기능',
      '채용공고 등록 및 관리',
      '경력기술서 자동 생성',
      '자기소개서 문항별 작성',
      '목업 데이터로 데모 지원',
    ],
  },
  {
    id: '4',
    date: '2024-01-20',
    version: 'v0.9.0',
    title: '베타 테스트',
    description: '내부 베타 테스트를 진행했습니다.',
    type: 'beta' as const,
    details: [
      '핵심 기능 테스트',
      '사용성 피드백 수집',
      '버그 수정',
    ],
  },
];

export default function UpdatesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">업데이트 소식</h1>
        <p className="text-sm text-gray-600 mt-1">
          공대 전화기의 새로운 기능과 개선사항을 확인하세요
        </p>
      </div>

      <UpdatesList updates={updates} />
    </div>
  );
}

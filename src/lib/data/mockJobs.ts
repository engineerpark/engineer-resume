import type { Job, JobQuestion } from '@/types/database';

export const mockJobs: Job[] = [
  {
    id: 'job-1',
    user_id: '00000000-0000-0000-0000-000000000001',
    source_type: 'saved',
    title: '전기설계 엔지니어',
    company: '삼성전자',
    url: null,
    raw_text: `[삼성전자] 전기설계 엔지니어 채용

담당업무:
- 반도체 FAB 전기설비 설계 및 구축
- 전력계통 해석 및 최적화
- 배전반 및 MCC 설계

자격요건:
- 전기공학 관련 학과 졸업
- 전기설계 경력 3년 이상
- AutoCAD, ETAP 활용 가능자

우대사항:
- 반도체 FAB 설계 경험자
- PLC/SCADA 경험자`,
    structured: {
      requirements: {
        must: [
          '전기공학 관련 학과 졸업',
          '전기설계 경력 3년 이상',
          'AutoCAD, ETAP 활용 가능자',
        ],
        preferred: [
          '반도체 FAB 설계 경험자',
          'PLC/SCADA 경험자',
        ],
      },
      responsibilities: [
        '반도체 FAB 전기설비 설계 및 구축',
        '전력계통 해석 및 최적화',
        '배전반 및 MCC 설계',
      ],
      length_rules: {
        max_chars: 3000,
      },
    },
    created_at: '2024-01-20T00:00:00Z',
  },
  {
    id: 'job-2',
    user_id: '00000000-0000-0000-0000-000000000001',
    source_type: 'saved',
    title: '공정설계 엔지니어',
    company: 'LG에너지솔루션',
    url: null,
    raw_text: `[LG에너지솔루션] 공정설계 엔지니어

담당업무:
- 배터리 양극재/음극재 공정 설계
- P&ID 작성 및 검토
- 공정 시뮬레이션

자격요건:
- 화학공학 석사 이상
- 화학공정 설계 경력 5년 이상
- Aspen Plus 활용 가능자

자기소개서 문항:
1. 지원동기와 입사 후 포부 (500자)
2. 본인의 강점과 이를 활용한 경험 (800자)`,
    structured: {
      requirements: {
        must: [
          '화학공학 석사 이상',
          '화학공정 설계 경력 5년 이상',
          'Aspen Plus 활용 가능자',
        ],
        preferred: [
          '배터리 소재 공정 경험자',
        ],
      },
      responsibilities: [
        '배터리 양극재/음극재 공정 설계',
        'P&ID 작성 및 검토',
        '공정 시뮬레이션',
      ],
      questions: [
        { title: '지원동기와 입사 후 포부', char_limit: 500 },
        { title: '본인의 강점과 이를 활용한 경험', char_limit: 800 },
      ],
      length_rules: {
        max_chars: 3000,
      },
    },
    created_at: '2024-01-18T00:00:00Z',
  },
];

export const mockJobQuestions: JobQuestion[] = [
  {
    id: 'q-1',
    job_id: 'job-2',
    user_id: '00000000-0000-0000-0000-000000000001',
    question_title: '지원동기와 입사 후 포부',
    char_limit: 500,
    order_idx: 0,
  },
  {
    id: 'q-2',
    job_id: 'job-2',
    user_id: '00000000-0000-0000-0000-000000000001',
    question_title: '본인의 강점과 이를 활용한 경험',
    char_limit: 800,
    order_idx: 1,
  },
];

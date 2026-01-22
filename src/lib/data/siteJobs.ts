// Seed data for Site Jobs (demo purposes)
// These are sample job postings for engineering positions

import type { JobStructured } from '@/types/database';

export interface SiteJob {
  id: string;
  title: string;
  company: string;
  summary: string;
  raw_text: string;
  structured: JobStructured;
}

export const siteJobs: SiteJob[] = [
  {
    id: 'site-job-1',
    title: '전기설계 엔지니어',
    company: '삼성전자',
    summary: '반도체 FAB 전기설계 담당',
    raw_text: `[삼성전자] 전기설계 엔지니어 채용

담당업무:
- 반도체 FAB 전기설비 설계 및 구축
- 전력계통 해석 및 최적화
- 배전반 및 MCC 설계
- 접지/피뢰 시스템 설계
- 시운전 및 유지보수 지원

자격요건:
- 전기공학 관련 학과 졸업
- 전기설계 경력 3년 이상
- AutoCAD, ETAP 활용 가능자
- 전기기사 자격증 소지자

우대사항:
- 반도체 FAB 설계 경험자
- PLC/SCADA 경험자
- 영어 커뮤니케이션 가능자`,
    structured: {
      requirements: {
        must: [
          '전기공학 관련 학과 졸업',
          '전기설계 경력 3년 이상',
          'AutoCAD, ETAP 활용 가능자',
          '전기기사 자격증 소지자',
        ],
        preferred: [
          '반도체 FAB 설계 경험자',
          'PLC/SCADA 경험자',
          '영어 커뮤니케이션 가능자',
        ],
      },
      responsibilities: [
        '반도체 FAB 전기설비 설계 및 구축',
        '전력계통 해석 및 최적화',
        '배전반 및 MCC 설계',
        '접지/피뢰 시스템 설계',
        '시운전 및 유지보수 지원',
      ],
      length_rules: {
        max_chars: 3000,
      },
    },
  },
  {
    id: 'site-job-2',
    title: '공정설계 엔지니어',
    company: 'LG화학',
    summary: '배터리 소재 공정설계',
    raw_text: `[LG화학] 공정설계 엔지니어 채용

담당업무:
- 배터리 소재(양극재/음극재) 공정 설계
- P&ID 작성 및 검토
- 공정 시뮬레이션 (Aspen Plus)
- HAZOP 및 안전성 검토
- Scale-up 설계 및 기술이전

자격요건:
- 화학공학 석사 이상
- 화학공정 설계 경력 5년 이상
- Aspen Plus 활용 가능자
- P&ID 작성 경험자

우대사항:
- 배터리 소재 공정 경험자
- 위험물기능사 이상 자격 보유자
- 영어 논문/보고서 작성 가능자

자기소개서 문항:
1. 지원동기와 입사 후 포부 (500자)
2. 가장 성공적인 프로젝트 경험 (800자)
3. 팀워크 경험과 본인의 역할 (500자)`,
    structured: {
      requirements: {
        must: [
          '화학공학 석사 이상',
          '화학공정 설계 경력 5년 이상',
          'Aspen Plus 활용 가능자',
          'P&ID 작성 경험자',
        ],
        preferred: [
          '배터리 소재 공정 경험자',
          '위험물기능사 이상 자격 보유자',
          '영어 논문/보고서 작성 가능자',
        ],
      },
      responsibilities: [
        '배터리 소재(양극재/음극재) 공정 설계',
        'P&ID 작성 및 검토',
        '공정 시뮬레이션 (Aspen Plus)',
        'HAZOP 및 안전성 검토',
        'Scale-up 설계 및 기술이전',
      ],
      questions: [
        { title: '지원동기와 입사 후 포부', char_limit: 500 },
        { title: '가장 성공적인 프로젝트 경험', char_limit: 800 },
        { title: '팀워크 경험과 본인의 역할', char_limit: 500 },
      ],
      length_rules: {
        max_chars: 3000,
      },
    },
  },
  {
    id: 'site-job-3',
    title: '기계설계 엔지니어',
    company: '현대자동차',
    summary: 'EV 파워트레인 설계',
    raw_text: `[현대자동차] 기계설계 엔지니어 채용

담당업무:
- EV 파워트레인 부품 설계
- 3D 모델링 및 도면 작성
- 구조해석 (FEM/FEA)
- 시제품 제작 및 시험 지원
- 협력업체 기술 지원

자격요건:
- 기계공학 학사 이상
- 자동차 부품 설계 경력 3년 이상
- CATIA V5 능숙자
- 구조해석 경험자 (ANSYS, Abaqus)

우대사항:
- EV/HEV 개발 경험자
- 해외 출장 가능자
- 일본어 가능자`,
    structured: {
      requirements: {
        must: [
          '기계공학 학사 이상',
          '자동차 부품 설계 경력 3년 이상',
          'CATIA V5 능숙자',
          '구조해석 경험자 (ANSYS, Abaqus)',
        ],
        preferred: [
          'EV/HEV 개발 경험자',
          '해외 출장 가능자',
          '일본어 가능자',
        ],
      },
      responsibilities: [
        'EV 파워트레인 부품 설계',
        '3D 모델링 및 도면 작성',
        '구조해석 (FEM/FEA)',
        '시제품 제작 및 시험 지원',
        '협력업체 기술 지원',
      ],
      length_rules: {
        max_chars: 2500,
      },
    },
  },
  {
    id: 'site-job-4',
    title: '자동화설비 엔지니어',
    company: 'SK하이닉스',
    summary: 'FAB 자동화 시스템 구축',
    raw_text: `[SK하이닉스] 자동화설비 엔지니어 채용

담당업무:
- FAB 자동화 설비(AMHS, OHT) 설계/구축
- PLC 프로그래밍 및 제어 로직 개발
- SCADA/HMI 시스템 구축
- 설비 시운전 및 최적화
- 예방보전 체계 수립

자격요건:
- 전기/전자/기계/제어 관련 전공
- 자동화설비 관련 경력 4년 이상
- PLC(Siemens, Mitsubishi) 프로그래밍
- 계장설계 경험자

우대사항:
- 반도체 FAB 경험자
- MES 연동 경험자
- Robot 시스템 경험자

자기소개서:
1. 자동화 프로젝트 경험을 구체적으로 기술 (1000자)
2. 문제 해결 경험과 그 과정 (600자)`,
    structured: {
      requirements: {
        must: [
          '전기/전자/기계/제어 관련 전공',
          '자동화설비 관련 경력 4년 이상',
          'PLC(Siemens, Mitsubishi) 프로그래밍',
          '계장설계 경험자',
        ],
        preferred: [
          '반도체 FAB 경험자',
          'MES 연동 경험자',
          'Robot 시스템 경험자',
        ],
      },
      responsibilities: [
        'FAB 자동화 설비(AMHS, OHT) 설계/구축',
        'PLC 프로그래밍 및 제어 로직 개발',
        'SCADA/HMI 시스템 구축',
        '설비 시운전 및 최적화',
        '예방보전 체계 수립',
      ],
      questions: [
        { title: '자동화 프로젝트 경험을 구체적으로 기술', char_limit: 1000 },
        { title: '문제 해결 경험과 그 과정', char_limit: 600 },
      ],
      length_rules: {
        max_chars: 3000,
      },
    },
  },
];

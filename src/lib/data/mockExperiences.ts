import type { Experience } from '@/types/database';

export const mockExperiences: Experience[] = [
  {
    id: 'exp-1',
    user_id: '00000000-0000-0000-0000-000000000001',
    start_month: '2021-03',
    end_month: '2023-06',
    ongoing: false,
    company: '삼성전자',
    company_visibility: 'public',
    project_name: '반도체 FAB 전기설비 자동화 시스템 구축',
    raw_notes: `- PLC 기반 자동화 시스템 설계 총괄 (Siemens S7-1500)
- SCADA 시스템 구축 및 HMI 개발 (WinCC)
- 전력계통 해석 및 최적화 수행 (ETAP)
- 생산성 30% 향상, 전력비용 15% 절감 달성
- 팀원 5명 리드, 협력업체 3개사 관리`,
    one_liner: '삼성전자에서 반도체 FAB 전기설비 자동화 시스템 구축 총괄 (생산성 30% 향상)',
    tags: ['반도체', 'PM/PL', '자동화', '설계'],
    keywords: ['PLC', 'SCADA', 'HMI', 'ETAP', '전력계통', '30%'],
    role_level: 'lead',
    risk_level: 'green',
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'exp-2',
    user_id: '00000000-0000-0000-0000-000000000001',
    start_month: '2019-07',
    end_month: '2021-02',
    ongoing: false,
    company: 'LG화학',
    company_visibility: 'public',
    project_name: '배터리 양극재 공정 설계 및 스케일업',
    raw_notes: `- 양극재 제조 공정 P&ID 작성 및 검토
- Aspen Plus 활용 공정 시뮬레이션
- HAZOP 안전성 검토 참여
- Pilot에서 양산 스케일업 (10배) 성공
- 특허 2건 출원`,
    one_liner: 'LG화학에서 배터리 양극재 공정 설계 담당 (Pilot→양산 10배 스케일업)',
    tags: ['에너지저장', '화학공정', '설계'],
    keywords: ['P&ID', 'Aspen Plus', 'HAZOP', '스케일업', '특허'],
    role_level: 'partial',
    risk_level: 'yellow',
    created_at: '2024-01-10T00:00:00Z',
  },
  {
    id: 'exp-3',
    user_id: '00000000-0000-0000-0000-000000000001',
    start_month: '2023-07',
    end_month: null,
    ongoing: true,
    company: '현대자동차',
    company_visibility: 'public',
    project_name: 'EV 파워트레인 열관리 시스템 개발',
    raw_notes: `- 전기차 배터리 냉각 시스템 설계
- CFD 해석 (ANSYS Fluent) 담당
- 시제품 설계 및 시험 평가
- 냉각 효율 20% 개선 달성
- 글로벌 OEM 협업 (GM, Ford)`,
    one_liner: '현대자동차에서 EV 파워트레인 열관리 시스템 개발 담당 (냉각효율 20% 개선)',
    tags: ['자동차', 'EV', '설계'],
    keywords: ['CFD', 'ANSYS', '열관리', '냉각시스템', '20%'],
    role_level: 'partial',
    risk_level: 'green',
    created_at: '2024-01-20T00:00:00Z',
  },
  {
    id: 'exp-4',
    user_id: '00000000-0000-0000-0000-000000000001',
    start_month: '2017-03',
    end_month: '2019-06',
    ongoing: false,
    company: 'SK하이닉스',
    company_visibility: 'public',
    project_name: 'FAB 클린룸 공조 시스템 유지보수',
    raw_notes: `- 반도체 FAB 클린룸 공조설비 운영관리
- 예방보전 체계 수립 및 운영
- 설비 가동률 99.5% 달성
- 에너지 절감 프로젝트 참여 (연 5억원 절감)`,
    one_liner: 'SK하이닉스에서 FAB 클린룸 공조 시스템 운영 (가동률 99.5%)',
    tags: ['반도체', '운영', '설비관리'],
    keywords: ['클린룸', '공조', '예방보전', '가동률', '5억'],
    role_level: 'operate',
    risk_level: 'green',
    created_at: '2024-01-05T00:00:00Z',
  },
];

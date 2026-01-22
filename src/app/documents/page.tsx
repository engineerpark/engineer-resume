import { DocumentsList } from '@/components/documents/DocumentsList';

// Mock submitted documents
const mockDocuments = [
  {
    id: 'doc-1',
    jobId: 'job-1',
    jobTitle: '전기설계 엔지니어',
    company: '삼성전자',
    docType: 'career_report' as const,
    title: '경력기술서',
    status: 'submitted' as const,
    submittedAt: '2024-01-20T10:30:00Z',
    charCount: 2850,
  },
  {
    id: 'doc-2',
    jobId: 'job-1',
    jobTitle: '전기설계 엔지니어',
    company: '삼성전자',
    docType: 'cover_letter' as const,
    title: '자기소개서 - 지원동기',
    status: 'draft' as const,
    submittedAt: null,
    charCount: 480,
  },
  {
    id: 'doc-3',
    jobId: 'job-2',
    jobTitle: '공정설계 엔지니어',
    company: 'LG에너지솔루션',
    docType: 'career_report' as const,
    title: '경력기술서',
    status: 'submitted' as const,
    submittedAt: '2024-01-18T14:20:00Z',
    charCount: 2920,
  },
  {
    id: 'doc-4',
    jobId: 'job-2',
    jobTitle: '공정설계 엔지니어',
    company: 'LG에너지솔루션',
    docType: 'cover_letter' as const,
    title: '자기소개서 - 지원동기와 입사 후 포부',
    status: 'submitted' as const,
    submittedAt: '2024-01-18T14:25:00Z',
    charCount: 498,
  },
  {
    id: 'doc-5',
    jobId: 'job-2',
    jobTitle: '공정설계 엔지니어',
    company: 'LG에너지솔루션',
    docType: 'cover_letter' as const,
    title: '자기소개서 - 본인의 강점과 이를 활용한 경험',
    status: 'submitted' as const,
    submittedAt: '2024-01-18T14:30:00Z',
    charCount: 795,
  },
];

export default function DocumentsPage() {
  // Calculate stats
  const totalDocs = mockDocuments.length;
  const submittedDocs = mockDocuments.filter(d => d.status === 'submitted').length;
  const draftDocs = mockDocuments.filter(d => d.status === 'draft').length;
  const companiesApplied = new Set(mockDocuments.filter(d => d.status === 'submitted').map(d => d.company)).size;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">제출서류 현황</h1>
        <p className="text-sm text-gray-600 mt-1">
          작성한 서류와 제출 현황을 확인하세요
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">전체 서류</p>
          <p className="text-2xl font-bold text-gray-900">{totalDocs}건</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">제출완료</p>
          <p className="text-2xl font-bold text-green-600">{submittedDocs}건</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">작성중</p>
          <p className="text-2xl font-bold text-yellow-600">{draftDocs}건</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">지원 회사</p>
          <p className="text-2xl font-bold text-blue-600">{companiesApplied}개사</p>
        </div>
      </div>

      <DocumentsList documents={mockDocuments} />
    </div>
  );
}

export default function DocumentsHistoryPage() {
  const history = [
    {
      id: 'h1',
      action: 'submit',
      documentTitle: '경력기술서',
      company: 'LG에너지솔루션',
      jobTitle: '공정설계 엔지니어',
      timestamp: '2024-01-18T14:20:00Z',
    },
    {
      id: 'h2',
      action: 'submit',
      documentTitle: '자기소개서 - 지원동기와 입사 후 포부',
      company: 'LG에너지솔루션',
      jobTitle: '공정설계 엔지니어',
      timestamp: '2024-01-18T14:25:00Z',
    },
    {
      id: 'h3',
      action: 'submit',
      documentTitle: '자기소개서 - 본인의 강점과 이를 활용한 경험',
      company: 'LG에너지솔루션',
      jobTitle: '공정설계 엔지니어',
      timestamp: '2024-01-18T14:30:00Z',
    },
    {
      id: 'h4',
      action: 'edit',
      documentTitle: '경력기술서',
      company: '삼성전자',
      jobTitle: '전기설계 엔지니어',
      timestamp: '2024-01-20T10:15:00Z',
    },
    {
      id: 'h5',
      action: 'submit',
      documentTitle: '경력기술서',
      company: '삼성전자',
      jobTitle: '전기설계 엔지니어',
      timestamp: '2024-01-20T10:30:00Z',
    },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionStyle = (action: string) => {
    switch (action) {
      case 'submit':
        return { bg: 'bg-green-100', text: 'text-green-700', label: '제출' };
      case 'edit':
        return { bg: 'bg-blue-100', text: 'text-blue-700', label: '수정' };
      case 'create':
        return { bg: 'bg-purple-100', text: 'text-purple-700', label: '생성' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', label: action };
    }
  };

  // Sort by timestamp descending
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">제출 이력</h1>
        <p className="text-sm text-gray-600 mt-1">
          서류 작성 및 제출 활동 기록입니다
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {sortedHistory.map((item) => {
            const style = getActionStyle(item.action);
            return (
              <div key={item.id} className="px-4 py-4 flex items-start gap-4">
                {/* Timeline dot */}
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${style.bg}`} />
                  <div className="w-px h-full bg-gray-200 mt-2" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${style.bg} ${style.text}`}>
                      {style.label}
                    </span>
                    <span className="text-sm text-gray-500">{formatDate(item.timestamp)}</span>
                  </div>
                  <p className="font-medium text-gray-900">{item.documentTitle}</p>
                  <p className="text-sm text-gray-500">
                    {item.company} · {item.jobTitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseJobFromUrl, createJob } from '@/app/jobs/actions';

type Mode = 'url' | 'paste';

export function JobAddForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('url');

  // URL mode state
  const [url, setUrl] = useState('');
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  // Paste mode state (also used after URL parse)
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [rawText, setRawText] = useState('');
  const [parsedUrl, setParsedUrl] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUrlParse = async () => {
    if (!url.trim()) return;

    setUrlLoading(true);
    setUrlError(null);

    const result = await parseJobFromUrl(url);

    if (result.success && result.rawText) {
      setRawText(result.rawText);
      if (result.title) setTitle(result.title);
      setParsedUrl(url);
      setMode('paste'); // Switch to paste mode to review/edit
    } else {
      setUrlError(result.error || '공고를 불러오지 못했습니다');
      setMode('paste'); // Show paste option
    }

    setUrlLoading(false);
  };

  const handleSave = async () => {
    if (!title.trim() || !company.trim() || !rawText.trim()) {
      setError('제목, 회사명, 공고 내용을 모두 입력해주세요');
      return;
    }

    setSaving(true);
    setError(null);

    const result = await createJob({
      source_type: parsedUrl ? 'url' : 'paste',
      title: title.trim(),
      company: company.trim(),
      url: parsedUrl,
      raw_text: rawText.trim(),
    });

    if (result.success) {
      router.refresh();
      // Reset form
      setUrl('');
      setTitle('');
      setCompany('');
      setRawText('');
      setParsedUrl(null);
      setMode('url');
    } else {
      setError(result.error || '저장 실패');
    }

    setSaving(false);
  };

  return (
    <div className="card">
      {/* Mode toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode('url')}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            mode === 'url'
              ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          URL로 추가
        </button>
        <button
          onClick={() => setMode('paste')}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            mode === 'paste'
              ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          직접 붙여넣기
        </button>
      </div>

      {mode === 'url' && (
        <div className="space-y-4">
          <div>
            <label className="label">채용공고 URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="input flex-1"
                placeholder="https://..."
              />
              <button
                onClick={handleUrlParse}
                disabled={urlLoading || !url.trim()}
                className="btn-primary whitespace-nowrap"
              >
                {urlLoading ? '불러오는 중...' : '불러오기'}
              </button>
            </div>
          </div>

          {urlError && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
              <p className="font-medium">{urlError}</p>
              <button
                onClick={() => setMode('paste')}
                className="mt-2 text-yellow-700 underline text-sm"
              >
                직접 JD를 붙여넣기 하기
              </button>
            </div>
          )}

          <p className="text-xs text-gray-500">
            * 일부 사이트는 자동 불러오기가 지원되지 않을 수 있습니다.
            그 경우 직접 붙여넣기를 이용해주세요.
          </p>
        </div>
      )}

      {mode === 'paste' && (
        <div className="space-y-4">
          {parsedUrl && (
            <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
              URL에서 불러온 내용입니다. 필요시 수정해주세요.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">공고 제목 *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
                placeholder="예: 전기설계 엔지니어"
              />
            </div>
            <div>
              <label className="label">회사명 *</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="input"
                placeholder="예: 삼성전자"
              />
            </div>
          </div>

          <div>
            <label className="label">공고 내용 (JD) *</label>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="textarea h-64"
              placeholder="채용공고 전체 내용을 붙여넣기 해주세요..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {rawText.length}자
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setMode('url');
                setRawText('');
                setTitle('');
                setCompany('');
                setParsedUrl(null);
                setError(null);
              }}
              className="btn-secondary"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !title.trim() || !company.trim() || !rawText.trim()}
              className="btn-primary"
            >
              {saving ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import type { TraceabilityItem } from '@/types/database';

interface DocumentOutputProps {
  content: string;
  contentMd: string;
  charCount: number;
  maxChars?: number;
  traceability?: TraceabilityItem[];
  riskFlags?: string[];
  qcPass?: boolean;
  qcIssues?: string[];
  onBack?: () => void;
}

type ViewMode = 'text' | 'markdown';
type Tab = 'content' | 'traceability' | 'qc';

export function DocumentOutput({
  content,
  contentMd,
  charCount,
  maxChars,
  traceability,
  riskFlags,
  qcPass,
  qcIssues,
  onBack,
}: DocumentOutputProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('text');
  const [activeTab, setActiveTab] = useState<Tab>('content');
  const [copied, setCopied] = useState(false);

  const displayContent = viewMode === 'markdown' ? contentMd : content;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(displayContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([displayContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = viewMode === 'markdown' ? 'career-report.md' : 'career-report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const isOverLimit = maxChars ? charCount > maxChars : false;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h2 className="text-lg font-semibold text-gray-900">생성 결과</h2>
        </div>

        {/* QC Badge */}
        {qcPass !== undefined && (
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              qcPass
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {qcPass ? 'PASS' : 'FAIL'}
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {(['content', 'traceability', 'qc'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'content' && '내용'}
            {tab === 'traceability' && '요구사항 매칭'}
            {tab === 'qc' && 'QC 결과'}
          </button>
        ))}
      </div>

      {/* Content tab */}
      {activeTab === 'content' && (
        <div className="card">
          {/* Format toggle + actions */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('text')}
                className={`px-3 py-1 text-sm rounded ${
                  viewMode === 'text'
                    ? 'bg-gray-200 text-gray-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Plain Text
              </button>
              <button
                onClick={() => setViewMode('markdown')}
                className={`px-3 py-1 text-sm rounded ${
                  viewMode === 'markdown'
                    ? 'bg-gray-200 text-gray-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Markdown
              </button>
            </div>
            <div className="flex gap-2">
              <button onClick={handleCopy} className="btn-outline text-sm">
                {copied ? '복사됨!' : '복사'}
              </button>
              <button onClick={handleDownload} className="btn-outline text-sm">
                다운로드
              </button>
            </div>
          </div>

          {/* Char count */}
          <div className="flex items-center gap-2 mb-3 text-sm">
            <span className={isOverLimit ? 'text-red-600 font-medium' : 'text-gray-600'}>
              {charCount.toLocaleString()}자
            </span>
            {maxChars && (
              <>
                <span className="text-gray-400">/</span>
                <span className="text-gray-500">{maxChars.toLocaleString()}자</span>
                {isOverLimit && (
                  <span className="text-red-600 font-medium">
                    ({(charCount - maxChars).toLocaleString()}자 초과)
                  </span>
                )}
              </>
            )}
          </div>

          {/* Content display */}
          <div className="bg-gray-50 rounded-lg p-4 max-h-[500px] overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
              {displayContent}
            </pre>
          </div>

          {/* Risk flags */}
          {riskFlags && riskFlags.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="font-medium text-yellow-800 mb-2">주의 사항</p>
              <ul className="text-sm text-yellow-700 space-y-1">
                {riskFlags.map((flag, i) => (
                  <li key={i}>{flag}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Traceability tab */}
      {activeTab === 'traceability' && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">요구사항 ↔ 경험 매칭</h3>
          {traceability && traceability.length > 0 ? (
            <div className="space-y-3">
              {traceability.map((item, i) => (
                <div
                  key={i}
                  className="p-3 bg-gray-50 rounded-lg border-l-4 border-green-500"
                >
                  <p className="text-sm font-medium text-gray-800">
                    요구사항: {item.requirement}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    → {item.experience_summary}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              매칭된 요구사항이 없습니다
            </p>
          )}
        </div>
      )}

      {/* QC tab */}
      {activeTab === 'qc' && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">품질 검사 결과</h3>

          <div className="flex items-center gap-3 mb-4">
            <span
              className={`px-4 py-2 rounded-lg font-medium ${
                qcPass
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {qcPass ? 'PASS' : 'FAIL'}
            </span>
            <span className="text-gray-600">
              글자수: {charCount.toLocaleString()}자
              {maxChars && ` / ${maxChars.toLocaleString()}자`}
            </span>
          </div>

          {qcIssues && qcIssues.length > 0 && (
            <div className="space-y-2">
              <p className="font-medium text-gray-700">발견된 이슈:</p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {qcIssues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {(!qcIssues || qcIssues.length === 0) && qcPass && (
            <p className="text-green-600">모든 검사를 통과했습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}

# 공대 전화기 - Engineering Career Document Generator

공학 분야(전기/전자/화학/기계) 경력직을 위한 경력기술서 및 자기소개서 생성기 MVP입니다.

## 주요 기능

### 1. 경험노트 (Experience Notes)
- 프로젝트 경험을 구조화된 형태로 입력
- 자동 태그/키워드 추출
- 역할 수준(Lead/담당/운영/협업) 분류
- 위험도 수준(🟢/🟡/🔴) 표시

### 2. 공고관리 (Job Management)
- 관심공고: 저장한 채용공고 관리
- Site Jobs: 샘플 채용공고 데모
- URL 입력: URL에서 공고 자동 추출 (best-effort)
- 직접 붙여넣기: JD 텍스트 직접 입력

### 3. 경력기술서 만들기 (Career Report Builder)
- 공고 선택 → 경험 선택 → 생성
- 글자수 제한 준수
- 요구사항 ↔ 경험 추적성 표시
- 위험 플래그 표시
- QC(품질검사) 결과 표시

### 4. 자기소개서 만들기 (Cover Letter Builder)
- 문항별 경험 선택 (칩 형태로 항상 표시)
- "이 문항 채우기" 버튼으로 답변 생성
- 글자수 제한 자동 준수
- 문항 추가/삭제 기능
- 전체 내보내기 기능

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth

## 설치 및 실행

### 1. 의존성 설치

```bash
cd career-doc-generator
npm install
```

### 2. 환경변수 설정

`.env.local` 파일을 생성하고 다음 내용을 입력:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase 데이터베이스 설정

Supabase SQL Editor에서 `supabase/migrations/001_initial_schema.sql` 파일의 내용을 실행하여 테이블과 RLS 정책을 생성합니다.

### 4. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 앱을 확인할 수 있습니다.

## 프로젝트 구조

```
src/
├── app/                      # Next.js App Router 페이지
│   ├── auth/callback/        # OAuth 콜백
│   ├── builder/              # 문서 빌더
│   │   ├── career-report/    # 경력기술서 빌더
│   │   └── cover-letter/     # 자기소개서 빌더
│   ├── experiences/          # 경험노트 CRUD
│   ├── jobs/                 # 공고관리
│   └── login/                # 로그인 페이지
├── components/               # React 컴포넌트
│   ├── builder/              # 빌더 관련 컴포넌트
│   ├── experiences/          # 경험 관련 컴포넌트
│   └── jobs/                 # 공고 관련 컴포넌트
├── lib/                      # 유틸리티 및 서비스
│   ├── ai/                   # AI 파이프라인 (placeholder)
│   ├── data/                 # 시드 데이터
│   └── supabase/             # Supabase 클라이언트
└── types/                    # TypeScript 타입 정의
```

## 데이터 모델

### experiences
- 사용자의 프로젝트 경험 저장
- 자동 추출: one_liner, tags, keywords, role_level, risk_level

### jobs
- 채용공고 정보 저장
- structured: 요구사항, 담당업무, 자소서 문항 등 파싱 결과

### job_questions
- 자기소개서 문항 저장

### documents
- 생성된 경력기술서/자기소개서 저장

### document_qc
- 문서 품질검사 결과 저장

## AI 파이프라인

현재 MVP에서는 placeholder 구현을 사용합니다. `src/lib/ai/placeholder.ts`에서 다음 함수들을 확인할 수 있습니다:

- `structureExperience()`: 경험에서 태그/키워드 추출
- `structureJob()`: 공고에서 요구사항/문항 추출
- `generateCareerReport()`: 경력기술서 생성
- `generateCoverLetterAnswer()`: 자소서 답변 생성
- `qcDocument()`: 문서 품질검사

실제 AI 모델을 연동하려면 `src/lib/ai/index.ts`에서 다른 구현으로 교체하면 됩니다.

## 배포

### Vercel 배포

1. GitHub에 코드 push
2. Vercel에서 프로젝트 import
3. 환경변수 설정
4. 배포

### 환경변수 (Vercel)

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx
```

## 주의사항

- MVP 버전으로 최소한의 스타일링만 적용되어 있습니다
- URL 파싱은 best-effort로 동작하며, 실패 시 직접 붙여넣기를 안내합니다
- AI 생성 결과는 placeholder이므로 실제 AI 연동이 필요합니다
- 결제 기능, 관리자 패널은 포함되어 있지 않습니다

## 라이선스

Private - All rights reserved
# Deployed 2026년  1월 22일 목요일 21시 28분 25초 KST

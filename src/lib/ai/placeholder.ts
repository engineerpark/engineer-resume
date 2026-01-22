// Placeholder AI Implementation
// Returns deterministic structured outputs for MVP testing
// Replace with actual model calls (OpenAI, Claude, etc.) in production

import type {
  StructuredExperience,
  ParsedJob,
  JobStructured,
  CareerReportResult,
  CoverLetterAnswerResult,
  QCResult,
  RoleLevel,
  RiskLevel,
} from '@/types/database';

import type {
  AIService,
  AIStructureExperienceInput,
  AIStructureJobInput,
  AICareerReportInput,
  AICoverLetterAnswerInput,
  AIQCInput,
} from './types';

// Helper: Extract potential keywords from text
function extractKeywords(text: string): string[] {
  const techTerms = [
    'PLC', 'SCADA', 'HMI', '전기설계', '회로설계', 'PCB', 'CAD', 'AutoCAD',
    'SolidWorks', 'CATIA', '3D모델링', '공정설계', '품질관리', 'QC', 'QA',
    '시운전', '유지보수', '설비관리', '자동화', 'PID', '계장', '제어시스템',
    '반도체', '디스플레이', '배터리', '전력', '송전', '배전', '신재생에너지',
    '태양광', '풍력', 'ESS', '화학공정', '촉매', '반응기', '증류', '정제',
    '열역학', '유체역학', '구조해석', 'FEM', 'FEA', 'CFD', '진동분석',
    '기계설계', '금형', '사출', '프레스', '용접', 'ISO', 'KS', 'ASME',
    'API', 'HAZOP', 'P&ID', 'DCS', 'MES', 'ERP', 'SAP',
  ];

  const found: string[] = [];
  const textLower = text.toLowerCase();

  for (const term of techTerms) {
    if (textLower.includes(term.toLowerCase())) {
      found.push(term);
    }
  }

  // Also extract numbers with units (performance metrics)
  const metricsPattern = /\d+(?:\.\d+)?(?:\s*)?(?:%|억|만|kW|MW|kg|ton|m²|㎡)/g;
  const metrics = text.match(metricsPattern) || [];

  return [...new Set([...found, ...metrics.slice(0, 3)])].slice(0, 8);
}

// Helper: Determine role level from keywords
function determineRoleLevel(text: string): RoleLevel {
  const leadKeywords = ['총괄', '책임', 'PM', 'PL', '팀장', '리드', '주도'];
  const partialKeywords = ['담당', '설계', '개발', '구현', '주관'];
  const operateKeywords = ['운영', '관리', '유지보수', '모니터링'];

  const textLower = text.toLowerCase();

  if (leadKeywords.some(k => text.includes(k))) return 'lead';
  if (partialKeywords.some(k => text.includes(k))) return 'partial';
  if (operateKeywords.some(k => text.includes(k))) return 'operate';
  return 'collab';
}

// Helper: Determine risk level (sensitive/confidential content)
function determineRiskLevel(text: string): RiskLevel {
  const highRiskKeywords = ['비밀', '기밀', 'NDA', '보안', '특허', '미공개', '대외비'];
  const mediumRiskKeywords = ['내부', '고객사', '프로젝트명', '코드명'];

  if (highRiskKeywords.some(k => text.includes(k))) return 'red';
  if (mediumRiskKeywords.some(k => text.includes(k))) return 'yellow';
  return 'green';
}

// Helper: Generate tags from project info
function generateTags(meta: AIStructureExperienceInput['meta'], text: string): string[] {
  const tags: string[] = [];

  // Industry tags
  const industryKeywords: Record<string, string> = {
    '반도체': '반도체',
    '디스플레이': '디스플레이',
    '배터리': '에너지저장',
    '자동차': '자동차',
    '조선': '조선해양',
    '플랜트': '플랜트',
    '화학': '화학공정',
    '전력': '전력시스템',
    '건설': '건설',
    '제조': '제조업',
  };

  for (const [keyword, tag] of Object.entries(industryKeywords)) {
    if (text.includes(keyword) || meta.company.includes(keyword)) {
      tags.push(tag);
    }
  }

  // Role-based tags
  const roleLevel = determineRoleLevel(text);
  if (roleLevel === 'lead') tags.push('PM/PL');
  if (text.includes('설계')) tags.push('설계');
  if (text.includes('시공') || text.includes('시운전')) tags.push('시공');
  if (text.includes('유지보수') || text.includes('운영')) tags.push('운영');

  return [...new Set(tags)].slice(0, 5);
}

// Helper: Generate one-liner summary
function generateOneLiner(meta: AIStructureExperienceInput['meta'], text: string): string {
  const roleLevel = determineRoleLevel(text);
  const roleText = {
    lead: '총괄',
    partial: '담당',
    operate: '운영',
    collab: '참여',
  }[roleLevel];

  // Extract any quantifiable result
  const numbers = text.match(/\d+(?:\.\d+)?(?:\s*)?(?:%|억|만)/);
  const result = numbers ? ` (${numbers[0]} 달성)` : '';

  return `${meta.company}에서 ${meta.projectName} ${roleText}${result}`;
}

export const placeholderAI: AIService = {
  async structureExperience(input: AIStructureExperienceInput): Promise<StructuredExperience> {
    const { meta, rawNotes } = input;
    const fullText = `${meta.company} ${meta.projectName} ${rawNotes}`;

    return {
      one_liner: generateOneLiner(meta, fullText),
      tags: generateTags(meta, fullText),
      keywords: extractKeywords(fullText),
      role_level: determineRoleLevel(rawNotes),
      risk_level: determineRiskLevel(rawNotes),
    };
  },

  async parseJobFromUrl(url: string): Promise<ParsedJob> {
    // In MVP, we attempt to fetch the URL server-side
    // This is a stub - actual implementation is in server action
    throw new Error('URL parsing should be done via server action');
  },

  async structureJob(input: AIStructureJobInput): Promise<JobStructured> {
    const { rawText } = input;

    // Simple keyword-based extraction for MVP
    const mustRequirements: string[] = [];
    const preferredRequirements: string[] = [];
    const responsibilities: string[] = [];

    // Extract lines that look like requirements
    const lines = rawText.split('\n').filter(l => l.trim());

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.includes('필수') || trimmed.includes('자격요건') || trimmed.includes('요구사항')) {
        // Next few lines might be must requirements
        continue;
      }

      if (trimmed.includes('우대') || trimmed.includes('선호')) {
        continue;
      }

      if (trimmed.includes('담당업무') || trimmed.includes('주요업무') || trimmed.includes('업무내용')) {
        continue;
      }

      // Heuristic: lines with bullets or numbers are likely list items
      if (/^[-•·▪▸◦\d.]+/.test(trimmed)) {
        const content = trimmed.replace(/^[-•·▪▸◦\d.)\s]+/, '').trim();
        if (content.length > 5) {
          if (trimmed.toLowerCase().includes('경력') || trimmed.includes('년')) {
            mustRequirements.push(content);
          } else if (trimmed.includes('우대')) {
            preferredRequirements.push(content);
          } else {
            responsibilities.push(content);
          }
        }
      }
    }

    // If nothing extracted, provide defaults
    if (mustRequirements.length === 0) {
      mustRequirements.push('관련 분야 경력 보유자');
    }
    if (responsibilities.length === 0) {
      responsibilities.push('해당 직무 수행');
    }

    // Try to extract questions for cover letter
    const questions: { title: string; char_limit?: number }[] = [];
    const questionPattern = /(?:자기소개서|질문|문항).*?(\d+)\s*[.:]?\s*(.+?)(?:\((\d+)자[^)]*\))?$/gm;
    let match;
    while ((match = questionPattern.exec(rawText)) !== null) {
      questions.push({
        title: match[2].trim(),
        char_limit: match[3] ? parseInt(match[3]) : undefined,
      });
    }

    return {
      requirements: {
        must: mustRequirements.slice(0, 10),
        preferred: preferredRequirements.slice(0, 10),
      },
      responsibilities: responsibilities.slice(0, 10),
      questions: questions.length > 0 ? questions : undefined,
      length_rules: {
        max_chars: 3000, // Default for career reports
      },
    };
  },

  async generateCareerReport(input: AICareerReportInput): Promise<CareerReportResult> {
    const { jobStructured, selectedExperiences, lengthRule } = input;
    const maxChars = lengthRule?.maxChars || 3000;

    // Build content from selected experiences
    const sections: string[] = [];
    const traceability: CareerReportResult['traceability'] = [];
    const riskFlags: string[] = [];

    // Group experiences by company
    const byCompany = new Map<string, typeof selectedExperiences>();
    for (const exp of selectedExperiences) {
      const list = byCompany.get(exp.company) || [];
      list.push(exp);
      byCompany.set(exp.company, list);
    }

    for (const [company, experiences] of byCompany) {
      const expList = experiences.sort((a, b) =>
        a.start_month.localeCompare(b.start_month)
      );

      const period = `${expList[0].start_month} ~ ${
        expList[expList.length - 1].ongoing
          ? '현재'
          : expList[expList.length - 1].end_month || '현재'
      }`;

      sections.push(`\n[${company}] (${period})`);

      for (const exp of expList) {
        sections.push(`\n• ${exp.project_name}`);
        sections.push(`  - ${exp.one_liner}`);

        if (exp.keywords.length > 0) {
          sections.push(`  - 핵심역량: ${exp.keywords.slice(0, 4).join(', ')}`);
        }

        // Track risk
        if (exp.risk_level === 'red') {
          riskFlags.push(`[주의] ${exp.project_name}: 민감정보 포함 가능`);
        } else if (exp.risk_level === 'yellow') {
          riskFlags.push(`[확인필요] ${exp.project_name}: 내부정보 확인 필요`);
        }

        // Build traceability
        for (const req of jobStructured.requirements.must) {
          if (exp.keywords.some(k => req.includes(k)) ||
              exp.tags.some(t => req.includes(t))) {
            traceability.push({
              requirement: req,
              experience_id: exp.id,
              experience_summary: exp.one_liner,
            });
          }
        }
      }
    }

    let content = `[경력기술서]\n\n지원분야 요구사항에 맞춰 주요 경력을 기술합니다.\n`;
    content += sections.join('\n');

    // Trim if too long
    if (content.length > maxChars) {
      content = content.slice(0, maxChars - 50) + '\n\n... (글자수 제한으로 생략)';
    }

    // Generate markdown version
    let contentMd = `# 경력기술서\n\n지원분야 요구사항에 맞춰 주요 경력을 기술합니다.\n`;
    for (const [company, experiences] of byCompany) {
      const expList = experiences.sort((a, b) =>
        a.start_month.localeCompare(b.start_month)
      );
      const period = `${expList[0].start_month} ~ ${
        expList[expList.length - 1].ongoing
          ? '현재'
          : expList[expList.length - 1].end_month || '현재'
      }`;

      contentMd += `\n## ${company} (${period})\n`;

      for (const exp of expList) {
        contentMd += `\n### ${exp.project_name}\n`;
        contentMd += `- ${exp.one_liner}\n`;
        if (exp.keywords.length > 0) {
          contentMd += `- **핵심역량**: ${exp.keywords.slice(0, 4).join(', ')}\n`;
        }
      }
    }

    return {
      content,
      content_md: contentMd,
      traceability,
      risk_flags: riskFlags,
      char_count: content.length,
    };
  },

  async generateCoverLetterAnswer(input: AICoverLetterAnswerInput): Promise<CoverLetterAnswerResult> {
    const { question, selectedExperiences, charLimit } = input;
    const limit = charLimit || 1000;

    if (selectedExperiences.length === 0) {
      return {
        answer: '선택된 경험이 없습니다. 관련 경험을 선택해주세요.',
        char_count: 0,
        risk_flags: [],
      };
    }

    const riskFlags: string[] = [];

    // Build answer from experiences
    let answer = `[${question}]\n\n`;

    for (const exp of selectedExperiences) {
      answer += `${exp.company}에서 ${exp.project_name}을 수행하며 `;
      answer += `${exp.one_liner.replace(exp.company + '에서 ', '')}. `;

      if (exp.keywords.length > 0) {
        answer += `이 과정에서 ${exp.keywords.slice(0, 3).join(', ')} 역량을 쌓았습니다. `;
      }
      answer += '\n\n';

      if (exp.risk_level !== 'green') {
        riskFlags.push(`[${exp.risk_level === 'red' ? '주의' : '확인'}] ${exp.project_name} 관련 내용 검토 필요`);
      }
    }

    // Trim to character limit
    if (answer.length > limit) {
      answer = answer.slice(0, limit - 30) + '... (글자수 제한)';
    }

    return {
      answer: answer.trim(),
      char_count: answer.trim().length,
      risk_flags: riskFlags,
    };
  },

  async qcDocument(input: AIQCInput): Promise<QCResult> {
    const { docContent, constraints } = input;
    const issues: string[] = [];
    const suggestions: string[] = [];

    const charCount = docContent.length;

    // Check character limit
    if (constraints.charLimit && charCount > constraints.charLimit) {
      issues.push(`글자수 초과: ${charCount}자 / ${constraints.charLimit}자`);
      suggestions.push(`${charCount - constraints.charLimit}자를 줄여주세요`);
    }

    // Check for required keywords
    if (constraints.requiredKeywords) {
      for (const keyword of constraints.requiredKeywords) {
        if (!docContent.includes(keyword)) {
          issues.push(`필수 키워드 누락: ${keyword}`);
          suggestions.push(`'${keyword}' 관련 내용을 추가해주세요`);
        }
      }
    }

    // General checks
    if (charCount < 100) {
      issues.push('내용이 너무 짧습니다');
      suggestions.push('구체적인 경험과 성과를 추가해주세요');
    }

    // Check for potential issues
    if (docContent.includes('비밀') || docContent.includes('기밀')) {
      issues.push('민감정보 포함 가능성');
      suggestions.push('보안 관련 표현을 검토해주세요');
    }

    return {
      pass: issues.length === 0,
      issues,
      suggestions,
      char_count_by_section: {
        total: charCount,
      },
    };
  },
};

export default placeholderAI;

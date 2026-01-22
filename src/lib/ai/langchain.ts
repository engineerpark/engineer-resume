// LangChain AI Implementation
// Uses OpenAI GPT models for document generation

import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
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

// Initialize OpenAI model
const getModel = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  return new ChatOpenAI({
    modelName: 'gpt-4o-mini',
    temperature: 0.7,
    openAIApiKey: apiKey,
  });
};

// Helper functions from placeholder (reuse for consistency)
function determineRoleLevel(text: string): RoleLevel {
  const leadKeywords = ['총괄', '책임', 'PM', 'PL', '팀장', '리드', '주도'];
  const partialKeywords = ['담당', '설계', '개발', '구현', '주관'];
  const operateKeywords = ['운영', '관리', '유지보수', '모니터링'];

  if (leadKeywords.some(k => text.includes(k))) return 'lead';
  if (partialKeywords.some(k => text.includes(k))) return 'partial';
  if (operateKeywords.some(k => text.includes(k))) return 'operate';
  return 'collab';
}

function determineRiskLevel(text: string): RiskLevel {
  const highRiskKeywords = ['비밀', '기밀', 'NDA', '보안', '특허', '미공개', '대외비'];
  const mediumRiskKeywords = ['내부', '고객사', '프로젝트명', '코드명'];

  if (highRiskKeywords.some(k => text.includes(k))) return 'red';
  if (mediumRiskKeywords.some(k => text.includes(k))) return 'yellow';
  return 'green';
}

export const langchainAI: AIService = {
  async structureExperience(input: AIStructureExperienceInput): Promise<StructuredExperience> {
    const { meta, rawNotes } = input;
    const model = getModel();

    const systemPrompt = `당신은 엔지니어 경력 문서 전문가입니다. 사용자의 경험 노트를 분석하여 구조화된 정보를 추출합니다.
응답은 반드시 JSON 형식으로만 해주세요.`;

    const userPrompt = `다음 프로젝트 경험을 분석해주세요:

회사: ${meta.company}
프로젝트명: ${meta.projectName}
기간: ${meta.startMonth} ~ ${meta.endMonth || (meta.ongoing ? '현재' : '')}
상세내용:
${rawNotes}

다음 JSON 형식으로 응답해주세요:
{
  "one_liner": "한 줄 요약 (회사에서 무엇을 담당/총괄했고 어떤 성과를 냈는지)",
  "tags": ["산업분야", "역할", "기술영역"] (최대 5개),
  "keywords": ["핵심 기술용어", "성과 수치"] (최대 8개)
}`;

    try {
      const response = await model.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(userPrompt),
      ]);

      const content = response.content as string;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          one_liner: parsed.one_liner || `${meta.company}에서 ${meta.projectName} 수행`,
          tags: parsed.tags || [],
          keywords: parsed.keywords || [],
          role_level: determineRoleLevel(rawNotes),
          risk_level: determineRiskLevel(rawNotes),
        };
      }
    } catch (error) {
      console.error('LangChain structureExperience error:', error);
    }

    // Fallback
    return {
      one_liner: `${meta.company}에서 ${meta.projectName} 수행`,
      tags: [],
      keywords: [],
      role_level: determineRoleLevel(rawNotes),
      risk_level: determineRiskLevel(rawNotes),
    };
  },

  async parseJobFromUrl(_url: string): Promise<ParsedJob> {
    throw new Error('URL parsing should be done via server action');
  },

  async structureJob(input: AIStructureJobInput): Promise<JobStructured> {
    const { rawText } = input;
    const model = getModel();

    const systemPrompt = `당신은 채용공고 분석 전문가입니다. 공고 텍스트를 분석하여 구조화된 정보를 추출합니다.
응답은 반드시 JSON 형식으로만 해주세요.`;

    const userPrompt = `다음 채용공고를 분석해주세요:

${rawText.slice(0, 3000)}

다음 JSON 형식으로 응답해주세요:
{
  "requirements": {
    "must": ["필수 자격요건 목록"],
    "preferred": ["우대사항 목록"]
  },
  "responsibilities": ["담당업무 목록"],
  "questions": [{"title": "자소서 문항", "char_limit": 500}] (있는 경우만)
}`;

    try {
      const response = await model.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(userPrompt),
      ]);

      const content = response.content as string;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          requirements: {
            must: parsed.requirements?.must || [],
            preferred: parsed.requirements?.preferred || [],
          },
          responsibilities: parsed.responsibilities || [],
          questions: parsed.questions,
          length_rules: { max_chars: 3000 },
        };
      }
    } catch (error) {
      console.error('LangChain structureJob error:', error);
    }

    // Fallback
    return {
      requirements: { must: [], preferred: [] },
      responsibilities: [],
      length_rules: { max_chars: 3000 },
    };
  },

  async generateCareerReport(input: AICareerReportInput): Promise<CareerReportResult> {
    const { jobStructured, selectedExperiences, lengthRule } = input;
    const maxChars = lengthRule?.maxChars || 3000;
    const model = getModel();

    const experiencesText = selectedExperiences.map(exp => `
회사: ${exp.company}
프로젝트: ${exp.project_name}
기간: ${exp.start_month} ~ ${exp.end_month || (exp.ongoing ? '현재' : '')}
역할: ${exp.one_liner}
핵심역량: ${exp.keywords.join(', ')}
상세내용: ${exp.raw_notes}
`).join('\n---\n');

    const requirementsText = `
필수요건: ${jobStructured.requirements.must.join(', ')}
우대사항: ${jobStructured.requirements.preferred.join(', ')}
담당업무: ${jobStructured.responsibilities.join(', ')}
`;

    const systemPrompt = `당신은 엔지니어링 분야 경력기술서 작성 전문가입니다.
지원자의 경험을 바탕으로 채용공고 요구사항에 맞는 경력기술서를 작성합니다.
반드시 ${maxChars}자 이내로 작성해주세요.
한국어로 전문적이고 구체적으로 작성합니다.`;

    const userPrompt = `다음 정보를 바탕으로 경력기술서를 작성해주세요:

[지원 직무 요구사항]
${requirementsText}

[보유 경험]
${experiencesText}

요구사항:
1. ${maxChars}자 이내로 작성
2. 지원 직무와 관련된 경험 위주로 구성
3. 구체적인 성과와 수치 포함
4. 회사별로 구분하여 작성`;

    try {
      const response = await model.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(userPrompt),
      ]);

      let content = response.content as string;

      // Trim if exceeds limit
      if (content.length > maxChars) {
        content = content.slice(0, maxChars - 20) + '\n\n(글자수 제한)';
      }

      const riskFlags: string[] = [];
      for (const exp of selectedExperiences) {
        if (exp.risk_level === 'red') {
          riskFlags.push(`[주의] ${exp.project_name}: 민감정보 포함 가능`);
        } else if (exp.risk_level === 'yellow') {
          riskFlags.push(`[확인필요] ${exp.project_name}: 내부정보 확인 필요`);
        }
      }

      const traceability = selectedExperiences.map(exp => ({
        requirement: jobStructured.requirements.must[0] || '관련 경력',
        experience_id: exp.id,
        experience_summary: exp.one_liner,
      }));

      return {
        content,
        content_md: content,
        traceability,
        risk_flags: riskFlags,
        char_count: content.length,
      };
    } catch (error) {
      console.error('LangChain generateCareerReport error:', error);
      throw error;
    }
  },

  async generateCoverLetterAnswer(input: AICoverLetterAnswerInput): Promise<CoverLetterAnswerResult> {
    const { question, selectedExperiences, charLimit } = input;
    const limit = charLimit || 1000;
    const model = getModel();

    if (selectedExperiences.length === 0) {
      return {
        answer: '선택된 경험이 없습니다. 관련 경험을 선택해주세요.',
        char_count: 0,
        risk_flags: [],
      };
    }

    const experiencesText = selectedExperiences.map(exp => `
[${exp.company}] ${exp.project_name}
- 역할: ${exp.one_liner}
- 핵심역량: ${exp.keywords.join(', ')}
- 상세: ${exp.raw_notes}
`).join('\n');

    const systemPrompt = `당신은 한국 대기업 자기소개서 작성 전문가입니다.
엔지니어링 분야 경력직 지원자의 경험을 바탕으로 자기소개서 답변을 작성합니다.

중요한 규칙:
1. 반드시 정확히 ${limit}자에 최대한 가깝게 작성하세요 (${Math.floor(limit * 0.9)}자 ~ ${limit}자 사이)
2. 글자 수를 맞추기 위해 내용을 자연스럽게 조절하세요
3. 구체적인 경험과 성과를 포함하세요
4. 지원 동기, 강점, 포부 등 질문 의도에 맞게 작성하세요
5. 한국어로 전문적이고 진정성 있게 작성하세요`;

    const userPrompt = `다음 자기소개서 문항에 답변을 작성해주세요:

[문항]
${question}

[글자수 제한]
${limit}자 (반드시 ${Math.floor(limit * 0.9)}자 ~ ${limit}자 사이로 작성)

[활용할 경험]
${experiencesText}

위 경험들을 활용하여 문항에 대한 답변을 작성해주세요.
반드시 글자수 제한을 준수하세요.`;

    try {
      const response = await model.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(userPrompt),
      ]);

      let answer = (response.content as string).trim();

      // Trim if exceeds limit
      if (answer.length > limit) {
        // Try to find a natural break point
        const breakPoints = ['. ', '다. ', '요. ', '니다. '];
        let trimmedAnswer = answer.slice(0, limit);

        for (const bp of breakPoints) {
          const lastBreak = trimmedAnswer.lastIndexOf(bp);
          if (lastBreak > limit * 0.8) {
            trimmedAnswer = trimmedAnswer.slice(0, lastBreak + bp.length - 1);
            break;
          }
        }
        answer = trimmedAnswer;
      }

      const riskFlags: string[] = [];
      for (const exp of selectedExperiences) {
        if (exp.risk_level !== 'green') {
          riskFlags.push(`[${exp.risk_level === 'red' ? '주의' : '확인'}] ${exp.project_name} 관련 내용 검토 필요`);
        }
      }

      return {
        answer,
        char_count: answer.length,
        risk_flags: riskFlags,
      };
    } catch (error) {
      console.error('LangChain generateCoverLetterAnswer error:', error);
      throw error;
    }
  },

  async qcDocument(input: AIQCInput): Promise<QCResult> {
    const { docContent, constraints } = input;
    const issues: string[] = [];
    const suggestions: string[] = [];
    const charCount = docContent.length;

    if (constraints.charLimit && charCount > constraints.charLimit) {
      issues.push(`글자수 초과: ${charCount}자 / ${constraints.charLimit}자`);
      suggestions.push(`${charCount - constraints.charLimit}자를 줄여주세요`);
    }

    if (constraints.requiredKeywords) {
      for (const keyword of constraints.requiredKeywords) {
        if (!docContent.includes(keyword)) {
          issues.push(`필수 키워드 누락: ${keyword}`);
          suggestions.push(`'${keyword}' 관련 내용을 추가해주세요`);
        }
      }
    }

    if (charCount < 100) {
      issues.push('내용이 너무 짧습니다');
      suggestions.push('구체적인 경험과 성과를 추가해주세요');
    }

    if (docContent.includes('비밀') || docContent.includes('기밀')) {
      issues.push('민감정보 포함 가능성');
      suggestions.push('보안 관련 표현을 검토해주세요');
    }

    return {
      pass: issues.length === 0,
      issues,
      suggestions,
      char_count_by_section: { total: charCount },
    };
  },
};

export default langchainAI;

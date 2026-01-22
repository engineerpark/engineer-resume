// AI Service Entry Point
// Uses LangChain/OpenAI when API key is available, otherwise falls back to placeholder

import { langchainAI } from './langchain';
import { placeholderAI } from './placeholder';
import type { AIService } from './types';

// Check if OpenAI API key is available
const hasOpenAIKey = typeof process !== 'undefined' && !!process.env?.OPENAI_API_KEY;

// Export the appropriate AI service
export const aiService: AIService = hasOpenAIKey ? langchainAI : placeholderAI;

export type { AIService } from './types';

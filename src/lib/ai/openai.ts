import OpenAI from 'openai';
import { mockFeedback, generateMockQuestions } from './mock-responses';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export async function generateInterviewQuestion(
  domain: string,
  difficulty: string,
  resumeData?: any,
  previousQuestions: string[] = []
): Promise<string> {
  if (!openai) {
    // Use mock questions
    const mockQuestions = generateMockQuestions(domain, difficulty, 10);
    const availableQuestions = mockQuestions.filter(q => !previousQuestions.includes(q));
    return availableQuestions[0] || mockQuestions[0];
  }

  try {
    const prompt = `Generate a ${difficulty}-level interview question for a ${domain} role.
    ${resumeData ? `The candidate has experience with: ${resumeData.skills?.join(', ')}` : ''}
    Previous questions asked: ${previousQuestions.join(', ')}
    
    Generate a single, specific interview question that is relevant and challenging.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content?.trim() || 'Tell me about your experience with this domain.';
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback to mock questions
    const mockQuestions = generateMockQuestions(domain, difficulty, 10);
    return mockQuestions[0];
  }
}

export async function evaluateAnswer(
  question: string,
  answer: string,
  domain: string
): Promise<{
  clarity: { score: number; tip: string };
  depth: { score: number; tip: string };
  relevance: { score: number; tip: string };
  communication: { score: number; tip: string };
  totalScore: number;
  overallFeedback: string;
}> {
  if (!openai) {
    return mockFeedback.generateFeedback(answer, domain);
  }

  try {
    const prompt = `Evaluate this interview answer on a scale of 0-100 for each dimension:

Question: ${question}
Answer: ${answer}
Domain: ${domain}

Provide scores for:
1. Clarity (how well-structured and clear the answer is)
2. Technical Depth (level of technical knowledge demonstrated)
3. Relevance (how well the answer addresses the question)
4. Communication (how effectively ideas are communicated)

Return a JSON response with scores and specific tips for improvement for each dimension, plus an overall feedback message.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400,
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0]?.message?.content || '{}');
    const totalScore = Math.round((result.clarity.score + result.depth.score + result.relevance.score + result.communication.score) / 4);
    
    return {
      ...result,
      totalScore
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    return mockFeedback.generateFeedback(answer, domain);
  }
}

export async function generateFollowUpQuestion(
  originalQuestion: string,
  answer: string
): Promise<string> {
  if (!openai) {
    return mockFeedback.generateFollowUp(answer, originalQuestion);
  }

  try {
    const prompt = `Based on this interview question and answer, generate a natural follow-up question:

Original Question: ${originalQuestion}
Answer: ${answer}

Generate a single follow-up question that probes deeper or asks for specific examples.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content?.trim() || mockFeedback.generateFollowUp(answer, originalQuestion);
  } catch (error) {
    console.error('OpenAI API error:', error);
    return mockFeedback.generateFollowUp(answer, originalQuestion);
  }
}
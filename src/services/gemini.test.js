import { describe, it, expect, vi } from 'vitest';
import { generateCarbonTwin, generateSustainabilityReport, generateChallenges } from './gemini';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock the AI service
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
      getGenerativeModel: vi.fn().mockReturnValue({
        generateContent: vi.fn().mockResolvedValue({
          response: {
            text: vi.fn().mockReturnValue('MOCK_AI_RESPONSE')
          }
        })
      })
    }))
  };
});

describe('Gemini Service', () => {
  const mockUserData = { commuteMode: 'Gas Car' };
  const mockMetrics = { total: 10000, breakdown: [] };

  it('generateCarbonTwin should return an object (fallback or parsed)', async () => {
    const result = await generateCarbonTwin(mockUserData, mockMetrics);
    expect(result).toHaveProperty('archetype');
  });

  it('generateSustainabilityReport should return a string', async () => {
    const result = await generateSustainabilityReport(mockUserData, mockMetrics);
    expect(typeof result).toBe('string');
  });

  it('generateChallenges should fallback if AI parsing fails', async () => {
    // If the mock returns non-JSON, it will fallback
    const result = await generateChallenges(mockUserData, mockMetrics);
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toHaveProperty('title');
  });
});

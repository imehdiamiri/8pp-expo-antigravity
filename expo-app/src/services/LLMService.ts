/**
 * LLMService — matches iOS LLMService
 * OpenAI-compatible API integration for AI card generation.
 * 
 * Configuration: Set OPENAI_API_KEY in your environment or .env file.
 * The service falls back to a mock response when no key is configured,
 * allowing offline development and testing.
 */

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini';

// In production, load from env or secure storage
let API_KEY: string | null = null;

/**
 * Configure the LLM service with an API key.
 * Call this during app initialization if the key is available.
 */
export function configureLLM(apiKey: string): void {
  API_KEY = apiKey;
}

/**
 * Check if the LLM service is configured and ready.
 */
export function isLLMConfigured(): boolean {
  return API_KEY !== null && API_KEY.length > 0;
}

/**
 * Strip markdown code fences from LLM output.
 */
export function stripCodeFences(text: string): string {
  return text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();
}

/**
 * Complete a chat prompt using the configured LLM.
 * Falls back to a mock response when no API key is set.
 */
export async function complete(system: string, user: string): Promise<string> {
  if (!isLLMConfigured()) {
    // Mock fallback for development
    console.warn('LLMService: No API key configured. Using mock response.');
    return mockCompletion(user);
  }

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.9,
      max_tokens: 100,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`LLM request failed (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Empty LLM response');
  }

  return content;
}

/**
 * Mock completion that returns a plausible party card based on category hints.
 */
function mockCompletion(userPrompt: string): Promise<string> {
  const mockCards: Record<string, string> = {
    act: '{"text":"Pretend you are a confused tourist asking for directions in sign language"}',
    talk: '{"text":"What is the most spontaneous thing you have ever done on a whim"}',
    challenges: '{"text":"Speak only in questions for the next two minutes without breaking"}',
    penalty: '{"text":"Do your most dramatic slow motion walk across the entire room"}',
    couple: '{"text":"What is the one thing you wish you could tell each other more often"}',
  };

  const lowerPrompt = userPrompt.toLowerCase();
  let category = 'talk';
  if (lowerPrompt.includes('act')) category = 'act';
  else if (lowerPrompt.includes('challenge')) category = 'challenges';
  else if (lowerPrompt.includes('penalty')) category = 'penalty';
  else if (lowerPrompt.includes('couple')) category = 'couple';

  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockCards[category] || mockCards.talk), 800);
  });
}

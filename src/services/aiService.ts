interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

export interface InsightData {
  feasibility: {
    status: 'viable' | 'needs_adjustment' | 'unfeasible';
    content: string;
  };
  diagnosis: {
    content: string;
  };
  suggestions: {
    items: string[];
  };
  extraIncome: {
    items: string[];
  };
  investment: {
    items: string[];
  };
  motivation: {
    content: string;
  };
}

const API_KEY = String(import.meta.env.VITE_GEMINI_API_KEY);
const MODEL_NAME = 'gemini-flash-latest';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

const MAX_RETRIES = 3;
const RETRYABLE_STATUS_CODES = [429, 503];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const callGeminiAPI = async (prompt: string, attempt = 0): Promise<GeminiResponse> => {
  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!response.ok) {
    const isRetryable = RETRYABLE_STATUS_CODES.includes(response.status);

    if (isRetryable && attempt < MAX_RETRIES) {
      // backoff exponencial: 1s, 2s, 4s...
      const delay = 1000 * 2 ** attempt;
      await sleep(delay);
      return callGeminiAPI(prompt, attempt + 1);
    }

    if (response.status === 503) {
      throw new Error(
        'O modelo de IA está sobrecarregado no momento. Tente novamente em alguns instantes.',
      );
    }

    throw new Error(`Erro na requisição: ${response.status}`);
  }

  return (await response.json()) as GeminiResponse;
};

export const getInsight = async (prompt: string) => {
  const response = await callGeminiAPI(prompt);
  const json = response.candidates[0].content.parts[0].text;
  return JSON.parse(json) as InsightData;
};

export const askFollowUpQuestion = async (prompt: string): Promise<string> => {
  const response = await callGeminiAPI(prompt);
  return response.candidates[0].content.parts[0].text.trim();
};

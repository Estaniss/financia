import { useCallback, useState } from 'react';

import { type InsightData, type SimulationRecord } from '@/hooks/useSimulationHistory';
import { buildChatPrompt, type ChatMessage } from '@/lib/buildChatPrompt';
import { askFollowUpQuestion } from '@/services/aiService';

export function useSimulationChat(
  simulation: SimulationRecord | undefined,
  insight: InsightData | null,
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (question: string) => {
      const trimmed = question.trim();

      // sem simulação carregada, não há contexto para responder
      if (!trimmed || isLoading || !simulation) return;

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: trimmed,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const prompt = buildChatPrompt(simulation, insight, messages, trimmed);
        const answer = await askFollowUpQuestion(prompt);

        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: answer,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch {
        setError('Não foi possível responder agora. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    },
    [simulation, insight, messages, isLoading],
  );

  return { messages, sendMessage, isLoading, error };
}

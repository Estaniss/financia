import { type InsightData, type SimulationRecord } from '@/hooks/useSimulationHistory';
import { formatBRL } from '@/lib/formatCurrency';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function buildChatPrompt(
  simulation: SimulationRecord,
  insight: InsightData | null,
  history: ChatMessage[],
  question: string,
): string {
  const { renda, custosFixos, parcelas, objetivo, custoObjetivo } = simulation;

  const conversationText = history
    .map((msg) => `${msg.role === 'user' ? 'Usuário' : 'Você'}: ${msg.content}`)
    .join('\n');

  return `Você é um educador financeiro conversando com um usuário sobre a simulação financeira dele.

    Dados da simulação:
    - Renda mensal: ${formatBRL(renda)}
    - Custos fixos: ${formatBRL(custosFixos)}
    - Parcelas/dívidas: ${formatBRL(parcelas)}
    - Meta: ${objetivo}
    - Custo da meta: ${formatBRL(custoObjetivo)}

    ${insight ? `Diagnóstico já apresentado ao usuário: ${insight.diagnosis.content}` : ''}

    ${conversationText ? `Conversa até agora:\n${conversationText}` : ''}

    Nova pergunta do usuário: "${question}"

    Responda em português do Brasil, de forma direta, curta (máximo 3 parágrafos) e didática, 
    baseando-se nos dados da simulação acima. Fale em segunda pessoa ("você"). 
    Não use markdown, não use JSON, responda apenas com texto corrido.`;
}

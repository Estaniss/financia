import { type SimulationRecord } from '@/hooks/useSimulationHistory';
import { calculateInsight } from '@/lib/calculateInsight';
import { formatBRL } from '@/lib/formatCurrency';

const RESPONSE_SCHEMA = `{
  "feasibility": {
    "status": "viable" | "needs_adjustment" | "unfeasible",
    "content": "<Análise objetiva sobre se a meta é atingível no prazo com o valor disponível. Mencione os números relevantes.>"
  },
  "diagnosis": {
    "content": "<Diagnóstico focado no comprometimento do orçamento: quanto % da renda está comprometida com gastos e dívidas, e o que isso representa para a saúde financeira.>"
  },
  "suggestions": {
    "items": ["<Sugestão prática e concreta para reduzir gastos ou reorganizar o orçamento>"]
  },
  "extraIncome": {
    "items": ["<Ideia prática para gerar renda extra compatível com a realidade brasileira>"]
  },
  "investment": {
    "items": ["<Sugestão de investimento acessível para o perfil apresentado, com foco em atingir a meta>"]
  },
  "motivation": {
    "content": "<Mensagem final motivacional e personalizada, citando a meta pelo nome.>"
  }
}`;

function getFeasibilityStatus(
  saldoMensal: number,
  renda: number,
): 'viable' | 'needs_adjustment' | 'unfeasible' {
  if (saldoMensal >= 0) return 'viable';

  const deficitPercent = renda > 0 ? (Math.abs(saldoMensal) / renda) * 100 : 100;
  return deficitPercent <= 20 ? 'needs_adjustment' : 'unfeasible';
}

export function buildAIPrompt(simulation: SimulationRecord) {
  const { renda, custosFixos, parcelas, objetivo, custoObjetivo } = simulation;

  const insight = calculateInsight(simulation);
  const { saldoMensal, percentualComprometido, mesesParaObjetivo, dataEstimada } = insight;

  const prazoTexto =
    mesesParaObjetivo !== null
      ? `${mesesParaObjetivo} meses (por volta de ${dataEstimada})`
      : 'não é possível estimar com o saldo atual';

  return `Você é um educador financeiro especializado em finanças pessoais. 
    Analise os dados abaixo e gere um diagnóstico financeiro personalizado com linguagem clara, didática e encorajadora, 
    voltado para pessoas sem conhecimento financeiro. O diagnóstico será exibido diretamente ao usuário no app, 
    fale sempre em segunda pessoa ("você tem...", "sua meta...").

    Dados da simulação:
    - Renda mensal bruta: ${formatBRL(renda)}
    - Custos fixos essenciais: ${formatBRL(custosFixos)}
    - Dívidas e parcelas mensais: ${formatBRL(parcelas)}
    - Percentual da renda comprometida com custos e dívidas: ${percentualComprometido.toFixed(0)}%
    - Valor disponível por mês (após custos e dívidas): ${formatBRL(saldoMensal)}
    - Meta: ${objetivo}
    - Custo da meta: ${formatBRL(custoObjetivo)}
    - Prazo estimado para atingir a meta no ritmo atual: ${prazoTexto}

    Retorne APENAS um JSON válido, sem texto adicional, sem blocos de código, neste formato exato:

    ${RESPONSE_SCHEMA}

    Regras:
    - Todos os textos em português do Brasil
    - Máximo de 4 itens por lista
    - Seja específico ao citar valores calculados
    - Não repita informações entre seções
    - Nunca use markdown dentro dos valores do JSON
    - Para o campo "feasibility.status", use exatamente: "${getFeasibilityStatus(saldoMensal, renda)}"`;
}

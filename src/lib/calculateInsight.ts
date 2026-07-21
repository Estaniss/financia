import { type SimulationRecord } from '@/hooks/useSimulationHistory';

export interface FinancialInsight {
  saldoMensal: number;
  percentualComprometido: number;
  mesesParaObjetivo: number | null;
  dataEstimada: string | null;
}

export function calculateInsight(simulation: SimulationRecord): FinancialInsight {
  const { renda, custosFixos, parcelas, custoObjetivo } = simulation;

  const saldoMensal = renda - custosFixos - parcelas;
  const percentualComprometido = renda > 0 ? ((custosFixos + parcelas) / renda) * 100 : 0;

  let mesesParaObjetivo: number | null = null;
  let dataEstimada: string | null = null;

  if (saldoMensal > 0 && custoObjetivo > 0) {
    mesesParaObjetivo = Math.ceil(custoObjetivo / saldoMensal);

    const estimatedDate = new Date();
    estimatedDate.setMonth(estimatedDate.getMonth() + mesesParaObjetivo);
    dataEstimada = estimatedDate.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    });
  }

  return { saldoMensal, percentualComprometido, mesesParaObjetivo, dataEstimada };
}

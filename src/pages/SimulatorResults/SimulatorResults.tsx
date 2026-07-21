import {
  AlertCircle,
  Calendar,
  CreditCard,
  Loader2,
  PiggyBank,
  Sparkles,
  Target,
  Wallet,
} from 'lucide-react';
import { Navigate, useNavigate, useParams } from 'react-router';

import { Button, InsightChat } from '@/components';
import { MetricCard } from '@/components/MetricCard';
import { useInsight } from '@/hooks/useInsight';
import { useSimulationChat } from '@/hooks/useSimulationChat';
import { useSimulationHistory } from '@/hooks/useSimulationHistory';
import { calculateInsight } from '@/lib/calculateInsight';
import { formatBRL } from '@/lib/formatCurrency';
import { cn } from '@/lib/utils';

export default function Results() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getSimulationById } = useSimulationHistory();

  const simulation = id ? getSimulationById(id) : undefined;
  const { insight, isLoading, error, fetchInsight } = useInsight(id ?? '');
  const {
    messages,
    sendMessage,
    isLoading: isChatLoading,
  } = useSimulationChat(simulation, insight);

  if (!simulation) {
    return <Navigate to="/historico" replace />;
  }

  const insightCalc = calculateInsight(simulation);
  const isPositive = insightCalc.saldoMensal > 0;
  const totalDespesas = simulation.custosFixos + simulation.parcelas;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-cotton-rose-500 dark:text-cotton-rose-400 text-2xl font-bold tracking-tight sm:text-3xl">
          Seu insight financeiro
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Baseado nas respostas que você preencheu
        </p>
      </div>

      {/* Linha 1 - 3 cards de métricas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          icon={Target}
          label="Custo da meta"
          value={formatBRL(simulation.custoObjetivo)}
          description={simulation.objetivo}
        />
        <MetricCard
          icon={Calendar}
          label="Prazo"
          value={insightCalc.mesesParaObjetivo ? `${insightCalc.mesesParaObjetivo} meses` : '—'}
          description={
            insightCalc.dataEstimada
              ? `Por volta de ${insightCalc.dataEstimada}`
              : 'Prazo para atingir a meta'
          }
        />
        <MetricCard
          icon={PiggyBank}
          label="Economia mensal"
          value={formatBRL(Math.max(insightCalc.saldoMensal, 0))}
          description="Valor mensal necessário"
        />
      </div>

      {/* Linha 2 - card de IA (grande) + 3 cards verticais */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Card 4 - Insights da IA */}
        <div className="border-border bg-card flex max-h-[600px] flex-col rounded-lg border p-6 shadow-md lg:col-span-2 dark:shadow-black/30">
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
              <Sparkles className="size-5" />
            </span>
            <h2 className="text-card-foreground text-lg font-semibold">Insights da IA</h2>
          </div>

          {/* Área com scroll: diagnóstico + chat */}
          <div className="mt-4 flex-1 space-y-4 overflow-y-auto pr-1 text-sm leading-relaxed">
            {isLoading && (
              <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                <Loader2 className="text-primary size-6 animate-spin" />
                <p className="text-muted-foreground text-sm">
                  Gerando seu diagnóstico personalizado...
                </p>
              </div>
            )}

            {error && !isLoading && (
              <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                <AlertCircle className="text-destructive size-6" />
                <p className="text-muted-foreground text-sm">{error}</p>
                <Button variant="outline" size="sm" onClick={() => fetchInsight(id ?? '')}>
                  Tentar novamente
                </Button>
              </div>
            )}

            {insight && !isLoading && !error && (
              <div className="space-y-4">
                <p className="text-card-foreground">{insight.feasibility.content}</p>

                <div>
                  <p className="text-card-foreground mb-1 font-semibold">Diagnóstico</p>
                  <p className="text-muted-foreground">{insight.diagnosis.content}</p>
                </div>

                {insight.suggestions.items.length > 0 && (
                  <div>
                    <p className="text-card-foreground mb-1 font-semibold">Sugestões</p>
                    <ul className="text-muted-foreground list-inside list-disc space-y-1">
                      {insight.suggestions.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {insight.extraIncome.items.length > 0 && (
                  <div>
                    <p className="text-card-foreground mb-1 font-semibold">Renda extra</p>
                    <ul className="text-muted-foreground list-inside list-disc space-y-1">
                      {insight.extraIncome.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {insight.investment.items.length > 0 && (
                  <div>
                    <p className="text-card-foreground mb-1 font-semibold">Investimentos</p>
                    <ul className="text-muted-foreground list-inside list-disc space-y-1">
                      {insight.investment.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="border-border text-primary border-t pt-3 font-medium">
                  {insight.motivation.content}
                </p>

                {/* Mensagens do chat aparecem aqui, dentro da mesma área com scroll */}
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted text-foreground',
                    )}
                  >
                    {message.content}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Campo de pergunta fixo, fora da área com scroll */}
          {insight && !isLoading && !error && (
            <div className="border-border border-t pt-4">
              <InsightChat messages={[]} isLoading={isChatLoading} onSend={sendMessage} />
            </div>
          )}
        </div>

        {/* Cards 5, 6 e 7 */}
        <div className="flex flex-col gap-4">
          <div className="border-border bg-card rounded-lg border p-5 shadow-md dark:shadow-black/30">
            <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
              <Wallet className="text-primary size-4" />
              Resumo das finanças
            </div>
            <p
              className={cn(
                'mt-2 text-xl font-bold',
                isPositive ? 'text-primary' : 'text-destructive',
              )}
            >
              {formatBRL(insightCalc.saldoMensal)}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              {insightCalc.percentualComprometido.toFixed(0)}% da renda comprometida
            </p>
          </div>

          <div className="border-border bg-card rounded-lg border p-5 shadow-md dark:shadow-black/30">
            <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
              <Wallet className="text-primary size-4" />
              Renda mensal
            </div>
            <p className="text-card-foreground mt-2 text-xl font-bold">
              {formatBRL(simulation.renda)}
            </p>
          </div>

          <div className="border-border bg-card rounded-lg border p-5 shadow-md dark:shadow-black/30">
            <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
              <CreditCard className="text-primary size-4" />
              Custos e dívidas
            </div>
            <p className="text-card-foreground mt-2 text-xl font-bold">
              {formatBRL(totalDespesas)}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              Fixos: {formatBRL(simulation.custosFixos)} · Parcelas:{' '}
              {formatBRL(simulation.parcelas)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <Button variant="outline" onClick={() => navigate('/')}>
          Nova simulação
        </Button>
        <Button onClick={() => navigate('/historico')}>Ver histórico</Button>
      </div>
    </div>
  );
}

import { ArrowRight, Calendar, Target, Trash2 } from 'lucide-react';
import { Link } from 'react-router';

import { Button } from '@/components';
import { useSimulationHistory } from '@/hooks/useSimulationHistory';

function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function HistoryPage() {
  const { history, removeSimulation, clearHistory } = useSimulationHistory();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-cotton-rose-500 dark:text-cotton-rose-400 text-2xl font-bold tracking-tight sm:text-3xl">
          Histórico de simulações
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Reveja simulações que você já fez anteriormente
        </p>
      </div>

      {history.length === 0 ? (
        <div className="border-border rounded-lg border border-dashed p-10 text-center">
          <p className="text-muted-foreground">Você ainda não fez nenhuma simulação.</p>
          <Button className="mt-4">
            <Link to="/">Fazer minha primeira simulação</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="border-border bg-card flex items-center justify-between gap-4 rounded-lg border p-5 shadow-sm transition-shadow hover:shadow-md dark:shadow-black/20"
            >
              <Link
                to={`/resultado/${item.id}`}
                className="focus-visible:ring-primary flex flex-1 items-center gap-4 rounded-md outline-none focus-visible:ring-2"
              >
                <span className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                  <Target className="size-5" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-card-foreground truncate font-semibold">{item.objetivo}</p>
                  <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                    <Calendar className="size-3.5" />
                    {formatDate(item.createdAt)}
                  </div>
                </div>

                <div className="hidden text-right sm:block">
                  <p className="text-card-foreground text-sm font-semibold">
                    {formatBRL(item.custoObjetivo)}
                  </p>
                  <p className="text-muted-foreground text-xs">Meta</p>
                </div>

                <ArrowRight className="text-muted-foreground size-4 shrink-0" />
              </Link>

              <button
                onClick={() => removeSimulation(item.id)}
                aria-label="Remover simulação"
                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0 rounded-md p-2 transition-colors"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}

          <div className="flex justify-center pt-2">
            <Button variant="ghost" onClick={clearHistory}>
              Limpar todo o histórico
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

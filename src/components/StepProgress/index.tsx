import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface Step {
  id: string;
  label: string;
}

interface StepProgressProps {
  steps: readonly Step[];
  currentStep: number;
  className?: string;
}

export function StepProgress({ steps, currentStep, className }: StepProgressProps) {
  const progressPercent = steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0;

  return (
    <div className={cn('w-full', className)}>
      <div className="relative flex items-center justify-between">
        <div className="bg-border absolute top-4 right-0 left-0 h-0.5 -translate-y-1/2" />
        <div
          className="bg-primary absolute top-4 left-0 h-0.5 -translate-y-1/2 transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={cn(
                  'flex size-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors duration-300',
                  isCompleted && 'border-primary bg-primary text-primary-foreground',
                  isCurrent && 'border-primary bg-background text-primary',
                  !isCompleted && !isCurrent && 'border-border bg-background text-muted-foreground',
                )}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isCompleted ? <Check className="size-4" /> : index + 1}
              </div>

              <span
                className={cn(
                  'max-w-20 text-center text-xs font-medium transition-colors duration-300',
                  isCurrent && 'text-foreground',
                  !isCurrent && 'text-muted-foreground',
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { type LucideIcon } from 'lucide-react';
import { type InputHTMLAttributes, type Ref, useId } from 'react';

import { cn } from '@/lib/utils';

export interface FormQuestionInputProps extends InputHTMLAttributes<HTMLInputElement> {
  question: string;
  icon?: LucideIcon;
  helperText?: string;
  error?: string;
  ref?: Ref<HTMLInputElement>;
}

export function FormQuestionInput({
  question,
  icon: Icon,
  helperText,
  error,
  className,
  id,
  ref,
  ...props
}: FormQuestionInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="w-full space-y-2">
      <label
        htmlFor={inputId}
        className="text-foreground flex items-center gap-2 text-base leading-snug font-semibold"
      >
        {Icon && <Icon className="text-muted-foreground size-5 shrink-0" strokeWidth={2} />}
        {question}
      </label>

      <div
        className={cn(
          'border-border bg-card flex items-center gap-3 rounded-lg border px-4 py-3 shadow-sm transition-shadow',
          'focus-within:border-primary focus-within:ring-primary/20 focus-within:shadow-md focus-within:ring-2',
          error && 'border-destructive focus-within:ring-destructive/20',
        )}
      >
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'text-foreground placeholder:text-muted-foreground w-full bg-transparent text-base outline-none',
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
      </div>

      {error && (
        <p id={`${inputId}-error`} className="text-destructive text-sm">
          {error}
        </p>
      )}

      {!error && helperText && (
        <p id={`${inputId}-helper`} className="text-muted-foreground text-sm">
          {helperText}
        </p>
      )}
    </div>
  );
}

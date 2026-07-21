import { Loader2, Send } from 'lucide-react';
import { type FormEvent, useRef, useState } from 'react';

import { type ChatMessage } from '@/lib/buildChatPrompt';
import { cn } from '@/lib/utils';

interface InsightChatProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSend: (question: string) => void;
}

export function InsightChat({ messages, isLoading, onSend }: InsightChatProps) {
  const [question, setQuestion] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!question.trim()) return;

    onSend(question);
    setQuestion('');
    inputRef.current?.focus();
  }

  return (
    <div className="border-border mt-4 space-y-3 border-t pt-4">
      {messages.length > 0 && (
        <div className="space-y-3">
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

      {isLoading && (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Loader2 className="size-4 animate-spin" />
          Pensando...
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          ref={inputRef}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Pergunte algo sobre sua simulação..."
          disabled={isLoading}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary flex-1 rounded-md border px-3 py-2 text-sm outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !question.trim()}
          aria-label="Enviar pergunta"
          className="bg-primary text-primary-foreground flex size-9 shrink-0 items-center justify-center rounded-md transition-colors hover:opacity-90 disabled:opacity-50"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  );
}

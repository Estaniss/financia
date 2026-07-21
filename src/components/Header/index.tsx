import { Wallet } from 'lucide-react';

import { ThemeToggle } from '..';

export function Header() {
  return (
    <header className="border-border bg-background/80 sticky top-0 z-50 border-b backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <a
          href="/"
          className="focus-visible:ring-primary flex items-center gap-2 rounded-md outline-none focus-visible:ring-2"
        >
          <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-lg">
            <Wallet className="size-5" strokeWidth={2.25} />
          </span>
          <span className="text-foreground text-lg font-bold tracking-tight">
            Financ<span className="text-primary">.IA</span>
          </span>
        </a>

        {/* Ações do header */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

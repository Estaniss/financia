import useTheme from '@/hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="border-border bg-card text-card-foreground hover:bg-muted rounded-md border px-3 py-1.5 text-sm transition-colors"
    >
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}

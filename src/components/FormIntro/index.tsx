interface FormIntroProps {
  title: string;
  description: string;
}

export function FormIntro({ title, description }: FormIntroProps) {
  return (
    <div className="space-y-2 text-center">
      <h1 className="text-cotton-rose-500 dark:text-cotton-rose-400 text-2xl font-bold tracking-tight sm:text-3xl">
        {title}
      </h1>
      <p className="text-muted-foreground text-sm sm:text-base">{description}</p>
    </div>
  );
}

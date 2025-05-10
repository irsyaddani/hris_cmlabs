interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export function FormSection({ title, children }: FormSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-md text-muted-foreground font-regular">{title}</h3>
      <hr className="border-neutral-200 my-4" />
      <div className="grid gap-4">{children}</div>
    </div>
  );
}

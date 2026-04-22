export default function SectionEyebrow({ label }: { label: string }) {
  return (
    <div className="mb-10 flex items-center gap-4 md:mb-14">
      <span className="section-eyebrow">{label}</span>
      <div className="h-px flex-1 bg-[var(--color-rule)]" />
    </div>
  );
}

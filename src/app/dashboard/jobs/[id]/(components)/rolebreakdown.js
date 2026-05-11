import { CheckCircle2 } from "lucide-react";

export default function RoleBreakdown({ description }) {
  return (
    <section className="bg-[var(--color-background-secondary)] rounded-[2.5rem] p-8 md:p-12 border border-[var(--color-border-secondary)] shadow-sm">
      <h2 className="text-3xl font-black mb-10 text-[var(--color-text-primary)] tracking-tighter uppercase italic">Role Breakdown</h2>
      <div className="space-y-6">
        {description?.split('\n').filter(l => l.trim()).map((line, index) => (
          <div key={index} className="flex gap-6 group">
            <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed font-medium">
              {line.replace(/^- /, '')}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
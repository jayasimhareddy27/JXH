import { MessageSquareText, Lightbulb } from "lucide-react";

export default function InterviewPrep({ questions }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
          <MessageSquareText size={20} />
        </div>
        <h2 className="text-xl font-black uppercase tracking-tight">Interview Cheat Sheet</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questions.map((q, idx) => (
          <div key={idx} className="p-5 bg-white border border-[var(--color-border-secondary)] rounded-[1.5rem] shadow-sm group hover:border-rose-500 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-rose-500 text-white rounded-md">
                {q.focusArea}
              </span>
            </div>
            <p className="text-sm font-bold text-[var(--color-text-primary)] leading-tight italic">
              "{q.question}"
            </p>
            <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Lightbulb size={12} className="text-amber-500" />
              <span className="text-[10px] font-black uppercase text-[var(--color-text-placeholder)]">Think about this...</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
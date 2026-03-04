import { FLOW_STAGES } from "./constants.js";

export default function FilterBar({ activeStage, stageIndex, onStageChange }) {
  return (
    <div className="bg-[var(--color-card-bg)] rounded-2xl border border-[var(--color-border-secondary)] p-4 shadow-sm overflow-x-auto">
      <div className="flex items-center justify-between relative min-w-[1000px]">
        <div className="absolute top-1/2 left-0 w-full h-[3px] bg-[var(--color-background-tertiary)] -translate-y-6" />

        {FLOW_STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isActive = idx === stageIndex;
          const isCompleted = idx < stageIndex && idx !== 0;

          return (
            <button
              key={stage.key}
              onClick={() => onStageChange(stage.key)}
              className="relative z-10 flex flex-col items-center flex-1"
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all
                  ${isActive 
                    ? "bg-[var(--color-button-primary-bg)] text-[var(--color-text-on-primary)] scale-110 shadow-lg" 
                    : isCompleted 
                    ? "bg-[var(--color-button-primary-hover-bg)] text-[var(--color-text-on-primary)]" 
                    : "bg-[var(--color-card-bg)] border border-[var(--color-border-primary)] text-[var(--color-text-secondary)]"
                  }`}
              >
                <Icon size={16} />
              </div>
              <span className={`mt-2 text-[11px] font-bold uppercase tracking-wider
                ${isActive || isCompleted ? "text-[var(--color-button-primary-bg)]" : "text-[var(--color-text-secondary)]"}`}>
                {stage.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
// dashboard/jobs/edit/(components)/IconInput.js

export default function IconInput({ icon, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="group flex items-center gap-3 px-3 py-2 rounded-xl bg-transparent hover:bg-[var(--color-background-tertiary)] transition-all border border-transparent hover:border-[var(--color-border-secondary)]">
      {/* ICON - Wrapped in a fixed-width container for alignment */}
      <div className="flex-shrink-0 text-[var(--color-text-placeholder)] group-hover:text-blue-500 transition-colors">
        {icon}
      </div>

      {/* INPUT - Transparent background to blend into the parent card */}
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none text-xs font-bold text-[var(--color-text-primary)] placeholder:text-[var(--color-text-placeholder)] placeholder:font-medium tracking-tight"
      />
    </div>
  );
}
import { ShieldAlert, X } from "lucide-react";

export default function RedFlagSection({ tags, setTags, commonHurdles }) {
  const toggleTag = (tag) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  return (
    <div className="p-6 rounded-[2rem] border border-[var(--color-danger)] bg-[var(--color-background-secondary)] space-y-5 border-dashed">
      <span className="text-[10px] font-black text-[var(--color-danger)] uppercase tracking-widest flex items-center gap-2">
        <ShieldAlert size={16}/> Red Flag Hurdles
      </span>
      <div className="grid grid-cols-2 gap-2 pb-2">
        {commonHurdles.map(tag => (
          <button key={tag} type="button" onClick={() => toggleTag(tag)}
            className={`text-[9px] font-bold p-2 rounded-lg border transition-all ${
              tags.includes(tag) ? 'bg-[var(--color-danger)] text-white' : 'bg-transparent text-[var(--color-text-secondary)]'
            }`}
          > {tag} </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span key={tag} className="card-tag flex items-center gap-1">
            {tag} <X size={12} className="cursor-pointer" onClick={() => toggleTag(tag)} />
          </span>
        ))}
      </div>
    </div>
  );
}
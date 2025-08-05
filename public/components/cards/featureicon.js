import React from "react";

const Feature = ({ icon, title, children }) => (
  <div className="text-center text-[color:var(--color-text-primary)]">
    <div
      className="flex items-center justify-center h-16 w-16 rounded-2xl mb-6 mx-auto"
      style={{
        backgroundColor: "var(--color-bg-feature)",
        color: "var(--color-primary)",
      }}
    >
      {React.cloneElement(icon, { className: "h-8 w-8" })}
    </div>
    <h3 className="text-xl font-semibold mb-3 text-[color:var(--color-text-primary)]">
      {title}
    </h3>
    <p className="text-[color:var(--color-text-secondary)] leading-relaxed">{children}</p>
  </div>
);

export default Feature;

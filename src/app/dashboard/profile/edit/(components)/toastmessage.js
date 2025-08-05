"use client";

export default function ToastMessage({ message }) {
  if (!message) return null;
  return (
    <div
      className="
        fixed top-4 left-1/2 transform -translate-x-1/2
        bg-[color:var(--color-cta-bg)]
        text-[color:var(--color-cta-text)]
        px-5 py-3 rounded-md shadow-lg z-50
        font-medium text-sm select-none
        ring-2 ring-[color:var(--color-button-primary-hover-bg)]
      "
      role="alert"
      aria-live="assertive"
    >
      {message}
    </div>
  );
}

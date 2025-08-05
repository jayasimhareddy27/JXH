export default function StatusMessage({ message }) {
  return (
    <div className="text-center mt-8 ">
      <p className="text-lg text-[color:var(--color-text-secondary)]">{message}</p>
    </div>
  );
}
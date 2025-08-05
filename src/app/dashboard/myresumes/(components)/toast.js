import { useEffect } from "react";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg text-white ${type === "error" ? "bg-red-600" : "bg-green-600"} animate-fade-in`}>
      {type === "error" ? "⚠️ " : "✅ "} {message}
    </div>
  );
};

export default Toast;
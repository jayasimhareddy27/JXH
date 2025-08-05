"use client";

export default function ToastMessage({ message }) {
  if (!message) return null;
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded z-50">
      {message}
    </div>
  );
}
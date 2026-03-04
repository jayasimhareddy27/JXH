/**
 * Simple helper to turn a date string into "Xd ago" format.
 */
export function timeAgo(date) {
  if (!date) return "N/A";
  
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const days = Math.floor(seconds / 86400);

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}
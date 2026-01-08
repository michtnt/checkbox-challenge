import { formatDistanceToNow } from 'date-fns';

export const formatRelativeTime = (date: Date | null): string => {
  if (!date) return '';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  // If less than 30 seconds, show "just now"
  if (diffMs < 30000) {
    return 'just now';
  }

  // If more than 1 day, show full date
  if (diffMs > 24 * 60 * 60 * 1000) {
    return (
      date.toLocaleDateString() +
      ' ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  }

  // Use date-fns for relative time formatting
  return formatDistanceToNow(date, { addSuffix: true });
};

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const formatRelativeDate = (date: Date | string): string => {
  const now = new Date();
  const d = new Date(typeof date === 'string' ? new Date(date) : date);
  d.setHours(d.getHours() + 2);
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffMonth > 1) {
    return d.toLocaleDateString();
  }
  if (diffMonth === 1) {
    return 'last month';
  }
  if (diffWeek > 1) {
    return `${String(diffWeek)} weeks ago`;
  }
  if (diffWeek === 1) {
    return 'last week';
  }
  if (diffDay > 1) {
    return `${String(diffDay)} days ago`;
  }
  if (diffDay === 1) {
    return 'yesterday';
  }
  if (diffHour > 1) {
    return `${String(diffHour)} hours ago`;
  }
  if (diffHour === 1) {
    return '1 hour ago';
  }
  if (diffMin > 1) {
    return `${String(diffMin)} minutes ago`;
  }
  if (diffMin === 1) {
    return '1 minute ago';
  }
  return 'just now';
};

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const capitalize = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

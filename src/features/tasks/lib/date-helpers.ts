import { useEffect, useState } from 'react';
import { TaskStatus } from '../types/task';

export const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleString(undefined, {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  });

export const getDuration = (start: Date, end: Date) => {
  const diffMs = Math.abs(end.getTime() - start.getTime());
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
};

export const getRelative = (date: Date | string) => {
  const base = typeof date === 'string' ? new Date(date) : date;
  const diffMs = Date.now() - base.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) {
    return `${diffSec} seconds ago`;
  }
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return `${diffMin} minutes ago`;
  }
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) {
    return `${diffHrs} hours ago`;
  }
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }
  if (diffDays < 14) {
    return '1 week ago';
  }
  if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)} weeks ago`;
  }
  return `${diffDays} days ago`;
};

export const useDuration = (
  startDate: Date | string,
  status: TaskStatus,
  endDate?: Date | null | string,
) => {
  const live = status === 'R' || status === 'Q';

  const calc = () => {
    const start =
      typeof startDate === 'string' ? new Date(startDate) : startDate;

    let end: Date;
    if (live) {
      end = new Date();
    } else if (endDate) {
      end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    } else {
      end = start;
    }
    return getDuration(start, end);
  };

  const [duration, setDuration] = useState(calc);

  useEffect(() => {
    if (!live) {
      setDuration(calc());
      return;
    }
    const id = setInterval(() => setDuration(calc()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, startDate, endDate]);

  return duration;
};

export const useRelativeTime = (date: Date | string) => {
  const [relative, setRelative] = useState(() => getRelative(date));
  useEffect(() => {
    const id = setInterval(() => setRelative(getRelative(date)), 60_000);
    return () => clearInterval(id);
  }, [date]);
  return relative;
};

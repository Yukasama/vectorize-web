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
  const diffMs = end.getTime() - start.getTime();
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

export const getRelative = (dateString: string) => {
  const diffMs = Date.now() - new Date(dateString).getTime();
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
  if (diffDays > 7 && diffDays < 14) {
    return '1 week ago';
  }
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} weeks ago`;
  }
  return `${diffDays} days ago`;
};

export const useDuration = (
  startDate: string,
  status: TaskStatus,
  endDate?: null | string,
) => {
  const getInitialDuration = () => {
    return status === 'R'
      ? getDuration(new Date(startDate), new Date())
      : getDuration(new Date(startDate), new Date(endDate ?? startDate));
  };

  const [duration, setDuration] = useState(() => getInitialDuration());
  const [initialSeconds, setInitialSeconds] = useState<number | undefined>();

  useEffect(() => {
    if (status !== 'R') {
      setDuration(getInitialDuration());
      setInitialSeconds(undefined);
      return;
    }

    if (initialSeconds === undefined) {
      const startTime = new Date(startDate).getTime();
      const currentTime = Date.now();
      const diffSeconds = Math.floor((currentTime - startTime) / 1000);
      setInitialSeconds(diffSeconds);
    }

    const id = setInterval(() => {
      setInitialSeconds((prev) => {
        if (prev === undefined) {
          return;
        }
        const newSeconds = prev + 1;

        const minutes = Math.floor(newSeconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
          setDuration(`${hours}h ${minutes % 60}m`);
        } else if (minutes > 0) {
          setDuration(`${minutes}m ${newSeconds % 60}s`);
        } else {
          setDuration(`${newSeconds}s`);
        }

        return newSeconds;
      });
    }, 1000);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, startDate, endDate, initialSeconds]);

  return duration;
};

export const useRelativeTime = (dateString: string) => {
  const [relative, setRelative] = useState(() => getRelative(dateString));
  useEffect(() => {
    const id = setInterval(
      () => setRelative(getRelative(dateString)),
      60 * 1000,
    );
    return () => clearInterval(id);
  }, [dateString]);
  return relative;
};

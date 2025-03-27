import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const capitalize = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

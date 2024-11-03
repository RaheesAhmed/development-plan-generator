import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateThreadId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function generateApiKey(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2);
  return `sk_${timestamp}${random}`;
}

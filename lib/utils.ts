import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";
import { randomBytes } from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateThreadId(): string {
  return uuidv4();
}

export function generateApiKey(): string {
  return randomBytes(32).toString("hex");
}

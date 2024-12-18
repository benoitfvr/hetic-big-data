import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const buildQuery = (
  filters: Record<string, string | boolean | number | null | undefined>
): string => {
  return Object.entries(filters)
    .filter(
      ([, value]) => value !== null && value !== undefined && value !== ""
    ) // Exclude null, undefined, or empty values
    .map(
      ([key, value]) =>
        typeof value === "boolean"
          ? `${key}=${value ? 1 : 0}` // Handle booleans
          : `${key}=${encodeURIComponent(String(value))}` // Handle strings, numbers, and other types
    )
    .join("&");
};

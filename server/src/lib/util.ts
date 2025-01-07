import { API_PATTERNS } from "./constant";

export const isPotentialAPIRequest = (response: string): boolean => {
  const patterns = Object.values(API_PATTERNS);
  const matchCount = patterns.reduce((count, pattern) =>
    count + (pattern.test(response) ? 1 : 0), 0);

  return matchCount >= 1;
};


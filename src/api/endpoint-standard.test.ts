import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

function findLegacyPrefix(content: string): number {
  const needle = '/v3/api';
  let index = content.indexOf(needle);

  while (index !== -1) {
    const prefix = content.slice(Math.max(0, index - 4), index);
    if (prefix !== '/app') {
      return index;
    }
    index = content.indexOf(needle, index + needle.length);
  }

  return -1;
}

describe('api endpoint standard', () => {
  it('should not use legacy /v3/api prefix in api modules', () => {
    const currentDir = dirname(fileURLToPath(import.meta.url));
    const files = readdirSync(currentDir).filter(
      (file) =>
        file.endsWith('.ts') &&
        !file.endsWith('.test.ts') &&
        file !== 'paths.ts'
    );

    const violations: string[] = [];

    files.forEach((file) => {
      const filePath = join(currentDir, file);
      const content = readFileSync(filePath, 'utf8');
      const index = findLegacyPrefix(content);

      if (index !== -1) {
        violations.push(`${file}:${index}`);
      }
    });

    expect(violations).toEqual([]);
  });

  it('should not hardcode /app/v3/api prefix in api modules', () => {
    const currentDir = dirname(fileURLToPath(import.meta.url));
    const files = readdirSync(currentDir).filter(
      (file) =>
        file.endsWith('.ts') &&
        !file.endsWith('.test.ts') &&
        file !== 'paths.ts'
    );

    const violations: string[] = [];

    files.forEach((file) => {
      const filePath = join(currentDir, file);
      const content = readFileSync(filePath, 'utf8');
      const index = content.indexOf('/app/v3/api');

      if (index !== -1) {
        violations.push(`${file}:${index}`);
      }
    });

    expect(violations).toEqual([]);
  });
});

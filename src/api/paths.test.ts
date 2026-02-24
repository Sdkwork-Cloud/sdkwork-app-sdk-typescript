import { describe, expect, it } from 'vitest';
import { appApiPath, coreApiPath } from './paths';

describe('api paths', () => {
  it('should build core api paths', () => {
    expect(coreApiPath('/auth/login')).toBe('/app/v3/api/auth/login');
    expect(coreApiPath('auth/login')).toBe('/app/v3/api/auth/login');
  });

  it('should build app api paths', () => {
    expect(appApiPath('/projects')).toBe('/app/v3/api/projects');
    expect(appApiPath('projects')).toBe('/app/v3/api/projects');
  });
});

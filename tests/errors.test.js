import { describe, it, expect } from 'vitest';
import { NotFoundError, UnauthorizedError, ForbiddenError, IllegalArgumentError } from '../src/utils/errors.js';

describe('Custom Errors', () => {
  it('NotFoundError should have status 404', () => {
    const err = new NotFoundError('Test 404');
    expect(err.status).toBe(404);
    expect(err.name).toBe('NotFoundError');
  });

  it('UnauthorizedError should have status 401', () => {
    const err = new UnauthorizedError('Test 401');
    expect(err.status).toBe(401);
    expect(err.name).toBe('UnauthorizedError');
  });

  it('ForbiddenError should have status 403', () => {
    const err = new ForbiddenError('Test 403');
    expect(err.status).toBe(403);
    expect(err.name).toBe('ForbiddenError');
  });

  it('IllegalArgumentError should have status 400', () => {
    const err = new IllegalArgumentError('Test 400');
    expect(err.status).toBe(400);
    expect(err.name).toBe('IllegalArgumentError');
  });
});

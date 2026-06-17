import { describe, it, expect, vi } from 'vitest';
import { UnauthorizedError, ForbiddenError } from '../src/utils/errors.js';
import app from '../src/app.js';

describe('Global Error Handler', () => {
  it('should handle different error statuses', () => {
    // Le middleware est le dernier dans la stack de app._router
    const middleware = app._router.stack.find(layer => layer.name === '<anonymous>' && layer.handle.length === 4).handle;
    
    const req = {};
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    const next = vi.fn();

    middleware({ status: 400, message: 'Bad request' }, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Bad Request' }));

    middleware({ status: 401, message: 'Unauthorized' }, req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Unauthorized' }));

    middleware({ status: 403, message: 'Forbidden' }, req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Forbidden' }));

    middleware({ status: 404, message: 'Not found' }, req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Not Found' }));

    middleware({ message: 'Internal error' }, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Internal Server Error' }));
  });
});

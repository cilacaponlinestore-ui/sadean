import { Logger } from '@nestjs/common';
import { RequestLoggingMiddleware } from './request-logging.middleware';

describe('RequestLoggingMiddleware', () => {
  it('propagates request ID and emits safe structured access fields', () => {
    const logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    let finish: () => void = () => undefined;
    const req: any = {
      method: 'POST',
      originalUrl: '/api/v1/banners',
      body: { password: 'secret' },
      headers: { authorization: 'Bearer secret' },
      header: (name: string) => name === 'x-request-id' ? 'client-request-id' : undefined,
    };
    const res: any = {
      statusCode: 201,
      setHeader: jest.fn(),
      on: (_event: string, callback: () => void) => { finish = callback; },
    };

    new RequestLoggingMiddleware().use(req, res, jest.fn());
    finish();

    expect(req.requestId).toBe('client-request-id');
    expect(res.setHeader).toHaveBeenCalledWith('x-request-id', 'client-request-id');
    const entry = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(entry).toEqual(expect.objectContaining({
      level: 'log', module: 'HTTP', method: 'POST', path: '/api/v1/banners',
      statusCode: 201, requestId: 'client-request-id',
    }));
    expect(entry.durationMs).toEqual(expect.any(Number));
    expect(JSON.stringify(entry)).not.toContain('secret');
    logSpy.mockRestore();
  });
});

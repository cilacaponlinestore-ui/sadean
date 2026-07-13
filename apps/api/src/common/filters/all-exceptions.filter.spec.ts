import { BadRequestException } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';

describe('AllExceptionsFilter', () => {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  const request = { method: 'POST', originalUrl: '/api/v1/users', requestId: 'request-1' };
  const host = {
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: () => ({ status }),
    }),
  } as any;

  beforeEach(() => jest.clearAllMocks());

  it('preserves validation message arrays and request ID', () => {
    new AllExceptionsFilter().catch(
      new BadRequestException({ message: ['email must be an email'], error: 'Bad Request' }),
      host,
    );

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        path: '/api/v1/users',
        statusCode: 400,
        error: 'Bad Request',
        message: ['email must be an email'],
        requestId: 'request-1',
      }),
    );
  });

  it('masks unexpected exception details in production', () => {
    const previousEnvironment = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    new AllExceptionsFilter().catch(new Error('database password leaked'), host);
    process.env.NODE_ENV = previousEnvironment;

    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 500, message: 'Internal server error' }),
    );
    expect(JSON.stringify(json.mock.calls[0][0])).not.toContain('database password leaked');
  });
});

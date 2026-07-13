import { Logger } from '@nestjs/common';
import { AuditService } from './audit.service';

describe('AuditService', () => {
  const create = jest.fn();
  const prisma = { auditLog: { create } } as any;
  let service: AuditService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuditService(prisma);
  });

  it('persists the actor, entity and metadata', async () => {
    create.mockResolvedValue({ id: 'log-1' });

    await service.record({
      actorId: 'admin-1',
      action: 'SELLER_REJECT',
      entity: 'Seller',
      entityId: 'seller-1',
      metadata: { reason: 'Incomplete documents' },
    });

    expect(create).toHaveBeenCalledWith({
      data: {
        userId: 'admin-1',
        action: 'SELLER_REJECT',
        entity: 'Seller',
        entityId: 'seller-1',
        newData: { reason: 'Incomplete documents' },
      },
    });
  });

  it('logs and does not reject when persistence fails', async () => {
    const errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    create.mockRejectedValue(new Error('database unavailable'));

    await expect(
      service.record({ actorId: 'admin-1', action: 'PRODUCT_DELETE', entity: 'Product' }),
    ).resolves.toBeUndefined();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});

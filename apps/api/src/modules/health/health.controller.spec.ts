import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { PrismaService } from '../../prisma/prisma.service';

describe('HealthController', () => {
  let controller: HealthController;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [PrismaService],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should return ok when db is connected', async () => {
    jest.spyOn(prisma, '$queryRaw').mockResolvedValue([{ '1': 1 }]);
    const result = await controller.check();
    expect(result.status).toBe('ok');
    expect(result.db).toBe('connected');
  });

  it('should return error when db is disconnected', async () => {
    jest.spyOn(prisma, '$queryRaw').mockRejectedValue(new Error('DB down'));
    const result = await controller.check();
    expect(result.status).toBe('error');
    expect(result.db).toBe('disconnected');
  });
});

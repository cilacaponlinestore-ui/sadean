import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export interface AuditEvent {
  actorId: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Prisma.InputJsonValue;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async record(event: AuditEvent): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: event.actorId,
          action: event.action,
          entity: event.entity,
          entityId: event.entityId,
          newData: event.metadata,
        },
      });
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          level: 'error',
          module: AuditService.name,
          message: 'Audit log write failed',
          actorId: event.actorId,
          action: event.action,
          entity: event.entity,
          entityId: event.entityId,
        }),
        process.env.NODE_ENV === 'production' ? undefined : error instanceof Error ? error.stack : undefined,
      );
    }
  }
}

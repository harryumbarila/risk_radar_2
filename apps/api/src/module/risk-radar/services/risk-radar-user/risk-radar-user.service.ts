import { Injectable } from '@nestjs/common';
import { InjectPinoLogger } from 'nestjs-pino';
import { Logger } from 'pino';

import { RiskRadarUserRepository } from '@/finance-db/repositories';

type User = {
  id: number;
  ntUserId: string;
};

@Injectable()
export class RiskRadarUserService {
  public constructor(
    @InjectPinoLogger(RiskRadarUserService.name)
    private readonly logger: Logger,
    private readonly userRepository: RiskRadarUserRepository
  ) {}

  /**
   * Get user by ID
   */
  public async getUserById(id: number): Promise<User | null> {
    this.logger.info(`Getting user with ID ${id}`);

    try {
      const user = await this.userRepository.findOne({
        where: { id },
        select: ['id', 'ntUserId'],
      });

      if (!user) {
        this.logger.warn(`User with ID ${id} not found`);
        return null;
      }

      return user as User;
    } catch (error: unknown) {
      this.logger.error(
        { err: error },
        `Error getting user with ID ${id}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
      throw error;
    }
  }
}

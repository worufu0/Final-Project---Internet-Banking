import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.manager);
  }

  /**
   * find user by email
   * @param email
   * @returns
   */
  async findByEmail(email: string): Promise<User> {
    return await this.findOne({
      where: {
        email,
      },
    });
  }

  /**
   * find user by token
   * @param refreshToken
   * @returns
   */
  async findUserByToken(refreshToken: string): Promise<User> {
    return await this.findOne({
      where: {
        refreshToken,
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { TransactionType } from '../../../configs/enum/transaction-type';
import { DataSource, Repository } from 'typeorm';
import { TransactionHistory } from './entities/transaction-history.entity';

@Injectable()
export class TransactionHistoryRepository extends Repository<TransactionHistory> {
  constructor(dataSource: DataSource) {
    super(TransactionHistory, dataSource.manager);
  }

  async createTransactionHistory(
    from: number,
    to: number,
    type: TransactionType,
    cash: number,
  ) {
    return await this.save({
      type,
      from: {
        id: from,
      },
      to: {
        id: to,
      },
      cash,
    });
  }

  async getTransfers(auth, field) {
    return await this.find({
      where: {
        [field]: {
          id: auth.id,
        },
        type: TransactionType.TRANSFERS,
      },
      select: {
        from: {
          phone: true,
          fullname: true,
          email: true,
        },
        to: {
          phone: true,
          fullname: true,
          email: true,
        },
        cash: true,
        createdAt: true,
      },
      relations: {
        to: true,
        from: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getSender(auth) {
    return await this.find({
      where: {
        from: {
          id: auth.id,
        },
        type: TransactionType.TRANSFERS,
      },
      select: {
        from: {
          phone: true,
          fullname: true,
          email: true,
        },
        to: {
          phone: true,
          fullname: true,
          email: true,
        },
        cash: true,
        createdAt: true,
      },
      relations: {
        to: true,
        from: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getReceiver(auth) {
    return await this.find({
      where: {
        to: {
          id: auth.id,
        },
        type: TransactionType.TRANSFERS,
      },
      select: {
        from: {
          phone: true,
          fullname: true,
          email: true,
        },
        to: {
          phone: true,
          fullname: true,
          email: true,
        },
        cash: true,
        createdAt: true,
      },
      relations: {
        to: true,
        from: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getPays(auth) {
    return await this.find({
      where: {
        from: {
          id: auth.id,
        },
        type: TransactionType.PAY,
      },
      select: {
        from: {
          phone: true,
          fullname: true,
          email: true,
        },
        to: {
          phone: true,
          fullname: true,
          email: true,
        },
        cash: true,
        createdAt: true,
      },
      relations: {
        to: true,
        from: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}

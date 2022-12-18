import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateDebtReminber } from './dto/create-debt-reminber.dto';
import { DebtReminder } from './entities/debt-reminder.entity';

@Injectable()
export class DebtReminderRepository extends Repository<DebtReminder> {
  constructor(dataSource: DataSource) {
    super(DebtReminder, dataSource.manager);
  }

  async createDebtReminder(
    fromId: number,
    toId: number,
    input: CreateDebtReminber,
  ) {
    return await this.insert({
      from: {
        id: fromId,
      },
      to: {
        id: toId,
      },
      cash: input.cash,
      description: input.description,
      statusTransaction: false,
    });
  }
}

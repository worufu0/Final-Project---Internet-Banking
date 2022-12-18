import { HttpStatus, Injectable } from '@nestjs/common';
import { DebtReminderRepository } from './debt-reminder.repository';
import { BaseException } from '../../../vendors/exceptions/base.exception';
import { User } from '../user/entities/user.entity';
import { CreateDebtReminber } from './dto/create-debt-reminber.dto';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class DebtReminderService {
  constructor(
    private debtReminderRepository: DebtReminderRepository,
    private userRepository: UserRepository,
  ) {}
  async createDebtReminder(auth: User, createDebtReminber: CreateDebtReminber) {
    const { accountNumber } = createDebtReminber;
    const toUser = await this.userRepository.findOne({
      where: {
        accounts: {
          accountNumber,
        },
      },
    });

    const debtReminber = await this.debtReminderRepository.createDebtReminder(
      auth.id,
      toUser.id,
      createDebtReminber,
    );
    return debtReminber;
  }

  async findSelfCreatedList(auth) {
    return await this.debtReminderRepository.find({
      where: {
        from: auth.id,
      },
      relations: {
        to: {
          id: true,
          email: true,
          fullname: true,
          phone: true,
        },
      },
    });
  }

  async findListReceived(auth) {
    return await this.debtReminderRepository.find({
      where: {
        to: auth.id,
      },
      relations: {
        from: {
          id: true,
          email: true,
          fullname: true,
          phone: true,
        },
      },
    });
  }

  async deleteDebtReminber(from, id: number): Promise<string> {
    const { affected } = await this.debtReminderRepository.delete({
      id,
      from: {
        id: from.id,
      },
    });
    if (!affected) {
      throw new BaseException(
        'DEBT_REMINBER_NOT_EXISTS',
        'Nhắc nợ không tồn tại',
      );
    }
    return 'OK';
  }
}

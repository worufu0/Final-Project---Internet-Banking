import { HttpStatus, Injectable } from '@nestjs/common';
import { DebtReminderRepository } from './debt-reminder.repository';
import { BaseException } from '../../../vendors/exceptions/base.exception';
import { User } from '../user/entities/user.entity';
import { CreateDebtReminber, PayDebt } from './dto/create-debt-reminber.dto';
import { UserRepository } from '../user/user.repository';
import { DebtReminder } from './entities/debt-reminder.entity';
import { OtpTransactionRepository } from '../account/otp.repository';
import { TransactionHistoryRepository } from '../transaction-history/transaction-history.repository';
import { AccountRepository } from '../account/account.repository';
import { AccountType } from '../../../configs/enum/account';
import { TransactionType } from '../../../configs/enum/transaction-type';

@Injectable()
export class DebtReminderService {
  constructor(
    private debtReminderRepository: DebtReminderRepository,
    private userRepository: UserRepository,
    private otpTransactionRepository: OtpTransactionRepository,
    private accountRepository: AccountRepository,
    private transactionHistoryRepository: TransactionHistoryRepository,
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

  async realtimeDebtReminber(id: number): Promise<DebtReminder[]> {
    const data = await this.debtReminderRepository.find({
      where: {
        from: {
          id,
        },
        statusTransaction: true,
      },
    });
    return data;
  }

  async payDebt(debtId: number): Promise<string> {
    const debt = await this.debtReminderRepository.findOne({
      where: {
        id: debtId,
      },
      relations: {
        from: true,
        to: true,
      },
    });

    const chuNo = await this.accountRepository.findOne({
      where: {
        user: {
          id: debt.from.id,
        },
        accountType: AccountType.PaymentAccount,
      },
      relations: {
        user: true,
      },
    });

    const conNo = await this.accountRepository.findOne({
      where: {
        user: {
          id: debt.to.id,
        },
        accountType: AccountType.PaymentAccount,
      },
      relations: {
        user: true,
      },
    });

    if (conNo.blance < debt.cash) {
      throw new BaseException(
        'CASH_INVALID',
        'Số dư không đủ thể thực hiện giao dịch',
        null,
        HttpStatus.FORBIDDEN,
      );
    }

    conNo.blance -= debt.cash;
    chuNo.blance += debt.cash;
    debt.statusTransaction = true;

    await Promise.all([
      this.debtReminderRepository.save(debt),
      this.accountRepository.save(chuNo),
      this.accountRepository.save(conNo),
      this.transactionHistoryRepository.createTransactionHistory(
        conNo.user.id,
        chuNo.user.id,
        TransactionType.DEBT,
        debt.cash,
      ),
    ]);
    return 'Debt successfully';
  }
}

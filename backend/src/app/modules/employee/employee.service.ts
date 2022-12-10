import { HttpStatus, Injectable } from '@nestjs/common';
import { USER_ERRORS } from '../../../configs/constants/error-code';
import { BaseException } from '../../../vendors/exceptions/base.exception';
import { AccountRepository } from '../account/account.repository';
import { TransactionHistoryRepository } from '../transaction-history/transaction-history.repository';
import { UserRepository } from '../user/user.repository';
import { LoginInput } from './dto/login-input.dto';
import { PaymentInput } from './dto/paymentInput.dto';
import * as bcrypt from 'bcrypt';
import { EmployeeRepository } from './employee.repository';

@Injectable()
export class EmployeeService {
  constructor(
    private accountRepository: AccountRepository,
    private userRepository: UserRepository,
    private transactionHistoryRepository: TransactionHistoryRepository,
    private employeeRepository: EmployeeRepository,
  ) {}

  async addCash(inputPayment: PaymentInput) {
    const { accountNumber, cash } = inputPayment;
    const account = await this.accountRepository.findOneBy({ accountNumber });
    if (!account) {
      throw new BaseException(
        'ACCOUNT_NOT_EXISTS',
        'Account not exists',
        null,
        HttpStatus.OK,
      );
    }
    const sender = await this.accountRepository.addCash(account, cash);
    return sender;
  }

  async getTransactionHistory(id) {
    const user = this.userRepository.findOneBy({ id });
    const sender = await this.transactionHistoryRepository.getTransfers(
      user,
      'from',
    );

    const receiver = await this.transactionHistoryRepository.getTransfers(
      user,
      'to',
    );

    const pay = await this.transactionHistoryRepository.getPays(user);

    return {
      sender,
      receiver,
      pay,
    };
  }
}

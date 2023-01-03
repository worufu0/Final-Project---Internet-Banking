import { MailerService } from '@nestjs-modules/mailer';
import { HttpStatus, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { OtpType } from 'src/configs/enum/otp';
import { TransactionType } from '../../../configs/enum/transaction-type';
import { generateOTP } from '../../../app/utils/genarate-otp';
import { TransactionHistoryRepository } from '../transaction-history/transaction-history.repository';
import { User } from '../user/entities/user.entity';
import { AccountRepository } from './account.repository';
import { CreateTransaction, QueryAccount } from './dto/create-transaction.dto';
import { OtpTransaction } from './entities/otp.entity';
import { OtpTransactionRepository } from './otp.repository';
import { BaseException } from '../../../vendors/exceptions/base.exception';

@Injectable()
export class AccountService {
  constructor(
    private otpTransactionRepository: OtpTransactionRepository,
    private accountRepository: AccountRepository,
    private transactionHistoryRepository: TransactionHistoryRepository,
    private mailService: MailerService,
  ) {}
  async createTransaction(auth: User, inputTransaction: CreateTransaction) {
    const { cash, accountNumber, otp } = inputTransaction;
    const otpTransactions = await this.otpTransactionRepository.checkOtp(
      auth.id,
      otp,
    );

    if (!otpTransactions) {
      throw new BaseException(
        'OTP_INVALID',
        'Mã OTP không hợp lệ',
        null,
        HttpStatus.FORBIDDEN,
      );
    }
    await this.otpTransactionRepository.remove(otpTransactions);

    const accountCurrent = await this.accountRepository.findOneBy({
      user: {
        id: auth.id,
      },
    });

    if (accountCurrent.blance < cash) {
      throw new BaseException(
        'CASH_INVALID',
        'Số dư không đủ thể thực hiện giao dịch',
        null,
        HttpStatus.FORBIDDEN,
      );
    }

    const beneficiary = await this.accountRepository.findAccountByAccountNumber(
      accountNumber,
    );

    if (!beneficiary) {
      throw new BaseException(
        'ACCOUNT_NUMBER_INVALID',
        'Số tài khoản người thụ hưởng không tồn tại',
        null,
        HttpStatus.OK,
      );
    }

    accountCurrent.blance -= cash;
    beneficiary.blance += cash;
    await Promise.all([
      this.accountRepository.save(accountCurrent),
      this.accountRepository.save(beneficiary),
      this.transactionHistoryRepository.createTransactionHistory(
        auth.id,
        beneficiary.user.id,
        TransactionType.TRANSFERS,
        cash,
      ),
    ]);
    return 'Transaction successfully';
  }

  async getAccount(input: QueryAccount) {
    return await this.accountRepository.findAccountByAccountNumber(
      input.accountNumber,
    );
  }

  async getOtp(auth) {
    const generateOtp = generateOTP();
    const otpTransaction = new OtpTransaction();
    otpTransaction.user = auth;
    otpTransaction.otp = generateOtp;
    otpTransaction.type = OtpType.Transaction;
    otpTransaction.expire = moment().add(10, 'minutes').unix();
    await otpTransaction.save();
    console.log(auth);
    await this.mailService.sendMail({
      to: auth.username,
      from: 'notolistore@gmail.com',
      subject: 'Meomeo Bank send OTP',
      template: 'email-transaction',
      context: {
        data: {
          fullname: auth.fullname,
          otp: generateOtp,
        },
      },
    });
    return {
      message: 'Success',
    };
  }
}

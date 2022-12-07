import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { OtpType } from 'src/configs/enum/otp';
import { TransactionType } from '../../../configs/enum/transaction-type';
import { generateOTP } from '../../../app/utils/genarate-otp';
import { TransactionHistoryRepository } from '../transaction-history/transaction-history.repository';
import { User } from '../user/entities/user.entity';
import { AccountRepository } from './account.repository';
import { CreateTransaction } from './dto/create-transaction.dto';
import { OtpTransaction } from './entities/otp.entity';
import { OtpTransactionRepository } from './otp.repository';

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
      throw new HttpException('Mã OTP không hợp lệ', HttpStatus.OK);
    }

    await this.otpTransactionRepository.remove(otpTransactions);

    const accountCurrent = await this.accountRepository.findOneBy({
      user: {
        id: auth.id,
      },
    });

    if (accountCurrent.blance < cash) {
      throw new HttpException(
        'Số dư không đủ thể thực hiện giao dịch',
        HttpStatus.OK,
      );
    }

    const beneficiary = await this.accountRepository.findAccountByAccountNumber(
      accountNumber,
    );

    if (!beneficiary) {
      throw new HttpException(
        'Số tài khoản người thụ hưởng không tồn tại',
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

    return {
      message: 'Transaction successfully',
    };
  }

  async getOtp(auth) {
    const generateOtp = generateOTP();
    const otpTransaction = new OtpTransaction();
    otpTransaction.user = auth;
    otpTransaction.otp = generateOtp;
    otpTransaction.type = OtpType.Transaction;
    otpTransaction.expire = moment().add(10, 'minutes').unix();
    await otpTransaction.save();
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

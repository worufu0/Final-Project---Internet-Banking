import { Module } from '@nestjs/common';
import { PartnerBankService } from './partner-bank.service';
import { PartnerBankController } from './partner-bank.controller';
import { AccountService } from '../account/account.service';
import { AccountRepository } from '../account/account.repository';
import { OtpTransactionRepository } from '../account/otp.repository';
import { TransactionHistoryRepository } from '../transaction-history/transaction-history.repository';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [PartnerBankController],
  providers: [
    JwtService,
    PartnerBankService,
    AccountService,
    AccountRepository,
    OtpTransactionRepository,
    TransactionHistoryRepository,
  ],
})
export class PartnerBankModule {}

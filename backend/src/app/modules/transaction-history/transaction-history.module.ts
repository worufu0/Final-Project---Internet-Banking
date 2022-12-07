import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TransactionHistoryRepository } from '../transaction-history/transaction-history.repository';
import { TransactionHistoryController } from './transaction-history.controller';
import { TransactionHistoryService } from './transaction-history.service';

@Module({
  imports: [],
  controllers: [TransactionHistoryController],
  providers: [
    TransactionHistoryRepository,
    TransactionHistoryService,
    JwtService,
  ],
})
export class TransactionHistoryModule {}

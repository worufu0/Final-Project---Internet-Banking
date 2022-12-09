import { Injectable } from '@nestjs/common';
import { TransactionHistoryRepository } from './transaction-history.repository';

@Injectable()
export class TransactionHistoryService {
  constructor(
    private transactionHistoryRepository: TransactionHistoryRepository,
  ) {}

  async getTransactionHistory(auth) {
    const sender = await this.transactionHistoryRepository.getTransfers(
      auth,
      'from',
    );

    const receiver = await this.transactionHistoryRepository.getTransfers(
      auth,
      'to',
    );

    const pay = await this.transactionHistoryRepository.getPays(auth);

    return {
      sender,
      receiver,
      pay,
    };
  }
}

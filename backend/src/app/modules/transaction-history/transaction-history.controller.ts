import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { UserGuard } from '../../../vendors/guards/auth.guard';
import { User } from '../user/entities/user.entity';
import { TransactionHistoryService } from './transaction-history.service';

@Controller('transactionHistory')
export class TransactionHistoryController {
  constructor(
    private readonly transactionHistoryService: TransactionHistoryService,
  ) {}

  @UseGuards(UserGuard)
  @Get('getTransactionHistory')
  getTransactionHistory(@Req() request) {
    const auth = request.auth as User;
    return this.transactionHistoryService.getTransactionHistory(auth);
  }
}

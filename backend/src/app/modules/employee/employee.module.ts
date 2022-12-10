import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountRepository } from '../account/account.repository';
import { TransactionHistoryRepository } from '../transaction-history/transaction-history.repository';
import { UserRepository } from '../user/user.repository';
import { EmployeeController } from './employee.controller';
import { EmployeeRepository } from './employee.repository';
import { EmployeeService } from './employee.service';

@Module({
  imports: [],
  controllers: [EmployeeController],
  providers: [
    AccountRepository,
    TransactionHistoryRepository,
    UserRepository,
    EmployeeRepository,
    EmployeeService,
    JwtService,
  ],
})
export class EmployeeModule {}

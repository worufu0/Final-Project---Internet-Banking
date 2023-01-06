import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountRepository extends Repository<Account> {
  constructor(dataSource: DataSource) {
    super(Account, dataSource.manager);
  }

  async findAccountByAccountNumber(accountNumber: string) {
    console.log('account: ', accountNumber)
    return await this.findOne({
      select: {
        id: true,
        accountNumber: true,
        blance: true,
        accountType: true,
        user: {
          id: true,
          email: true,
          fullname: true,
          phone: true,
        },
      },
      where: {
        accountNumber,
      },
      relations: {
        user: true,
      },
    });
  }

  async addCash(account: Account, cash: number) {
    account.blance += cash;
    return await this.save(account);
  }
}

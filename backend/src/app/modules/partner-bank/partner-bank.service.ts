import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InputAddCash } from './dto/input-add-cash.dto';
import { AccountRepository } from '../account/account.repository';
import { BaseException } from '../../../vendors/exceptions/base.exception';

@Injectable()
export class PartnerBankService {
  constructor(
    private accountRepository: AccountRepository,
    private jwtService: JwtService,
  ) {}

  async sign(payload) {
    console.log('pay', process.env.PRIVATE_KEY);
    const token = this.jwtService.sign(payload, {
      privateKey: process.env.PRIVATE_KEY,
      algorithm: 'RS256',
    });

    this.jwtService.verify(token, {
      publicKey: process.env.PUBLIC_KEY,
      algorithms: ['RS256'],
    });

    return token;
  }

  async addCash(inputPayment: InputAddCash) {
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
}

import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InputAddCash } from './dto/input-add-cash.dto';
import { AccountRepository } from '../account/account.repository';
import { BaseException } from '../../../vendors/exceptions/base.exception';
import { PartnerBank } from './entities/partner-bank.entity';
import { PartnerHistory } from './entities/partner-history.entity';
import { Between } from 'typeorm';

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

    console.log(token);

    return token;
  }

  async addBank(input) {
    const { nameBank, codeBank } = input;

    if (!nameBank || !codeBank) {
      throw new BaseException(
        'PARAM_INVALID',
        'PARAM_INVALID',
        null,
        HttpStatus.BAD_REQUEST,
      );
    }
    await PartnerBank.insert({
      codeBank,
      nameBank
    })

    return 'Success';
  }

  async getListPartnerBank() {
    return await PartnerBank.find({});
  }

  async transaction(request, inputPayment: InputAddCash) {
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
    await PartnerHistory.insert({
      codeBank: 'BIDV',
      nameBank: 'Ngân hàng Thương mại cổ phần Đầu tư và Phát triển Việt Nam',
      priceTransaction: cash,
    });
    const sender = await this.accountRepository.addCash(account, cash);
    return sender;
  }

  async getHistoryPartnerBank(input) {
    const { beforeTime, afterTime } = input;
    return await PartnerHistory.find({
      where: {
        createdAt: Between(beforeTime, afterTime),
      }
    });
  }
}

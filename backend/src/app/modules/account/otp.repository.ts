import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { DataSource, MoreThanOrEqual, Repository } from 'typeorm';
import { OtpTransaction } from './entities/otp.entity';

@Injectable()
export class OtpTransactionRepository extends Repository<OtpTransaction> {
  constructor(dataSource: DataSource) {
    super(OtpTransaction, dataSource.manager);
  }

  async checkOtp(userId: number, otp: string): Promise<OtpTransaction> {
    const timeCurrent = moment().unix();
    return this.findOne({
      where: {
        otp,
        user: {
          id: userId,
        },
        expire: MoreThanOrEqual(timeCurrent),
      },
    });
  }
}

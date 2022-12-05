import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateReceiverDto } from './dto/create-receiver.dto';
import { Receiver } from './entities/receiver.entity';

@Injectable()
export class ReceiverRepository extends Repository<Receiver> {
  constructor(dataSource: DataSource) {
    super(Receiver, dataSource.manager);
  }

  async saveRecipient(userId: number, inputReceiver: CreateReceiverDto) {
    return await this.save({
      userId,
      accountNumber: inputReceiver.accountNumber,
      reminiscentName: inputReceiver.reminiscentName,
    });
  }

  async findReceiverExists(userId: number, accountNumber: string) {
    return this.findOneBy({ userId, accountNumber });
  }

  async getListRecipient(userId: number) {
    return this.findBy({ userId });
  }
}

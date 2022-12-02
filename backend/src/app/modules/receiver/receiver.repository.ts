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

  async saveRecipient(auth: User, inputReceiver: CreateReceiverDto) {
    // const receiver = new Receiver();
    // receiver.userId = auth.id;
    // receiver.reminiscentName = inputReceiver.reminiscentName;
    // receiver.accountNumber = inputReceiver.accountNumber;
    return await this.save({
      userId: auth.id,
      accountNumber: inputReceiver.accountNumber,
      reminiscentName: inputReceiver.reminiscentName,
    });
  }
}

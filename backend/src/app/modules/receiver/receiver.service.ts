import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { ReceiverRepository } from './receiver.repository';
import { CreateReceiverDto } from './dto/create-receiver.dto';
import { UpdateReceiverDto } from './dto/update-receiver.dto';
import { AccountRepository } from '../account/account.repository';
import { Receiver } from './entities/receiver.entity';

@Injectable()
export class ReceiverService {
  constructor(
    private receiverRepository: ReceiverRepository,
    private accountRepository: AccountRepository,
  ) {}

  async saveRecipient(auth: User, receiver: CreateReceiverDto) {
    const { accountNumber, reminiscentName } = receiver;
    const queryReceiver =
      await this.accountRepository.findAccountByAccountNumber(accountNumber);

    if (!queryReceiver) {
      throw new HttpException('Account not exists', HttpStatus.BAD_REQUEST);
    }

    const receiverExists = await this.receiverRepository.findReceiverExists(
      auth.id,
      accountNumber,
    );

    if (receiverExists) {
      throw new HttpException('Receiver exists', HttpStatus.OK);
    }

    const newReceiver: CreateReceiverDto = {
      accountNumber: receiver.accountNumber,
      reminiscentName:
        receiver.reminiscentName || queryReceiver?.user?.fullname,
    };

    return await this.receiverRepository.saveRecipient(auth.id, newReceiver);
  }

  async getListRecipient(auth: User) {
    return this.receiverRepository.getListRecipient(auth.id);
  }

  async updateRecipient(auth: User, receiver: CreateReceiverDto) {
    const { accountNumber, reminiscentName } = receiver;
    const receiverExists = await this.receiverRepository.findReceiverExists(
      auth.id,
      accountNumber,
    );
    if (!receiverExists) {
      throw new HttpException('Receiver not exists', HttpStatus.OK);
    }
    receiverExists.reminiscentName = reminiscentName;
    return await this.receiverRepository.save(receiverExists);
  }

  async deleteRecipient(auth: User, accountNumber: string) {
    const result = await this.receiverRepository.delete({
      userId: auth.id,
      accountNumber,
    });
    if (result.affected > 0) {
      return { message: 'Deleted receiver success' };
    }
    return { message: 'Not exits receiver' };
  }
}

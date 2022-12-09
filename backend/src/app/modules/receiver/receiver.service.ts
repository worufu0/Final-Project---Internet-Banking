import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { ReceiverRepository } from './receiver.repository';
import { CreateReceiverDto } from './dto/create-receiver.dto';
import { AccountRepository } from '../account/account.repository';
import { BaseException } from '../../../vendors/exceptions/base.exception';

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
      throw new BaseException(
        'ACCOUNT_NOT_EXISTS',
        'Account not exists',
        null,
        HttpStatus.OK,
      );
    }

    const receiverExists = await this.receiverRepository.findReceiverExists(
      auth.id,
      accountNumber,
    );

    if (receiverExists) {
      throw new BaseException(
        'RECEIVER_EXISTS',
        'Receiver exists',
        null,
        HttpStatus.OK,
      );
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
      throw new BaseException(
        'RECEIVER_NOT_EXISTS',
        'Receiver not exists',
        null,
        HttpStatus.OK,
      );
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

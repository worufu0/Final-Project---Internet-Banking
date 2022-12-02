import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { ReceiverRepository } from './receiver.repository';
import { CreateReceiverDto } from './dto/create-receiver.dto';
import { UpdateReceiverDto } from './dto/update-receiver.dto';

@Injectable()
export class ReceiverService {
  constructor(private receiverRepository: ReceiverRepository) {}

  async saveRecipient(auth: User, receiver: CreateReceiverDto) {
    return await this.receiverRepository.saveRecipient(auth, receiver);
  }
}

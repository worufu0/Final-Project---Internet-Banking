import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { CreateReceiverDto } from './dto/create-receiver.dto';
import { UpdateReceiverDto } from './dto/update-receiver.dto';

@Injectable()
export class ReceiverService {
  async saveRecipient(currentUser: User, input: string) {
    
    return null;
  }
}

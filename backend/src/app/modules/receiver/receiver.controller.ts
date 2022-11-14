import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReceiverService } from './receiver.service';
import { CreateReceiverDto } from './dto/create-receiver.dto';
import { UpdateReceiverDto } from './dto/update-receiver.dto';
import { UserAuth } from '../../../vendors/guards/auth.guard';
import { User } from '../user/entities/user.entity';

@Controller('receiver')
export class ReceiverController {
  constructor(private readonly receiverService: ReceiverService) {}

  @UseGuards(UserAuth)
  @Post('saveRecipient')
  async saveRecipient(@Req() request, @Body() input) {
    const user = request.auth as User;
    this.receiverService.saveRecipient(user, input);
    return user;
  }
}

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
import { UserGuard } from '../../../vendors/guards/auth.guard';
import { User } from '../user/entities/user.entity';

@Controller('receiver')
export class ReceiverController {
  constructor(private readonly receiverService: ReceiverService) {}

  @UseGuards(UserGuard)
  @Post('saveRecipient')
  async saveRecipient(@Req() request, @Body() receive: CreateReceiverDto) {
    const auth = request.auth as User;
    return this.receiverService.saveRecipient(auth, receive);
  }
}

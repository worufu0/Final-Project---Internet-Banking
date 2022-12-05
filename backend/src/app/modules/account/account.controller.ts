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
import { UserGuard } from '../../../vendors/guards/auth.guard';
import { User } from '../user/entities/user.entity';
import { AccountService } from './account.service';
import { CreateTransaction } from './dto/create-transaction.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(UserGuard)
  @Post('createTransaction')
  transaction(@Req() request, @Body() inputTransaction: CreateTransaction) {
    const auth = request.auth as User;
    return this.accountService.createTransaction(auth, inputTransaction);
  }

  @UseGuards(UserGuard)
  @Get('getOtp')
  getOtp(@Req() request) {
    const auth = request.auth as User;
    return this.accountService.getOtp(auth);
  }
}

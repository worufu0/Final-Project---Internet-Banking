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
import { BaseController } from '../../../vendors/base/base.controller';

@Controller('account')
export class AccountController extends BaseController {
  constructor(private readonly accountService: AccountService) {
    super();
  }

  @UseGuards(UserGuard)
  @Post('createTransaction')
  async transaction(
    @Req() request,
    @Body() inputTransaction: CreateTransaction,
  ) {
    const auth = request.auth as User;
    console.log('beng beng');
    const data = await this.accountService.createTransaction(
      auth,
      inputTransaction,
    );
    return this.response(data);
  }

  @UseGuards(UserGuard)
  @Get('getOtp')
  getOtp(@Req() request) {
    const auth = request.auth as User;
    return this.accountService.getOtp(auth);
  }
}

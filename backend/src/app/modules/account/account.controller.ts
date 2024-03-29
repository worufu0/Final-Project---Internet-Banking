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
  Query,
} from '@nestjs/common';
import { UserGuard } from '../../../vendors/guards/auth.guard';
import { User } from '../user/entities/user.entity';
import { AccountService } from './account.service';
import { CreateTransaction, QueryAccount } from './dto/create-transaction.dto';
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
    const data = await this.accountService.createTransaction(
      auth,
      inputTransaction,
    );
    return this.response(data);
  }

  @UseGuards(UserGuard)
  @Post('transactionPartner')
  async transactionPartner(
    @Req() request,
    @Body() inputTransaction: CreateTransaction,
  ) {
    const auth = request.auth as User;
    const data = await this.accountService.transactionPartner(
      auth,
      inputTransaction,
    );
    return this.response(data);
  }

  @UseGuards(UserGuard)
  @Get('getAccount')
  async getAccount(@Req() input: QueryAccount) {
    const data = await this.accountService.getAccount(input);
    return this.response(data);
  }

  @UseGuards(UserGuard)
  @Get('getOtp')
  getOtp(@Req() request) {
    const auth = request.auth as User;
    return this.accountService.getOtp(auth);
  }

  @UseGuards(UserGuard)
  @Get('getInfoAccountPartner')
  getInfoAccountPartner(@Query() input) {
    return this.accountService.getInfoAccountPartner(input);
  }
}

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
import { PartnerBankService } from './partner-bank.service';
import { AccountService } from '../account/account.service';
import { QueryAccount } from '../account/dto/create-transaction.dto';
import { SecretGuard } from '../../../vendors/guards/secret.guard';
import * as crypto from 'crypto';
import { verifyOptions } from './verify-option';
import { RsaGuard } from '../../../vendors/guards/rsa.guard';
import { BaseController } from '../../../vendors/base/base.controller';
import { InputAddCash } from './dto/input-add-cash.dto';
import { AdminGuard } from '../../../vendors/guards/admin.guard';

@Controller('partnerBank')
export class PartnerBankController extends BaseController {
  constructor(
    private readonly partnerBankService: PartnerBankService,
    private readonly accountService: AccountService,
  ) {
    super()
  }

  @UseGuards(SecretGuard)
  @Post('queryAccount')
  getAccount(@Body() input: QueryAccount) {
    return this.accountService.getAccount(input);
  }

  @Post('encypt')
  async encypt(@Body() input) {
    const timestamp = new Date().getTime().toString();
    return {
      encrypt: crypto
        .createHash('sha256')
        .update(input.path + timestamp + process.env.SECRET_KEY)
        .digest('hex'),
      timestamp,
    };
  }

  @Post('sign')
  async sign() {
    const token = this.partnerBankService.sign(verifyOptions);
    return this.response(token);
  }

  @UseGuards(RsaGuard)
  @Post('transaction')
  async transaction(@Req() request, @Body() input: InputAddCash) {
    await this.partnerBankService.transaction(request, input);
    return this.response({});
  }

  @UseGuards(AdminGuard)
  @Get('getListPartnerBank')
  async getListPartnerBank() {
    const data = await this.partnerBankService.getListPartnerBank();
    return this.response(data);
  }

  @UseGuards(AdminGuard)
  @Get('getHistoryPartnerBank')
  async getHistoryPartnerBank(@Query() input) {
    const data = await this.partnerBankService.getHistoryPartnerBank(input);
    return this.response(data);
  }
}

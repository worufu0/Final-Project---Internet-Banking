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
import { DebtReminderService } from './debt-reminder.service';
import { BaseController } from '../../../vendors/base/base.controller';
import { CreateDebtReminber } from './dto/create-debt-reminber.dto';
import { UserGuard } from '../../../vendors/guards/auth.guard';
import { User } from '../user/entities/user.entity';

@Controller('debtReminber')
export class DebtReminderController extends BaseController {
  constructor(private readonly debtReminderService: DebtReminderService) {
    super();
  }

  @UseGuards(UserGuard)
  @Post('createDebtReminber')
  async createDebtReminber(
    @Req() request,
    @Body() createDebtReminber: CreateDebtReminber,
  ) {
    const auth = request.auth as User;
    await this.debtReminderService.createDebtReminder(auth, createDebtReminber);
    return await this.response('Send debt reminder success');
  }

  @UseGuards(UserGuard)
  @Get('findAllDebtReminber')
  async getAllDebtReminber(@Req() request) {
    const auth = request.auth as User;
    const response = await this.debtReminderService.findSelfCreatedList(auth);
    return await this.response(response);
  }

  @UseGuards(UserGuard)
  @Get('findListReceived')
  async findListReceived(@Req() request) {
    const auth = request.auth as User;
    const response = await this.debtReminderService.findListReceived(auth);
    return await this.response(response);
  }

  @UseGuards(UserGuard)
  @Delete('deleteDebtReminber')
  async deleteDebtReminber(@Req() request, @Query() query) {
    const auth = request.auth as User;
    const { debtId } = query;
    const response = await this.debtReminderService.deleteDebtReminber(
      auth,
      debtId,
    );
    return await this.response(response);
  }

  @UseGuards(UserGuard)
  @Get('realtimeDebtReminber')
  async realtimeDebtReminber(@Req() request) {
    const { id } = request;
    const response = await this.debtReminderService.realtimeDebtReminber(id);
    return await this.response(response);
  }

  @UseGuards(UserGuard)
  @Post('payDebt')
  async payDebt(@Body() body) {
    const { debtId } = body;
    const response = await this.debtReminderService.payDebt(debtId);
    return await this.response(response);
  }
}

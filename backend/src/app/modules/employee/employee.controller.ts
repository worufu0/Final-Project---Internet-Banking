import {
  Controller,
  UseGuards,
  Req,
  Post,
  Body,
  Get,
  Query,
} from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { EmployeeService } from '../employee/employee.service';
import { PaymentInput } from './dto/paymentInput.dto';
import { LoginInput } from './dto/login-input.dto';
import { EmployeeGuard } from '../../../vendors/guards/employee.guard';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @UseGuards(EmployeeGuard)
  @Post('addCash')
  payment(@Body() inputPayment: PaymentInput) {
    return this.employeeService.addCash(inputPayment);
  }

  @UseGuards(EmployeeGuard)
  @Get('getTransactionHistory')
  getTransactionHistory(@Query() query) {
    const { userId } = query;
    return this.employeeService.getTransactionHistory(userId);
  }
}

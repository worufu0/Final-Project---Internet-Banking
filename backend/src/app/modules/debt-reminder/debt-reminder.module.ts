import { Module } from '@nestjs/common';
import { DebtReminderService } from './debt-reminder.service';
import { DebtReminderController } from './debt.reminder.controller';
import { DebtReminderRepository } from './debt-reminder.repository';
import { JwtService } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';
import { OtpTransactionRepository } from '../account/otp.repository';
import { TransactionHistoryRepository } from '../transaction-history/transaction-history.repository';
import { UserRepository } from '../user/user.repository';
import { AccountRepository } from '../account/account.repository';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.sendgrid.net',
        auth: {
          user: 'apikey',
          pass: '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',
        },
      },
      template: {
        dir: path.join(__dirname, '../../../', 'mails'),
        adapter: new HandlebarsAdapter(),
      },
    }),
  ],
  controllers: [DebtReminderController],
  providers: [
    DebtReminderService,
    DebtReminderRepository,
    UserRepository,
    OtpTransactionRepository,
    TransactionHistoryRepository,
    AccountRepository,
    JwtService,
  ],
})
export class DebtReminderModule {}

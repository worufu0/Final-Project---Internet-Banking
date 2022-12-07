import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AccountRepository } from './account.repository';
import { JwtService } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';
import { OtpTransactionRepository } from './otp.repository';
import { TransactionHistoryRepository } from '../transaction-history/transaction-history.repository';

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
  controllers: [AccountController],
  providers: [
    AccountService,
    AccountRepository,
    OtpTransactionRepository,
    TransactionHistoryRepository,
    JwtService,
  ],
})
export class AccountModule {}

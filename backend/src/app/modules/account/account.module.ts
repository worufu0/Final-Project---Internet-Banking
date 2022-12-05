import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AccountRepository } from './account.repository';
import { JwtService } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { google } from 'googleapis';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';
import { OtpTransactionRepository } from './otp.repository';

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
    JwtService,
  ],
})
export class AccountModule {}

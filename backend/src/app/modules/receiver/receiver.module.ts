import { Module } from '@nestjs/common';
import { ReceiverService } from './receiver.service';
import { ReceiverController } from './receiver.controller';
import { JwtService } from '@nestjs/jwt';
import { ReceiverRepository } from './receiver.repository';
import { AccountRepository } from '../account/account.repository';

@Module({
  controllers: [ReceiverController],
  providers: [
    ReceiverService,
    ReceiverRepository,
    AccountRepository,
    JwtService,
  ],
})
export class ReceiverModule {}

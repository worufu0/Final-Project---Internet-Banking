import { Module } from '@nestjs/common';
import { ReceiverService } from './receiver.service';
import { ReceiverController } from './receiver.controller';
import { JwtService } from '@nestjs/jwt';
import { ReceiverRepository } from './receiver.repository';

@Module({
  controllers: [ReceiverController],
  providers: [ReceiverService, ReceiverRepository, JwtService],
})
export class ReceiverModule {}

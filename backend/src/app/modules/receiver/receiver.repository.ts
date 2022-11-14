import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Receiver } from './entities/receiver.entity';

@Injectable()
export class ReceiverRepository extends Repository<Receiver> {
  constructor(dataSource: DataSource) {
    super(Receiver, dataSource.manager);
  }
}

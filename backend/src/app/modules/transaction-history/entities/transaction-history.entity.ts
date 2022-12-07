import { TransactionType } from '../../../../configs/enum/transaction-type';

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('transaction-history')
export class TransactionHistory extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({
    name: 'type',
    type: 'enum',
    enum: TransactionType,
    nullable: false,
  })
  type: TransactionType;

  @Column({ name: 'cash', type: 'double', default: 0 })
  cash: number;

  @ManyToOne(() => User, (user) => user.from)
  from: User;

  @ManyToOne(() => User, (user) => user.to)
  to: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

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

@Entity('debt-reminder')
export class DebtReminder extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @ManyToOne(() => User, (user) => user.from)
  from: User;

  @ManyToOne(() => User, (user) => user.to)
  to: User;

  @Column({ name: 'cash', type: 'double', default: 0 })
  cash: number;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'status_transaction' })
  statusTransaction: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

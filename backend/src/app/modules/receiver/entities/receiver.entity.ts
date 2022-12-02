import { AccountType } from 'src/configs/enum/account';
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

@Entity('receivers')
export class Receiver extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({
    name: 'account_number',
    nullable: false,
  })
  accountNumber: string;

  @Column({
    name: 'reminiscent_name',
    nullable: false,
  })
  reminiscentName: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

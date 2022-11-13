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

@Entity('accounts')
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({
    name: 'account_number',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  accountNumber: string;

  @Column({ name: 'blance', type: 'double', default: 0 })
  blance: number;

  @Column({
    name: 'account_type',
    type: 'enum',
    enum: AccountType,
    nullable: false,
  })
  accountType: AccountType;

  @ManyToOne(() => User, (user) => user.accounts)
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

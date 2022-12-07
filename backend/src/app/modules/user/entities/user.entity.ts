import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { Account } from '../../account/entities/account.entity';
import { OtpTransaction } from '../../account/entities/otp.entity';
import { TransactionHistory } from '../../transaction-history/entities/transaction-history.entity';

@Entity('users')
@Unique(['email'])
@Unique(['phone'])
@Unique('UQ_USER', ['email', 'phone'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  fullname: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  phone: string;

  @Column({
    name: 'refresh_token',
    type: 'varchar',
    length: 1000,
    nullable: true,
  })
  refreshToken: string;

  @Column({ name: 'expied_at', type: 'varchar', length: 20, nullable: true })
  expiedAt: string;

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];

  @OneToMany(() => OtpTransaction, (otp) => otp.user)
  otps: OtpTransaction[];

  @OneToMany(
    () => TransactionHistory,
    (transactionHistory) => transactionHistory.from,
  )
  from: TransactionHistory[];

  @OneToMany(
    () => TransactionHistory,
    (transactionHistory) => transactionHistory.to,
  )
  to: TransactionHistory[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

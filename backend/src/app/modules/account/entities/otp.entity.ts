import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('otp_transactions')
@Unique('UQ_OTP', ['otp', 'user'])
export class OtpTransaction extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({
    name: 'otp',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  otp: string;

  @Column({
    name: 'type',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  type: string;

  @Column({ name: 'expire' })
  expire: number;

  @ManyToOne(() => User, (user) => user.otps)
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

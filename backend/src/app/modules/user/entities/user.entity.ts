import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Account } from '../../account/entities/account.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

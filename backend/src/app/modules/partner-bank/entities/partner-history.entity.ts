import { EmployeeRole } from '../../../../configs/enum/employee-role';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('partner_history')
export class PartnerHistory extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({
    name: 'name_bank',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  nameBank: string;

  @Column({
    name: 'code_bank',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  codeBank: string;

  @Column({ name: 'price_transaction' })
  priceTransaction: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
// $2b$10$KvaF0Bljivr4B6/ejHSjh.P6X6LsgryZfRyEPcY6jzf/fJxHlKbiy
// $2b$10$Ysa0vY1LYUnuXsKF/v5qJOIXwcE/cwyyjYDfN.xb3DwQGm5udGtL6
